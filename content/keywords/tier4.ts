import type { ContentPage } from "../types";

export const tier4: ContentPage[] = [
  {
    kind: "keyword",
    slug: "chrome-extension-safety-check",
    cluster: "privacy-checker",
    hub: "browser-extension-privacy-checker",
    primaryKeyword: "chrome extension safety check",
    intent: "guide",
    title: "Chrome Extension Safety Check: What to Verify",
    metaTitle: "Chrome Extension Safety Check - What to Verify",
    description:
      "Run a Chrome extension safety check on permissions, host access, content scripts, code indicators and external domains. Learn what it can and cannot prove.",
    h1: "Chrome extension safety check",
    answer:
      "A Chrome extension safety check reviews the package's permissions, host access, content scripts, code indicators, external domains and update behavior. It shows what the extension is capable of and flags suspicious patterns, but it cannot prove intent or observe runtime activity. Use it with store review, publisher history and a privacy policy review.",
    sections: [
      {
        heading: "What a safety check can tell you",
        body: [
          "A package-level check reads manifest.json and the files inside the extension. It can separate API permissions from website access, list content-script match patterns, show background or service-worker entry points and identify external domains referenced in the code.",
          "Static rules can also flag dynamic code execution, remote script references, obfuscation, credential access and other patterns that deserve a closer look. Each finding should include the file, line and matched evidence so the result can be verified.",
        ],
        list: [
          "Required and optional API permissions",
          "Host permissions and content-script matches",
          "Remote code and dynamic execution indicators",
          "External domains and their categories",
          "Manifest fields such as CSP and externally_connectable",
        ],
        links: [
          { label: "browser extension privacy checker", slug: "browser-extension-privacy-checker" },
          { label: "how to audit an extension before install", slug: "how-to-audit-an-extension-before-install" },
        ],
      },
      {
        heading: "What it cannot tell you",
        body: [
          "A static check does not execute the extension, so it cannot observe network requests, DOM changes, user interactions or behavior that only appears after a delay. It also cannot prove that a referenced domain was contacted or that a permission was used.",
          "Bundled libraries and minified code can create findings that are not part of the publisher's own logic. Read the surrounding code before treating a pattern as evidence of intent. Store review and runtime testing answer different questions.",
        ],
        callout:
          "A clean static report is not a guarantee. A suspicious finding is not a malware verdict.",
        links: [
          { label: "is this Chrome extension safe", slug: "is-this-chrome-extension-safe-to-install" },
          { label: "are Chrome extensions safe", slug: "are-chrome-extensions-safe" },
        ],
      },
      {
        heading: "A practical safety checklist",
        body: [
          "Start with the permissions and host access. Ask whether each capability is proportionate to the feature you need. Then review content scripts, external domains and code findings. Finally, check the publisher, the privacy policy and the update history.",
          "If an update adds a broad host pattern, a sensitive API permission or an unexplained endpoint, review the evidence before accepting it. When the publisher does not explain the change, remove the extension until it does.",
        ],
        list: [
          "Does the extension need all_urls or only specific sites?",
          "Are optional permissions requested only when needed?",
          "Do external domains match the publisher and feature?",
          "Are there remote script references or eval-like calls?",
          "Does the privacy policy explain data collection and retention?",
        ],
        links: [
          { label: "Chrome host permissions checker", slug: "chrome-extension-host-permissions-checker" },
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is a Chrome extension safety check enough before installing?",
        answer:
          "No single check is enough. Combine the package report with the publisher's reputation, the privacy policy, the store listing and your own risk tolerance.",
      },
      {
        question: "Can a safety check detect malware?",
        answer:
          "It can flag static indicators associated with malicious or risky behavior, but it cannot prove malware. Runtime analysis and threat intelligence answer different questions.",
      },
      {
        question: "Why do bundled libraries create findings?",
        answer:
          "Minified dependencies can contain patterns such as dynamic code construction or network calls that are normal for the library but look suspicious out of context.",
      },
      {
        question: "What should I check after an extension updates?",
        answer:
          "Compare permissions, host patterns, external domains and code findings with the previous version. Review any new capability that the release notes do not explain.",
      },
    ],
    related: [
      "browser-extension-privacy-checker",
      "is-this-chrome-extension-safe-to-install",
      "how-to-audit-an-extension-before-install",
      "chrome-extension-host-permissions-checker",
    ],
    lastReviewed: "2026-11-01",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "extension-risk-score-explained",
    cluster: "privacy-checker",
    hub: "browser-extension-privacy-checker",
    primaryKeyword: "extension risk score",
    intent: "reference",
    title: "Extension Risk Score Explained: Categories and Limits",
    metaTitle: "Extension Risk Score Explained - Categories and Limits",
    description:
      "Understand how an extension risk score is calculated, what the six categories measure, how to read the bands and why the score is not a malware verdict.",
    h1: "Extension risk score explained",
    answer:
      "An extension risk score summarizes static indicators across permissions, website access, data collection, remote code, external domains and obfuscation. It is a review aid that shows where to look, not a probability of malice. Read the category contributions and evidence before acting on the number.",
    sections: [
      {
        heading: "The six weighted categories",
        body: [
          "A transparent score should show its weights and the contribution from each category. The categories separate capabilities from behavior indicators so a broad permission does not hide behind a low total.",
          "This analyzer uses permission exposure, website access, data-collection indicators, remote-code indicators, external-domain exposure and source obfuscation. The weights are published on the methodology page and repeated in each report.",
        ],
        table: {
          caption: "Example score categories",
          headers: ["Category", "What it looks at"],
          rows: [
            ["Permission exposure", "Sensitive API permissions and optional access"],
            ["Website access", "Host permissions and content-script matches"],
            ["Data collection", "Tracking, credential and clipboard indicators"],
            ["Remote code", "Remote scripts, eval-like calls and dynamic loading"],
            ["External domains", "Number and type of referenced domains"],
            ["Obfuscation", "Minification and unreadable code patterns"],
          ],
        },
        links: [
          { label: "browser extension privacy checker", slug: "browser-extension-privacy-checker" },
          { label: "extension permission analyzer", slug: "extension-permission-analyzer" },
        ],
      },
      {
        heading: "How to read the bands",
        body: [
          "Bands such as low, moderate, high and critical make the score easier to scan, but the boundaries are conventions, not scientific thresholds. A moderate score with one sensitive permission may deserve more attention than a high score driven by many low-risk domain references.",
          "Always read the findings and category contributions. A score without evidence is a black box; a score with file and line references is a starting point for review.",
        ],
        callout:
          "The score is not a probability, a certification or a malware verdict. It is a structured summary of static indicators.",
        links: [
          { label: "best extension permission checker tools", slug: "best-extension-permission-checker-tools" },
          { label: "browser extension privacy guide", slug: "browser-extension-privacy-guide" },
        ],
      },
      {
        heading: "When the score changes between versions",
        body: [
          "A score increase after an update can come from a new permission, a broader host pattern, a new domain or a new code finding. Compare the two reports to see which category moved and whether the release notes explain the change.",
          "A score decrease does not prove that an update is safe. The new version may have removed a flagged pattern while adding a different capability that the rules do not yet cover.",
        ],
        links: [
          { label: "compare Chrome extension versions", slug: "compare-chrome-extension-versions" },
          { label: "are Chrome extensions safe", slug: "are-chrome-extensions-safe" },
        ],
      },
    ],
    faqs: [
      {
        question: "What is a good extension risk score?",
        answer:
          "There is no universal good score. A low score with narrow permissions is generally easier to justify, but the evidence and the feature you need matter more than the number.",
      },
      {
        question: "Can I lower an extension's risk score?",
        answer:
          "Only the publisher can change the package. As a user, you can restrict site access, decline optional permissions or remove the extension.",
      },
      {
        question: "Why do two analyzers give different scores?",
        answer:
          "They use different rules, weights, domain lists and severity mappings. Compare the categories and evidence rather than assuming one number is objective.",
      },
      {
        question: "Is a high score automatically malicious?",
        answer:
          "No. A high score means the package has many capabilities or indicators that deserve review. Intent requires more evidence than static analysis provides.",
      },
    ],
    related: [
      "browser-extension-privacy-checker",
      "best-extension-permission-checker-tools",
      "compare-chrome-extension-versions",
      "browser-extension-privacy-guide",
    ],
    lastReviewed: "2026-11-01",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "check-chrome-extension-source-code",
    cluster: "remote-code",
    hub: "remote-script-reference-detector",
    primaryKeyword: "check chrome extension source code",
    intent: "guide",
    title: "How to Check Chrome Extension Source Code",
    metaTitle: "Check Chrome Extension Source Code - Safe Review",
    description:
      "Learn how to obtain, unpack and review Chrome extension source code for permissions, entry points, remote scripts, obfuscation and suspicious patterns.",
    h1: "How to check Chrome extension source code",
    answer:
      "To check Chrome extension source code, obtain the CRX or unpacked package, extract it, read manifest.json for entry points, then review the background worker, content scripts and bundled JavaScript. Search for remote script loads, eval-like calls, credential access and unexplained endpoints. Never run untrusted code outside a controlled environment.",
    sections: [
      {
        heading: "Get the package and unpack it",
        body: [
          "Download the CRX from the store or use the extension's unpacked directory if you are the developer. A CRX is a header plus a ZIP payload. Extract it with a package inspector or a standard archive tool after stripping the header.",
          "Keep the original package. If you later compare versions, you want the exact build you reviewed rather than a reconstructed directory.",
        ],
        links: [
          { label: "unpack a CRX without installing", slug: "unpack-crx-file-without-installing" },
          { label: "CRX3 file format structure", slug: "crx3-file-format-structure" },
        ],
      },
      {
        heading: "Start with the manifest",
        body: [
          "The manifest lists permissions, host permissions, content scripts, the background or service worker, the action popup, options page, CSP and update URL. These fields tell you where the code runs and what it can reach.",
          "Follow each entry point into the referenced files. A content script that runs on every site is more consequential than a popup script that only runs when the user clicks the toolbar icon.",
        ],
        list: [
          "Read permissions and optional_permissions",
          "Inspect host_permissions and content_scripts.matches",
          "Find background.service_worker or background.scripts",
          "Check content_security_policy and update_url",
          "Review web_accessible_resources and externally_connectable",
        ],
        links: [
          { label: "view an extension manifest online", slug: "view-extension-manifest-json-online" },
          { label: "extension content script inspector", slug: "extension-content-script-inspector" },
        ],
      },
      {
        heading: "Search for risky patterns",
        body: [
          "Search the source for remote script references, dynamic imports, eval-like calls, credential and cookie access, clipboard reads and raw IP endpoints. These are indicators, not proof of intent, and minified libraries can produce false positives.",
          "Read the surrounding file and line for each hit. If the code is obfuscated or loaded remotely, treat the extension as harder to review and weigh that against the feature you need.",
        ],
        callout:
          "Static review shows what the code can do. It does not prove what the extension did at runtime.",
        links: [
          { label: "remote script reference detector", slug: "remote-script-reference-detector" },
          { label: "extension JavaScript behavior analyzer", slug: "extension-javascript-behavior-analyzer" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I view Chrome extension source code without installing it?",
        answer:
          "Yes. Download the CRX, extract the ZIP payload and read the files locally. You do not need to load the extension in a browser profile.",
      },
      {
        question: "Is unpacked extension code readable?",
        answer:
          "Sometimes. Many extensions ship minified or bundled code. You can still search for strings and patterns, but the original variable names and comments may be missing.",
      },
      {
        question: "What is the most important file to review?",
        answer:
          "Start with manifest.json to map entry points, then follow the background worker and content scripts. Those files usually define the extension's persistent behavior and page access.",
      },
      {
        question: "Does reading the source prove an extension is safe?",
        answer:
          "No. Source review can miss runtime behavior, server-side logic and future updates. It reduces uncertainty but is not a guarantee.",
      },
    ],
    related: [
      "remote-script-reference-detector",
      "unpack-crx-file-without-installing",
      "extension-javascript-behavior-analyzer",
      "browser-plugin-source-analyzer",
    ],
    lastReviewed: "2026-11-01",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "firefox-addon-privacy-checker",
    cluster: "xpi",
    hub: "firefox-xpi-analyzer",
    primaryKeyword: "firefox addon privacy checker",
    intent: "analyzer",
    title: "Firefox Add-on Privacy Checker: Inspect XPI Files",
    metaTitle: "Firefox Add-on Privacy Checker - Inspect XPI Files",
    description:
      "Inspect a Firefox add-on XPI for permissions, host access, content scripts, external domains and code indicators before installing it.",
    h1: "Firefox add-on privacy checker",
    answer:
      "A Firefox add-on privacy checker inspects the XPI package's manifest, permissions, host access, content scripts, external domains and code indicators. It shows what the add-on can access and flags patterns that deserve review. It does not execute the add-on or prove that a permission was used.",
    sections: [
      {
        heading: "What an XPI contains",
        body: [
          "An XPI is a ZIP archive with a manifest.json for WebExtensions, or a legacy install.rdf for older add-ons. The manifest lists permissions, content scripts, background scripts and browser-specific settings.",
          "Modern Firefox add-ons use the same WebExtensions model as Chrome and Edge, with differences in API names, optional permissions and host-access prompts. Read the manifest before relying on the store summary.",
        ],
        links: [
          { label: "Firefox XPI analyzer", slug: "firefox-xpi-analyzer" },
          { label: "Firefox XPI file analyzer", slug: "firefox-xpi-file-analyzer" },
        ],
      },
      {
        heading: "Permissions and website access",
        body: [
          "Separate API permissions from host permissions. A permission such as cookies or history is different from access to all sites, and optional permissions are requested at runtime rather than granted at install.",
          "Check content_scripts.matches and host_permissions together. A narrow add-on should not need every site unless its feature genuinely works across the web.",
        ],
        list: [
          "Required and optional API permissions",
          "Host permissions and match patterns",
          "Content scripts and run_at timing",
          "Background scripts or event pages",
          "External domains referenced in code",
        ],
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "Chrome host permissions checker", slug: "chrome-extension-host-permissions-checker" },
        ],
      },
      {
        heading: "Firefox-specific review notes",
        body: [
          "Firefox shows some permissions in the add-on manager and may ask for host access separately. The package is still the most precise source because it shows the declared capabilities and the code that uses them.",
          "Check the add-on's update URL, signature status and publisher. A signed XPI from addons.mozilla.org is not automatically private, but it gives you a review and distribution trail.",
        ],
        callout:
          "The store badge answers who distributed the add-on. The package answers what it can access.",
        links: [
          { label: "how to audit an extension before install", slug: "how-to-audit-an-extension-before-install" },
          { label: "extension permission analyzer", slug: "extension-permission-analyzer" },
        ],
      },
    ],
    faqs: [
      {
        question: "How do I inspect a Firefox add-on before installing it?",
        answer:
          "Download the XPI, extract it and read manifest.json. Review permissions, host access, content scripts and code findings before loading the add-on.",
      },
      {
        question: "Are Firefox add-ons safer than Chrome extensions?",
        answer:
          "Neither platform is automatically safer. Review and policy differ, but both can grant powerful access. The package and publisher matter more than the browser label.",
      },
      {
        question: "Can I analyze a legacy XPI?",
        answer:
          "Some legacy add-ons use install.rdf rather than manifest.json. A modern analyzer may only support WebExtensions manifests, so check the supported formats first.",
      },
      {
        question: "Does an add-on need all-sites access to work?",
        answer:
          "Only if its feature genuinely operates across every site. Many add-ons work with specific host patterns or activeTab access.",
      },
    ],
    related: [
      "firefox-xpi-analyzer",
      "firefox-xpi-file-analyzer",
      "how-to-audit-an-extension-before-install",
      "extension-permission-analyzer",
    ],
    lastReviewed: "2026-11-01",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "edge-extension-permission-checker",
    cluster: "edge",
    hub: "edge-extension-inspector",
    primaryKeyword: "edge extension permission checker",
    intent: "analyzer",
    title: "Edge Extension Permission Checker: Inspect Add-ons",
    metaTitle: "Edge Extension Permission Checker - Inspect Add-ons",
    description:
      "Check a Microsoft Edge add-on's permissions, host access, content scripts, external domains and code indicators before installing or updating it.",
    h1: "Edge extension permission checker",
    answer:
      "An Edge extension permission checker inspects the add-on package for API permissions, host access, content scripts, external domains and code indicators. Edge add-ons use the Chromium extension model, so the manifest fields are familiar. The checker shows capability and static risk signals, not proof of runtime behavior.",
    sections: [
      {
        heading: "Edge add-ons use the Chromium model",
        body: [
          "Microsoft Edge supports Chromium extensions, so manifest.json fields such as permissions, host_permissions, content_scripts, background and action work in the same way as Chrome. API support can differ at the edges, but the permission review process is familiar.",
          "An Edge add-on package can be inspected as a CRX or ZIP. The store page and the add-on details page summarize access, but the manifest is more precise.",
        ],
        links: [
          { label: "Edge extension inspector", slug: "edge-extension-inspector" },
          { label: "Chrome extension inspector online", slug: "chrome-extension-inspector-online" },
        ],
      },
      {
        heading: "What to compare",
        body: [
          "Review required and optional permissions, host patterns and content-script matches together. A permission such as debugger or nativeMessaging is more consequential than storage, and an all-sites pattern is broader than a single host.",
          "Check external domains and code findings as well. A new endpoint or a remote script reference in an update deserves a closer look even when the permission list is unchanged.",
        ],
        table: {
          caption: "Permission review priorities",
          headers: ["Area", "What to ask"],
          rows: [
            ["API permissions", "Does the feature need this capability?"],
            ["Host access", "Does it need every site or specific sites?"],
            ["Content scripts", "Where does the code run?"],
            ["External domains", "Do endpoints match the publisher?"],
            ["Code findings", "Are there remote or dynamic code patterns?"],
          ],
        },
        links: [
          { label: "Chrome permissions checker", slug: "chrome-permissions-checker" },
          { label: "how to check permissions before installing", slug: "how-to-check-chrome-extension-permissions-before-installing" },
        ],
      },
      {
        heading: "Before you install or update",
        body: [
          "Compare the new package with the version you already reviewed. Look for new permissions, broader host access, new domains and new code findings. If the release notes do not explain a change, ask the publisher or wait.",
          "Store review and the Edge Add-ons badge are useful signals, but they are not a guarantee about privacy or future updates.",
        ],
        callout:
          "A permission is a capability. The package tells you what changed; the publisher should explain why.",
        links: [
          { label: "compare Chrome extension versions", slug: "compare-chrome-extension-versions" },
          { label: "how to audit an extension before install", slug: "how-to-audit-an-extension-before-install" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I use a Chrome extension checker for Edge add-ons?",
        answer:
          "Often yes, because Edge uses the Chromium extension model. Confirm that the tool supports the package format and the manifest version you are reviewing.",
      },
      {
        question: "How do I see an Edge add-on's permissions?",
        answer:
          "Open the add-on details page in Edge or inspect manifest.json from the package. The manifest is more complete and shows optional and host permissions separately.",
      },
      {
        question: "Are Edge add-ons reviewed by Microsoft?",
        answer:
          "Microsoft reviews add-ons for its store, but review is not a guarantee of privacy or future behavior. Inspect the package and publisher yourself.",
      },
      {
        question: "What is the riskiest Edge extension permission?",
        answer:
          "There is no single riskiest permission. Debugger, nativeMessaging, proxy, cookies and broad host access are all high-impact depending on the feature.",
      },
    ],
    related: [
      "edge-extension-inspector",
      "chrome-permissions-checker",
      "chrome-extension-inspector-online",
      "how-to-audit-an-extension-before-install",
    ],
    lastReviewed: "2026-11-01",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "extension-data-collection-checker",
    cluster: "tracking",
    hub: "browser-extension-tracking-analysis",
    primaryKeyword: "extension data collection checker",
    intent: "analyzer",
    title: "Extension Data Collection Checker: Find Tracking Signals",
    metaTitle: "Extension Data Collection Checker - Tracking Signals",
    description:
      "Check an extension for data-collection indicators such as analytics domains, tracking permissions, credential access and clipboard reads.",
    h1: "Extension data collection checker",
    answer:
      "An extension data collection checker looks for indicators such as analytics and advertising domains, broad host access, cookies or history permissions, credential and clipboard reads, and network endpoints in the code. These signals show where data could flow, not proof that data was collected or sold.",
    sections: [
      {
        heading: "Indicators a static check can find",
        body: [
          "Data collection usually leaves traces in permissions, domains and code. A tracking SDK may appear as a known analytics domain. Credential access may appear as cookie or storage reads. Clipboard monitoring may appear as clipboard API calls or event listeners.",
          "The report groups these indicators so you can review them together instead of treating each finding in isolation.",
        ],
        list: [
          "Analytics, advertising and session-replay domains",
          "Cookies, history, tabs and webRequest permissions",
          "Credential, token and clipboard access patterns",
          "Broad host permissions and content-script matches",
          "Unexplained endpoints in background code",
        ],
        links: [
          { label: "browser extension tracking analysis", slug: "browser-extension-tracking-analysis" },
          { label: "does this extension track me", slug: "does-this-extension-track-me" },
        ],
      },
      {
        heading: "What the indicators do not prove",
        body: [
          "A domain reference does not prove that the extension contacted it. A cookie permission does not prove that cookies were read or sent. Static analysis shows capability and code paths, not runtime behavior.",
          "Legitimate features can also need sensitive access. A password manager needs credential access; a research tool may need history. The question is whether the access is proportionate and explained.",
        ],
        callout:
          "Capability plus code path plus unexplained destination is a reason to look closer, not a verdict.",
        links: [
          { label: "extension external domain finder", slug: "extension-external-domain-finder" },
          { label: "cookies permission explained", slug: "extension-asking-for-cookies-permission" },
        ],
      },
      {
        heading: "How to review the result",
        body: [
          "Start with the domains and permissions that are hardest to justify for the feature. Then read the code around the matching finding. Check the privacy policy for the same categories of data and retention period.",
          "If the policy does not mention a category that the code can access, ask the publisher. If an update adds a new analytics or advertising domain, compare it with the previous version and read the release notes.",
        ],
        links: [
          { label: "compare Chrome extension versions", slug: "compare-chrome-extension-versions" },
          { label: "browser extension privacy guide", slug: "browser-extension-privacy-guide" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can an extension collect data without tracking permissions?",
        answer:
          "Yes. A content script with host access can read page content and send it to a server. Permissions define some capabilities, but code and domains matter too.",
      },
      {
        question: "Does an analytics domain mean the extension sells my data?",
        answer:
          "No. It shows that analytics code or an endpoint is referenced. Whether data is sold depends on the publisher's policy and runtime behavior.",
      },
      {
        question: "How can I reduce extension data collection?",
        answer:
          "Install fewer extensions, restrict site access, decline optional permissions, use a separate browser profile for sensitive accounts and remove unused add-ons.",
      },
      {
        question: "Is clipboard access always a privacy risk?",
        answer:
          "Clipboard access can expose copied text, passwords or tokens. Some features need it, but it should be explained and limited to a user action.",
      },
    ],
    related: [
      "browser-extension-tracking-analysis",
      "does-this-extension-track-me",
      "extension-external-domain-finder",
      "extension-asking-for-cookies-permission",
    ],
    lastReviewed: "2026-11-01",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "browser-extension-malware-scanner",
    cluster: "privacy-checker",
    hub: "browser-extension-privacy-checker",
    primaryKeyword: "browser extension malware scanner",
    intent: "reference",
    title: "Browser Extension Malware Scanner: What Static Analysis Can Do",
    metaTitle: "Browser Extension Malware Scanner - Static Indicators",
    description:
      "What a browser extension malware scanner can detect statically, why it cannot prove malware, and how to combine indicators with runtime checks.",
    h1: "Browser extension malware scanner",
    answer:
      "A browser extension malware scanner looks for static indicators such as remote script loading, dynamic code execution, obfuscation, credential access and suspicious endpoints. It cannot prove malware because it does not execute the extension or observe runtime behavior. Treat the result as a triage list, not a clean bill of health.",
    sections: [
      {
        heading: "Why the label is misleading",
        body: [
          "Malware detection usually combines signatures, reputation, runtime behavior and threat intelligence. A package analyzer can inspect the files, but it cannot see what happens after the extension loads, what a server returns or how the code behaves for a specific user.",
          "That does not make static analysis useless. It is fast, private and good at finding capabilities and code patterns that deserve a closer look.",
        ],
        links: [
          { label: "browser extension privacy checker", slug: "browser-extension-privacy-checker" },
          { label: "are Chrome extensions safe", slug: "are-chrome-extensions-safe" },
        ],
      },
      {
        heading: "What static analysis can flag",
        body: [
          "Useful indicators include remote script references, eval-like calls, heavily obfuscated code, credential and cookie access, clipboard monitoring, crypto-mining patterns, raw IP endpoints and known temporary upload hosts.",
          "Each indicator should be tied to a file, line and matched evidence. Without evidence, a scanner is asking you to trust a black box.",
        ],
        list: [
          "Remote code and dynamic execution",
          "Obfuscation and unreadable bundles",
          "Credential, cookie and clipboard access",
          "Crypto-mining and exfiltration patterns",
          "Suspicious endpoints and temporary upload hosts",
        ],
        links: [
          { label: "remote script reference detector", slug: "remote-script-reference-detector" },
          { label: "extension JavaScript behavior analyzer", slug: "extension-javascript-behavior-analyzer" },
        ],
      },
      {
        heading: "How to use the result safely",
        body: [
          "Do not install an extension only because a static scan is clean. Do not remove a legitimate extension only because a bundled library triggered a rule. Read the evidence, check the publisher and compare versions when an update changes the risk profile.",
          "For high-value accounts, use a separate browser profile with a minimal extension set and review permissions after every major update.",
        ],
        callout:
          "A static scan is a triage tool. Runtime testing, reputation and publisher transparency answer the questions it cannot.",
        links: [
          { label: "compare Chrome extension versions", slug: "compare-chrome-extension-versions" },
          { label: "how to audit an extension before install", slug: "how-to-audit-an-extension-before-install" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can a browser extension scanner detect malware?",
        answer:
          "It can detect static indicators associated with malicious behavior, but it cannot prove malware without runtime analysis and threat intelligence.",
      },
      {
        question: "Is a free static scanner enough?",
        answer:
          "It is a useful first pass. Combine it with store review, publisher reputation, privacy policy review and runtime testing for high-risk cases.",
      },
      {
        question: "Why do legitimate extensions trigger malware rules?",
        answer:
          "Bundled libraries, minification and legitimate sensitive features can match patterns that are also used by malicious code.",
      },
      {
        question: "What should I do if a scan finds a critical indicator?",
        answer:
          "Read the evidence, check the publisher and release notes, and consider removing the extension until the behavior is explained.",
      },
    ],
    related: [
      "browser-extension-privacy-checker",
      "chrome-extension-safety-check",
      "are-chrome-extensions-safe",
      "remote-script-reference-detector",
    ],
    lastReviewed: "2026-11-01",
    analyzerEmbed: true,
  },
];
