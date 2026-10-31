import { LIMITS } from "./limits";
import type { DomainCategory, DomainRef, ManifestSummary } from "./types";

const URL_PATTERN = /\b(?:https?|wss?):\/\/[^\s"'`<>)\\]{3,}/gi;
const PROTOCOL_RELATIVE = /(?:^|[^:\w])(\/\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+[^\s"'`<>)\\]*)/gi;

const ANALYTICS = [
  "google-analytics.com",
  "analytics.google.com",
  "googletagmanager.com",
  "segment.com",
  "segment.io",
  "mixpanel.com",
  "amplitude.com",
  "hotjar.com",
  "matomo.cloud",
  "matomo.org",
  "statcounter.com",
  "plausible.io",
  "posthog.com",
  "fullstory.com",
  "mouseflow.com",
  "heap.io",
  "clarity.ms",
  "mc.yandex.ru",
  "quantserve.com",
  "scorecardresearch.com",
];

const ADVERTISING = [
  "doubleclick.net",
  "googlesyndication.com",
  "googleadservices.com",
  "adservice.google.com",
  "ads.google.com",
  "taboola.com",
  "outbrain.com",
  "criteo.com",
  "pubmatic.com",
  "rubiconproject.com",
  "adnxs.com",
  "amazon-adsystem.com",
  "adsrvr.org",
  "media.net",
  "adroll.com",
  "bat.bing.com",
  "facebook.net",
  "ads.tiktok.com",
  "ads.snapchat.com",
  "ads.reddit.com",
];

const AUTHENTICATION = [
  "accounts.google.com",
  "login.microsoftonline.com",
  "login.live.com",
  "auth0.com",
  "okta.com",
  "onelogin.com",
  "duosecurity.com",
  "appleid.apple.com",
  "login.github.com",
  "gitlab.com",
  "firebaseauth.com",
  "identitytoolkit.googleapis.com",
];

const ERROR_REPORTING = [
  "sentry.io",
  "bugsnag.com",
  "rollbar.com",
  "airbrake.io",
  "newrelic.com",
  "datadoghq.com",
  "logrocket.com",
  "raygun.io",
  "trackjs.com",
  "honeybadger.io",
  "getsentry.com",
];

const CLOUD = [
  "amazonaws.com",
  "cloudfront.net",
  "azureedge.net",
  "azurewebsites.net",
  "googleapis.com",
  "gstatic.com",
  "googleusercontent.com",
  "cloudflare.com",
  "cloudflare-dns.com",
  "firebaseio.com",
  "firebaseapp.com",
  "supabase.co",
  "herokuapp.com",
  "vercel.app",
  "netlify.app",
  "digitaloceanspaces.com",
  "workers.dev",
  "r2.dev",
  "backblazeb2.com",
  "fastly.net",
  "akamaihd.net",
  "unpkg.com",
  "jsdelivr.net",
  "cdnjs.cloudflare.com",
];

function matchesList(domain: string, list: string[]): boolean {
  return list.some((entry) => domain === entry || domain.endsWith(`.${entry}`));
}

export function classifyDomain(domain: string): DomainCategory {
  const normalized = domain.toLowerCase().replace(/^\*\.?/, "").replace(/\.$/, "");
  if (matchesList(normalized, ANALYTICS)) return "analytics";
  if (matchesList(normalized, ADVERTISING)) return "advertising";
  if (matchesList(normalized, AUTHENTICATION)) return "authentication";
  if (matchesList(normalized, ERROR_REPORTING)) return "error-reporting";
  if (matchesList(normalized, CLOUD)) return "cloud";
  return "unknown";
}

function normalizeDomain(hostname: string): string | null {
  const host = hostname
    .toLowerCase()
    .replace(/^\*\./, "")
    .replace(/\.$/, "")
    .replace(/:\d+$/, "");
  if (!host) return null;
  if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]") {
    return null;
  }
  if (host === "example.com" || host.endsWith(".example")) return null;
  if (!host.includes(".") && !/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return null;
  if (/[<>{}\s]/.test(host)) return null;
  return host;
}

function hostFromPattern(pattern: string): string | null {
  if (pattern === "<all_urls>") return null;
  const match = /^[a-z*]+:\/\/([^/]+)/i.exec(pattern);
  if (!match) return null;
  const rawHost = match[1];
  if (rawHost === "*" || rawHost === "*.*") return null;
  return normalizeDomain(rawHost);
}

function domainFromUrl(candidate: string): string | null {
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:" && url.protocol !== "ws:" && url.protocol !== "wss:") {
      return null;
    }
    return normalizeDomain(url.hostname);
  } catch {
    return null;
  }
}

function collectManifestDomains(manifest: ManifestSummary): { domain: string; file: string }[] {
  const found: { domain: string; file: string }[] = [];
  const manifestPath = manifest.path ?? "manifest.json";

  const addPattern = (value: string) => {
    const fromPattern = hostFromPattern(value);
    if (fromPattern) {
      found.push({ domain: fromPattern, file: manifestPath });
      return;
    }
    const fromUrl = domainFromUrl(value);
    if (fromUrl) found.push({ domain: fromUrl, file: manifestPath });
  };

  for (const pattern of [
    ...manifest.hostPermissions,
    ...manifest.optionalHostPermissions,
    ...manifest.contentScripts.flatMap((script) => script.matches),
  ]) {
    addPattern(pattern);
  }

  if (manifest.updateUrl) addPattern(manifest.updateUrl);

  const walk = (value: unknown) => {
    if (typeof value === "string") {
      if (/^(https?|wss?):\/\//i.test(value) || /^[a-z*]+:\/\/[^/]+/i.test(value)) addPattern(value);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) walk(item);
      return;
    }
    if (value && typeof value === "object") {
      for (const item of Object.values(value)) walk(item);
    }
  };

  walk(manifest.externallyConnectable);
  walk(manifest.webAccessibleResources);
  if (manifest.contentSecurityPolicy) {
    for (const match of manifest.contentSecurityPolicy.matchAll(URL_PATTERN)) addPattern(match[0]);
  }

  return found;
}

export function extractDomains(
  files: { path: string; text: string }[],
  manifest: ManifestSummary,
): DomainRef[] {
  const records = new Map<string, { count: number; files: Set<string>; category: DomainCategory }>();

  const add = (domain: string, file: string, count = 1) => {
    const existing = records.get(domain);
    if (existing) {
      existing.count += count;
      existing.files.add(file);
      return;
    }
    records.set(domain, {
      count,
      files: new Set([file]),
      category: classifyDomain(domain),
    });
  };

  for (const entry of collectManifestDomains(manifest)) add(entry.domain, entry.file);

  for (const file of files) {
    for (const match of file.text.matchAll(URL_PATTERN)) {
      const domain = domainFromUrl(match[0]);
      if (domain) add(domain, file.path);
    }
    for (const match of file.text.matchAll(PROTOCOL_RELATIVE)) {
      const domain = domainFromUrl(`https:${match[1]}`);
      if (domain) add(domain, file.path);
    }
  }

  return Array.from(records.entries())
    .map(([domain, record]) => ({
      domain,
      category: record.category,
      count: record.count,
      files: Array.from(record.files).sort(),
    }))
    .sort((a, b) => b.count - a.count || a.domain.localeCompare(b.domain))
    .slice(0, LIMITS.maxDomains);
}
