import { AnalysisError } from "../errors";
import { LIMITS } from "../analyze/limits";

export type StoreName = "chrome" | "edge" | "firefox";

export interface StoreTarget {
  store: StoreName;
  id: string;
  slug: string | null;
  pageUrl: string;
}

const CHROME_HOSTS = new Set(["chromewebstore.google.com", "chrome.google.com"]);
const EDGE_HOSTS = new Set(["microsoftedge.microsoft.com", "edge.microsoft.com"]);
const FIREFOX_HOSTS = new Set(["addons.mozilla.org"]);

const CHROME_REDIRECT_HOSTS = new Set([
  "clients2.google.com",
  "clients2.googleusercontent.com",
]);
const EDGE_REDIRECT_HOSTS = new Set([
  "edge.microsoft.com",
  "microsoftedge.microsoft.com",
  "msedge.api.cdp.microsoft.com",
]);
const FIREFOX_REDIRECT_HOSTS = new Set(["addons.mozilla.org", "addons.cdn.mozilla.net"]);

const EXTENSION_ID = /^[a-p]{32}$/;
const EDGE_ID = /^[a-z0-9]{32}$/;
const FIREFOX_SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;

export function parseStoreUrl(input: string): StoreTarget {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new AnalysisError("STORE_URL_INVALID", "That does not look like a valid store URL.");
  }

  if (url.protocol !== "https:" || url.username || url.password) {
    throw new AnalysisError("STORE_URL_INVALID", "Only public HTTPS store URLs are supported.");
  }

  const host = url.hostname.toLowerCase();

  if (CHROME_HOSTS.has(host)) {
    const parts = url.pathname.split("/").filter(Boolean);
    const detailIndex = parts.indexOf("detail");
    const id = detailIndex >= 0 ? parts[detailIndex + 2] : null;
    if (!id || !EXTENSION_ID.test(id)) {
      throw new AnalysisError(
        "STORE_URL_INVALID",
        "The Chrome Web Store URL must contain a 32-character extension ID.",
      );
    }
    return {
      store: "chrome",
      id,
      slug: detailIndex >= 0 ? parts[detailIndex + 1] ?? null : null,
      pageUrl: url.toString(),
    };
  }

  if (EDGE_HOSTS.has(host)) {
    const parts = url.pathname.split("/").filter(Boolean);
    const detailIndex = parts.indexOf("detail");
    const id = detailIndex >= 0 ? parts[detailIndex + 2] : null;
    if (!id || !EDGE_ID.test(id)) {
      throw new AnalysisError(
        "STORE_URL_INVALID",
        "The Edge Add-ons URL must contain a 32-character extension ID.",
      );
    }
    return {
      store: "edge",
      id,
      slug: detailIndex >= 0 ? parts[detailIndex + 1] ?? null : null,
      pageUrl: url.toString(),
    };
  }

  if (FIREFOX_HOSTS.has(host)) {
    const parts = url.pathname.split("/").filter(Boolean);
    const addonIndex = parts.indexOf("addon");
    const slug = addonIndex >= 0 ? parts[addonIndex + 1] ?? null : null;
    const normalized = slug?.toLowerCase() ?? null;
    if (!normalized || !FIREFOX_SLUG.test(normalized)) {
      throw new AnalysisError(
        "STORE_URL_INVALID",
        "The Firefox Add-ons URL must contain a valid add-on slug.",
      );
    }
    return { store: "firefox", id: normalized, slug: normalized, pageUrl: url.toString() };
  }

  throw new AnalysisError(
    "STORE_HOST_BLOCKED",
    "Only Chrome Web Store, Microsoft Edge Add-ons and Firefox Add-ons URLs are allowed.",
  );
}

function redirectAllowlist(store: StoreName): Set<string> {
  if (store === "chrome") return CHROME_REDIRECT_HOSTS;
  if (store === "edge") return EDGE_REDIRECT_HOSTS;
  return FIREFOX_REDIRECT_HOSTS;
}

async function fetchWithRedirectValidation(
  initialUrl: string,
  allowlist: Set<string>,
): Promise<Response> {
  let current = initialUrl;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    let url: URL;
    try {
      url = new URL(current);
    } catch {
      throw new AnalysisError("STORE_FETCH_FAILED", "The store returned an invalid redirect.");
    }
    if (url.protocol !== "https:" || !allowlist.has(url.hostname.toLowerCase())) {
      throw new AnalysisError(
        "STORE_HOST_BLOCKED",
        "The store redirected to a host that is not on the approved list.",
      );
    }

    const response = await fetch(current, {
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(LIMITS.storeFetchTimeoutMs),
      headers: {
        "User-Agent": "ExtensionPrivacyChecker/1.0 (+static package analysis)",
        Accept: "application/json, application/octet-stream, application/x-xpinstall, */*",
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        throw new AnalysisError("STORE_FETCH_FAILED", "The store returned an empty redirect.");
      }
      current = new URL(location, current).toString();
      continue;
    }

    if (!response.ok) {
      throw new AnalysisError(
        "STORE_FETCH_FAILED",
        `The store responded with HTTP ${response.status}. Try downloading the package and uploading it manually.`,
      );
    }

    return response;
  }

  throw new AnalysisError("STORE_FETCH_FAILED", "The store returned too many redirects.");
}

async function readLimited(response: Response): Promise<Uint8Array> {
  const lengthHeader = response.headers.get("content-length");
  if (lengthHeader) {
    const length = Number(lengthHeader);
    if (Number.isFinite(length) && length > LIMITS.maxStoreDownloadBytes) {
      throw new AnalysisError("STORE_TOO_LARGE", "The store package is larger than the download limit.");
    }
  }

  if (!response.body) {
    const buffer = new Uint8Array(await response.arrayBuffer());
    if (buffer.byteLength > LIMITS.maxStoreDownloadBytes) {
      throw new AnalysisError("STORE_TOO_LARGE", "The store package is larger than the download limit.");
    }
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > LIMITS.maxStoreDownloadBytes) {
      await reader.cancel();
      throw new AnalysisError("STORE_TOO_LARGE", "The store package is larger than the download limit.");
    }
    chunks.push(value);
  }

  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result;
}

async function resolveFirefoxDownload(slug: string): Promise<{ url: string; name: string }> {
  const apiUrl = `https://addons.mozilla.org/api/v5/addons/addon/${encodeURIComponent(slug)}/`;
  const response = await fetchWithRedirectValidation(apiUrl, FIREFOX_REDIRECT_HOSTS);
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new AnalysisError("STORE_FETCH_FAILED", "The Firefox Add-ons API returned an invalid response.");
  }

  const record = payload as { name?: unknown; current_version?: { file?: { url?: unknown } } };
  const fileUrl = record?.current_version?.file?.url;
  if (typeof fileUrl !== "string") {
    throw new AnalysisError(
      "STORE_FETCH_FAILED",
      "The Firefox Add-ons API did not return a downloadable package. Upload the XPI manually instead.",
    );
  }

  const name =
    record.name && typeof record.name === "object" && typeof (record.name as Record<string, unknown>).enUS === "string"
      ? String((record.name as Record<string, unknown>).enUS)
      : typeof record.name === "string"
        ? record.name
        : slug;

  return { url: fileUrl, name };
}

export interface StoreDownload {
  bytes: Uint8Array;
  filename: string;
  store: StoreName;
  displayName: string;
  pageUrl: string;
}

export async function downloadStorePackage(input: string): Promise<StoreDownload> {
  const target = parseStoreUrl(input);

  try {
    if (target.store === "firefox") {
      const { url, name } = await resolveFirefoxDownload(target.id);
      const response = await fetchWithRedirectValidation(url, FIREFOX_REDIRECT_HOSTS);
      const bytes = await readLimited(response);
      return {
        bytes,
        filename: `${safeFilename(name)}.xpi`,
        store: "firefox",
        displayName: name,
        pageUrl: target.pageUrl,
      };
    }

    const downloadUrl =
      target.store === "chrome"
        ? `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=130.0&acceptformat=crx2,crx3&x=id%3D${target.id}%26uc`
        : `https://edge.microsoft.com/extensionwebstorebase/v1/crx?response=redirect&x=id%3D${target.id}%26uc`;

    const response = await fetchWithRedirectValidation(downloadUrl, redirectAllowlist(target.store));
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("text/html")) {
      throw new AnalysisError(
        "STORE_FETCH_FAILED",
        "The store returned an HTML page instead of a package. Try uploading the file manually.",
      );
    }
    const bytes = await readLimited(response);
    const extension = target.store === "chrome" ? "crx" : "crx";
    const fallbackName = target.slug ? `${target.slug}-${target.id.slice(0, 8)}` : target.id.slice(0, 12);
    return {
      bytes,
      filename: `${safeFilename(fallbackName)}.${extension}`,
      store: target.store,
      displayName: target.slug ?? target.id.slice(0, 12),
      pageUrl: target.pageUrl,
    };
  } catch (error) {
    if (error instanceof AnalysisError) throw error;
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new AnalysisError(
        "STORE_TIMEOUT",
        "The store did not respond in time. Download the package and upload it manually.",
      );
    }
    throw new AnalysisError(
      "STORE_FETCH_FAILED",
      "The package could not be retrieved from the store. Download it and upload the file manually.",
    );
  }
}

function safeFilename(value: string): string {
  const cleaned = value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return cleaned || "extension";
}
