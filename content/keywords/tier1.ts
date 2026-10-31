import type { ContentPage } from "../types";

export const tier1: ContentPage[] = [
  {
    kind: "keyword",
    slug: "crx-file-analyzer-online-free",
    cluster: "crx",
    hub: "crx-package-analyzer",
    primaryKeyword: "crx file analyzer online free",
    intent: "analyzer",
    title: "CRX File Analyzer Online Free: Inspect a Chrome Package",
    metaTitle: "CRX File Analyzer Online Free - No Install, No Signup",
    description:
      "Analyze a CRX file online for free. See the manifest, permissions, host access, scripts, external domains and a transparent risk score without installing it.",
    h1: "CRX file analyzer online free",
    answer:
      "A free CRX file analyzer opens a Chrome extension package in your browser, strips the CRX header and reads the embedded ZIP. You see its manifest, permissions, scripts and referenced domains without installing or executing anything. This analyzer also reports static code indicators and a transparent risk score.",
    sections: [
      {
        heading: "What can you inspect in a CRX file for free?",
        body: [
          "You can inspect every text entry that matters for a privacy review: manifest.json, background and service-worker scripts, content scripts, popup HTML and JSON configuration. The analyzer summarizes the manifest instead of dumping raw JSON, and it lists each permission with a plain-language explanation.",
          "The report also extracts external domains and groups them by likely purpose. Code findings include file names and line numbers where available, so you can verify the evidence yourself.",
        ],
        links: [
          { label: "unpack a CRX without installing", slug: "unpack-crx-file-without-installing" },
          { label: "CRX3 structure", slug: "crx3-file-format-structure" },
        ],
      },
      {
        heading: "How to analyze a CRX file in three steps",
        body: [
          "Download the CRX from the store or obtain it from the publisher. Open this page, drop the file onto the analyzer and wait for unpacking. Review permissions and host access first, then read the code findings and domain list.",
          "Everything happens locally in a Web Worker. The file is not uploaded to a server, and the extension code is parsed as text rather than executed.",
        ],
        steps: [
          { title: "Get the package", body: "Download the CRX or use a supported store URL." },
          { title: "Upload it", body: "Drop the file or choose it from your device." },
          { title: "Read the report", body: "Start with permissions, then evidence and domains." },
        ],
        links: [
          { label: "CRX package analyzer", slug: "crx-package-analyzer" },
          { label: "browser extension privacy checker", slug: "browser-extension-privacy-checker" },
        ],
      },
      {
        heading: "What the free analysis cannot do",
        body: [
          "It cannot execute the extension, so it cannot observe runtime network traffic, permission use or behavior that depends on a logged-in account. It also cannot follow code that is fetched after installation.",
          "A CRX signature and a clean static report are not safety guarantees. Use the report to make an informed decision, not as a certification.",
        ],
        callout:
          "Static references describe capability. Only runtime observation can show what an extension actually did.",
      },
    ],
    faqs: [
      {
        question: "Is the CRX analyzer really free?",
        answer:
          "Yes. There is no account, payment or scan limit. Files are processed in your browser and the report is not stored on a server.",
      },
      {
        question: "Can I analyze a CRX from the Chrome Web Store?",
        answer:
          "You can paste a Chrome Web Store URL or download the package and upload it. If the store blocks automatic retrieval, manual upload works.",
      },
      {
        question: "Does the analyzer read my Chrome data?",
        answer:
          "No. It only reads the file you provide. It has no access to your Chrome profile, history, cookies or installed extensions.",
      },
      {
        question: "What is the maximum file size?",
        answer:
          "The upload limit is 25 MB. Archive entries and total decompressed size are capped to prevent abuse.",
      },
    ],
    related: [
      "unpack-crx-file-without-installing",
      "crx3-file-format-structure",
      "view-extension-manifest-json-online",
      "is-this-chrome-extension-safe-to-install",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "how-to-check-chrome-extension-permissions-before-installing",
    cluster: "permissions",
    hub: "chrome-permissions-checker",
    primaryKeyword: "how to check chrome extension permissions before installing",
    intent: "guide",
    title: "How to Check Chrome Extension Permissions Before Installing",
    metaTitle: "How to Check Chrome Extension Permissions Before Installing",
    description:
      "Learn how to check Chrome extension permissions before installing. Read the manifest, separate API and host access, and identify broad permissions.",
    h1: "How to check Chrome extension permissions before installing",
    answer:
      "You can check permissions before installing by reading the extension's manifest.json from its package or store listing, then matching each declared permission and host pattern to the feature you need. The most important checks are broad host access, cookies, history, debugger, nativeMessaging and scripting.",
    sections: [
      {
        heading: "Where to find the permission list",
        body: [
          "The Chrome Web Store detail page shows a permissions summary, but the package's manifest.json is more precise. A CRX, ZIP or unpacked folder contains the full list of required permissions, optional permissions and host permissions.",
          "If you only have the store URL, paste it into the analyzer. When automatic retrieval is blocked, download the package and upload the file. Never install an extension just to inspect it.",
        ],
        links: [
          { label: "Chrome host permissions checker", slug: "chrome-extension-host-permissions-checker" },
          { label: "view manifest online", slug: "view-extension-manifest-json-online" },
        ],
      },
      {
        heading: "A practical review order",
        body: [
          "Start with host permissions because they define which websites can be read or changed. Then look at content scripts, which may run on those sites. Review sensitive APIs next, and finish with optional permissions and the update URL.",
          "Write down each capability and the feature that needs it. If you cannot connect a permission to a feature, that is the item to investigate.",
        ],
        steps: [
          { title: "Check host_access", body: "Prefer specific hosts over wildcards and all_urls." },
          { title: "Check content_scripts", body: "See which pages receive injected code." },
          { title: "Check powerful APIs", body: "Review cookies, history, debugger, proxy, nativeMessaging." },
          { title: "Check optional permissions", body: "Understand what may be requested later." },
        ],
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "content script matches", slug: "content-script-matches-patterns-explained" },
        ],
      },
      {
        heading: "Permission warnings are not enough",
        body: [
          "Chrome's install prompt summarizes access, but wording can be broad and easy to dismiss. The manifest distinguishes optional from required access and shows the exact site patterns.",
          "Use the install prompt for a quick check and the package analysis for detail. After installation, the browser's extensions page still lists granted permissions, and you can restrict site access.",
        ],
        callout:
          "A permission is a capability, not proof of misuse. The review question is whether the capability fits the feature and the publisher's transparency.",
      },
    ],
    faqs: [
      {
        question: "How can I see extension permissions without installing?",
        answer:
          "Download the CRX or ZIP and inspect manifest.json with a static analyzer. The Chrome Web Store page also shows a summary, but the manifest is more complete.",
      },
      {
        question: "Which permission is the biggest privacy risk?",
        answer:
          "Context decides. debugger, nativeMessaging, proxy and broad host access have the widest reach, while cookies, history and webRequest can expose sensitive data.",
      },
      {
        question: "Do optional permissions still matter?",
        answer:
          "Yes. They can be requested later and may expand access after installation. Review what the extension says it will ask for.",
      },
      {
        question: "Can I limit an extension to one site?",
        answer:
          "Some browsers let you restrict site access for an installed extension. The extension's own host permissions still define what it is designed to access.",
      },
    ],
    related: [
      "chrome-extension-host-permissions-checker",
      "what-does-all-urls-permission-mean",
      "extension-permission-analyzer",
      "is-this-chrome-extension-safe-to-install",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "firefox-xpi-file-analyzer",
    cluster: "xpi",
    hub: "firefox-xpi-analyzer",
    primaryKeyword: "firefox xpi file analyzer",
    intent: "analyzer",
    title: "Firefox XPI File Analyzer: Inspect an Add-on Package",
    metaTitle: "Firefox XPI File Analyzer - Inspect Add-ons Online",
    description:
      "Analyze a Firefox XPI file online. Inspect manifest permissions, host access, background scripts, content scripts, domains and code findings.",
    h1: "Firefox XPI file analyzer",
    answer:
      "A Firefox XPI file analyzer opens the ZIP-based add-on package and reads its manifest and scripts without installing it. You can review permissions, host access, content scripts, external domains and static code indicators. The add-on is never loaded into Firefox.",
    sections: [
      {
        heading: "What is inside an XPI file?",
        body: [
          "An XPI is a ZIP archive that contains manifest.json plus the add-on's JavaScript, HTML, styles, images and locale files. Firefox reads the manifest to decide which capabilities to grant.",
          "The analyzer validates archive paths and sizes, then inspects text entries. Binary assets and nested archives are skipped rather than opened.",
        ],
        links: [
          { label: "Firefox XPI analyzer hub", slug: "firefox-xpi-analyzer" },
          { label: "manifest viewer", slug: "extension-manifest-viewer" },
        ],
      },
      {
        heading: "Reviewing an add-on safely",
        body: [
          "Check host and content-script access first. Then review permissions such as cookies, history, tabs and webRequest, followed by code findings for dynamic code, remote scripts and data access.",
          "If you obtain the XPI from addons.mozilla.org, use the public listing or the add-on's download link. The analyzer attempts official retrieval only when you provide an approved store URL.",
        ],
        links: [
          { label: "extension permission analyzer", slug: "extension-permission-analyzer" },
          { label: "external domain finder", slug: "extension-external-domain-finder" },
        ],
      },
      {
        heading: "Limitations of XPI inspection",
        body: [
          "The report shows static references and manifest declarations. It cannot observe runtime behavior, verify publisher identity or prove that data was collected. Legacy add-ons that do not use a standard manifest may produce incomplete results.",
        ],
        callout:
          "A Mozilla review and a clean static scan are useful signals, but neither guarantees privacy. Check the permissions against your own risk tolerance.",
      },
    ],
    faqs: [
      {
        question: "How do I open an XPI file?",
        answer:
          "Upload it here or rename a copy to .zip and open it with an archive tool. The analyzer does this safely in your browser without installing the add-on.",
      },
      {
        question: "Can I inspect a Firefox add-on from its store URL?",
        answer:
          "Yes, when the public API and approved hosts allow retrieval. If not, download the XPI and upload it manually.",
      },
      {
        question: "Are XPI files safe to open?",
        answer:
          "They are archives, not executables. Opening one as an archive is generally safe. Do not install an add-on you have not reviewed.",
      },
    ],
    related: [
      "firefox-xpi-analyzer",
      "extension-manifest-viewer",
      "extension-permission-analyzer",
      "are-chrome-extensions-safe",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "manifest-v3-permissions-list-explained",
    cluster: "manifest",
    hub: "extension-manifest-viewer",
    primaryKeyword: "manifest v3 permissions list explained",
    intent: "reference",
    title: "Manifest V3 Permissions List Explained in Plain Language",
    metaTitle: "Manifest V3 Permissions List Explained - Common APIs",
    description:
      "A plain-language list of common Manifest V3 permissions, including host permissions, cookies, tabs, scripting, webRequest, debugger and storage.",
    h1: "Manifest V3 permissions list explained",
    answer:
      "Manifest V3 permissions declare which browser APIs an extension can use. Common examples include storage, tabs, cookies, history, scripting, webRequest, downloads, management, nativeMessaging and debugger. Host permissions live in a separate field and define which websites the extension can access. Each permission describes capability, not intent.",
    sections: [
      {
        heading: "Common Manifest V3 permissions",
        body: [
          "The list below is a practical summary, not a complete browser API catalog. Browser support can vary, and new permissions are added over time. Always confirm the exact meaning in the vendor documentation before making a decision.",
        ],
        table: {
          caption: "Common permissions and what they allow",
          headers: ["Permission", "Allows access to", "Privacy consideration"],
          rows: [
            ["storage", "Extension-local and synced storage", "May retain personal or browsing data"],
            ["tabs", "Tab titles, URLs, creation and closure", "Reveals browsing activity"],
            ["cookies", "Cookie read and write access", "Session cookies can grant account access"],
            ["history", "Browsing history", "Highly revealing personal data"],
            ["scripting", "Code injection into permitted pages", "Can read and change page content"],
            ["webRequest", "Observation of network requests", "URLs and headers may contain tokens"],
            ["downloads", "Download initiation and file access", "Review destinations and file types"],
            ["management", "Other extensions", "Can disable or remove extensions"],
            ["nativeMessaging", "Communication with a native app", "Reaches outside the browser sandbox"],
            ["debugger", "Deep tab and network inspection", "Extremely powerful access"],
            ["declarativeNetRequest", "Rule-based request blocking or changes", "Review bundled rule lists"],
            ["alarms", "Scheduled background tasks", "Low risk alone; review task behavior"],
          ],
        },
        links: [
          { label: "Chrome permissions checker", slug: "chrome-permissions-checker" },
          { label: "cookies permission explained", slug: "extension-asking-for-cookies-permission" },
        ],
      },
      {
        heading: "Where host permissions fit",
        body: [
          "Manifest V3 separates host permissions into host_permissions. A value such as https://example.com/* allows access to that host, while <all_urls> or *://*/* covers nearly every site. Content-script match patterns also define where injected code runs.",
          "An extension can have API permission for tabs but no host access, or host access without a particular API. Read both fields together.",
        ],
        links: [
          { label: "host permissions checker", slug: "chrome-extension-host-permissions-checker" },
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
        ],
      },
      {
        heading: "Optional permissions and updates",
        body: [
          "Optional permissions are listed separately and requested at runtime. They can expand access after installation, so check what the extension might ask for. Updates can also introduce new required permissions, which the browser may prompt you about.",
          "Neither a permission list nor a store label tells you how data is handled. Combine the list with code evidence and the publisher's privacy policy.",
        ],
        callout:
          "This table is educational. The authoritative list for a specific browser version is the vendor's extension API documentation.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between permissions and host_permissions in Manifest V3?",
        answer:
          "permissions grant API capabilities such as storage or cookies. host_permissions grant website access. Many privacy-sensitive features require both.",
      },
      {
        question: "Is scripting more dangerous than tabs?",
        answer:
          "They expose different things. scripting can change page content where allowed, while tabs can reveal URLs and metadata. Context and host access determine impact.",
      },
      {
        question: "Why do some permissions appear optional?",
        answer:
          "Optional permissions let an extension request a capability only when a feature needs it. Users can refuse them.",
      },
      {
        question: "Does every Manifest V3 extension use host_permissions?",
        answer:
          "No. An extension without website access may request only API permissions, subject to browser rules.",
      },
    ],
    related: [
      "chrome-extension-host-permissions-checker",
      "what-does-all-urls-permission-mean",
      "extension-csp-manifest-v3-explained",
      "extension-permission-analyzer",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "what-does-all-urls-permission-mean",
    cluster: "permissions",
    hub: "chrome-permissions-checker",
    primaryKeyword: "what does <all_urls> permission mean",
    intent: "question",
    title: "What Does the <all_urls> Permission Mean?",
    metaTitle: "What Does all_urls Permission Mean? Broad Website Access",
    description:
      "Understand the <all_urls> extension permission: which websites it covers, what it allows, how it differs from an API permission and what to check.",
    h1: "What does the <all_urls> permission mean?",
    answer:
      "<all_urls> is a host permission that matches every URL scheme and website an extension is allowed to access. It lets content scripts run on, and extension APIs reach, nearly any page you visit, including logged-in accounts. It describes reach, not proof that the extension reads or collects your data.",
    sections: [
      {
        heading: "Which sites does <all_urls> cover?",
        body: [
          "<all_urls> covers http, https, file and other supported schemes. In practice, a content script with this match can run on almost every ordinary web page. The extension still needs the relevant API permission for specific browser data.",
          "A more limited pattern names one host or a wildcard subdomain. Broad wildcard patterns and all_urls are common in ad blockers, password managers, accessibility tools and developer utilities, which makes context essential.",
        ],
        links: [
          { label: "Chrome host permissions", slug: "chrome-extension-host-permissions-checker" },
          { label: "all sites permission", slug: "chrome-extension-reading-all-sites-permission" },
        ],
      },
      {
        heading: "What can an extension do with it?",
        body: [
          "With all_urls and the right supporting permissions, an extension can inject scripts, read page content, observe navigation, modify forms and send messages between contexts. Without scripting or API permissions, the practical reach is smaller.",
          "A content script can also read document.cookie where cookies are not HttpOnly. The cookies permission is separate and grants broader cookie API access.",
        ],
        links: [
          { label: "content script matches explained", slug: "content-script-matches-patterns-explained" },
          { label: "cookies permission", slug: "extension-asking-for-cookies-permission" },
        ],
      },
      {
        heading: "How to decide whether to accept it",
        body: [
          "Ask whether the feature genuinely requires every site. A password manager may need to recognize login forms everywhere; a shopping coupon tool may need many retail sites; a niche utility usually does not need all_urls.",
          "Look for narrow alternatives, check the publisher's privacy policy and restrict site access in the browser if the extension supports it. Review again after updates.",
        ],
        callout:
          "all_urls is a red flag only when it is disproportionate to the stated feature or combined with opaque data practices.",
      },
    ],
    faqs: [
      {
        question: "Does <all_urls> include my bank and email?",
        answer:
          "It can include them if they are ordinary web pages and the extension runs a content script there. Highly sensitive sites may use additional protections, but you should assume broad reach.",
      },
      {
        question: "Is <all_urls> the same as the cookies permission?",
        answer:
          "No. all_urls is website access. cookies is a separate API permission that allows cookie operations beyond page-level access.",
      },
      {
        question: "Can I grant all_urls to one site only?",
        answer:
          "Some browsers let you restrict an installed extension's site access. That limits runtime behavior but does not change what the extension requested.",
      },
      {
        question: "Why do ad blockers request all_urls?",
        answer:
          "They need to inspect and modify requests or page content on many sites. That can be legitimate, but the rule lists and publisher still matter.",
      },
    ],
    related: [
      "chrome-extension-host-permissions-checker",
      "chrome-extension-reading-all-sites-permission",
      "extension-website-access-inspector",
      "are-chrome-extensions-safe",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "chrome-extension-host-permissions-checker",
    cluster: "permissions",
    hub: "chrome-permissions-checker",
    primaryKeyword: "chrome extension host permissions checker",
    intent: "analyzer",
    title: "Chrome Extension Host Permissions Checker",
    metaTitle: "Chrome Extension Host Permissions Checker - Site Access",
    description:
      "Check Chrome extension host permissions and content-script match patterns. See which websites an extension can access and how broad the patterns are.",
    h1: "Chrome extension host permissions checker",
    answer:
      "A Chrome extension host permissions checker lists the website patterns an extension can access. It distinguishes specific hosts from wildcard subdomains, wildcard schemes and <all_urls>, and it shows content-script matches that inject code. Host permissions define website reach, not data handling.",
    sections: [
      {
        heading: "Reading host permission patterns",
        body: [
          "A pattern begins with a scheme, followed by a host and path. https://example.com/* is limited to one host. https://*.example.com/* includes subdomains. <all_urls> covers every supported scheme and host. The path portion can narrow access, but many extensions use /*.",
          "Manifest V3 stores these patterns in host_permissions. Manifest V2 often places them in the general permissions array alongside API permissions.",
        ],
        table: {
          caption: "Host pattern breadth",
          headers: ["Pattern", "Reach", "Typical concern"],
          rows: [
            ["https://example.com/*", "One host", "Low, if the site matches the feature"],
            ["https://*.example.com/*", "Host and subdomains", "Medium; many services use subdomains"],
            ["*://*/*", "Every http and https host", "Broad; review the feature carefully"],
            ["<all_urls>", "All supported schemes and hosts", "Broadest website access"],
            ["file:///*", "Local files opened in the browser", "Can expose local content"],
          ],
        },
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "website access inspector", slug: "extension-website-access-inspector" },
        ],
      },
      {
        heading: "Host access versus content scripts",
        body: [
          "Host permissions grant API access to matching URLs. Content scripts are files injected into matching pages. The match patterns can differ, so an extension may request API access to one set of sites and inject scripts into another.",
          "The checker reports both. It also highlights all_frames, which extends injection into iframes, and run_at timing, which affects how early the script sees the page.",
        ],
        links: [
          { label: "content script matches", slug: "content-script-matches-patterns-explained" },
          { label: "extension content script inspector", slug: "extension-content-script-inspector" },
        ],
      },
      {
        heading: "What to do with a broad result",
        body: [
          "Compare the breadth with the product. If the extension only works on one service but requests every site, ask why. Check whether optional host permissions could have been used instead.",
          "Host access is a capability. The report does not claim that the extension read any page. Use code findings and runtime observation for behavior.",
        ],
        callout:
          "Broad host permissions are common and sometimes necessary. Disproportionate access combined with vague privacy claims is the concerning combination.",
      },
    ],
    faqs: [
      {
        question: "What are host permissions in a Chrome extension?",
        answer:
          "They define which website URLs the extension can access through browser APIs and content scripts. They are separate from API permissions such as storage or cookies.",
      },
      {
        question: "Does host access include cookies?",
        answer:
          "Not automatically. The cookies permission is a separate API capability. A content script can read non-HttpOnly cookies on its matched pages.",
      },
      {
        question: "What is a wildcard subdomain pattern?",
        answer:
          "A pattern such as https://*.example.com/* covers the base domain and its subdomains. It can reach many hosts operated by the same organization.",
      },
      {
        question: "Can I check host permissions after installing?",
        answer:
          "Yes, the browser's extension details page shows site access and lets you restrict it. This tool checks the package before installation.",
      },
    ],
    related: [
      "what-does-all-urls-permission-mean",
      "content-script-matches-patterns-explained",
      "extension-website-access-inspector",
      "chrome-extension-reading-all-sites-permission",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "view-extension-manifest-json-online",
    cluster: "manifest",
    hub: "extension-manifest-viewer",
    primaryKeyword: "view extension manifest.json online",
    intent: "analyzer",
    title: "View Extension manifest.json Online",
    metaTitle: "View Extension manifest.json Online - Plain-Language Viewer",
    description:
      "Open an extension manifest.json online and read its permissions, host access, content scripts, background configuration and security fields.",
    h1: "View extension manifest.json online",
    answer:
      "You can view an extension manifest online by uploading a manifest.json file or the whole CRX, XPI or ZIP package. A viewer parses the JSON, validates common fields and explains permissions, host access, content scripts, background configuration and security settings in plain language.",
    sections: [
      {
        heading: "What you can learn from manifest.json",
        body: [
          "The manifest names the extension, declares its version and entry points, and lists the permissions it needs. It is the first file a browser reads, which makes it the most reliable public description of capability.",
          "A viewer groups related fields so you do not have to remember the schema. It highlights missing required values, deprecated manifest versions and broad permissions.",
        ],
        list: [
          "Name, version and description",
          "Manifest version and browser signals",
          "Required and optional permissions",
          "Host permissions and content scripts",
          "Background worker or scripts",
          "CSP, update URL and externally connectable origins",
        ],
        links: [
          { label: "manifest viewer hub", slug: "extension-manifest-viewer" },
          { label: "Manifest V3 permissions", slug: "manifest-v3-permissions-list-explained" },
        ],
      },
      {
        heading: "Uploading only the manifest",
        body: [
          "A standalone manifest.json is accepted, but referenced scripts are not included. The report will show permissions and configuration without code findings for missing files.",
          "For a complete analysis, upload the full CRX, XPI or ZIP. The analyzer locates manifest.json inside the package and scans the other text files.",
        ],
        links: [
          { label: "CRX file analyzer", slug: "crx-file-analyzer-online-free" },
          { label: "Firefox XPI analyzer", slug: "firefox-xpi-file-analyzer" },
        ],
      },
      {
        heading: "Do not judge from one field",
        body: [
          "A manifest can look harmless while a referenced script performs sensitive work. Conversely, a broad permission can be justified by a feature. Read the manifest together with the code findings, domains and publisher information.",
        ],
        callout:
          "The viewer explains declared configuration. It does not certify the extension or prove that any declared capability was used.",
      },
    ],
    faqs: [
      {
        question: "Can I view manifest.json from a CRX file?",
        answer:
          "Yes. Upload the CRX and the analyzer opens the embedded archive and locates manifest.json automatically.",
      },
      {
        question: "Is manifest.json valid JSON?",
        answer:
          "It should be, but real packages sometimes contain comments or malformed values. The viewer reports parse errors rather than failing silently.",
      },
      {
        question: "Does the viewer show every manifest field?",
        answer:
          "It summarizes the fields that matter for privacy and permissions. The raw manifest is included in the JSON export for full inspection.",
      },
    ],
    related: [
      "extension-manifest-viewer",
      "manifest-v3-permissions-list-explained",
      "extension-externally-connectable-explained",
      "crx-file-analyzer-online-free",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "unpack-crx-file-without-installing",
    cluster: "crx",
    hub: "crx-package-analyzer",
    primaryKeyword: "unpack crx file without installing",
    intent: "guide",
    title: "How to Unpack a CRX File Without Installing It",
    metaTitle: "Unpack a CRX File Without Installing - Safe Methods",
    description:
      "Learn how to unpack a CRX file without installing the Chrome extension. Understand the CRX header, ZIP payload and safe inspection methods.",
    h1: "Unpack a CRX file without installing it",
    answer:
      "A CRX file is a ZIP archive with a small CRX header. To unpack it safely, remove the header and extract the ZIP with an archive tool, or upload the CRX to a static analyzer that performs the same steps in an isolated worker. You never need to install the extension.",
    sections: [
      {
        heading: "Understand the header before extracting",
        body: [
          "CRX2 and CRX3 use different headers. CRX3 stores a little-endian header length after the magic bytes and version, followed by a signed header and then the ZIP. CRX2 stores public-key and signature lengths. Cutting at the wrong offset produces a corrupt archive.",
          "The analyzer validates these boundaries and checks that the remaining bytes begin with a ZIP signature. It also enforces entry and size limits before decompressing.",
        ],
        links: [
          { label: "CRX3 structure", slug: "crx3-file-format-structure" },
          { label: "CRX package analyzer", slug: "crx-package-analyzer" },
        ],
      },
      {
        heading: "Two safe ways to inspect the contents",
        body: [
          "The simplest method is to upload the CRX to this analyzer. It shows the manifest and findings in a readable report without installing anything. No command line or extension developer mode is required.",
          "If you prefer local tools, use a script or archive utility that understands the CRX header, then inspect the extracted files with a text editor. Treat the extracted JavaScript as untrusted text and do not open HTML files in a browser with the extension's scripts.",
        ],
        steps: [
          { title: "Obtain the CRX", body: "Download it from the store or get it from the publisher." },
          { title: "Strip the header", body: "Parse the version-specific header and locate the ZIP signature." },
          { title: "Extract the ZIP", body: "Use an isolated folder and avoid executing any extracted code." },
          { title: "Inspect manifest and code", body: "Read permissions, scripts and domains, or use the analyzer report." },
        ],
        links: [
          { label: "CRX file analyzer online free", slug: "crx-file-analyzer-online-free" },
          { label: "view manifest online", slug: "view-extension-manifest-json-online" },
        ],
      },
      {
        heading: "Safety rules for unpacking",
        body: [
          "Never run an extracted script to see what it does. Do not load the unpacked folder as an extension in developer mode unless you accept the risk. Keep archive extraction inside a dedicated folder and avoid opening files that could trigger a local handler.",
          "If the package contains nested archives, the analyzer skips them. You should be equally cautious: nested content is not part of the reviewed manifest and can hide additional files.",
        ],
        callout:
          "Unpacking reveals files, not intent. Inspect the manifest and code before drawing conclusions.",
      },
    ],
    faqs: [
      {
        question: "Can a CRX file be renamed to ZIP?",
        answer:
          "Not directly. The CRX header must be removed first. Renaming alone leaves extra bytes before the ZIP and standard tools may fail.",
      },
      {
        question: "Does unpacking a CRX install the extension?",
        answer:
          "No. Unpacking only extracts files. Installation happens only if you load the folder or package into a browser as an extension.",
      },
      {
        question: "Is it legal to unpack a CRX?",
        answer:
          "Inspecting a package you obtained lawfully is generally acceptable, but the extension's license may restrict redistribution or reverse engineering. Follow applicable law and the license.",
      },
    ],
    related: [
      "crx3-file-format-structure",
      "crx-package-analyzer",
      "crx-file-analyzer-online-free",
      "view-extension-manifest-json-online",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "check-what-domains-a-chrome-extension-connects-to",
    cluster: "domains",
    hub: "extension-external-domain-finder",
    primaryKeyword: "check what domains a chrome extension connects to",
    intent: "analyzer",
    title: "Check What Domains a Chrome Extension Connects To",
    metaTitle: "Check What Domains a Chrome Extension Connects To",
    description:
      "Find the domains referenced by a Chrome extension. Learn how static domain extraction works, what the groups mean and why a reference is not proof of traffic.",
    h1: "Check what domains a Chrome extension connects to",
    answer:
      "To see which domains a Chrome extension references, extract URLs from its manifest, JavaScript, HTML and CSP. Group them as analytics, advertising, authentication, error reporting, cloud or unknown. This shows potential endpoints, not proof that the extension contacted them.",
    sections: [
      {
        heading: "Static extraction versus network monitoring",
        body: [
          "Static extraction reads strings in the package. It finds hostnames even in code paths that never run, and it can miss endpoints assembled at runtime. Network monitoring observes actual requests but requires installing the extension and controlling the browser session.",
          "Use static extraction before installation when you want a quick risk signal. Use developer tools or a proxy in a separate profile when you need to confirm behavior.",
        ],
        links: [
          { label: "external domain finder", slug: "extension-external-domain-finder" },
          { label: "browser extension tracking analysis", slug: "browser-extension-tracking-analysis" },
        ],
      },
      {
        heading: "How to interpret the domain groups",
        body: [
          "Analytics and advertising hosts suggest measurement or monetization. Authentication hosts suggest sign-in flows. Error reporting hosts may receive diagnostic data. Cloud hosts can be anything from static assets to storage buckets. Unknown hosts need manual review.",
          "Check the file and reference count for each domain. One mention in a bundled library is different from repeated references in a content script that also reads cookies or page content.",
        ],
        table: {
          caption: "What each group may indicate",
          headers: ["Group", "Possible meaning", "Follow-up"],
          rows: [
            ["Analytics", "Usage measurement", "Inspect event payloads and identifiers"],
            ["Advertising", "Ads or attribution", "Check consent and data sharing"],
            ["Authentication", "Login or token exchange", "Review OAuth scopes and token storage"],
            ["Error reporting", "Crash diagnostics", "Check whether page data is attached"],
            ["Cloud", "APIs, files, storage", "Identify the account or bucket owner"],
            ["Unknown", "Unclassified", "Read surrounding code and publisher docs"],
          ],
        },
        links: [
          { label: "check domains hub", slug: "extension-external-domain-finder" },
          { label: "does this extension track me", slug: "does-this-extension-track-me" },
        ],
      },
      {
        heading: "What to do with an unexpected domain",
        body: [
          "Search the source for the hostname, note the context and compare it with the privacy policy. If the domain belongs to a third party, look for a clear explanation of why it is needed.",
          "Do not accuse an extension solely because a domain appears. Static references can be stale, optional or unrelated. Ask the publisher when the purpose is unclear.",
        ],
        callout:
          "A domain list is a map of potential communication, not a log of actual communication.",
      },
    ],
    faqs: [
      {
        question: "Can I see actual network requests in the analyzer?",
        answer:
          "No. The analyzer only reads the package. To observe real requests, install the extension in a controlled profile and use browser developer tools.",
      },
      {
        question: "Why does an extension reference domains it never contacts?",
        answer:
          "The reference may be unused, part of a library, used only for an optional feature or kept as a fallback endpoint.",
      },
      {
        question: "Are analytics domains always a privacy problem?",
        answer:
          "Not always, but they indicate measurement. The privacy impact depends on what data is sent, whether identifiers are used and whether the publisher discloses it.",
      },
    ],
    related: [
      "extension-external-domain-finder",
      "does-this-extension-track-me",
      "browser-add-on-data-access-checker",
      "extension-asking-for-cookies-permission",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "extension-externally-connectable-explained",
    cluster: "manifest",
    hub: "extension-manifest-viewer",
    primaryKeyword: "extension externally_connectable explained",
    intent: "reference",
    title: "Extension externally_connectable Explained",
    metaTitle: "externally_connectable Explained - Extension Messaging",
    description:
      "Learn what externally_connectable does in a browser extension, which websites can message it, and why broad origins deserve review.",
    h1: "Extension externally_connectable explained",
    answer:
      "externally_connectable lets specified websites send messages to an extension and, in some configurations, lets the extension message them. It defines external message origins rather than general website access. Broad origins such as <all_urls> mean many sites can attempt to reach the extension's message handlers.",
    sections: [
      {
        heading: "What the field controls",
        body: [
          "By default, web pages cannot connect directly to an extension's runtime messaging. externally_connectable opens that channel for listed origins and extension IDs. The extension must still implement message handlers.",
          "The field is about communication, not DOM access. A site does not need a content script to send a message if the origin is allowed, although the extension decides whether to respond.",
        ],
        links: [
          { label: "manifest viewer", slug: "extension-manifest-viewer" },
          { label: "web_accessible_resources security", slug: "extension-web-accessible-resources-security" },
        ],
      },
      {
        heading: "Why broad origins matter",
        body: [
          "An entry of <all_urls> means any website can attempt to connect. If a handler exposes privileged operations without validating the sender, another site could trigger them. The risk depends on the handler's authorization logic.",
          "Even a narrow origin list deserves review when it includes sites the publisher does not control, because a compromised site could send crafted messages.",
        ],
        links: [
          { label: "extension CSP", slug: "extension-csp-manifest-v3-explained" },
          { label: "source analyzer", slug: "browser-plugin-source-analyzer" },
        ],
      },
      {
        heading: "What to look for in the code",
        body: [
          "Search for runtime.onMessageExternal and runtime.onConnectExternal handlers. Check whether the sender origin is validated, whether messages are authenticated and whether the handler can access sensitive APIs or data.",
          "A static analyzer can flag the manifest value and the handler references, but it cannot prove that exploitation is possible. Treat findings as review prompts.",
        ],
        callout:
          "externally_connectable is not automatically dangerous. It is a communication surface that should match a documented integration.",
      },
    ],
    faqs: [
      {
        question: "Does externally_connectable grant website access?",
        answer:
          "No. It allows cross-origin messaging with the extension. Website content access is granted through host permissions and content scripts.",
      },
      {
        question: "What does <all_urls> mean in externally_connectable?",
        answer:
          "Any website origin can attempt to send a message to the extension. The extension's handlers decide whether and how to respond.",
      },
      {
        question: "Can an extension message a website with this field?",
        answer:
          "The field primarily allows web pages to connect to the extension. Messaging direction and availability depend on the API and the extension's implementation.",
      },
    ],
    related: [
      "extension-manifest-viewer",
      "extension-web-accessible-resources-security",
      "extension-csp-manifest-v3-explained",
      "browser-plugin-source-analyzer",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "is-this-chrome-extension-safe-to-install",
    cluster: "privacy-checker",
    hub: "browser-extension-privacy-checker",
    primaryKeyword: "is this chrome extension safe to install",
    intent: "question",
    title: "Is This Chrome Extension Safe to Install?",
    metaTitle: "Is This Chrome Extension Safe to Install? How to Check",
    description:
      "A practical checklist for deciding whether a Chrome extension is safe to install: permissions, publisher, code evidence, domains and update behavior.",
    h1: "Is this Chrome extension safe to install?",
    answer:
      "There is no automated yes-or-no answer. Check who publishes it, whether the permissions match its features, which sites it can access, what the code references and how it updates. A clean static report reduces uncertainty but cannot guarantee that an extension is safe.",
    sections: [
      {
        heading: "A five-part safety checklist",
        body: [
          "Start with the publisher and listing. Look for a real website, a support channel and a privacy policy that names the data collected. Then inspect the package with a static analyzer.",
          "Focus on host access, sensitive APIs, content scripts, remote code indicators and external domains. Finally, consider update behavior and whether you can live with the access after future changes.",
        ],
        steps: [
          { title: "Identify the publisher", body: "Prefer recognizable developers with a documented support path." },
          { title: "Match permissions to features", body: "Unused powerful permissions are a warning sign." },
          { title: "Review website access", body: "Narrow hosts are safer than all_urls for a niche tool." },
          { title: "Read code findings", body: "Check dynamic code, remote scripts, cookies and messaging." },
          { title: "Plan for updates", body: "Re-check permissions after major versions and remove unused add-ons." },
        ],
        links: [
          { label: "browser extension privacy checker", slug: "browser-extension-privacy-checker" },
          { label: "how to audit an extension", slug: "how-to-audit-an-extension-before-install" },
        ],
      },
      {
        heading: "Signals that deserve extra caution",
        body: [
          "Be cautious when a simple utility requests all_urls, cookies, debugger, nativeMessaging or proxy access; when the privacy policy is missing or vague; when the update URL is not HTTPS; or when the package contains obfuscated code and remote script references.",
          "These signals are not proof of malice. They are reasons to slow down, look for alternatives and ask the publisher questions.",
        ],
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "remote script detector", slug: "remote-script-reference-detector" },
        ],
      },
      {
        heading: "What a static report cannot tell you",
        body: [
          "It cannot prove runtime behavior, account access or data transmission. It also cannot see code loaded after installation. If the stakes are high, use a separate browser profile and monitor requests with developer tools.",
        ],
        callout:
          "Safe is a judgment about capability, behavior, transparency and your risk tolerance. No single score replaces that judgment.",
      },
    ],
    faqs: [
      {
        question: "Are Chrome Web Store extensions safe?",
        answer:
          "Store review reduces some risks but does not guarantee privacy or future safety. Extensions can update and request new permissions.",
      },
      {
        question: "Can an extension steal my passwords?",
        answer:
          "A content script on a login page can read form fields it can access, and broad permissions increase reach. Whether it does so requires runtime analysis or a code audit.",
      },
      {
        question: "Should I install an extension with a high risk score?",
        answer:
          "Only if you understand and accept the specific exposure. Consider narrower alternatives and limit the sites where the extension can run.",
      },
      {
        question: "How do I check an extension before installing it?",
        answer:
          "Download the CRX or use a store URL in this analyzer. Review permissions, host access, code findings and domains before enabling it.",
      },
    ],
    related: [
      "browser-extension-privacy-checker",
      "how-to-audit-an-extension-before-install",
      "extension-permission-analyzer",
      "are-chrome-extensions-safe",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "chrome-extension-service-worker-vs-background-page",
    cluster: "privacy-guide",
    hub: "browser-extension-privacy-guide",
    primaryKeyword: "chrome extension service worker vs background page",
    intent: "comparison",
    title: "Chrome Extension Service Worker vs Background Page",
    metaTitle: "Chrome Extension Service Worker vs Background Page",
    description:
      "Compare a Manifest V3 service worker with a Manifest V2 background page: lifecycle, persistence, network access, privacy implications and what to inspect.",
    h1: "Chrome extension service worker vs background page",
    answer:
      "A Manifest V2 background page can stay loaded persistently. A Manifest V3 service worker is event-driven and can be stopped when idle, then restarted when an event arrives. Both can coordinate extension behavior and make network requests, so the privacy review focuses on what they do, not only on the lifecycle model.",
    sections: [
      {
        heading: "Lifecycle and state",
        body: [
          "A persistent background page keeps in-memory state for the life of the browser session. A service worker is suspended when idle, so extensions must persist important state in storage and reinitialize on wake.",
          "The service worker model reduces idle resource use. It does not inherently reduce access to APIs, pages or network endpoints.",
        ],
        table: {
          caption: "Background execution models",
          headers: ["Aspect", "Background page (V2)", "Service worker (V3)"],
          rows: [
            ["Lifecycle", "Can remain loaded", "Event-driven, may stop"],
            ["State", "In-memory state persists", "State must be persisted separately"],
            ["Network access", "Available", "Available"],
            ["Manifest field", "background.page or scripts", "background.service_worker"],
            ["Browser direction", "Legacy", "Current Chromium model"],
          ],
        },
        links: [
          { label: "Manifest V2 vs V3", slug: "manifest-v2-vs-v3-security-differences" },
          { label: "browser extension privacy guide", slug: "browser-extension-privacy-guide" },
        ],
      },
      {
        heading: "What to inspect in either model",
        body: [
          "Read the background script or worker for network calls, storage access, message handling and remote code references. Check whether it registers event listeners that observe tabs, history, web requests or cookies.",
          "The analyzer reports the background type, service worker or script paths, and static findings from the referenced files. It also shows the update URL and CSP, which affect what can change later.",
        ],
        links: [
          { label: "JavaScript behavior analyzer", slug: "extension-javascript-behavior-analyzer" },
          { label: "extension CSP", slug: "extension-csp-manifest-v3-explained" },
        ],
      },
      {
        heading: "Privacy does not follow the manifest version",
        body: [
          "A service worker can be just as invasive as a background page if it has broad permissions and sends data to third parties. A legacy background page can be carefully scoped and transparent.",
          "Use the lifecycle as context, not as a safety label. Pay attention to what data the background context can reach and where it sends it.",
        ],
        callout:
          "Manifest V3 changed execution and remote-code rules; it did not remove the need to review permissions and behavior.",
      },
    ],
    faqs: [
      {
        question: "Is a service worker more secure than a background page?",
        answer:
          "The service worker model is newer and aligns with Manifest V3 restrictions, but security depends on permissions, code and data handling. The lifecycle alone does not determine safety.",
      },
      {
        question: "Can a service worker make network requests?",
        answer:
          "Yes. It can use fetch and related APIs subject to permissions, CSP and host access. Network access is available in both models.",
      },
      {
        question: "Why does a V3 extension still have background scripts?",
        answer:
          "Firefox and cross-browser manifests can declare background scripts. Chromium primarily uses service_worker, but manifests may include compatibility entries.",
      },
    ],
    related: [
      "manifest-v2-vs-v3-security-differences",
      "browser-extension-privacy-guide",
      "extension-csp-manifest-v3-explained",
      "extension-javascript-behavior-analyzer",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: false,
  },
  {
    kind: "keyword",
    slug: "content-script-matches-patterns-explained",
    cluster: "content-scripts",
    hub: "extension-content-script-inspector",
    primaryKeyword: "content script matches patterns explained",
    intent: "reference",
    title: "Content Script Match Patterns Explained",
    metaTitle: "Content Script Match Patterns Explained - Extension Access",
    description:
      "Learn how extension content-script match patterns work, including scheme, host, path, wildcards, all_urls, run_at and all_frames.",
    h1: "Content script match patterns explained",
    answer:
      "A content-script match pattern tells the browser where to inject an extension's script. It has a scheme, host and path. Patterns can name one host, use wildcard subdomains, cover every URL or target local files. The pattern defines injection reach, not whether the script reads or sends data.",
    sections: [
      {
        heading: "Pattern anatomy",
        body: [
          "The scheme is http, https, file or a wildcard. The host can be a domain, a wildcard subdomain or an asterisk. The path must begin with a slash and can include a wildcard.",
          "https://example.com/* matches only that host. https://*.example.com/* matches the base domain and subdomains. <all_urls> is a special shorthand for all supported schemes and hosts.",
        ],
        table: {
          caption: "Match pattern examples",
          headers: ["Pattern", "Matches", "Breadth"],
          rows: [
            ["https://example.com/*", "One HTTPS host", "Narrow"],
            ["https://*.example.com/*", "Domain and subdomains", "Medium"],
            ["*://example.com/*", "HTTP and HTTPS on one host", "Medium"],
            ["*://*/*", "All HTTP and HTTPS hosts", "Broad"],
            ["<all_urls>", "All supported schemes and hosts", "Broadest"],
          ],
        },
        links: [
          { label: "content script inspector", slug: "extension-content-script-inspector" },
          { label: "website access inspector", slug: "extension-website-access-inspector" },
        ],
      },
      {
        heading: "run_at and all_frames",
        body: [
          "run_at controls when injection occurs. document_start runs before the page DOM is fully built, document_end runs after the DOM is ready, and document_idle runs later when the browser decides the page is quiet.",
          "all_frames allows the script to run in matching iframes. That can be necessary for embedded forms or editors, and it expands where the code can observe content.",
        ],
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "Chrome host permissions", slug: "chrome-extension-host-permissions-checker" },
        ],
      },
      {
        heading: "Evaluating injection reach",
        body: [
          "Compare the pattern with the feature. A tool that improves one web app should not need every site. A password manager or content blocker may need broad reach, but it should explain how page data is handled.",
          "The inspector lists the matched hosts, the injected files and related static findings. Use it to decide whether the script's access is proportionate.",
        ],
        callout:
          "A content script runs in pages, not in the extension's background. Its access to page content makes the match pattern privacy-relevant.",
      },
    ],
    faqs: [
      {
        question: "Do content scripts need host permissions?",
        answer:
          "The match patterns in content_scripts define where injection is allowed. In Manifest V3, host_permissions separately grant API access to those hosts. Both can coexist.",
      },
      {
        question: "Can a content script run on every page?",
        answer:
          "Yes, with <all_urls> or an equivalent broad pattern. The extension must also be permitted by the browser and user.",
      },
      {
        question: "Does document_start see the full page?",
        answer:
          "No. It runs very early, before the page is fully parsed. It may need to wait for DOMContentLoaded or observe mutations.",
      },
    ],
    related: [
      "extension-content-script-inspector",
      "extension-website-access-inspector",
      "chrome-extension-reading-all-sites-permission",
      "what-does-all-urls-permission-mean",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "extension-web-accessible-resources-security",
    cluster: "privacy-guide",
    hub: "browser-extension-privacy-guide",
    primaryKeyword: "extension web_accessible_resources security",
    intent: "reference",
    title: "Extension web_accessible_resources Security",
    metaTitle: "web_accessible_resources Security - What Gets Exposed",
    description:
      "Understand web_accessible_resources in browser extensions: which files websites can load, how matches limit exposure and what broad patterns risk.",
    h1: "Extension web_accessible_resources security",
    answer:
      "web_accessible_resources lists extension files that web pages or content scripts can load. It can expose scripts, images or styles to matching sites. Broad resources and matches increase the exposed surface, but exposure alone does not mean a file contains secrets or that a site used it.",
    sections: [
      {
        heading: "What the field exposes",
        body: [
          "By default, extension files are not directly loadable from web pages. web_accessible_resources grants that ability for listed paths and, in Manifest V3, usually for listed origins.",
          "This is common for images referenced by content scripts, injected styles or worker scripts. It becomes a security concern when sensitive files, source maps or broadly reusable assets are exposed.",
        ],
        links: [
          { label: "privacy guide", slug: "browser-extension-privacy-guide" },
          { label: "manifest viewer", slug: "extension-manifest-viewer" },
        ],
      },
      {
        heading: "Paths, matches and wildcards",
        body: [
          "Manifest V3 uses an array of objects with resources and matches. Manifest V2 uses an array of strings. Wildcards can expose more files than intended, and broad matches let many origins load them.",
          "The analyzer flags serialized values that contain <all_urls>, a bare asterisk or broad path wildcards. It shows the configuration but does not open every exposed asset.",
        ],
        links: [
          { label: "externally_connectable", slug: "extension-externally-connectable-explained" },
          { label: "extension CSP", slug: "extension-csp-manifest-v3-explained" },
        ],
      },
      {
        heading: "Reviewing the exposure",
        body: [
          "List the exposed files and ask whether each one needs to be reachable from a web page. Check for scripts that could be reused by another site and for files that reveal internal endpoints or build paths.",
          "web_accessible_resources does not grant access to extension APIs or user data. It controls file loading, so the impact depends on what the files contain.",
        ],
        callout:
          "Broad exposure is a design smell, not automatically a vulnerability. Inspect the exposed assets before concluding.",
      },
    ],
    faqs: [
      {
        question: "Are web-accessible resources a security risk?",
        answer:
          "They can be if they expose sensitive files or if broad matches let untrusted sites load them. Most extensions expose a small number of assets for legitimate reasons.",
      },
      {
        question: "What changed in Manifest V3?",
        answer:
          "V3 uses objects with resources and matches, which makes the allowed origins explicit. V2 used a flat string list.",
      },
      {
        question: "Can websites read all extension files?",
        answer:
          "No. Only the resources explicitly listed and allowed by the match configuration can be loaded.",
      },
    ],
    related: [
      "extension-manifest-viewer",
      "extension-externally-connectable-explained",
      "browser-extension-privacy-guide",
      "extension-csp-manifest-v3-explained",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "crx3-file-format-structure",
    cluster: "crx",
    hub: "crx-package-analyzer",
    primaryKeyword: "crx3 file format structure",
    intent: "reference",
    title: "CRX3 File Format Structure Explained",
    metaTitle: "CRX3 File Format Structure - Header and ZIP Payload",
    description:
      "Understand the CRX3 file format: magic bytes, version, little-endian header length, signed protobuf header, ZIP payload and safety checks.",
    h1: "CRX3 file format structure",
    answer:
      "A CRX3 file starts with the magic bytes Cr24, a little-endian version value of 3, a 32-bit header length and a signed header, followed by a standard ZIP archive. The ZIP holds the extension files. Parsers must validate the header length before extracting anything.",
    sections: [
      {
        heading: "Byte layout",
        body: [
          "Bytes 0-3 contain the ASCII string Cr24. Bytes 4-7 contain the version as a little-endian unsigned 32-bit integer. Bytes 8-11 contain the header length. The header begins at byte 12 and occupies the declared length. The ZIP begins immediately after it.",
          "CRX3 does not use the older separate public-key and signature length fields from CRX2. Its header carries signed data, and the ZIP signature should appear where the length calculation says it will.",
        ],
        table: {
          caption: "CRX3 header fields",
          headers: ["Offset", "Size", "Meaning"],
          rows: [
            ["0", "4 bytes", "Magic: Cr24"],
            ["4", "4 bytes", "Version: 3"],
            ["8", "4 bytes", "Header length (little-endian)"],
            ["12", "N bytes", "Signed CRX header"],
            ["12 + N", "Remaining", "ZIP archive payload"],
          ],
        },
        links: [
          { label: "unpack CRX without installing", slug: "unpack-crx-file-without-installing" },
          { label: "CRX package analyzer", slug: "crx-package-analyzer" },
        ],
      },
      {
        heading: "Safety checks before extraction",
        body: [
          "A parser should reject truncated files, header lengths larger than the remaining buffer, and payloads that do not begin with a ZIP signature. It should also apply archive limits after locating the ZIP.",
          "The analyzer performs these checks in sequence and never interprets the CRX header as executable code. If the structure is invalid, the scan stops with a clear error instead of guessing.",
        ],
        links: [
          { label: "CRX file analyzer online", slug: "crx-file-analyzer-online-free" },
          { label: "browser extension privacy checker", slug: "browser-extension-privacy-checker" },
        ],
      },
      {
        heading: "Signature versus safety",
        body: [
          "The signed header helps browsers associate the package with an extension identity and detect some tampering. It does not audit the JavaScript, permissions or data practices. A valid signature can sign a privacy-invasive extension.",
        ],
        callout:
          "Structure validation answers whether the file is a well-formed CRX. Safety review answers what the embedded extension can do.",
      },
    ],
    faqs: [
      {
        question: "Is CRX3 the same as ZIP?",
        answer:
          "No. CRX3 is a ZIP payload with an additional CRX header. The embedded archive is standard ZIP after the header is removed.",
      },
      {
        question: "Why is the header length little-endian?",
        answer:
          "The CRX format stores the version and header length as little-endian 32-bit integers, matching the platform conventions used by the format's tooling.",
      },
      {
        question: "Can I extract a CRX3 file with unzip?",
        answer:
          "Not directly, because of the header. Remove the header using a CRX-aware tool or use this analyzer.",
      },
    ],
    related: [
      "crx-package-analyzer",
      "unpack-crx-file-without-installing",
      "crx-file-analyzer-online-free",
      "view-extension-manifest-json-online",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "extension-csp-manifest-v3-explained",
    cluster: "manifest",
    hub: "extension-manifest-viewer",
    primaryKeyword: "extension CSP manifest v3 explained",
    intent: "reference",
    title: "Extension CSP in Manifest V3 Explained",
    metaTitle: "Extension CSP in Manifest V3 Explained - Safety Settings",
    description:
      "Learn how Content Security Policy works in Manifest V3 extensions, what extension_pages and sandbox mean, and why unsafe-eval matters.",
    h1: "Extension CSP in Manifest V3 explained",
    answer:
      "Content Security Policy limits which scripts and resources an extension page can load or execute. In Manifest V3 it is usually declared as content_security_policy.extension_pages. A policy allowing 'unsafe-eval' or broad script sources weakens protection against injected or remote code.",
    sections: [
      {
        heading: "What the policy controls",
        body: [
          "CSP applies to extension pages and, when configured, sandboxed pages. It restricts script sources, object sources and other resource loads. Manifest V3 enforces stricter defaults than older extensions.",
          "The manifest field can be a string in V2 or an object in V3. The viewer extracts extension_pages, sandbox and related entries so you can read the effective rules.",
        ],
        links: [
          { label: "manifest viewer", slug: "extension-manifest-viewer" },
          { label: "Manifest V3 permissions", slug: "manifest-v3-permissions-list-explained" },
        ],
      },
      {
        heading: "Values that deserve attention",
        body: [
          "script-src 'self' is the normal restrictive baseline. The addition of 'unsafe-eval' permits string-to-code execution such as eval or new Function. 'unsafe-inline' permits inline scripts. Remote script hosts in script-src can allow external code, depending on manifest version and browser rules.",
          "A permissive CSP is not automatically malicious. Some libraries or legacy features require it. It does increase the impact of an injection flaw and should be explained.",
        ],
        table: {
          caption: "Common CSP values",
          headers: ["Value", "Meaning", "Review note"],
          rows: [
            ["'self'", "Only packaged extension scripts", "Restrictive baseline"],
            ["'unsafe-eval'", "Allows string-to-code execution", "High-impact relaxation"],
            ["'unsafe-inline'", "Allows inline scripts", "Weakens injection protection"],
            ["https://cdn.example", "Allows scripts from a host", "Remote code risk"],
            ["sandbox", "Isolates a page", "Limits access to extension APIs"],
          ],
        },
        links: [
          { label: "remote script detector", slug: "remote-script-reference-detector" },
          { label: "manifest V2 vs V3", slug: "manifest-v2-vs-v3-security-differences" },
        ],
      },
      {
        heading: "CSP is one layer",
        body: [
          "A restrictive CSP does not fix excessive permissions or unsafe data handling. A permissive CSP does not prove that an extension misbehaves. Read the policy alongside the manifest permissions and code findings.",
        ],
        callout:
          "The analyzer reports CSP text and flags unsafe values. It cannot prove that a relaxation was exploited.",
      },
    ],
    faqs: [
      {
        question: "Does Manifest V3 forbid remote code?",
        answer:
          "It restricts executable remote code and removes eval from the default policy. Extensions can still load data and assets, and the rules differ by browser.",
      },
      {
        question: "Why would an extension need unsafe-eval?",
        answer:
          "Legacy libraries or template engines may require it. That is a design tradeoff, not a safety guarantee, and it should be justified.",
      },
      {
        question: "What is a sandboxed extension page?",
        answer:
          "A page isolated from extension APIs, often used to evaluate untrusted content. Its CSP may differ from extension_pages.",
      },
    ],
    related: [
      "extension-manifest-viewer",
      "remote-script-reference-detector",
      "manifest-v2-vs-v3-security-differences",
      "extension-javascript-behavior-analyzer",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
];
