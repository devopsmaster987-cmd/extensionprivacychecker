export interface ContentSource {
  label: string;
  url: string;
}

const CHROME_PERMISSIONS: ContentSource = {
  label: "Chrome extensions: permissions list",
  url: "https://developer.chrome.com/docs/extensions/reference/permissions-list",
};
const CHROME_DECLARE_PERMISSIONS: ContentSource = {
  label: "Chrome extensions: declare permissions",
  url: "https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions",
};
const CHROME_MANIFEST: ContentSource = {
  label: "Chrome extensions: manifest reference",
  url: "https://developer.chrome.com/docs/extensions/reference/manifest",
};
const CHROME_CONTENT_SCRIPTS: ContentSource = {
  label: "Chrome extensions: content scripts",
  url: "https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts",
};
const CHROME_MATCH_PATTERNS: ContentSource = {
  label: "Chrome extensions: match patterns",
  url: "https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns",
};
const CHROME_CSP: ContentSource = {
  label: "Chrome extensions: content security policy",
  url: "https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy",
};
const CHROME_SERVICE_WORKERS: ContentSource = {
  label: "Chrome extensions: service workers",
  url: "https://developer.chrome.com/docs/extensions/develop/concepts/service-workers",
};
const CHROME_PROGRAM_POLICIES: ContentSource = {
  label: "Chrome Web Store program policies",
  url: "https://developer.chrome.com/docs/webstore/program-policies/",
};
const MDN_WEBEXTENSIONS: ContentSource = {
  label: "MDN: WebExtensions",
  url: "https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions",
};
const MDN_MANIFEST: ContentSource = {
  label: "MDN: manifest.json",
  url: "https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json",
};
const MDN_PERMISSIONS: ContentSource = {
  label: "MDN: WebExtensions permissions",
  url: "https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions",
};
const FIREFOX_PACKAGING: ContentSource = {
  label: "Firefox Extension Workshop: package your extension",
  url: "https://extensionworkshop.com/documentation/publish/package-your-extension/",
};
const FIREFOX_POLICIES: ContentSource = {
  label: "Firefox add-on policies",
  url: "https://extensionworkshop.com/documentation/publish/add-on-policies/",
};
const EDGE_EXTENSIONS: ContentSource = {
  label: "Microsoft Edge extensions documentation",
  url: "https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/",
};
const EDGE_POLICIES: ContentSource = {
  label: "Microsoft Edge Add-ons policies",
  url: "https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/store-policies/",
};
const WEBREQUEST: ContentSource = {
  label: "Chrome extensions: webRequest API",
  url: "https://developer.chrome.com/docs/extensions/reference/api/webRequest",
};
const EXTERNALLY_CONNECTABLE: ContentSource = {
  label: "Chrome extensions: externally_connectable",
  url: "https://developer.chrome.com/docs/extensions/reference/manifest/externally-connectable",
};
const WEB_ACCESSIBLE_RESOURCES: ContentSource = {
  label: "Chrome extensions: web_accessible_resources",
  url: "https://developer.chrome.com/docs/extensions/reference/manifest/web-accessible-resources",
};
const CRX_FORMAT: ContentSource = {
  label: "Chromium: CRX3 file format",
  url: "https://chromium.googlesource.com/chromium/src/+/main/components/crx_file/crx3.proto",
};

const SOURCES: Record<string, ContentSource[]> = {
  "privacy-checker": [CHROME_PERMISSIONS, MDN_WEBEXTENSIONS, EDGE_EXTENSIONS],
  crx: [CRX_FORMAT, CHROME_MANIFEST, CHROME_PROGRAM_POLICIES],
  manifest: [CHROME_MANIFEST, MDN_MANIFEST, CHROME_CSP],
  permissions: [CHROME_PERMISSIONS, CHROME_DECLARE_PERMISSIONS, MDN_PERMISSIONS],
  xpi: [MDN_WEBEXTENSIONS, MDN_MANIFEST, FIREFOX_PACKAGING],
  edge: [EDGE_EXTENSIONS, CHROME_PERMISSIONS, EDGE_POLICIES],
  domains: [WEBREQUEST, EXTERNALLY_CONNECTABLE, CHROME_DECLARE_PERMISSIONS],
  "content-scripts": [CHROME_CONTENT_SCRIPTS, CHROME_MATCH_PATTERNS, WEB_ACCESSIBLE_RESOURCES],
  "remote-code": [CHROME_CSP, CHROME_SERVICE_WORKERS, CHROME_PROGRAM_POLICIES],
  tracking: [WEBREQUEST, FIREFOX_POLICIES, MDN_PERMISSIONS],
  "privacy-guide": [CHROME_PROGRAM_POLICIES, FIREFOX_POLICIES, MDN_WEBEXTENSIONS],
};

const FALLBACK: ContentSource[] = [CHROME_PERMISSIONS, MDN_WEBEXTENSIONS, CHROME_PROGRAM_POLICIES];

export function getSources(cluster: string): ContentSource[] {
  return SOURCES[cluster] ?? FALLBACK;
}

export function allSourceUrls(): string[] {
  return [...new Set(Object.values(SOURCES).flat().map((source) => source.url))];
}
