import type { PermissionInfo } from "./types";

interface PermissionDefinition {
  score: number;
  broad?: boolean;
  description: string;
  recommendation: string;
}

const CATALOG: Record<string, PermissionDefinition> = {
  activeTab: {
    score: 4,
    description:
      "Grants temporary access to the active tab when the user clicks the extension. Access ends when the tab navigates or closes.",
    recommendation:
      "Generally low risk. Check that the extension explains why it needs to act on the current page.",
  },
  alarms: {
    score: 2,
    description: "Lets the extension schedule background tasks.",
    recommendation: "Low risk on its own. Review what the scheduled tasks do.",
  },
  background: {
    score: 6,
    description: "Allows the extension to run in the background.",
    recommendation:
      "Check the background service worker for network requests and data collection.",
  },
  bookmarks: {
    score: 8,
    description: "Allows reading and modifying the user's bookmarks.",
    recommendation:
      "Consider whether the extension needs full bookmark access or only a single action.",
  },
  browsingData: {
    score: 14,
    description:
      "Allows clearing browsing data such as history, cookies and cache.",
    recommendation:
      "Review the exact data types being cleared and whether the action is user-initiated.",
  },
  clipboardRead: {
    score: 12,
    broad: true,
    description: "Allows reading text the user copies to the clipboard.",
    recommendation:
      "Clipboard contents can include passwords or tokens. Verify when and why the extension reads it.",
  },
  clipboardWrite: {
    score: 5,
    description: "Allows writing text to the clipboard.",
    recommendation: "Low risk, but unexpected clipboard writes can be deceptive.",
  },
  contentSettings: {
    score: 10,
    description:
      "Allows changing website settings such as JavaScript, images and pop-ups.",
    recommendation:
      "Check which settings are changed and whether changes are reversible.",
  },
  contextMenus: {
    score: 3,
    description: "Lets the extension add items to the browser context menu.",
    recommendation: "Low risk. Review what the menu items do.",
  },
  cookies: {
    score: 14,
    broad: true,
    description:
      "Allows reading and modifying cookies, which may contain session identifiers.",
    recommendation:
      "Session cookies can grant account access. Check which sites are targeted and why cookies are needed.",
  },
  debugger: {
    score: 20,
    broad: true,
    description:
      "Allows attaching to browser tabs with the debugger protocol, giving deep access to page content and network traffic.",
    recommendation:
      "Debugger access is extremely powerful. Only use extensions that clearly document this feature.",
  },
  declarativeContent: {
    score: 3,
    description: "Allows showing extension actions based on page content.",
    recommendation: "Low risk on its own.",
  },
  declarativeNetRequest: {
    score: 8,
    description:
      "Allows blocking or modifying network requests using static or dynamic rules.",
    recommendation:
      "Review the bundled rule lists and whether requests are only blocked or also redirected.",
  },
  declarativeNetRequestFeedback: {
    score: 6,
    description:
      "Allows observing which declarative network rules matched requests.",
    recommendation: "Review how the matched request information is handled.",
  },
  declarativeNetRequestWithHostAccess: {
    score: 10,
    description:
      "Allows modifying network requests for sites covered by host permissions.",
    recommendation:
      "Check the host permissions and rule sets together to understand the reach.",
  },
  desktopCapture: {
    score: 15,
    broad: true,
    description: "Allows capturing the screen or application windows.",
    recommendation:
      "Screen capture can record sensitive information. Confirm capture is user-initiated and visible.",
  },
  downloads: {
    score: 10,
    description: "Allows starting downloads and accessing downloaded files.",
    recommendation:
      "Check what files are downloaded and where they come from.",
  },
  fontSettings: {
    score: 4,
    description: "Allows reading and changing browser font settings.",
    recommendation: "Low risk on its own.",
  },
  geolocation: {
    score: 12,
    broad: true,
    description: "Allows access to the user's approximate location.",
    recommendation:
      "Location is sensitive personal data. Check when it is requested and whether it is transmitted.",
  },
  history: {
    score: 14,
    broad: true,
    description: "Allows reading and deleting the browsing history.",
    recommendation:
      "Browsing history reveals interests and visited accounts. Verify the feature that needs it.",
  },
  identity: {
    score: 8,
    description:
      "Allows obtaining OAuth tokens for the signed-in browser profile.",
    recommendation:
      "Review which OAuth scopes are requested and where tokens are stored.",
  },
  idle: {
    score: 2,
    description: "Allows detecting when the user is idle or active.",
    recommendation: "Low risk on its own.",
  },
  management: {
    score: 16,
    broad: true,
    description:
      "Allows listing, enabling, disabling and uninstalling other extensions.",
    recommendation:
      "Extensions that can control other extensions deserve close review.",
  },
  nativeMessaging: {
    score: 20,
    broad: true,
    description:
      "Allows communicating with a native application installed on the computer.",
    recommendation:
      "Native messaging can reach beyond the browser sandbox. Confirm the companion app is trusted.",
  },
  notifications: {
    score: 4,
    description: "Allows showing browser notifications.",
    recommendation: "Low risk, but notifications can be used for spam or phishing.",
  },
  offscreen: {
    score: 5,
    description: "Allows creating hidden documents for background processing.",
    recommendation: "Review what the hidden document is used for.",
  },
  pageCapture: {
    score: 12,
    broad: true,
    description: "Allows saving a tab as a MHTML file.",
    recommendation: "Page captures may contain private content. Check where files go.",
  },
  privacy: {
    score: 12,
    description:
      "Allows reading and changing privacy-related browser settings.",
    recommendation: "Review which privacy settings are modified.",
  },
  proxy: {
    score: 18,
    broad: true,
    description:
      "Allows controlling the browser proxy configuration, which can route traffic through another server.",
    recommendation:
      "Proxy control is high impact. Verify who operates the proxy and whether traffic is decrypted.",
  },
  readingList: {
    score: 5,
    description: "Allows reading and modifying the reading list.",
    recommendation: "Low risk on its own.",
  },
  scripting: {
    score: 12,
    broad: true,
    description:
      "Allows injecting JavaScript and CSS into web pages covered by host permissions.",
    recommendation:
      "Injection can read and change page content. Review the injected scripts and target sites.",
  },
  search: {
    score: 4,
    description: "Allows querying the browser's search providers.",
    recommendation: "Low risk on its own.",
  },
  sessions: {
    score: 8,
    description: "Allows reading recently closed tabs and windows.",
    recommendation: "Review what happens with restored tab and window data.",
  },
  sidePanel: {
    score: 3,
    description: "Allows displaying a side panel in the browser.",
    recommendation: "Low risk on its own.",
  },
  storage: {
    score: 4,
    description: "Allows storing extension data locally or syncing it via the browser account.",
    recommendation:
      "Check what is stored and whether synced data contains personal information.",
  },
  tabCapture: {
    score: 14,
    broad: true,
    description: "Allows capturing the audio and video of a tab.",
    recommendation:
      "Captured tab content can be sensitive. Confirm the extension indicates when capture is active.",
  },
  tabGroups: {
    score: 3,
    description: "Allows reading and modifying tab groups.",
    recommendation: "Low risk on its own.",
  },
  tabs: {
    score: 9,
    broad: true,
    description:
      "Allows reading tab titles, URLs and favicons, and creating or closing tabs.",
    recommendation:
      "Tab metadata can reveal browsing activity. Check whether URLs are collected or transmitted.",
  },
  topSites: {
    score: 8,
    description: "Allows reading the most frequently visited sites.",
    recommendation: "Review whether the list is displayed locally or sent elsewhere.",
  },
  tts: {
    score: 3,
    description: "Allows using text-to-speech.",
    recommendation: "Low risk on its own.",
  },
  unlimitedStorage: {
    score: 3,
    description: "Removes the normal storage quota for extension data.",
    recommendation: "Review what data is retained and for how long.",
  },
  userScripts: {
    score: 16,
    broad: true,
    description:
      "Allows running user-provided scripts in pages with broad access.",
    recommendation:
      "User scripts can be changed after install. Check whether remote script updates are supported.",
  },
  webNavigation: {
    score: 7,
    description: "Allows observing navigation events and page loads.",
    recommendation:
      "Navigation data reveals browsing patterns. Check what is logged or transmitted.",
  },
  webRequest: {
    score: 13,
    broad: true,
    description:
      "Allows observing network requests, including URLs and headers.",
    recommendation:
      "Observed request data can include tokens or personal information. Review what is recorded.",
  },
  webRequestBlocking: {
    score: 16,
    broad: true,
    description:
      "Allows blocking and modifying network requests in Manifest V2 extensions.",
    recommendation:
      "Review the rule logic and ensure modifications are limited to the stated purpose.",
  },
  audioCapture: {
    score: 14,
    broad: true,
    description: "Allows capturing audio from tabs or the microphone in some contexts.",
    recommendation: "Confirm capture is visible and user-initiated.",
  },
  videoCapture: {
    score: 14,
    broad: true,
    description: "Allows capturing video in some extension contexts.",
    recommendation: "Confirm capture is visible and user-initiated.",
  },
  webAuthenticationProxy: {
    score: 10,
    description: "Allows intercepting WebAuthn authentication requests.",
    recommendation: "Review how authentication requests are handled.",
  },
  "system.cpu": {
    score: 4,
    description: "Allows reading CPU information.",
    recommendation: "Can contribute to device fingerprinting. Review the purpose.",
  },
  "system.memory": {
    score: 4,
    description: "Allows reading memory information.",
    recommendation: "Can contribute to device fingerprinting. Review the purpose.",
  },
  "system.display": {
    score: 4,
    description: "Allows reading display information.",
    recommendation: "Can contribute to device fingerprinting. Review the purpose.",
  },
  "system.storage": {
    score: 4,
    description: "Allows reading storage device information.",
    recommendation: "Can contribute to device fingerprinting. Review the purpose.",
  },
};

const UNKNOWN: PermissionDefinition = {
  score: 4,
  description:
    "This permission is not in our current catalog. Check the browser vendor documentation before installing.",
  recommendation:
    "Search the permission name in the official browser documentation and verify the extension's stated purpose.",
};

function levelFor(score: number): PermissionInfo["level"] {
  if (score >= 16) return "critical";
  if (score >= 12) return "high";
  if (score >= 6) return "medium";
  return "low";
}

export function analyzePermissions(
  rawPermissions: string[],
  rawOptionalPermissions: string[] = [],
): PermissionInfo[] {
  const seen = new Set<string>();
  const results: PermissionInfo[] = [];

  const add = (raw: string, optional: boolean) => {
    const key = raw.trim();
    if (!key || seen.has(key)) return;
    seen.add(key);

    if (key.includes("://") || key === "<all_urls>") {
      results.push({ ...analyzeHostPermission(key), optional });
      return;
    }

    const definition = CATALOG[key] ?? CATALOG[key.replace(/^chrome\./, "")] ?? UNKNOWN;
    results.push({
      key,
      raw: key,
      kind: "api",
      optional,
      score: definition.score,
      level: levelFor(definition.score),
      broad: Boolean(definition.broad),
      description: definition.description,
      recommendation: definition.recommendation,
    });
  };

  for (const raw of rawPermissions) add(raw, false);
  for (const raw of rawOptionalPermissions) add(raw, true);

  return results.sort(
    (a, b) => Number(a.optional) - Number(b.optional) || b.score - a.score || a.key.localeCompare(b.key),
  );
}

export function analyzeHostPermission(raw: string): Omit<PermissionInfo, "optional"> {
  const broad = raw === "<all_urls>" || /^\*:\/\/\*\/\*$/.test(raw) || /^https?:\/\/\*\/\*$/.test(raw);
  const schemeWildcard = raw.includes("*://");
  const hostWildcard = /^[a-z*]+:\/\/\*\./i.test(raw) || raw.startsWith("*.");
  const fileScheme = raw.startsWith("file://");

  let score = 8;
  if (broad) score = 25;
  else if (schemeWildcard && hostWildcard) score = 18;
  else if (hostWildcard) score = 12;
  else if (fileScheme) score = 12;
  else if (schemeWildcard) score = 14;

  return {
    key: raw,
    raw,
    kind: "host",
    score,
    level: levelFor(score),
    broad,
    description: broad
      ? "Grants access to every website the user visits, including pages that may show private or account-specific content."
      : hostWildcard
        ? "Grants access to a domain and all of its subdomains."
        : fileScheme
          ? "Grants access to local files opened in the browser."
          : "Grants access to websites matching this pattern.",
    recommendation: broad
      ? "Only install if you understand why the extension needs access to every site. Prefer extensions that request specific sites."
      : "Check that the listed sites match the extension's stated purpose.",
  };
}

export function permissionScore(permissions: PermissionInfo[]): number {
  const apiTotal = permissions
    .filter((permission) => permission.kind === "api")
    .reduce((total, permission) => total + permission.score, 0);
  return Math.min(100, apiTotal * 2);
}
