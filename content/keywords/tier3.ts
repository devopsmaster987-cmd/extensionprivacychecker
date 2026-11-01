import type { ContentPage } from "../types";

export const tier3: ContentPage[] = [
  {
    kind: "keyword",
    slug: "are-chrome-extensions-safe",
    cluster: "privacy-checker",
    hub: "browser-extension-privacy-checker",
    primaryKeyword: "are chrome extensions safe",
    intent: "question",
    title: "Are Chrome Extensions Safe? A Realistic Answer",
    metaTitle: "Are Chrome Extensions Safe? Risks and How to Check",
    description:
      "Are Chrome extensions safe? Learn the real risks, how store review works, which permissions matter and how to inspect an extension before installing.",
    h1: "Are Chrome extensions safe?",
    answer:
      "Chrome extensions are not automatically safe or unsafe. Store review filters some threats, but extensions can be powerful, can update after installation and can request broad access. Safety depends on the publisher, the permissions, the code and your willingness to review them. Static inspection reduces uncertainty but cannot guarantee safety.",
    sections: [
      {
        heading: "Where extension risk comes from",
        body: [
          "An extension runs inside the browser with privileges a normal website does not have. It can read page content where content scripts run, observe navigation, access browser APIs and persist data. A malicious or compromised extension can therefore expose more than a single website tab.",
          "Risk also comes from legitimate but invasive behavior: analytics, aggressive monetization, vague data retention or broad permissions that exceed the feature.",
        ],
        links: [
          { label: "browser extension privacy checker", slug: "browser-extension-privacy-checker" },
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
        ],
      },
      {
        heading: "What store review does and does not cover",
        body: [
          "Chrome Web Store review checks policies and automated signals. It does not continuously audit every update, and it cannot guarantee that a publisher's privacy claims are complete. Popular extensions can change ownership or add data collection later.",
          "The install prompt and the extension details page show permissions, but they compress detail. Reading manifest.json and the code gives a more precise picture.",
        ],
        links: [
          { label: "how to audit an extension", slug: "how-to-audit-an-extension-before-install" },
          { label: "how to check permissions", slug: "how-to-check-chrome-extension-permissions-before-installing" },
        ],
      },
      {
        heading: "Practical safety habits",
        body: [
          "Install fewer extensions, prefer ones with narrow site access, review permissions after major updates and remove what you do not use. For sensitive accounts, consider a separate browser profile with a minimal extension set.",
          "No checklist eliminates risk. The goal is proportionate caution: understand the capability, check the evidence and keep the number of trusted publishers small.",
        ],
        list: [
          "Prefer narrow host permissions over all_urls",
          "Question powerful APIs such as debugger and nativeMessaging",
          "Read the privacy policy and look for a real support channel",
          "Re-check permissions after updates",
          "Remove unused extensions",
        ],
        callout:
          "Store review is a filter, not a certificate. Your own review is still part of the decision.",
      },
    ],
    faqs: [
      {
        question: "Can a Chrome extension steal my data?",
        answer:
          "If it has access to sensitive pages or APIs, it may be able to read data. Whether it does requires runtime analysis or a code audit. Permissions define the potential.",
      },
      {
        question: "Are popular extensions safer?",
        answer:
          "Popularity can indicate quality and maintenance, but it does not guarantee privacy. Ownership changes and monetization can alter behavior.",
      },
      {
        question: "Do extensions run in a sandbox?",
        answer:
          "They run under browser security boundaries, but their declared permissions still grant significant access. The sandbox does not make broad access harmless.",
      },
      {
        question: "How can I check an extension before installing it?",
        answer:
          "Inspect its package with a static analyzer. Review permissions, website access, code findings and domains, then decide whether the access is proportionate.",
      },
    ],
    related: [
      "browser-extension-privacy-checker",
      "is-this-chrome-extension-safe-to-install",
      "how-to-audit-an-extension-before-install",
      "chrome-extension-reading-all-sites-permission",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "how-to-see-what-permissions-an-extension-has",
    cluster: "permissions",
    hub: "chrome-permissions-checker",
    primaryKeyword: "how to see what permissions an extension has",
    intent: "guide",
    title: "How to See What Permissions an Extension Has",
    metaTitle: "How to See What Permissions an Extension Has - 3 Methods",
    description:
      "See an extension's permissions from the browser UI, its store listing or its manifest.json. Compare required, optional and website access.",
    h1: "How to see what permissions an extension has",
    answer:
      "You can see permissions in the browser's extension details page, in the store listing summary, or precisely in the package's manifest.json. The manifest is the most complete source because it separates required, optional and host permissions that the browser UI may summarize.",
    sections: [
      {
        heading: "Method 1: the browser's extension page",
        body: [
          "Open the browser's extension management page, select the extension and view its details. Chromium browsers show site access and some permission warnings. Firefox shows a permissions section in the add-on manager.",
          "This is the fastest method for an installed extension. It reflects currently granted access, which can differ from what the package originally requested if the user restricted site access.",
        ],
        links: [
          { label: "Chrome permissions checker", slug: "chrome-permissions-checker" },
          { label: "how to check before installing", slug: "how-to-check-chrome-extension-permissions-before-installing" },
        ],
      },
      {
        heading: "Method 2: the store listing",
        body: [
          "Store pages usually include a permissions summary or a link to the developer's disclosure. It is convenient but abbreviated. Broad categories can hide the exact site patterns and optional permissions.",
          "Use the store summary as an overview, then inspect the package for detail.",
        ],
        links: [
          { label: "view manifest online", slug: "view-extension-manifest-json-online" },
          { label: "extension permission analyzer", slug: "extension-permission-analyzer" },
        ],
      },
      {
        heading: "Method 3: inspect manifest.json",
        body: [
          "Download the CRX, XPI or ZIP and upload it here. The analyzer locates manifest.json and explains permissions, host permissions and content scripts. This works before installation and shows optional access separately.",
          "If you only have a store URL, try the built-in retrieval. When it is blocked, download the package and upload the file.",
        ],
        steps: [
          { title: "Get the package", body: "Download it from the store or obtain it from the publisher." },
          { title: "Upload it", body: "Drop the file into the analyzer." },
          { title: "Read the permission list", body: "Check required, optional and host access." },
          { title: "Match to features", body: "Investigate anything that lacks a clear purpose." },
        ],
        callout:
          "Permissions show capability. They do not show how an extension uses the access at runtime.",
      },
    ],
    faqs: [
      {
        question: "Where is the permissions page in Chrome?",
        answer:
          "Open chrome://extensions, choose Details for the extension and review site access and permission warnings. Exact labels vary by Chrome version.",
      },
      {
        question: "Can I see permissions before installing?",
        answer:
          "Yes. The store summary shows some, but the manifest in the package is the most complete source.",
      },
      {
        question: "Why do browser warnings differ from the manifest?",
        answer:
          "Browsers group and humanize permissions. They may omit technical names or combine several capabilities into one warning.",
      },
    ],
    related: [
      "chrome-permissions-checker",
      "extension-permission-analyzer",
      "view-extension-manifest-json-online",
      "how-to-check-chrome-extension-permissions-before-installing",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "chrome-extension-reading-all-sites-permission",
    cluster: "permissions",
    hub: "chrome-permissions-checker",
    primaryKeyword: "chrome extension reading all sites permission",
    intent: "question",
    title: "Chrome Extension Reading All Sites: What It Means",
    metaTitle: "Chrome Extension Reading All Sites Permission Explained",
    description:
      "What does it mean when a Chrome extension can read all sites? Learn how all_urls works, what data it can reach and how to limit exposure.",
    h1: "Chrome extension reading all sites permission",
    answer:
      "When a Chrome extension can read all sites, it usually has <all_urls> host access and a content script or scripting permission. That allows code to run on nearly every page you visit and potentially read page content. It does not necessarily mean the extension reads or sends everything.",
    sections: [
      {
        heading: "How all-site reading works",
        body: [
          "Host access alone lets extension APIs query matching URLs. Reading and changing page content requires injection, often through content scripts declared in the manifest or the scripting API.",
          "The extension can then access the page DOM, observe input and read cookies that are not HttpOnly. It can also combine page context with tab, history or storage data depending on other permissions.",
        ],
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "content script matches", slug: "content-script-matches-patterns-explained" },
        ],
      },
      {
        heading: "Why legitimate extensions need it",
        body: [
          "Password managers, ad blockers, translation tools, accessibility helpers and developer utilities often need broad access to recognize or modify pages across sites. The access can be justified even though the privacy impact is large.",
          "The key questions are whether the feature truly needs every site, whether the publisher explains data handling and whether the extension sends page content to external hosts.",
        ],
        links: [
          { label: "is this extension safe", slug: "is-this-chrome-extension-safe-to-install" },
          { label: "external domain finder", slug: "extension-external-domain-finder" },
        ],
      },
      {
        heading: "Limiting exposure",
        body: [
          "Use the browser's site-access control to restrict an installed extension where possible. Remove extensions that are no longer needed. Prefer alternatives that name the sites they need.",
          "If you must use a broad extension for sensitive accounts, consider a separate browser profile with a smaller extension set.",
        ],
        callout:
          "All-site access is a capability. Evidence of actual reading requires runtime observation or code review.",
      },
    ],
    faqs: [
      {
        question: "Does all-site permission mean the extension sees my passwords?",
        answer:
          "It may be able to read form fields on pages where its scripts run. Whether it captures them is a separate question that static analysis cannot answer conclusively.",
      },
      {
        question: "Can I revoke all-site access?",
        answer:
          "Many Chromium browsers allow you to restrict site access per extension. Check the extension details page; some extensions may stop working.",
      },
      {
        question: "Why does a coupon extension ask for all sites?",
        answer:
          "It may check many retail sites for discounts. That is a common but broad design choice. Review the publisher and domains before trusting it.",
      },
    ],
    related: [
      "what-does-all-urls-permission-mean",
      "chrome-extension-host-permissions-checker",
      "extension-website-access-inspector",
      "are-chrome-extensions-safe",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "does-this-extension-track-me",
    cluster: "tracking",
    hub: "browser-extension-tracking-analysis",
    primaryKeyword: "does this extension track me",
    intent: "question",
    title: "Does This Extension Track Me? How to Check",
    metaTitle: "Does This Extension Track Me? Signals to Check",
    description:
      "Learn how to tell whether an extension might track you. Review analytics domains, cookies, identifiers, permissions, storage and runtime testing.",
    h1: "Does this extension track me?",
    answer:
      "You cannot prove tracking from a static scan alone. Look for combinations: analytics or advertising domains, cookie and storage access, tab or history permissions, persistent identifiers and network calls. These indicators show potential tracking. Confirming actual data collection requires runtime observation and the publisher's disclosures.",
    sections: [
      {
        heading: "Tracking indicators in a package",
        body: [
          "The strongest static pattern is sensitive data access plus a destination. For example, a content script that reads cookies and the current URL and sends them to an analytics host. Each element alone may be benign; together they deserve scrutiny.",
          "The report highlights analytics and advertising domains, cookie access, storage usage, tab and history permissions, and messaging endpoints. It also shows whether domains are unclassified.",
        ],
        links: [
          { label: "tracking analysis", slug: "browser-extension-tracking-analysis" },
          { label: "external domain finder", slug: "extension-external-domain-finder" },
        ],
      },
      {
        heading: "Check the publisher's statements",
        body: [
          "A privacy policy should say what data is collected, why, where it is sent and how long it is kept. Vague wording such as 'we may collect data to improve services' is not a meaningful disclosure.",
          "Look for a support page, a real company identity and a changelog. If the extension is monetized through ads or affiliate links, consider how that affects data collection.",
        ],
        links: [
          { label: "cookies permission", slug: "extension-asking-for-cookies-permission" },
          { label: "browser add-on data access checker", slug: "browser-add-on-data-access-checker" },
        ],
      },
      {
        heading: "Confirming behavior at runtime",
        body: [
          "Install the extension in a separate browser profile and use developer tools or a proxy to observe requests. Do not log into sensitive accounts during the test. Compare the observed hosts with the static domain list.",
          "Runtime testing has limits too: telemetry may be delayed, conditional or disabled for new profiles. Use it as additional evidence, not absolute proof.",
        ],
        callout:
          "A scan can show tracking capability and suspicious combinations. Only observed traffic and publisher disclosure can confirm actual collection.",
      },
    ],
    faqs: [
      {
        question: "Can an extension track me without analytics domains?",
        answer:
          "Yes. It could send data to an unclassified first-party host, use WebSockets or encode endpoints in configuration. Domain classification is a heuristic.",
      },
      {
        question: "Does the analyzer see my browsing history?",
        answer:
          "No. It reads only the uploaded package and has no access to your browser profile or history.",
      },
      {
        question: "What should I do if I suspect tracking?",
        answer:
          "Disable or remove the extension, review its privacy policy and report concerns to the store. For confirmation, observe network traffic in an isolated profile.",
      },
    ],
    related: [
      "browser-extension-tracking-analysis",
      "extension-external-domain-finder",
      "browser-add-on-data-access-checker",
      "extension-asking-for-cookies-permission",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "extension-asking-for-cookies-permission",
    cluster: "permissions",
    hub: "chrome-permissions-checker",
    primaryKeyword: "extension asking for cookies permission",
    intent: "question",
    title: "Why Is an Extension Asking for the Cookies Permission?",
    metaTitle: "Extension Asking for Cookies Permission - What It Means",
    description:
      "Understand the extension cookies permission: what it allows, why session cookies are sensitive, legitimate uses and what to check before installing.",
    h1: "Extension asking for cookies permission",
    answer:
      "The cookies permission lets an extension read, create and modify cookies for permitted sites. Cookies often contain session identifiers, so this access can be powerful. Legitimate uses include session managers, testing tools and account switchers. The access should match a clear feature and a transparent data policy.",
    sections: [
      {
        heading: "What the permission actually allows",
        body: [
          "With cookies and matching host permissions, an extension can query cookie stores, read names and values, set cookies and listen for changes. It can reach cookies for the sites its host permissions cover, which may be all sites.",
          "This is broader than document.cookie access in a content script. The API can see HttpOnly cookies that page scripts cannot read.",
        ],
        links: [
          { label: "Chrome permissions checker", slug: "chrome-permissions-checker" },
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
        ],
      },
      {
        heading: "Legitimate and concerning patterns",
        body: [
          "A session manager may list and switch accounts, a developer tool may inspect authentication, and a privacy tool may clear cookies on a schedule. These can be legitimate, especially when host access is narrow and the behavior is visible.",
          "Concern rises when a simple utility requests cookies plus all-site access, when cookie values are sent to analytics or unknown domains, or when the privacy policy does not explain retention.",
        ],
        table: {
          caption: "Cookie access signals",
          headers: ["Signal", "Interpretation", "Next step"],
          rows: [
            ["cookies + specific hosts", "Scoped account feature", "Check the feature description"],
            ["cookies + all_urls", "Broad access to sessions", "Review code and domains closely"],
            ["cookie change listeners", "Monitors session changes", "Check what is logged or sent"],
            ["document.cookie in a script", "Page-level cookie access", "Check host matches and data flow"],
          ],
        },
        links: [
          { label: "how to check permissions", slug: "how-to-check-chrome-extension-permissions-before-installing" },
          { label: "does this extension track me", slug: "does-this-extension-track-me" },
        ],
      },
      {
        heading: "Reducing cookie exposure",
        body: [
          "Prefer extensions with specific host permissions. Remove cookie-related extensions you do not actively use. If you need one, consider a separate profile for sensitive accounts and review the extension after updates.",
          "A permission is not proof of misuse. It is a reason to verify the feature and the destination of any cookie data.",
        ],
        callout:
          "Session cookies can be as sensitive as passwords. Treat cookie access as a high-impact capability.",
      },
    ],
    faqs: [
      {
        question: "Can an extension read all my cookies?",
        answer:
          "Only for sites covered by its host permissions and when it has the cookies permission. With broad host access, that can include most sites you use.",
      },
      {
        question: "Can it read HttpOnly cookies?",
        answer:
          "The extension cookies API can access cookies that page scripts cannot, including HttpOnly cookies, subject to permissions and browser rules.",
      },
      {
        question: "Are cookie manager extensions safe?",
        answer:
          "They can be useful, but they need powerful access. Choose one with narrow host permissions, a clear policy and a trustworthy publisher.",
      },
    ],
    related: [
      "chrome-permissions-checker",
      "chrome-extension-reading-all-sites-permission",
      "does-this-extension-track-me",
      "manifest-v3-permissions-list-explained",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "manifest-v2-vs-v3-security-differences",
    cluster: "privacy-guide",
    hub: "browser-extension-privacy-guide",
    primaryKeyword: "manifest v2 vs v3 security differences",
    intent: "comparison",
    title: "Manifest V2 vs V3 Security Differences",
    metaTitle: "Manifest V2 vs V3 Security Differences - What Changed",
    description:
      "Compare Manifest V2 and V3 security: background execution, host permissions, remote code, CSP, network rules and what still requires review.",
    h1: "Manifest V2 vs V3 security differences",
    answer:
      "Manifest V3 replaces persistent background pages with event-driven service workers, separates host permissions, restricts remote executable code and changes network interception. These changes reduce some attack surfaces, but permissions, content scripts, data collection and publisher trust still determine real privacy risk.",
    sections: [
      {
        heading: "What changed technically",
        body: [
          "V3 uses service workers that can be suspended, making state persistence explicit. Host permissions move to host_permissions. The default CSP disallows eval, and executable code must generally be bundled rather than fetched at runtime.",
          "Network interception shifts toward declarativeNetRequest rules instead of blocking webRequest in many cases. This changes capability and privacy in ways that depend on the extension's implementation.",
        ],
        table: {
          caption: "V2 versus V3",
          headers: ["Area", "Manifest V2", "Manifest V3"],
          rows: [
            ["Background", "Persistent page possible", "Event-driven service worker"],
            ["Host permissions", "Commonly in permissions", "Separate host_permissions"],
            ["Remote code", "Looser historical rules", "Executable code generally bundled"],
            ["CSP", "String policy", "Object policy, stricter default"],
            ["Request blocking", "webRequestBlocking", "declarativeNetRequest"],
            ["Browser support", "Legacy, being removed", "Current Chromium model"],
          ],
        },
        links: [
          { label: "service worker vs background page", slug: "chrome-extension-service-worker-vs-background-page" },
          { label: "extension CSP", slug: "extension-csp-manifest-v3-explained" },
        ],
      },
      {
        heading: "What did not change",
        body: [
          "V3 does not remove host permissions, cookies, history, debugger, nativeMessaging or content scripts. A V3 extension can still request all_urls and read page content where it runs. It can still send data to external servers.",
          "A V2 extension can be carefully designed and transparent. The manifest version is a platform fact, not a safety rating.",
        ],
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "are Chrome extensions safe", slug: "are-chrome-extensions-safe" },
        ],
      },
      {
        heading: "What to review in either version",
        body: [
          "Check host access, content scripts, sensitive API permissions, external domains, remote code indicators and the update URL. Review the CSP for relaxations. Re-check after major updates.",
        ],
        callout:
          "Do not treat V3 as a certification. Evaluate the specific package, not only its manifest version.",
      },
    ],
    faqs: [
      {
        question: "Is Manifest V3 more secure than V2?",
        answer:
          "It reduces some risks, especially remote executable code and persistent background pages. It does not eliminate broad permissions, data collection or content-script access.",
      },
      {
        question: "Does V3 block all remote code?",
        answer:
          "It restricts executable remote code and tightens CSP, but rules and exceptions vary by browser. Static review remains necessary.",
      },
      {
        question: "Why do some extensions still use V2?",
        answer:
          "They may rely on blocking webRequest, legacy APIs or older build systems. Chromium browsers have been phasing V2 out, so compatibility is shrinking.",
      },
    ],
    related: [
      "chrome-extension-service-worker-vs-background-page",
      "extension-csp-manifest-v3-explained",
      "browser-extension-privacy-guide",
      "extension-javascript-behavior-analyzer",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: false,
  },
  {
    kind: "keyword",
    slug: "how-to-audit-an-extension-before-install",
    cluster: "privacy-checker",
    hub: "browser-extension-privacy-checker",
    primaryKeyword: "how to audit an extension before install",
    intent: "guide",
    title: "How to Audit an Extension Before Install",
    metaTitle: "How to Audit an Extension Before Install - Step by Step",
    description:
      "A step-by-step extension audit before installation: publisher checks, manifest review, permissions, code findings, domains and risk decisions.",
    h1: "How to audit an extension before install",
    answer:
      "To audit an extension before installing, identify the publisher, obtain the package, inspect the manifest, separate API permissions from website access, review content scripts and code findings, check external domains, and compare the result with the feature you need. No single step proves safety, but together they reduce uncertainty.",
    sections: [
      {
        heading: "Step 1: verify the publisher",
        body: [
          "Check the store listing for a real developer website, a support address and a privacy policy. Search for the extension name outside the store to see whether the publisher has an established presence.",
          "Be cautious with clones, recently renamed extensions and listings that copy another product's description. Ownership changes are a known risk for popular extensions.",
        ],
        links: [
          { label: "are Chrome extensions safe", slug: "are-chrome-extensions-safe" },
          { label: "privacy checker", slug: "browser-extension-privacy-checker" },
        ],
      },
      {
        heading: "Step 2: inspect the package",
        body: [
          "Obtain the CRX, XPI or ZIP, then upload it to a static analyzer. Review the manifest version, required and optional permissions, host permissions and content scripts. Then read the code findings and domain list.",
          "Use the report's file and line references to spot-check the most important findings. If a high-severity finding appears in a bundled library, note the context before drawing conclusions.",
        ],
        steps: [
          { title: "Identify the package", body: "Download the exact file you would install or use an official store URL." },
          { title: "Read the manifest", body: "Check identity, version, permissions, hosts and background configuration." },
          { title: "Review code indicators", body: "Focus on dynamic code, remote scripts, cookies and messaging." },
          { title: "Review domains", body: "Check analytics, advertising and unknown hosts against the privacy policy." },
          { title: "Decide and monitor", body: "Install only if the exposure is acceptable, then re-check after updates." },
        ],
        links: [
          { label: "CRX file analyzer", slug: "crx-file-analyzer-online-free" },
          { label: "extension permission analyzer", slug: "extension-permission-analyzer" },
        ],
      },
      {
        heading: "Step 3: judge proportionality and transparency",
        body: [
          "The central question is proportionality: does the access match the feature? A screenshot tool may need tab capture; a calculator should not need cookies. Transparency is the second question: does the publisher explain the data clearly?",
          "If the extension fails either test, look for an alternative or skip it. The cheapest privacy protection is not installing software you do not need.",
        ],
        callout:
          "An audit reduces risk; it does not certify safety. Behavior can change with updates and cannot be fully known from static inspection.",
      },
    ],
    faqs: [
      {
        question: "Do I need technical skills to audit an extension?",
        answer:
          "A static report makes the first pass accessible. Reading every line of code requires technical skill, but matching permissions to features and checking domains does not.",
      },
      {
        question: "How long does an audit take?",
        answer:
          "A basic scan takes seconds. Reviewing the findings and comparing them with the privacy policy can take a few minutes.",
      },
      {
        question: "Should I audit every extension update?",
        answer:
          "At least review permission changes and major versions. Smaller updates are lower risk but can still change data handling.",
      },
    ],
    related: [
      "browser-extension-privacy-checker",
      "is-this-chrome-extension-safe-to-install",
      "how-to-check-chrome-extension-permissions-before-installing",
      "are-chrome-extensions-safe",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "best-extension-permission-checker-tools",
    cluster: "privacy-checker",
    hub: "browser-extension-privacy-checker",
    primaryKeyword: "best extension permission checker tools",
    intent: "comparison",
    title: "Best Extension Permission Checker Tools: What to Look For",
    metaTitle: "Best Extension Permission Checker Tools - Selection Criteria",
    description:
      "Compare extension permission checker tools by accuracy, privacy, supported formats, explanations, evidence, exports and limits. No ranking guarantees.",
    h1: "Best extension permission checker tools",
    answer:
      "The best extension permission checker is one that reads the package, explains permissions in context, keeps your files private and shows evidence instead of a mystery score. Compare supported formats, host-permission analysis, code findings, export options and whether the tool executes uploaded code.",
    sections: [
      {
        heading: "Criteria that matter",
        body: [
          "A useful checker must go beyond the store summary. It should parse manifest.json, separate required, optional and host permissions, and reveal content-script patterns. It should also state its limits clearly.",
          "Privacy of the checker itself matters. Prefer local processing, no account requirement and a clear statement that uploaded code is never executed.",
        ],
        table: {
          caption: "Comparison criteria",
          headers: ["Criterion", "Why it matters"],
          rows: [
            ["Formats", "CRX, XPI, ZIP and manifest support"],
            ["Host analysis", "Shows which sites can be accessed"],
            ["Code evidence", "File and line references for findings"],
            ["Domain extraction", "Reveals potential endpoints"],
            ["Transparency", "Explains scoring and states limits"],
            ["Local processing", "Keeps the package on your device"],
            ["Exports", "JSON and PDF for records"],
          ],
        },
        links: [
          { label: "extension permission analyzer", slug: "extension-permission-analyzer" },
          { label: "add-on permission scanner", slug: "add-on-permission-scanner" },
        ],
      },
      {
        heading: "What this tool does differently",
        body: [
          "This analyzer processes packages in a Web Worker, never executes extension code, and reports required and optional permissions with host access separately. It adds static code findings, domain classification and a transparent six-category score with evidence.",
          "It supports Chrome CRX, Firefox XPI, ZIP packages and standalone manifests, with optional PDF and JSON exports. It does not claim to prove malicious behavior.",
        ],
        links: [
          { label: "browser extension privacy checker", slug: "browser-extension-privacy-checker" },
          { label: "how to audit an extension", slug: "how-to-audit-an-extension-before-install" },
        ],
      },
      {
        heading: "No ranking guarantees",
        body: [
          "Tool quality changes, and search rankings are not a safety evaluation. Test a checker with a package you understand and see whether its findings are accurate, specific and honest about uncertainty.",
        ],
        callout:
          "A permission checker is one input. Store review, publisher reputation and runtime testing answer different questions.",
      },
    ],
    faqs: [
      {
        question: "What is the best free extension permission checker?",
        answer:
          "There is no universal best. Evaluate whether it supports your package format, explains host access, shows evidence and processes files privately.",
      },
      {
        question: "Do permission checkers need my browser data?",
        answer:
          "A package analyzer does not. Be cautious with tools that ask you to sign in or grant access to your browser profile for a static scan.",
      },
      {
        question: "Can a checker tell me if an extension is malicious?",
        answer:
          "No static checker can guarantee that. It can identify capabilities and suspicious patterns, which you combine with other evidence.",
      },
    ],
    related: [
      "browser-extension-privacy-checker",
      "extension-permission-analyzer",
      "how-to-audit-an-extension-before-install",
      "are-chrome-extensions-safe",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "compare-chrome-extension-versions",
    cluster: "privacy-checker",
    hub: "browser-extension-privacy-checker",
    primaryKeyword: "compare chrome extension versions",
    intent: "guide",
    title: "How to Compare Chrome Extension Versions",
    metaTitle: "Compare Chrome Extension Versions - Permission Diff",
    description:
      "Compare two Chrome extension versions to see permission, host pattern, domain and code finding changes. Learn which update changes deserve a closer review.",
    h1: "How to compare Chrome extension versions",
    answer:
      "To compare Chrome extension versions, download both packages, inspect each manifest and code, then diff permissions, host patterns, content-script matches, external domains and code findings. Focus on capabilities that grew between versions, such as new cookies access or broad host patterns, and check whether the release notes explain them. A static diff shows change, not intent.",
    sections: [
      {
        heading: "Collect both packages",
        body: [
          "Keep the version you already reviewed and obtain the update. If the extension is installed, use the browser's extension page to find the version number, then download the matching CRX or unpacked package. For Firefox, download the XPI. Store both files together so the comparison is reproducible.",
          "A version diff is only meaningful when the two packages are the actual builds you are comparing. Mixing a store build with a developer ZIP can create false differences in minification, build flags or bundled dependencies.",
        ],
        list: [
          "Record the version number and release date for both packages",
          "Prefer the same distribution channel for both builds",
          "Keep the original files until the review is complete",
        ],
        links: [
          { label: "unpack a CRX without installing", slug: "unpack-crx-file-without-installing" },
          { label: "Firefox XPI analyzer", slug: "firefox-xpi-file-analyzer" },
        ],
      },
      {
        heading: "Diff the manifest first",
        body: [
          "The manifest is the fastest place to spot a capability change. Compare permissions, optional_permissions, host_permissions and content_scripts.matches. A new all_urls pattern or a new cookies permission is more consequential than a renamed action popup.",
          "Also check externally_connectable, web_accessible_resources and the content security policy. These fields control who can talk to the extension and what resources pages can reach.",
        ],
        table: {
          caption: "Manifest fields to compare",
          headers: ["Field", "What a change can mean"],
          rows: [
            ["permissions", "New browser API access"],
            ["host_permissions", "Broader website access"],
            ["content_scripts.matches", "Code injected into more pages"],
            ["externally_connectable", "New web page communication"],
            ["web_accessible_resources", "More resources exposed to pages"],
          ],
        },
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "content script matches", slug: "content-script-matches-patterns-explained" },
        ],
      },
      {
        heading: "Review code and domain changes",
        body: [
          "After the manifest, compare code findings and external domains. New remote script references, credential access, clipboard reads or raw IP endpoints deserve a closer look. A new analytics domain may be expected; an unexplained endpoint on a login page is harder to justify.",
          "Static analysis can flag bundled library code that the publisher did not write. Read the surrounding file and line before treating a finding as evidence of intent.",
        ],
        callout:
          "Treat a version diff as a focused review list. It narrows where to look; it does not replace reading the changed code.",
        links: [
          { label: "how to audit an extension", slug: "how-to-audit-an-extension-before-install" },
          { label: "check extension domains", slug: "check-what-domains-a-chrome-extension-connects-to" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I compare Chrome extension versions without installing them?",
        answer:
          "Yes. Download both packages and inspect them statically. You can compare manifests, code findings and domains without loading either version in a browser profile.",
      },
      {
        question: "What is the most important change in an extension update?",
        answer:
          "A new broad host permission or a new sensitive API permission is usually more important than a version bump. Check whether the release notes explain the feature that needs it.",
      },
      {
        question: "Does a new domain in an update mean the extension is unsafe?",
        answer:
          "Not by itself. A new domain may support a new feature or a changed backend. Review the code context and the publisher's privacy policy before deciding.",
      },
      {
        question: "Can a version diff detect a compromised update?",
        answer:
          "It can surface suspicious changes, but it cannot prove compromise. A compromised build may reuse existing permissions and domains, so runtime behavior and publisher communication still matter.",
      },
    ],
    related: [
      "browser-extension-privacy-checker",
      "how-to-audit-an-extension-before-install",
      "is-this-chrome-extension-safe-to-install",
      "chrome-extension-host-permissions-checker",
    ],
    lastReviewed: "2026-11-01",
    analyzerEmbed: true,
  },
];
