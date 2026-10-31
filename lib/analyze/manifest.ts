import { z } from "zod";
import type { ContentScriptSummary, Finding, ManifestSummary } from "./types";

const stringArray = z.array(z.string()).optional();

const contentScriptSchema = z
  .object({
    matches: z.array(z.string()).default([]),
    js: stringArray,
    css: stringArray,
    run_at: z.string().optional(),
    all_frames: z.boolean().optional(),
  })
  .passthrough();

const manifestSchema = z
  .object({
    manifest_version: z.number().int().optional(),
    name: z.string().optional(),
    version: z.union([z.string(), z.number()]).optional(),
    description: z.string().optional(),
    permissions: stringArray,
    optional_permissions: stringArray,
    host_permissions: stringArray,
    optional_host_permissions: stringArray,
    content_scripts: z.array(contentScriptSchema).optional(),
    background: z
      .object({
        service_worker: z.string().optional(),
        scripts: stringArray,
        page: z.string().optional(),
        persistent: z.boolean().optional(),
        type: z.string().optional(),
      })
      .passthrough()
      .optional(),
    action: z.object({ default_popup: z.string().optional() }).passthrough().optional(),
    browser_action: z.object({ default_popup: z.string().optional() }).passthrough().optional(),
    page_action: z.object({ default_popup: z.string().optional() }).passthrough().optional(),
    externally_connectable: z.unknown().optional(),
    web_accessible_resources: z.unknown().optional(),
    content_security_policy: z.unknown().optional(),
    update_url: z.string().optional(),
    options_page: z.string().optional(),
    options_ui: z.object({ page: z.string().optional() }).passthrough().optional(),
    browser_specific_settings: z.unknown().optional(),
  })
  .passthrough();

export const MANIFEST_FILE_PATTERN = /(^|\/)manifest\.json$/i;

export function findManifestFile<T extends { path: string }>(files: T[]): T | null {
  const candidates = files
    .filter((file) => MANIFEST_FILE_PATTERN.test(file.path))
    .sort((a, b) => a.path.split("/").length - b.path.split("/").length || a.path.length - b.path.length);
  return candidates[0] ?? null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function extractCsp(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const parts: string[] = [];
    for (const key of ["extension_pages", "sandbox", "default"]) {
      if (typeof record[key] === "string") parts.push(`${key}: ${record[key]}`);
    }
    for (const [key, item] of Object.entries(record)) {
      if (!["extension_pages", "sandbox", "default"].includes(key) && typeof item === "string") {
        parts.push(`${key}: ${item}`);
      }
    }
    return parts.length ? parts.join(" | ") : null;
  }
  return null;
}

function extractUpdateUrl(value: unknown): string | null {
  return asString(value);
}

function detectBrowsers(raw: Record<string, unknown>): string[] {
  const browsers = new Set<string>();
  const background = raw.background as Record<string, unknown> | undefined;
  const hasGeckoSettings = Boolean(raw.browser_specific_settings || raw.applications);

  if (background?.service_worker) {
    browsers.add("Chrome");
    browsers.add("Edge");
    browsers.add("Chromium");
  }
  if (background?.scripts || background?.page || hasGeckoSettings) {
    browsers.add("Firefox");
  }
  if (raw.manifest_version === 3) {
    browsers.add("Chrome");
    browsers.add("Edge");
    browsers.add("Chromium");
  }
  if (browsers.size === 0) {
    browsers.add("Chrome");
    browsers.add("Edge");
    browsers.add("Firefox");
    browsers.add("Chromium");
  }
  return Array.from(browsers);
}

function summarizeContentScripts(raw: Record<string, unknown>): ContentScriptSummary[] {
  const scripts = Array.isArray(raw.content_scripts) ? raw.content_scripts : [];
  return scripts
    .filter((script): script is Record<string, unknown> => Boolean(script) && typeof script === "object")
    .map((script) => ({
      matches: asStringArray(script.matches),
      js: asStringArray(script.js),
      css: asStringArray(script.css),
      runAt: asString(script.run_at),
      allFrames: script.all_frames === true,
    }));
}

function summarizeBackground(raw: Record<string, unknown>): ManifestSummary["background"] {
  const background = raw.background;
  if (!background || typeof background !== "object") return null;
  const record = background as Record<string, unknown>;
  const serviceWorker = asString(record.service_worker);
  const scripts = asStringArray(record.scripts);
  const page = asString(record.page);

  if (serviceWorker) {
    return {
      type: "service-worker",
      scripts,
      serviceWorker,
      persistent: record.persistent === true ? true : null,
    };
  }
  if (scripts.length) {
    return {
      type: "scripts",
      scripts,
      serviceWorker: null,
      persistent: typeof record.persistent === "boolean" ? record.persistent : null,
    };
  }
  if (page) {
    return { type: "page", scripts: [], serviceWorker: null, persistent: null };
  }
  return { type: "unknown", scripts: [], serviceWorker: null, persistent: null };
}

export function summarizeManifest(
  rawValue: unknown,
  path: string,
): { manifest: ManifestSummary; warnings: string[] } {
  const warnings: string[] = [];
  const errors: string[] = [];

  const parsed = manifestSchema.safeParse(rawValue);
  if (!parsed.success) {
    for (const issue of parsed.error.issues.slice(0, 8)) {
      errors.push(`${issue.path.join(".") || "manifest"}: ${issue.message}`);
    }
  }

  const raw =
    rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
      ? (rawValue as Record<string, unknown>)
      : {};

  const manifestVersion =
    typeof raw.manifest_version === "number" ? raw.manifest_version : null;

  const permissions = Array.from(new Set(asStringArray(raw.permissions)));
  const optionalPermissions = Array.from(new Set(asStringArray(raw.optional_permissions)));
  const hostPermissions = asStringArray(raw.host_permissions);
  const optionalHostPermissions = asStringArray(raw.optional_host_permissions);
  const contentScripts = summarizeContentScripts(raw);
  const background = summarizeBackground(raw);
  const action = (raw.action ?? raw.browser_action ?? raw.page_action) as
    | Record<string, unknown>
    | undefined;
  const optionsUi = raw.options_ui as Record<string, unknown> | undefined;

  if (manifestVersion === null) errors.push("manifest_version is missing or not a number.");
  if (manifestVersion === 2) {
    warnings.push("Manifest V2 is deprecated in Chrome and Edge. Review whether the extension has a V3 plan.");
  }
  if (manifestVersion && manifestVersion !== 2 && manifestVersion !== 3) {
    warnings.push(`Unexpected manifest_version value: ${manifestVersion}.`);
  }
  if (!asString(raw.name)) warnings.push("The manifest does not declare a name.");
  if (raw.version === undefined || raw.version === null) warnings.push("The manifest does not declare a version.");

  const manifest: ManifestSummary = {
    found: true,
    path,
    manifestVersion,
    name: asString(raw.name),
    version: raw.version === undefined || raw.version === null ? null : String(raw.version),
    description: asString(raw.description),
    browsers: detectBrowsers(raw),
    permissions,
    optionalPermissions,
    hostPermissions,
    optionalHostPermissions,
    contentScripts,
    background,
    actionPopup: asString(action?.default_popup),
    externallyConnectable: raw.externally_connectable ?? null,
    webAccessibleResources: raw.web_accessible_resources ?? null,
    contentSecurityPolicy: extractCsp(raw.content_security_policy),
    updateUrl: extractUpdateUrl(raw.update_url),
    optionsPage: asString(raw.options_page) ?? asString(optionsUi?.page),
    errors,
    raw,
  };

  return { manifest, warnings };
}

export function emptyManifest(): ManifestSummary {
  return {
    found: false,
    path: null,
    manifestVersion: null,
    name: null,
    version: null,
    description: null,
    browsers: [],
    permissions: [],
    optionalPermissions: [],
    hostPermissions: [],
    optionalHostPermissions: [],
    contentScripts: [],
    background: null,
    actionPopup: null,
    externallyConnectable: null,
    webAccessibleResources: null,
    contentSecurityPolicy: null,
    updateUrl: null,
    optionsPage: null,
    errors: ["No manifest.json file was found in the package."],
    raw: null,
  };
}

export function manifestFindings(manifest: ManifestSummary): Finding[] {
  const findings: Finding[] = [];
  const path = manifest.path ?? "manifest.json";

  const add = (
    id: string,
    severity: Finding["severity"],
    evidence: string,
    explanation: string,
    recommendation: string,
  ) => {
    findings.push({
      id: `${path}:manifest:${id}`,
      rule: "manifest-warning",
      category: "manifest",
      file: path,
      line: null,
      column: null,
      severity,
      confidence: "high",
      evidence,
      explanation,
      recommendation,
    });
  };

  const csp = manifest.contentSecurityPolicy?.toLowerCase() ?? "";
  if (csp.includes("unsafe-eval")) {
    add(
      "csp-eval",
      "high",
      manifest.contentSecurityPolicy ?? "",
      "The Content Security Policy allows eval(), which weakens the protection against injected code.",
      "Prefer a CSP that does not include 'unsafe-eval'.",
    );
  }
  if (csp.includes("unsafe-inline")) {
    add(
      "csp-inline",
      "medium",
      manifest.contentSecurityPolicy ?? "",
      "The Content Security Policy allows inline scripts or styles.",
      "Check whether inline script execution is required.",
    );
  }
  if (manifest.updateUrl) {
    if (!manifest.updateUrl.startsWith("https://")) {
      add(
        "update-url-http",
        "high",
        manifest.updateUrl,
        "The extension update URL does not use HTTPS, so update checks could be intercepted.",
        "Only use extensions that update over HTTPS from a trusted store.",
      );
    } else {
      add(
        "update-url",
        "info",
        manifest.updateUrl,
        "A custom update URL means the package can be updated outside the browser store where it was installed. Automatic updates can change the code after review.",
        "Confirm the update host is controlled by the extension publisher or a recognized store.",
      );
    }
  }

  const externallyConnectable = manifest.externallyConnectable;
  if (externallyConnectable && typeof externallyConnectable === "object") {
    const record = externallyConnectable as Record<string, unknown>;
    const matches = asStringArray(record.matches);
    const origins = asStringArray(record.origins);
    if (matches.includes("<all_urls>") || origins.includes("<all_urls>")) {
      add(
        "externally-connectable-all",
        "high",
        "externally_connectable matches <all_urls>",
        "Any website can attempt to send messages to this extension.",
        "Verify that message handlers validate the sender and do not expose privileged actions.",
      );
    } else if (matches.length || origins.length) {
      add(
        "externally-connectable",
        "info",
        [...matches, ...origins].join(", "),
        "Web pages at these origins can send messages to the extension.",
        "Review the message handlers that accept external connections.",
      );
    }
  }

  const war = manifest.webAccessibleResources;
  if (war) {
    const serialized = JSON.stringify(war);
    if (serialized.includes('"<all_urls>"') || serialized.includes('"*"') || serialized.includes("*/")) {
      add(
        "web-accessible-broad",
        "medium",
        serialized.length > 220 ? `${serialized.slice(0, 219)}…` : serialized,
        "Web-accessible resources include broad patterns. Other pages may be able to load these extension files.",
        "Limit exposed files to the minimum necessary and avoid exposing sensitive assets.",
      );
    }
  }

  if (manifest.manifestVersion === 2) {
    add(
      "manifest-v2",
      "low",
      "manifest_version: 2",
      "Manifest V2 extensions use older extension APIs and are being phased out by Chromium browsers.",
      "Check whether a Manifest V3 version of the extension is available.",
    );
  }

  if (manifest.errors.length) {
    add(
      "manifest-errors",
      "low",
      manifest.errors.join("; "),
      "The manifest could not be fully validated against the expected schema. Some fields may be missing or formatted differently.",
      "Review the manifest with a JSON validator and compare it with the vendor documentation.",
    );
  }

  return findings;
}
