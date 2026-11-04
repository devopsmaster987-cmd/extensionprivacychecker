import type { ContentPage } from "../types";

export const tier5: ContentPage[] = [
  {
    kind: "keyword",
    slug: "tabs-vs-activetab-permission-difference",
    cluster: "permissions",
    hub: "chrome-permissions-checker",
    primaryKeyword: "tabs vs activeTab permission difference",
    intent: "question",
    title: "Tabs vs activeTab: Permission Difference Explained",
    metaTitle: "Tabs vs activeTab Permissions - Difference Explained",
    description:
      "The tabs permission watches every tab continuously; activeTab grants temporary access to the current tab after a click. Compare scope, trigger and risk.",
    h1: "Tabs vs activeTab permission difference",
    answer:
      "The tabs permission and activeTab differ in scope and trigger. tabs keeps a silent, ongoing view of every open tab's URLs and titles for as long as it is granted. activeTab grants temporary access to the current tab only, after an explicit user gesture such as clicking the toolbar button, and expires when you navigate or switch tabs.",
    sections: [
      {
        heading: "What each permission grants",
        body: [
          "The tabs permission exposes the url and title properties for all tabs in all windows, while the extension is running. It does not by itself read page content, but the browsing metadata alone reveals research topics, shopping and accounts.",
          "activeTab is a narrower alternative. It extends temporary host access to the tab the user interacted with, through an explicit gesture such as the toolbar click, a keyboard shortcut or the context menu.",
        ],
        table: {
          caption: "tabs vs activeTab at a glance",
          headers: ["Aspect", "tabs", "activeTab"],
          rows: [
            ["Scope", "All tabs in all windows", "The tab the user acted on"],
            ["Trigger", "Granted until revoked", "Explicit user gesture"],
            ["Page content", "No (metadata only)", "Yes, temporarily"],
            ["Expires", "No", "On navigation or tab switch"],
            ["Install prompt", "Listed as an API permission", "Not shown as a warning"],
          ],
        },
        links: [
          { label: "chrome permissions checker", slug: "chrome-permissions-checker" },
          { label: "extension permission analyzer", slug: "extension-permission-analyzer" },
        ],
      },
      {
        heading: "Which one signals more risk",
        body: [
          "tabs is a stronger privacy signal because it is continuous and silent: nothing is granted per visit and nothing expires. A utility that only counts open tabs could work with historical access models, so ask why the extension needs URLs persistently.",
          "activeTab is often a sign of good design, but it is not automatically harmless. Once granted, the extension can read or modify the current page, so the code still deserves review.",
        ],
        callout:
          "A narrow permission lowers exposure, but the behavior around it determines whether the access stays narrow.",
        links: [
          { label: "how to check permissions before installing", slug: "how-to-check-chrome-extension-permissions-before-installing" },
          { label: "content script matches explained", slug: "content-script-matches-patterns-explained" },
        ],
      },
      {
        heading: "How to check which one an extension uses",
        body: [
          "Open the package and read manifest.json. Both appear in the permissions array, so you need to look for the exact strings: tabs and activeTab. Compare the entry points that consume them, such as the background service worker or action popup.",
          "Store listings and the browser's permission prompts simplify all of this into short phrases, so the manifest remains the precise source.",
        ],
        list: [
          "Search manifest.json for tabs and activeTab",
          "Follow the code paths that consume tab metadata",
          "Compare the store prompt wording with the manifest",
        ],
        links: [
          { label: "view an extension manifest online", slug: "view-extension-manifest-json-online" },
          { label: "how to see what permissions an extension has", slug: "how-to-see-what-permissions-an-extension-has" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can an extension read page content with the tabs permission?",
        answer:
          "Not by itself. tabs exposes metadata such as URLs and titles. Reading or modifying page content requires host access, activeTab or content scripts.",
      },
      {
        question: "Is activeTab safer than tabs?",
        answer:
          "It is narrower: access is temporary, tied to a user gesture and expires on navigation. The extension can still read the current page while it lasts.",
      },
      {
        question: "Why does a timer extension want tabs?",
        answer:
          "Some genuine features need tab metadata, such as tab managers, session tools or a simple open-tab count. The question is whether the feature justifies continuous metadata access.",
      },
    ],
    related: [
      "chrome-permissions-checker",
      "extension-permission-analyzer",
      "how-to-check-chrome-extension-permissions-before-installing",
      "content-script-matches-patterns-explained",
    ],
    lastReviewed: "2026-11-04",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "native-messaging-permission-explained",
    cluster: "permissions",
    hub: "chrome-permissions-checker",
    primaryKeyword: "native messaging permission",
    intent: "reference",
    title: "Native Messaging Permission Explained",
    metaTitle: "Native Messaging Permission Explained - What It Allows",
    description:
      "The nativeMessaging permission lets an extension talk to a native desktop application. Learn how it works, what it enables and what to verify before trusting it.",
    h1: "Native messaging permission explained",
    answer:
      "The nativeMessaging permission lets an extension exchange messages with a native application installed on your computer, launched through a browser-configured host manifest. Because the native app runs outside the browser sandbox, this permission enables deep integrations such as password manager hooks, but it also creates a bridge between web content and desktop software. Verify which companion application the extension expects and whether the publisher explains why it is needed.",
    sections: [
      {
        heading: "How native messaging works",
        body: [
          "An extension sends a message to a named native host. The browser looks up a JSON manifest installed on the operating system, launches the registered executable and pipes JSON messages between the extension and the program. The host manifest explicitly allows communication with specific extensions.",
          "Because the native program runs with your user privileges, the permission can expose powerful desktop integrations that no ordinary API permission offers.",
        ],
        list: [
          "Native hosts are separate programs registered on your OS",
          "Communication is JSON messages, not raw shell access",
          "Developers install the host manifest outside the browser",
          "One host manifest can allow specific extensions only",
        ],
        links: [
          { label: "manifest V3 permissions list explained", slug: "manifest-v3-permissions-list-explained" },
          { label: "Chrome permissions checker", slug: "chrome-permissions-checker" },
        ],
      },
      {
        heading: "Why it deserves a closer look",
        body: [
          "The extension itself stays sandboxed, but the program it talks to does not. A compromised or lazy native host can turn messages into actions outside the browser, and the browser permission prompt says nothing about what that program does.",
          "Legitimate users of nativeMessaging include password managers, antivirus plugins and enterprise device integrations. The capability is proportionate there because the companion software is the product.",
        ],
        callout:
          "The permission describes a channel. The security of the channel depends on the native program at the other end.",
        links: [
          { label: "extension permission analyzer", slug: "extension-permission-analyzer" },
          { label: "externally_connectable explained", slug: "extension-externally-connectable-explained" },
        ],
      },
      {
        heading: "How to verify the pairing",
        body: [
          "Read the manifest to confirm nativeMessaging is requested, then look in the code for the native host name it connects to. Check whether the publisher documents the companion application and whether that application is signed and distributed by the same publisher.",
          "If an update changes or adds a native host name, treat it like a new endpoint: compare versions and read the release notes before accepting the change.",
        ],
        list: [
          "Find the nativeMessaging entry in manifest.json",
          "Search the code for the host name string",
          "Check the publisher's documentation for the companion app",
        ],
        links: [
          { label: "check Chrome extension source code", slug: "check-chrome-extension-source-code" },
          { label: "compare Chrome extension versions", slug: "compare-chrome-extension-versions" },
        ],
      },
    ],
    faqs: [
      {
        question: "Does nativeMessaging give an extension shell access?",
        answer:
          "Not directly. The extension exchange JSON messages with the native host. What the host does with those messages depends on that program, outside the browser's control.",
      },
      {
        question: "Why do password managers use native messaging?",
        answer:
          "To integrate with desktop applications, biometric prompts and system credential services. The companion program is part of the product, so the pairing is usually documented.",
      },
      {
        question: "Can I use an extension with nativeMessaging safely?",
        answer:
          "Yes, if the companion application is trusted, signed and from the same publisher, and the feature genuinely needs desktop integration.",
      },
    ],
    related: [
      "extension-permission-analyzer",
      "manifest-v3-permissions-list-explained",
      "extension-externally-connectable-explained",
      "chrome-permissions-checker",
    ],
    lastReviewed: "2026-11-04",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "chrome-extension-site-access-on-click",
    cluster: "permissions",
    hub: "chrome-permissions-checker",
    primaryKeyword: "chrome extension site access on click",
    intent: "guide",
    title: "Chrome Extension Site Access: On Click Explained",
    metaTitle: "Chrome Extension Site Access: On Click - Explained",
    description:
      "Chrome's runtime site access setting controls where extension code runs. Learn what On click, On specific sites and On all sites actually change.",
    h1: "Chrome extension site access: on click explained",
    answer:
      "Chrome extension site access settings decide where an extension's content scripts can run. On click grants access to a tab only after you click the extension's icon; On specific sites limits access to the hosts you add; On all sites allows every page. Lower site access constrains what code runs on each page without removing the capabilities declared in the manifest.",
    sections: [
      {
        heading: "The three runtime choices",
        body: [
          "The setting lives in the extension's details page under Site access and controls host access at runtime, separately from what the manifest requests. Chrome remembers your choice per extension.",
          "On all sites matches a broad host permission; On specific sites and On click narrow it. Some extensions offer these choices in their own options page instead, or rely on user-gesture access only.",
        ],
        table: {
          caption: "Runtime site access options",
          headers: ["Option", "What happens"],
          rows: [
            ["On click", "Content scripts run only after you click the icon"],
            ["On specific sites", "Runs only on hosts you explicitly add"],
            ["On all sites", "Runs on every page the browser opens"],
          ],
        },
        links: [
          { label: "chrome permissions checker", slug: "chrome-permissions-checker" },
          { label: "extension website access inspector", slug: "extension-website-access-inspector" },
        ],
      },
      {
        heading: "What it limits and what it does not",
        body: [
          "Site access narrows where content scripts execute. API permissions such as history, downloads or webRequest are not addressed by this setting, and a service worker can still receive events like browser update or alarm events.",
          "Extensions that actively need per-page code, such as translators or page annotators, may work poorly on On click because their interface only activates after a click. Test the feature you actually use.",
        ],
        callout:
          "Runtime site access is a control, not a verdict. It limits exposure; the manifest still lists what the extension could do.",
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "chrome host permissions checker", slug: "chrome-extension-host-permissions-checker" },
        ],
      },
      {
        heading: "A sensible habit",
        body: [
          "Set site access to On click or On specific sites unless the extension genuinely works across the web, such as an ad blocker or a password manager filling forms everywhere.",
          "After an update, revisit the details page: if the publisher adds a new host requirement, Chrome may show a new prompt and it deserves the same review as any other capability change.",
        ],
        list: [
          "Default new extensions to On click and raise only when needed",
          "Re-check site access after every significant update",
          "Compare the runtime choice with the manifest's host permissions",
        ],
        links: [
          { label: "how to see what permissions an extension has", slug: "how-to-see-what-permissions-an-extension-has" },
          { label: "compare Chrome extension versions", slug: "compare-chrome-extension-versions" },
        ],
      },
    ],
    faqs: [
      {
        question: "Does On click remove the extension's broad host permission?",
        answer:
          "No. The manifest still declares the capability. On click pauses the runtime use of that access until you interact with the extension on a tab.",
      },
      {
        question: "Why does an extension break on On click?",
        answer:
          "Features that inject code into pages as you browse need the page to be matched automatically. With On click, nothing runs until you click the icon, so automatic features stop working.",
      },
      {
        question: "Is On specific sites the most private option?",
        answer:
          "For most people, yes. It limits content scripts to hosts you approve. Some features genuinely need wider access, so pick the narrowest choice that keeps the feature working.",
      },
    ],
    related: [
      "what-does-all-urls-permission-mean",
      "chrome-extension-host-permissions-checker",
      "how-to-see-what-permissions-an-extension-has",
      "extension-website-access-inspector",
    ],
    lastReviewed: "2026-11-04",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "audit-installed-chrome-extensions",
    cluster: "privacy-checker",
    hub: "browser-extension-privacy-checker",
    primaryKeyword: "audit installed chrome extensions",
    intent: "guide",
    title: "How to Audit Installed Chrome Extensions",
    metaTitle: "Audit Installed Chrome Extensions - Step by Step",
    description:
      "A practical audit of the extensions already running in your browser: review manifests, host access, code indicators and remove what no longer earns its runtime cost.",
    h1: "How to audit installed Chrome extensions",
    answer:
      "Auditing installed Chrome extensions starts from chrome://extensions, where you enable developer mode, review each extension's details and open its manifest and service worker. Compare permission lists, host access and external domains against the features you actually use, remove anything dormant, and compare updated packages against older builds to spot silent capability growth.",
    sections: [
      {
        heading: "Inventory what you have",
        body: [
          "List every extension, including those disabled or off-managed by policy. An inactive extension usually still has permissions and can be updated by the browser, so dormant does not mean harmless.",
          "For each item, note what it does, when you last used it and its store origin. Split the list into daily tools, occasional tools and everything else.",
        ],
        list: [
          "Open chrome://extensions and enable developer mode",
          "Record last-used date and store origin per extension",
          "Mark anything unused for removal",
        ],
        links: [
          { label: "chrome extension safety check", slug: "chrome-extension-safety-check" },
          { label: "browser extension privacy checker", slug: "browser-extension-privacy-checker" },
        ],
      },
      {
        heading: "Inspect capabilities and evidence",
        body: [
          "Read manifest.json for permissions, optional permissions, host access and content scripts. Then check external domains and code indicators, which a manifest alone never shows.",
          "Prioritize extensions that combine sensitive capabilities with vague features: continuous access to every page, credential or clipboard patterns, or endpoints that do not match the publisher.",
        ],
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "extension data collection checker", slug: "extension-data-collection-checker" },
        ],
      },
      {
        heading: "Decide, then maintain the hygiene",
        body: [
          "Remove extensions without a clear recent purpose. For keepers, align runtime site access with the feature you use, decline optional permissions when prompted casually, and re-check after significant updates.",
          "Repeat the audit on a schedule, such as quarterly. Extension risk is not a one-time decision: the store listing you reviewed at install time does not constrain a future update.",
        ],
        callout:
          "The best audit result is a shorter list. Fewer extensions mean less attack surface and a faster, more private browser.",
        links: [
          { label: "compare Chrome extension versions", slug: "compare-chrome-extension-versions" },
          { label: "browser extension privacy guide", slug: "browser-extension-privacy-guide" },
        ],
      },
    ],
    faqs: [
      {
        question: "How often should I audit installed extensions?",
        answer:
          "Quarterly is a reasonable default for personal use, plus an immediate review after any major update to a high-privilege extension.",
      },
      {
        question: "Are disabled extensions safe?",
        answer:
          "They do not run content scripts while disabled, but they can still be updated and may retain permissions that apply again the moment you re-enable them.",
      },
      {
        question: "Can I export an audit report?",
        answer:
          "With this analyzer, each package report can be exported as JSON or PDF, so you can keep dated records of what you reviewed.",
      },
      {
        question: "How do I audit extensions managed by my organization?",
        answer:
          "Managed extensions may show a policy notice and cannot be removed. Ask your IT department for the policy list and review what data flows outside your control.",
      },
    ],
    related: [
      "chrome-extension-safety-check",
      "how-to-see-what-permissions-an-extension-has",
      "compare-chrome-extension-versions",
      "browser-extension-privacy-guide",
    ],
    lastReviewed: "2026-11-04",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "chrome-web-store-privacy-practices-explained",
    cluster: "privacy-checker",
    hub: "browser-extension-privacy-checker",
    primaryKeyword: "chrome web store privacy practices",
    intent: "reference",
    title: "Chrome Web Store Privacy Practices Tab Explained",
    metaTitle: "Chrome Web Store Privacy Practices Tab - Explained",
    description:
      "What each section of the Chrome Web Store privacy practices tab means, how the disclosures relate to declared data types, and their limits.",
    h1: "Chrome Web Store privacy practices tab explained",
    answer:
      "The Chrome Web Store privacy practices tab shows the data types a publisher declares they collect or use, why each is handled, and whether data collection is optional, shared or tied to your identity. The disclosures are publisher declarations rather than measurements, so treat them as a starting question and compare the declared categories against what the package's permissions and code actually allow.",
    sections: [
      {
        heading: "What the tab shows",
        body: [
          "The privacy practices tab lists declared data types such as location, identifiers, user activity and communications, each with a featured reason like app functionality, analytics or advertising. Labels can state that data is shared with third parties, collected by third parties or linked to an identity.",
          "Publishers answer a standardized questionnaire when they submit or update the listing; the tab renders those answers.",
        ],
        links: [
          { label: "is this Chrome extension safe", slug: "is-this-chrome-extension-safe-to-install" },
          { label: "extension data collection checker", slug: "extension-data-collection-checker" },
        ],
      },
      {
        heading: "How the disclosure relates to the package",
        body: [
          "A declaration that data is not collected should be consistent with the package: extensions that declare no user activity collection usually should not depend on webRequest-heavy reading, analytics endpoints or behavioral advertising domains.",
          "Conversely, a scary-sounding declaration does not confirm misuse. A password manager correctly declares credentials it stores. The comparison between declared purpose and declared capability is where review starts.",
        ],
        callout:
          "The tab describes intent. The manifest and code describe capability. Disagreement between the two is the signal worth chasing.",
        links: [
          { label: "browser extension tracking analysis", slug: "browser-extension-tracking-analysis" },
          { label: "does this extension track me", slug: "does-this-extension-track-me" },
        ],
      },
      {
        heading: "Limits to keep in mind",
        body: [
          "The questionnaire is self-reported and reviewable only by the store, not by you. It does not timestamp changes, and it can lag behind a package that already updated.",
          "Use the tab as one input alongside publisher reputation, the privacy policy and static analysis of the package itself. If declarations change after an update, re-check the package diff.",
        ],
        list: [
          "Declarations are not measurements",
          "No package-level diff is shown by the store",
          "Changed data types after update deserve a package review",
        ],
        links: [
          { label: "compare Chrome extension versions", slug: "compare-chrome-extension-versions" },
          { label: "browser extension privacy guide", slug: "browser-extension-privacy-guide" },
        ],
      },
    ],
    faqs: [
      {
        question: "Who writes the privacy practices tab?",
        answer:
          "The publisher, by answering the Chrome Web Store privacy questionnaire. The store renders the answers; it does not verify them against behavior.",
      },
      {
        question: "Can a no-data declaration be wrong?",
        answer:
          "Yes. Declarations can be incomplete or stale. Compare the declaration with the package's permissions, content scripts and external domains.",
      },
      {
        question: "Does a collected-data declaration mean the extension is not private?",
        answer:
          "No. It means the publisher discloses a data type. Evaluate whether the declared purpose is proportionate to the feature.",
      },
    ],
    related: [
      "is-this-chrome-extension-safe-to-install",
      "check-what-domains-a-chrome-extension-connects-to",
      "browser-extension-privacy-guide",
      "extension-data-collection-checker",
    ],
    lastReviewed: "2026-11-04",
    analyzerEmbed: true,
  },
  {
    kind: "keyword",
    slug: "safari-web-extension-privacy-check",
    cluster: "privacy-checker",
    hub: "browser-extension-privacy-checker",
    primaryKeyword: "safari web extension privacy check",
    intent: "analyzer",
    title: "Safari Web Extension Privacy Check: Inspect the Package",
    metaTitle: "Safari Web Extension Privacy Check - Inspect Packages",
    description:
      "Run a Safari web extension privacy check on the WebExtension manifest inside the app bundle: permissions, host access, content scripts and code indicators.",
    h1: "Safari web extension privacy check",
    answer:
      "A Safari web extension privacy check inspects the WebExtension manifest bundled inside the app extension resources. Safari uses the same manifest model as Chrome, so permissions, host access and content scripts are comparable across browsers. The check shows declared capabilities and static indicators; it cannot observe what the extension does at runtime or prove that a permission was used.",
    sections: [
      {
        heading: "Where the manifest lives",
        body: [
          "A Safari web extension is shipped inside an app bundle. The extension resources folder contains manifest.json, the JavaScript bundles and the icon and locale files, following the same WebExtensions conventions as Chrome and Firefox.",
          "On macOS, the App Store review layer can add a review trail, but the review focuses on store policy, not on a semantic promise that the extension never reads page content.",
        ],
        links: [
          { label: "view an extension manifest online", slug: "view-extension-manifest-json-online" },
          { label: "Chrome extension inspector online", slug: "chrome-extension-inspector-online" },
        ],
      },
      {
        heading: "What the check covers",
        body: [
          "Treat it like any browser extension: read the manifest, compare requested permissions with the feature, look at content script patterns, then check code indicators such as remote script references or obfuscation.",
          "Safari-specific details matter at the edges: some APIs are unavailable or named differently, and the same genuine capability in a manifest may work differently on this platform.",
        ],
        list: [
          "Permissions and optional permissions",
          "Host access and content script matches",
          "External domains and remote script references",
          "Update behavior and publisher pairing",
        ],
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "chrome host permissions checker", slug: "chrome-extension-host-permissions-checker" },
        ],
      },
      {
        heading: "Practical limits",
        body: [
          "App Store badges and signed builds answer who distributed the package, not what it can access or who funded it. The package and publisher remain the two main evidence sources.",
          "Compare manifest versions across the app history when the extension updates. A capability growth inside an app bundle can be as quiet as any other store update.",
        ],
        callout:
          "A signed app is a distribution guarantee. The manifest still tells you what the code is capable of.",
        links: [
          { label: "Firefox add-on privacy checker", slug: "firefox-addon-privacy-checker" },
          { label: "how to audit an extension before install", slug: "how-to-audit-an-extension-before-install" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I check a Safari extension without installing the app?",
        answer:
          "Usually yes. The extension resources live inside the app bundle, so you can inspect its manifest and code locally without installing or enabling the extension.",
      },
      {
        question: "Is a Mac App Store extension safer?",
        answer:
          "Not automatically. Review checks policy and distribution; privacy depends on what the extension's manifest and code actually access.",
      },
      {
        question: "Do Safari extensions use CRX files?",
        answer:
          "No. Safari web extensions use standard WebExtension folders inside an app bundle rather than CRX files, though the manifest format is familiar.",
      },
      {
        question: "How does the privacy check differ from Chrome?",
        answer:
          "The method is the same static review. API availability and platform defaults differ, so compare the manifest fields this browser honors.",
      },
    ],
    related: [
      "firefox-addon-privacy-checker",
      "edge-extension-permission-checker",
      "extension-permission-analyzer",
      "how-to-audit-an-extension-before-install",
    ],
    lastReviewed: "2026-11-04",
    analyzerEmbed: true,
  },
];
