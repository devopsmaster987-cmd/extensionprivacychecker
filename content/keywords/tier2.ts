import type { ContentPage } from "../types";

export const tier2: ContentPage[] = [
  {
    kind: "keyword",
    slug: "extension-permission-analyzer",
    cluster: "permissions",
    hub: "chrome-permissions-checker",
    primaryKeyword: "extension permission analyzer",
    intent: "analyzer",
    title: "Extension Permission Analyzer: Required, Optional and Host Access",
    metaTitle: "Extension Permission Analyzer - Explain Every Permission",
    description:
      "Analyze extension permissions with plain-language explanations. Separate required, optional and host access, and identify high-impact capabilities.",
    h1: "Extension permission analyzer",
    answer:
      "An extension permission analyzer reads the manifest and explains every declared API and website permission. It separates required access from optional requests, ranks capabilities by potential impact and shows the evidence behind the permission category score. It does not label an extension malicious for requesting powerful features.",
    sections: [
      {
        heading: "Why permission analysis needs context",
        body: [
          "A permission name alone says little about risk. The tabs permission can reveal browsing activity, but many tab managers need it. Cookies can expose sessions, but a session manager may require it. The analyzer pairs each permission with a description and a recommendation.",
          "It also reports optional permissions, which can expand access after installation, and host permissions, which define website reach.",
        ],
        links: [
          { label: "Chrome permissions checker", slug: "chrome-permissions-checker" },
          { label: "Manifest V3 permissions list", slug: "manifest-v3-permissions-list-explained" },
        ],
      },
      {
        heading: "How the permission category score works",
        body: [
          "Each known API permission has an impact weight. Required weights are summed and scaled, with a small additional weight for broad-access capabilities. Host permissions are scored separately under website access so the same reach is not counted twice.",
          "The report shows the top weighted permissions and the aggregate. This is a transparent heuristic, not a vendor risk rating.",
        ],
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "cookies permission", slug: "extension-asking-for-cookies-permission" },
        ],
      },
      {
        heading: "Using the result",
        body: [
          "Match each permission to a visible feature. If a capability is unnecessary for the product, prefer an alternative extension with narrower access. Review optional permissions before accepting a runtime prompt.",
          "A permission analyzer informs a decision. It cannot show whether a permission was used or whether data left your browser.",
        ],
        callout:
          "Powerful permissions are not evidence of wrongdoing. Disproportionate permissions combined with unclear data practices are the real warning sign.",
      },
    ],
    faqs: [
      {
        question: "What does an extension permission analyzer do?",
        answer:
          "It parses the manifest, explains each permission and host pattern, and highlights high-impact capabilities. It never installs or executes the extension.",
      },
      {
        question: "Does it analyze optional permissions?",
        answer:
          "Yes. Optional permissions are listed separately because they may be requested after installation.",
      },
      {
        question: "Can every permission be explained?",
        answer:
          "Common browser permissions have curated explanations. Unknown permissions are marked for manual review against vendor documentation.",
      },
    ],
    related: [
      "chrome-permissions-checker",
      "add-on-permission-scanner",
      "browser-add-on-data-access-checker",
      "how-to-see-what-permissions-an-extension-has",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "chrome-extension-inspector-online",
    cluster: "edge",
    hub: "edge-extension-inspector",
    primaryKeyword: "chrome extension inspector online",
    intent: "analyzer",
    title: "Chrome Extension Inspector Online: Package and Source Review",
    metaTitle: "Chrome Extension Inspector Online - Inspect Before Install",
    description:
      "Inspect a Chrome extension online. Review manifest fields, permissions, host access, content scripts, source indicators and external domains.",
    h1: "Chrome extension inspector online",
    answer:
      "A Chrome extension inspector online opens the CRX or ZIP package and presents its manifest, permissions, website access, scripts, external domains and static code findings. It is useful before installation because it reveals the extension's declared reach without granting it access to your browser.",
    sections: [
      {
        heading: "What the inspector shows",
        body: [
          "The report covers identity and compatibility, required and optional permissions, host permissions, content scripts, background configuration, CSP, externally_connectable and web-accessible resources.",
          "A findings section highlights dynamic code, remote script references, DOM injection, storage, messaging and sensitive-data indicators with file and line references.",
        ],
        links: [
          { label: "extension manifest viewer", slug: "extension-manifest-viewer" },
          { label: "extension permission analyzer", slug: "extension-permission-analyzer" },
        ],
      },
      {
        heading: "Inspector versus browser developer tools",
        body: [
          "An online inspector reviews a package before installation. Browser developer tools can inspect an installed extension's pages and network traffic at runtime. The two approaches answer different questions: capability and configuration versus observed behavior.",
          "Use the inspector to decide whether an extension deserves installation. Use runtime tools in a separate profile when you need to confirm network activity.",
        ],
        links: [
          { label: "remote script detector", slug: "remote-script-reference-detector" },
          { label: "external domain finder", slug: "extension-external-domain-finder" },
        ],
      },
      {
        heading: "Privacy of the inspection",
        body: [
          "Files are processed locally in a Web Worker. The inspector does not need your Google account, browser profile or installed extension list. The report exists only in the page and can be exported by you.",
        ],
        callout:
          "An inspection result is not an endorsement. Check the publisher and the extension's update history as well.",
      },
    ],
    faqs: [
      {
        question: "Can I inspect any Chrome extension online?",
        answer:
          "You can inspect any package you can lawfully obtain. Paste a Chrome Web Store URL or upload the CRX/ZIP. Some store retrieval requests may be blocked.",
      },
      {
        question: "Does inspecting require installing the extension?",
        answer:
          "No. The inspector reads the package only and never loads it into the browser.",
      },
      {
        question: "Is the inspector the same as Chrome's internal page?",
        answer:
          "No. Chrome's extension page shows installed extensions. This inspector analyzes a package before installation and explains permissions in plain language.",
      },
    ],
    related: [
      "edge-extension-inspector",
      "extension-manifest-viewer",
      "extension-permission-analyzer",
      "browser-plugin-source-analyzer",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "add-on-permission-scanner",
    cluster: "permissions",
    hub: "chrome-permissions-checker",
    primaryKeyword: "add-on permission scanner",
    intent: "analyzer",
    title: "Add-on Permission Scanner: Review Browser Add-on Access",
    metaTitle: "Add-on Permission Scanner - Review Browser Add-on Access",
    description:
      "Scan browser add-on permissions for Chrome, Edge and Firefox. See required, optional and host permissions with impact ratings and recommendations.",
    h1: "Add-on permission scanner",
    answer:
      "An add-on permission scanner extracts declared permissions from a browser extension package and explains what each one allows. It covers Chrome, Edge and Firefox packages, separates required from optional access, and highlights broad host access and high-impact browser APIs.",
    sections: [
      {
        heading: "What makes this scanner different",
        body: [
          "It reads the package rather than the store summary. That means it can show the exact host patterns, optional permissions and manifest version, including fields the install prompt compresses into a short warning.",
          "It also reports related code references. A permission tells you what is possible; code findings help you see where related APIs appear.",
        ],
        links: [
          { label: "Chrome permissions checker", slug: "chrome-permissions-checker" },
          { label: "Firefox XPI analyzer", slug: "firefox-xpi-analyzer" },
        ],
      },
      {
        heading: "A quick triage method",
        body: [
          "Sort permissions into three buckets: expected for the feature, plausible but unexplained, and inconsistent with the product. Investigate the third bucket first. Then check whether host access is limited to the sites the product touches.",
          "Review optional permissions separately. They can appear after installation and may be the moment when access expands.",
        ],
        links: [
          { label: "how to see permissions", slug: "how-to-see-what-permissions-an-extension-has" },
          { label: "all_urls meaning", slug: "what-does-all-urls-permission-mean" },
        ],
      },
      {
        heading: "Limits of a permission scan",
        body: [
          "A scanner cannot prove that a permission is used or abused. It cannot see runtime data flows or remote code. Use the scan to focus your review, not to replace it.",
        ],
        callout:
          "A clean permission list is not a privacy guarantee. A high-impact list is not a malware verdict.",
      },
    ],
    faqs: [
      {
        question: "Does the scanner work for Firefox add-ons?",
        answer:
          "Yes. Upload an XPI or use a supported addons.mozilla.org URL. Manifest permissions and host access are analyzed in the same way.",
      },
      {
        question: "Does it scan optional permissions?",
        answer:
          "Yes, and they are labelled separately so you can see what may be requested later.",
      },
      {
        question: "Is a permission scanner enough for a security audit?",
        answer:
          "No. It is a focused static review. A full audit needs code review and, for behavior, runtime observation.",
      },
    ],
    related: [
      "extension-permission-analyzer",
      "chrome-permissions-checker",
      "firefox-xpi-analyzer",
      "how-to-check-chrome-extension-permissions-before-installing",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "browser-plugin-source-analyzer",
    cluster: "edge",
    hub: "edge-extension-inspector",
    primaryKeyword: "browser plugin source analyzer",
    intent: "analyzer",
    title: "Browser Plugin Source Analyzer: Static Code Review",
    metaTitle: "Browser Plugin Source Analyzer - Static Review Without Running",
    description:
      "Analyze browser extension source code without running it. Find dynamic code, remote scripts, obfuscation, DOM injection, storage and messaging patterns.",
    h1: "Browser plugin source analyzer",
    answer:
      "A browser plugin source analyzer parses extension JavaScript as text and looks for static indicators such as eval, remote script loading, obfuscation, DOM injection, storage and messaging. It never executes the code. Findings show file, line, evidence and confidence so you can review the context yourself.",
    sections: [
      {
        heading: "What static source analysis can find",
        body: [
          "The analyzer uses a JavaScript parser to identify calls and patterns, not only regular expressions. It reports the source location and a short evidence snippet, which makes verification practical even for nontechnical users.",
          "It also applies lightweight obfuscation heuristics and extracts URL references for domain classification. Each finding has a severity and a confidence level.",
        ],
        list: [
          "eval and Function constructor use",
          "External script elements and importScripts",
          "HTML and document.write injection",
          "Cookie, password field and keyboard access",
          "Storage, messaging and native messaging",
          "Obfuscation and encoded payload indicators",
        ],
        links: [
          { label: "extension JavaScript behavior analyzer", slug: "extension-javascript-behavior-analyzer" },
          { label: "remote script detector", slug: "remote-script-reference-detector" },
        ],
      },
      {
        heading: "False positives are expected",
        body: [
          "Bundled libraries contain network calls, DOM helpers and sometimes eval-like code. Minification can look like obfuscation. The analyzer reports patterns, not intent, and confidence levels communicate uncertainty.",
          "Use file names and line numbers to check whether a finding is in the extension's own code, a third-party library or an optional build path.",
        ],
        links: [
          { label: "source code findings explained", slug: "is-this-chrome-extension-safe-to-install" },
          { label: "external domains", slug: "check-what-domains-a-chrome-extension-connects-to" },
        ],
      },
      {
        heading: "What cannot be seen",
        body: [
          "Runtime-generated code, dynamically assembled URLs and server-delivered scripts may not be visible. Static analysis is one layer of review, not a proof of behavior.",
        ],
        callout:
          "A finding is a prompt to inspect the code. It is not a verdict about the extension.",
      },
    ],
    faqs: [
      {
        question: "Is source code analysis safe?",
        answer:
          "Yes when the code is parsed as text and never executed. This analyzer runs in a Web Worker and does not evaluate extension JavaScript.",
      },
      {
        question: "Does it deobfuscate code?",
        answer:
          "No. It detects obfuscation indicators and reports them. A readable build from the publisher is easier to review.",
      },
      {
        question: "Why are bundled libraries reported?",
        answer:
          "Libraries contain generic patterns that may look risky. File names and context help distinguish library code from the extension's own logic.",
      },
    ],
    related: [
      "extension-javascript-behavior-analyzer",
      "remote-script-reference-detector",
      "edge-extension-inspector",
      "extension-external-domain-finder",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "extension-website-access-inspector",
    cluster: "content-scripts",
    hub: "extension-content-script-inspector",
    primaryKeyword: "extension website access inspector",
    intent: "analyzer",
    title: "Extension Website Access Inspector: See Sites and Match Patterns",
    metaTitle: "Extension Website Access Inspector - Host and Script Access",
    description:
      "Inspect which websites an extension can access. See host permissions, content-script match patterns, wildcards, all_urls and frame behavior.",
    h1: "Extension website access inspector",
    answer:
      "An extension website access inspector lists every host permission and content-script match pattern in the package. It shows whether access is limited to specific domains, expanded to wildcard subdomains or covers all sites. Website access is separate from API permissions and describes where the extension may read or change content.",
    sections: [
      {
        heading: "Two sources of website access",
        body: [
          "Host permissions declare which URLs extension APIs can access. Content-script match patterns declare where injected files run. They often overlap but can differ, so the inspector reports both.",
          "The report scores breadth and explains why: exact hosts, wildcard subdomains, wildcard schemes, all_urls and local file access each contribute differently.",
        ],
        links: [
          { label: "content script inspector", slug: "extension-content-script-inspector" },
          { label: "Chrome host permissions", slug: "chrome-extension-host-permissions-checker" },
        ],
      },
      {
        heading: "Breadth is not behavior",
        body: [
          "A site-specific pattern is narrower than all_urls, but a narrow extension can still mishandle data on one sensitive site. A broad extension may be transparent and necessary, such as a content blocker.",
          "The inspector provides the map. Code findings and the publisher's policy explain what happens inside it.",
        ],
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "reading all sites permission", slug: "chrome-extension-reading-all-sites-permission" },
        ],
      },
      {
        heading: "Reducing website exposure",
        body: [
          "Prefer extensions that use the narrowest host patterns, check whether the browser's site-access control can limit an installed extension, and remove extensions whose access is no longer needed.",
          "Review access after updates, because new hosts or content scripts can appear in a new version.",
        ],
        callout:
          "Website access defines where an extension can act. It does not prove that any page was read or transmitted.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between host permissions and content scripts?",
        answer:
          "Host permissions grant API access to URLs. Content scripts are code injected into matching pages. The patterns can be the same or different.",
      },
      {
        question: "Does a content script run in iframes?",
        answer:
          "Only when all_frames is enabled and the frame URL matches the pattern. Otherwise it normally runs in the top-level document.",
      },
      {
        question: "Can I restrict site access after installation?",
        answer:
          "Many Chromium browsers let you change site access for an installed extension. The extension's manifest still declares its intended reach.",
      },
    ],
    related: [
      "extension-content-script-inspector",
      "content-script-matches-patterns-explained",
      "chrome-extension-host-permissions-checker",
      "chrome-extension-reading-all-sites-permission",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "browser-add-on-data-access-checker",
    cluster: "tracking",
    hub: "browser-extension-tracking-analysis",
    primaryKeyword: "browser add-on data access checker",
    intent: "analyzer",
    title: "Browser Add-on Data Access Checker",
    metaTitle: "Browser Add-on Data Access Checker - Cookies, Tabs, Storage",
    description:
      "Check what data a browser add-on can access: cookies, tabs, history, storage, page content and external domains. Understand capability versus behavior.",
    h1: "Browser add-on data access checker",
    answer:
      "A browser add-on data access checker maps the extension's permissions and code references to categories of data such as cookies, browsing history, tab metadata, page content and stored values. It shows what the add-on could reach. It cannot prove that any data was read, retained or transmitted.",
    sections: [
      {
        heading: "Data categories to review",
        body: [
          "Sensitive categories include cookies and session tokens, browsing history, tab URLs, page content, form fields, clipboard contents and stored identifiers. The checker groups permissions and findings by these categories so the exposure is easier to understand.",
          "It also reports external domains, because data access matters most when paired with a transmission path.",
        ],
        table: {
          caption: "Data access examples",
          headers: ["Data type", "Related capability", "Why it matters"],
          rows: [
            ["Cookies", "cookies permission, document.cookie", "Sessions can grant account access"],
            ["History", "history permission", "Reveals interests and accounts"],
            ["Tab URLs", "tabs permission", "Exposes browsing context"],
            ["Page content", "content scripts, scripting", "Can read private page data"],
            ["Form input", "content scripts", "May include credentials or messages"],
            ["Storage", "storage API", "Can persist identifiers"],
          ],
        },
        links: [
          { label: "cookies permission explained", slug: "extension-asking-for-cookies-permission" },
          { label: "browser extension tracking analysis", slug: "browser-extension-tracking-analysis" },
        ],
      },
      {
        heading: "Capability is not collection",
        body: [
          "A password manager can read login forms by design. An ad blocker can inspect many pages to filter content. The privacy question is whether the data is necessary, minimized, secured and disclosed.",
          "Look for proportionality: a feature that needs one data category should not request five. Look for transparency: a privacy policy should state what is collected and why.",
        ],
        links: [
          { label: "does this extension track me", slug: "does-this-extension-track-me" },
          { label: "external domain finder", slug: "extension-external-domain-finder" },
        ],
      },
      {
        heading: "What to do next",
        body: [
          "Review the highest-impact permissions and the code paths that reference them. Check whether external domains are explained. If the add-on is not essential, remove it or replace it with a narrower alternative.",
        ],
        callout:
          "The checker reports potential access, not observed access. Runtime traffic requires separate monitoring.",
      },
    ],
    faqs: [
      {
        question: "Can an add-on read my passwords?",
        answer:
          "A content script on a login page may access form fields. Whether it does and whether it transmits them cannot be proven by static analysis alone.",
      },
      {
        question: "Does the checker see my actual data?",
        answer:
          "No. It only reads the add-on package and never accesses your browser profile, cookies, history or pages.",
      },
      {
        question: "Which data access is most sensitive?",
        answer:
          "Cookies, credentials, private page content and history are typically the most sensitive. Context and destination determine the actual risk.",
      },
    ],
    related: [
      "browser-extension-tracking-analysis",
      "does-this-extension-track-me",
      "extension-asking-for-cookies-permission",
      "chrome-extension-reading-all-sites-permission",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "extension-javascript-behavior-analyzer",
    cluster: "remote-code",
    hub: "remote-script-reference-detector",
    primaryKeyword: "extension JavaScript behavior analyzer",
    intent: "analyzer",
    title: "Extension JavaScript Behavior Analyzer",
    metaTitle: "Extension JavaScript Behavior Analyzer - Static Indicators",
    description:
      "Analyze extension JavaScript for dynamic code, remote scripts, DOM injection, storage, cookies, messaging and obfuscation indicators.",
    h1: "Extension JavaScript behavior analyzer",
    answer:
      "An extension JavaScript behavior analyzer inspects source files for patterns that indicate what the extension could do: execute dynamic code, load remote scripts, inject HTML, access cookies, store data, send messages or contact external hosts. Static indicators describe capability and code structure, not observed runtime behavior.",
    sections: [
      {
        heading: "How behavior is inferred statically",
        body: [
          "The analyzer parses JavaScript with an AST parser, then walks calls, assignments and member access. It records file, line, evidence and confidence. This is more precise than searching for words in minified text.",
          "It also scans HTML for remote script tags and inline scripts, and extracts URLs for domain classification.",
        ],
        links: [
          { label: "remote script detector", slug: "remote-script-reference-detector" },
          { label: "browser plugin source analyzer", slug: "browser-plugin-source-analyzer" },
        ],
      },
      {
        heading: "Prioritizing findings",
        body: [
          "Start with high-severity findings that combine access and transmission: eval or remote code references, native messaging, cookie access near network calls, password field references, and obfuscation with encoded payloads.",
          "Read the surrounding code and check whether the path is reachable. A finding in a bundled library or dead code is different from one in the main content script.",
        ],
        table: {
          caption: "Finding categories",
          headers: ["Category", "Example", "What it suggests"],
          rows: [
            ["Dynamic code", "eval, new Function", "Code built at runtime"],
            ["Remote code", "script src, importScripts", "Executable code outside the package"],
            ["DOM injection", "innerHTML, document.write", "Page content modification"],
            ["Sensitive data", "document.cookie, password fields", "Potential data access"],
            ["Network", "fetch, WebSocket", "Communication capability"],
            ["Obfuscation", "hex identifiers, base64 blobs", "Readability barrier"],
          ],
        },
        links: [
          { label: "Manifest V2 vs V3", slug: "manifest-v2-vs-v3-security-differences" },
          { label: "external domain finder", slug: "extension-external-domain-finder" },
        ],
      },
      {
        heading: "The limits of static behavior analysis",
        body: [
          "It cannot observe executed branches, server responses or user-specific data flows. It cannot prove that a network request happened. It is a review accelerator, not a sandbox.",
        ],
        callout:
          "Behavior inferred from code is a hypothesis until runtime evidence confirms it.",
      },
    ],
    faqs: [
      {
        question: "Does the analyzer run the JavaScript?",
        answer:
          "No. It parses the source as text and inspects the syntax tree. The code is never evaluated.",
      },
      {
        question: "Why does a clean extension still get findings?",
        answer:
          "Bundled libraries, optional features and generic APIs can produce findings. Use severity, confidence, file and line to judge relevance.",
      },
      {
        question: "Can it detect data exfiltration?",
        answer:
          "It can flag combinations such as cookie access near network calls, but it cannot prove that data was sent. Runtime monitoring is required for confirmation.",
      },
    ],
    related: [
      "remote-script-reference-detector",
      "browser-plugin-source-analyzer",
      "extension-external-domain-finder",
      "is-this-chrome-extension-safe-to-install",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
];
