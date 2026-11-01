import type { FindingRule } from "@/lib/analyze/types";

const PERMISSION_PAGES: Record<string, string> = {
  activeTab: "chrome-permissions-checker",
  alarms: "extension-permission-analyzer",
  background: "chrome-extension-service-worker-vs-background-page",
  bookmarks: "chrome-permissions-checker",
  browsingData: "does-this-extension-track-me",
  clipboardRead: "browser-add-on-data-access-checker",
  clipboardWrite: "browser-add-on-data-access-checker",
  contentSettings: "chrome-permissions-checker",
  contextMenus: "extension-permission-analyzer",
  cookies: "extension-asking-for-cookies-permission",
  debugger: "extension-permission-analyzer",
  declarativeContent: "chrome-permissions-checker",
  declarativeNetRequest: "extension-external-domain-finder",
  declarativeNetRequestFeedback: "extension-external-domain-finder",
  declarativeNetRequestWithHostAccess: "chrome-extension-host-permissions-checker",
  desktopCapture: "browser-add-on-data-access-checker",
  downloads: "chrome-permissions-checker",
  fontSettings: "extension-permission-analyzer",
  geolocation: "does-this-extension-track-me",
  history: "browser-extension-tracking-analysis",
  identity: "extension-permission-analyzer",
  idle: "extension-permission-analyzer",
  management: "extension-permission-analyzer",
  nativeMessaging: "extension-permission-analyzer",
  notifications: "extension-permission-analyzer",
  offscreen: "chrome-extension-service-worker-vs-background-page",
  pageCapture: "browser-add-on-data-access-checker",
  privacy: "browser-extension-privacy-guide",
  proxy: "extension-permission-analyzer",
  readingList: "extension-permission-analyzer",
  scripting: "content-script-matches-patterns-explained",
  search: "chrome-permissions-checker",
  sessions: "browser-extension-tracking-analysis",
  sidePanel: "extension-permission-analyzer",
  storage: "browser-add-on-data-access-checker",
  tabCapture: "browser-add-on-data-access-checker",
  tabGroups: "chrome-permissions-checker",
  tabs: "chrome-permissions-checker",
  topSites: "does-this-extension-track-me",
  tts: "extension-permission-analyzer",
  unlimitedStorage: "browser-add-on-data-access-checker",
  webNavigation: "browser-extension-tracking-analysis",
  webRequest: "chrome-extension-host-permissions-checker",
  webRequestBlocking: "chrome-extension-host-permissions-checker",
};

const FINDING_PAGES: Record<FindingRule, string> = {
  eval: "extension-javascript-behavior-analyzer",
  "function-constructor": "extension-javascript-behavior-analyzer",
  "timer-string": "extension-javascript-behavior-analyzer",
  "remote-script": "remote-script-reference-detector",
  "import-scripts": "remote-script-reference-detector",
  obfuscation: "browser-plugin-source-analyzer",
  "dom-injection": "extension-content-script-inspector",
  "document-write": "extension-content-script-inspector",
  "network-request": "check-what-domains-a-chrome-extension-connects-to",
  websocket: "check-what-domains-a-chrome-extension-connects-to",
  storage: "browser-add-on-data-access-checker",
  messaging: "extension-externally-connectable-explained",
  "native-messaging": "extension-permission-analyzer",
  "cookie-access": "extension-asking-for-cookies-permission",
  "credential-access": "does-this-extension-track-me",
  "keyboard-listeners": "does-this-extension-track-me",
  "secret-token": "browser-plugin-source-analyzer",
  fingerprinting: "does-this-extension-track-me",
  "clipboard-access": "browser-add-on-data-access-checker",
  "crypto-mining": "remote-script-reference-detector",
  "suspicious-endpoint": "check-what-domains-a-chrome-extension-connects-to",
  "data-exfiltration": "browser-extension-tracking-analysis",
  "manifest-warning": "extension-manifest-viewer",
};

const CATEGORY_PAGES: Record<string, string> = {
  permissionExposure: "browser-extension-privacy-checker",
  websiteAccess: "chrome-extension-host-permissions-checker",
  dataCollection: "does-this-extension-track-me",
  remoteCode: "remote-script-reference-detector",
  externalDomains: "extension-external-domain-finder",
  obfuscation: "browser-plugin-source-analyzer",
};

export const DOMAIN_HELP_PAGE = "check-what-domains-a-chrome-extension-connects-to";

export function permissionHelpPage(permission: {
  kind: "api" | "host";
  key: string;
  broad: boolean;
}): string {
  if (permission.kind === "host") {
    return permission.broad
      ? "chrome-extension-reading-all-sites-permission"
      : "chrome-extension-host-permissions-checker";
  }
  return PERMISSION_PAGES[permission.key] ?? "chrome-permissions-checker";
}

export function findingHelpPage(rule: FindingRule): string {
  return FINDING_PAGES[rule];
}

export function categoryHelpPage(key: string): string {
  return CATEGORY_PAGES[key] ?? "browser-extension-privacy-checker";
}

export function allReportHelpPages(): string[] {
  return [
    ...new Set([
      ...Object.values(PERMISSION_PAGES),
      ...Object.values(FINDING_PAGES),
      ...Object.values(CATEGORY_PAGES),
      "chrome-extension-reading-all-sites-permission",
      DOMAIN_HELP_PAGE,
    ]),
  ];
}
