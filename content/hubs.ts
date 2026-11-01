import type { ContentPage } from "./types";

export const hubs: ContentPage[] = [
  {
    kind: "hub",
    slug: "browser-extension-privacy-checker",
    cluster: "privacy-checker",
    hub: null,
    primaryKeyword: "browser extension privacy checker",
    intent: "analyzer",
    title: "Browser Extension Privacy Checker: Inspect Before You Install",
    metaTitle: "Browser Extension Privacy Checker - Free Static Analysis",
    description:
      "Use a free browser extension privacy checker to inspect permissions, website access, external domains and code indicators before installing an add-on.",
    h1: "Browser extension privacy checker",
    answer:
      "A browser extension privacy checker inspects an extension package without running it. It reads the manifest, permissions, host access and JavaScript references, then explains what the extension could access and which privacy signals deserve attention. A report describes exposure and evidence, not proof of malicious behavior.",
    sections: [
      {
        heading: "What this checker examines",
        body: [
          "The analyzer unpacks a CRX, XPI, ZIP or manifest.json file in an isolated worker and reads the package as data. It summarizes the manifest version, declared permissions, host permissions, content scripts, background scripts, externally_connectable settings, web-accessible resources and the content security policy.",
          "It then scans JavaScript and HTML for static indicators such as eval, remote script references, storage APIs, messaging APIs, DOM injection and cookie access. Referenced domains are extracted and grouped by category.",
        ],
        links: [
          { label: "how to audit an extension before install", slug: "how-to-audit-an-extension-before-install" },
          { label: "are Chrome extensions safe", slug: "are-chrome-extensions-safe" },
          { label: "what a CRX package contains", slug: "crx3-file-format-structure" },
        ],
      },
      {
        heading: "Why permissions matter more than store ratings",
        body: [
          "Store ratings reflect user satisfaction, not data access. A small utility can request broad host access for a legitimate feature, while a popular extension can quietly collect more than its description suggests. The permission list is the most reliable public description of what an extension is allowed to reach.",
          "The checker explains each permission and separates website access from API access. That distinction helps you see whether an extension can read every page you visit or only a specific service.",
        ],
        links: [
          { label: "how to check Chrome extension permissions", slug: "how-to-check-chrome-extension-permissions-before-installing" },
          { label: "what does the all_urls permission mean", slug: "what-does-all-urls-permission-mean" },
        ],
      },
      {
        heading: "How to read the risk score",
        body: [
          "The 0-100 score combines six categories with fixed weights: permission exposure, website access, data collection indicators, remote code indicators, external domain exposure and obfuscation. Every category shows its evidence and contribution.",
          "A high score is a prompt to investigate, not a malware verdict. Legitimate debugging tools, password managers and accessibility extensions often score higher because they need powerful capabilities. A low score cannot guarantee safety either, because static analysis sees references rather than runtime behavior.",
        ],
        links: [
          { label: "does this extension track me", slug: "does-this-extension-track-me" },
          { label: "best extension permission checker tools", slug: "best-extension-permission-checker-tools" },
          { label: "extension risk score explained", slug: "extension-risk-score-explained" },
          { label: "Chrome extension safety check", slug: "chrome-extension-safety-check" },
        ],
      },
      {
        heading: "What static analysis cannot prove",
        body: [
          "Static inspection cannot show whether a network request actually happened, whether a server returned code that was later executed, or whether a permission was used against your account. Code loaded remotely after installation may never appear in the package you scanned.",
          "Use the report together with the publisher's identity, the store listing, the extension's update history and your own tolerance for risk. If you are unsure, disable the extension when you do not need it.",
        ],
        callout:
          "A referenced domain or API is a capability, not evidence of data collection. Treat every automated finding as a question to investigate.",
        links: [
          { label: "browser extension malware scanner", slug: "browser-extension-malware-scanner" },
          { label: "Chrome extension safety check", slug: "chrome-extension-safety-check" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is this browser extension privacy checker free?",
        answer:
          "Yes. The analyzer, the report and the JSON/PDF exports are free and do not require an account. Files are processed in your browser, not uploaded to us.",
      },
      {
        question: "Does it install or run the extension?",
        answer:
          "No. The package is parsed as data in a Web Worker. JavaScript is inspected with a static parser and is never executed, imported or passed to eval.",
      },
      {
        question: "Which file types can I upload?",
        answer:
          "Chrome CRX, Firefox XPI, ZIP packages containing an extension, and a standalone manifest.json file. The maximum upload size is 25 MB.",
      },
      {
        question: "Can it tell me if an extension is spying on me?",
        answer:
          "It can show which data-access capabilities and code patterns exist. It cannot prove that data was collected or sent. That limitation is stated throughout the report.",
      },
    ],
    related: [
      "how-to-audit-an-extension-before-install",
      "what-does-all-urls-permission-mean",
      "check-what-domains-a-chrome-extension-connects-to",
      "does-this-extension-track-me",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "hub",
    slug: "crx-package-analyzer",
    cluster: "crx",
    hub: null,
    primaryKeyword: "CRX package analyzer",
    intent: "analyzer",
    title: "CRX Package Analyzer: Inspect a Chrome Extension File",
    metaTitle: "CRX Package Analyzer - Inspect Chrome Extensions Online",
    description:
      "Open a CRX package online to inspect its manifest, permissions, scripts and referenced domains without installing the Chrome extension.",
    h1: "CRX package analyzer",
    answer:
      "A CRX package analyzer opens the file format used by Chrome extensions, removes the signature header and reads the embedded ZIP archive. You can see the manifest, permissions, scripts and domains without installing anything. The analyzer never runs extension code, so suspicious JavaScript is inspected rather than executed.",
    sections: [
      {
        heading: "What a CRX file contains",
        body: [
          "A CRX file is a ZIP archive with a header that carries the CRX version, a signed header and, in CRX2, a public key and signature. The extension itself is stored as ordinary ZIP entries: manifest.json, background or service-worker files, content scripts, HTML, images and other assets.",
          "The analyzer validates the header boundaries and then treats the ZIP payload with the same limits as a normal upload. It never trusts file paths or declared sizes.",
        ],
        links: [
          { label: "CRX3 file format structure", slug: "crx3-file-format-structure" },
          { label: "unpack a CRX file without installing", slug: "unpack-crx-file-without-installing" },
        ],
      },
      {
        heading: "What the report shows",
        body: [
          "The report starts with the extension name, version, manifest version and browser compatibility. It then lists required and optional permissions, host access, content scripts, background configuration and content security policy.",
          "A code section shows static findings with file, line, severity and confidence. A domain section groups every referenced host as analytics, advertising, authentication, error reporting, cloud or unknown.",
        ],
        links: [
          { label: "CRX file analyzer online free", slug: "crx-file-analyzer-online-free" },
          { label: "view an extension manifest online", slug: "view-extension-manifest-json-online" },
        ],
      },
      {
        heading: "Using a CRX analyzer safely",
        body: [
          "Only open files you obtained deliberately, either from a store or from a publisher you trust. Treat the analysis as one input: an unsigned or side-loaded CRX may keep changing outside the store review process.",
          "If a store blocks automatic retrieval, download the package from the store page or ask the publisher for the build. Uploading the file gives you the same static report without bypassing store controls.",
        ],
        steps: [
          { title: "Choose the CRX file", body: "Drag it onto the analyzer or select it from your device." },
          { title: "Wait for unpacking", body: "The header is validated and ZIP limits are applied." },
          { title: "Review permissions first", body: "Broad host access and powerful APIs define the extension's reach." },
          { title: "Check findings and domains", body: "Use the evidence and file references to decide what to investigate." },
        ],
        callout:
          "A CRX signature proves that the file was signed with a key. It does not prove that the code is safe or that the publisher is trustworthy.",
      },
    ],
    faqs: [
      {
        question: "Can I open a CRX file without installing it?",
        answer:
          "Yes. This analyzer reads the CRX header and inspects the ZIP entries in your browser. Nothing is installed and no extension code is executed.",
      },
      {
        question: "Does a verified CRX signature mean the extension is safe?",
        answer:
          "No. A signature ties the package to a key. It does not evaluate intent, data collection or the safety of the code.",
      },
      {
        question: "Why does the analyzer ask me to upload a CRX?",
        answer:
          "Store URLs are supported where official retrieval works. When a store blocks automated downloads, you can download the package in your browser and upload the file.",
      },
      {
        question: "Are large CRX files supported?",
        answer:
          "The upload limit is 25 MB. Archive entries and decompressed size are also capped to prevent excessive memory use and ZIP bombs.",
      },
    ],
    related: [
      "crx-file-analyzer-online-free",
      "crx3-file-format-structure",
      "unpack-crx-file-without-installing",
      "view-extension-manifest-json-online",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "hub",
    slug: "extension-manifest-viewer",
    cluster: "manifest",
    hub: null,
    primaryKeyword: "extension manifest viewer",
    intent: "analyzer",
    title: "Extension Manifest Viewer: Read manifest.json in Plain Language",
    metaTitle: "Extension Manifest Viewer - Manifest V2 and V3 Explained",
    description:
      "View an extension manifest online. See manifest version, permissions, host permissions, content scripts, background scripts, CSP and update URL.",
    h1: "Extension manifest viewer",
    answer:
      "An extension manifest viewer parses manifest.json and explains its fields without requiring the extension to be installed. It shows Manifest V2 or V3, required and optional permissions, host permissions, content scripts, background behavior, externally_connectable, web-accessible resources and content security policy.",
    sections: [
      {
        heading: "The manifest is the extension's public contract",
        body: [
          "manifest.json declares the extension's name, version, entry points and capabilities. Browsers read it before any extension code runs. If a permission is not declared, the extension generally cannot use the matching API without asking the user later.",
          "Reading the manifest is usually faster and more reliable than guessing from the store description. The viewer highlights broad host access and powerful APIs such as debugger, nativeMessaging, proxy and cookies.",
        ],
        links: [
          { label: "Manifest V3 permissions list explained", slug: "manifest-v3-permissions-list-explained" },
          { label: "extension CSP in Manifest V3", slug: "extension-csp-manifest-v3-explained" },
        ],
      },
      {
        heading: "Fields the viewer explains",
        body: [
          "The viewer separates fields by purpose: identity, permissions, page access, background execution and communication. Nested fields are summarized instead of dumping raw JSON in your face.",
          "Externally_connectable and web_accessible_resources are often overlooked. They describe which websites can message the extension or load its files. The viewer marks broad values so you can review them.",
        ],
        list: [
          "Manifest version and browser compatibility",
          "Required and optional API permissions",
          "Host permissions and content-script matches",
          "Background service worker, scripts or page",
          "Content Security Policy and update URL",
          "Externally connectable origins and web-accessible resources",
        ],
        links: [
          { label: "externally_connectable explained", slug: "extension-externally-connectable-explained" },
          { label: "web-accessible resources security", slug: "extension-web-accessible-resources-security" },
        ],
      },
      {
        heading: "Manifest V2 and Manifest V3 side by side",
        body: [
          "Manifest V3 replaces persistent background pages with service workers, moves host permissions into a separate field and restricts remote code. Manifest V2 extensions still exist, especially outside the Chrome Web Store, but Chromium browsers have been phasing them out.",
          "The viewer reports the manifest version and adds contextual notes instead of assuming that one version is automatically safer. Migration quality depends on how the publisher implements the new model.",
        ],
        table: {
          caption: "Manifest versions at a glance",
          headers: ["Area", "Manifest V2", "Manifest V3"],
          rows: [
            ["Background", "Page or scripts", "Service worker or scripts"],
            ["Host access", "Often inside permissions", "Separate host_permissions field"],
            ["Remote code", "Historically more permissive", "Executable code must be bundled"],
            ["Network rules", "webRequestBlocking", "declarativeNetRequest"],
          ],
        },
        callout:
          "A manifest field can be valid and still be privacy-relevant. The viewer explains the field; it does not certify the publisher.",
      },
    ],
    faqs: [
      {
        question: "Can I view manifest.json without installing the extension?",
        answer:
          "Yes. Upload the CRX, XPI, ZIP or the manifest file itself. The viewer parses it in your browser and never installs anything.",
      },
      {
        question: "What is the difference between permissions and host_permissions?",
        answer:
          "Permissions grant API access such as storage or tabs. host_permissions grant access to website URLs. Many extensions need both.",
      },
      {
        question: "Why is a manifest field missing?",
        answer:
          "Different browsers and manifest versions use different fields. The viewer marks missing required values as warnings instead of inventing them.",
      },
      {
        question: "Does the viewer validate the manifest schema?",
        answer:
          "It checks expected types and common fields, and reports schema issues. It is not an official browser validator and does not guarantee store acceptance.",
      },
    ],
    related: [
      "manifest-v3-permissions-list-explained",
      "view-extension-manifest-json-online",
      "extension-externally-connectable-explained",
      "extension-csp-manifest-v3-explained",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "hub",
    slug: "chrome-permissions-checker",
    cluster: "permissions",
    hub: null,
    primaryKeyword: "Chrome permissions checker",
    intent: "analyzer",
    title: "Chrome Permissions Checker: Understand Every Extension Permission",
    metaTitle: "Chrome Permissions Checker - Explain Extension Permissions",
    description:
      "Check Chrome extension permissions in plain language. See required, optional and host permissions, broad access warnings and what each permission allows.",
    h1: "Chrome permissions checker",
    answer:
      "A Chrome permissions checker lists the APIs and websites an extension can access and explains each one in plain language. It separates required permissions from optional ones and flags broad host access such as all_urls. Powerful permissions are not automatically malicious, but they define the extension's maximum reach.",
    sections: [
      {
        heading: "Required versus optional permissions",
        body: [
          "Required permissions are granted at install time. Optional permissions must be requested later and may be refused by the user. A good extension asks for the minimum required access and requests optional capabilities only when a feature needs them.",
          "The checker labels each permission as required or optional so you can see which capabilities were forced by installation.",
        ],
        links: [
          { label: "how to check permissions before installing", slug: "how-to-check-chrome-extension-permissions-before-installing" },
          { label: "how to see what permissions an extension has", slug: "how-to-see-what-permissions-an-extension-has" },
        ],
      },
      {
        heading: "API permissions and website access are different",
        body: [
          "The tabs permission concerns tab metadata and browser actions. A host permission concerns page URLs. The cookies permission concerns cookie storage. Reading them separately prevents a common mistake: assuming that a host permission alone grants cookie or history access.",
          "The report shows both categories and highlights all_urls, http://*/*, https://*/*, debugger, nativeMessaging, proxy, management, cookies, history, webRequest, downloads and scripting.",
        ],
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "Chrome extension host permissions", slug: "chrome-extension-host-permissions-checker" },
          { label: "cookies permission explained", slug: "extension-asking-for-cookies-permission" },
        ],
      },
      {
        heading: "How to interpret a broad permission",
        body: [
          "Ask three questions: Does the stated feature require this capability? Is the access limited to the sites the feature needs? Is the permission used in a way the publisher explains clearly? When the answer is unclear, look for an alternative extension with narrower access.",
          "A permissions checker provides evidence, not intent. A broad permission can be necessary for a content blocker, accessibility tool or developer utility. The risk comes from the combination of access, data handling and transparency.",
        ],
        steps: [
          { title: "List the permissions", body: "Upload the package and read the required and optional lists." },
          { title: "Match them to features", body: "Each permission should map to something visible in the product." },
          { title: "Check the host patterns", body: "Specific hosts are narrower than all_urls or wildcard schemes." },
          { title: "Review sensitive APIs", body: "debugger, nativeMessaging, cookies and proxy deserve extra scrutiny." },
        ],
        callout:
          "Powerful permissions are a reason to investigate, not a reason to accuse. Context determines whether the access is justified.",
      },
    ],
    faqs: [
      {
        question: "What is the most dangerous Chrome extension permission?",
        answer:
          "There is no single ranking because context matters. debugger, nativeMessaging, proxy and broad host access are among the highest-impact capabilities, and cookies, history and webRequest can expose sensitive data.",
      },
      {
        question: "Does a permission mean the extension is using it?",
        answer:
          "No. A declaration is a capability. Static analysis can find references to related APIs, but only runtime monitoring or a code audit can show actual use.",
      },
      {
        question: "Can an extension ask for more permissions later?",
        answer:
          "It can request optional permissions, and some updates can require new permissions. Review the permission prompt and the extension's changelog before accepting.",
      },
      {
        question: "How do I check permissions after installing?",
        answer:
          "Open the browser's extension management page and inspect the extension details. This tool is for inspecting packages before or independently of installation.",
      },
    ],
    related: [
      "how-to-check-chrome-extension-permissions-before-installing",
      "what-does-all-urls-permission-mean",
      "chrome-extension-host-permissions-checker",
      "extension-asking-for-cookies-permission",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "hub",
    slug: "firefox-xpi-analyzer",
    cluster: "xpi",
    hub: null,
    primaryKeyword: "Firefox XPI analyzer",
    intent: "analyzer",
    title: "Firefox XPI Analyzer: Inspect Add-ons Before Installing",
    metaTitle: "Firefox XPI Analyzer - Inspect Add-on Permissions and Code",
    description:
      "Analyze a Firefox XPI add-on online. See manifest permissions, host access, background scripts, content scripts, external domains and code indicators.",
    h1: "Firefox XPI analyzer",
    answer:
      "A Firefox XPI analyzer opens the ZIP-based add-on package produced by Firefox. It reads manifest.json, explains permissions and host access, and inspects JavaScript for static indicators. You can review an add-on without installing it or granting it access to your browser profile.",
    sections: [
      {
        heading: "XPI packages are ZIP archives",
        body: [
          "Firefox add-ons use the .xpi extension, but the container is a ZIP archive. Modern add-ons declare capabilities in manifest.json using browser extension APIs. Legacy add-ons used different structures and may not fully validate.",
          "The analyzer handles root-level and nested manifests, reads text entries and skips binaries. It never loads the add-on into Firefox.",
        ],
        links: [
          { label: "Firefox XPI file analyzer", slug: "firefox-xpi-file-analyzer" },
        ],
      },
      {
        heading: "Firefox-specific signals",
        body: [
          "Firefox manifests may include browser_specific_settings with a Gecko ID and minimum version. Optional permissions and host permissions follow the same broad model as Chromium, but support varies by Firefox version.",
          "The analyzer reports Firefox compatibility when it sees Gecko settings, background scripts or an XPI source. Declared permissions still describe the add-on's reach, regardless of the store label.",
        ],
        links: [
          { label: "manifest V3 permissions explained", slug: "manifest-v3-permissions-list-explained" },
          { label: "what all_urls means", slug: "what-does-all-urls-permission-mean" },
          { label: "Firefox add-on privacy checker", slug: "firefox-addon-privacy-checker" },
        ],
      },
      {
        heading: "Manual analysis when store access is restricted",
        body: [
          "Automatic retrieval from addons.mozilla.org is attempted through its public API and approved hosts only. If retrieval fails, download the XPI from the add-on page and upload it here. No store access control is bypassed.",
          "For high-value accounts, consider a separate browser profile for extensions you have not fully reviewed, and remove add-ons you no longer need.",
        ],
        callout:
          "Static analysis of an XPI cannot prove that the add-on did or did not collect data. It shows the capabilities and code references inside the package.",
      },
    ],
    faqs: [
      {
        question: "Can I inspect a Firefox add-on without installing it?",
        answer:
          "Yes. Upload the XPI or paste its addons.mozilla.org page URL. The package is parsed locally and the add-on is never installed.",
      },
      {
        question: "Does the analyzer support legacy XPI add-ons?",
        answer:
          "It reads the ZIP and manifest when present. Legacy formats that do not use manifest.json may not produce a complete report.",
      },
      {
        question: "Is every Firefox add-on reviewed by Mozilla?",
        answer:
          "Add-ons distributed through addons.mozilla.org go through a review process, but review is not a guarantee about privacy or future updates. Inspect the permissions yourself.",
      },
      {
        question: "Why does automatic Firefox retrieval fail?",
        answer:
          "The API, network or store may block the request. When that happens, download the XPI manually and upload the file.",
      },
    ],
    related: [
      "firefox-xpi-file-analyzer",
      "extension-permission-analyzer",
      "are-chrome-extensions-safe",
      "how-to-audit-an-extension-before-install",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "hub",
    slug: "edge-extension-inspector",
    cluster: "edge",
    hub: null,
    primaryKeyword: "Edge extension inspector",
    intent: "analyzer",
    title: "Edge Extension Inspector: Audit Microsoft Edge Add-ons",
    metaTitle: "Edge Extension Inspector - Analyze Add-on Permissions",
    description:
      "Inspect Microsoft Edge extensions online. Review permissions, host access, manifest fields, source indicators and external domains before installing an add-on.",
    h1: "Edge extension inspector",
    answer:
      "An Edge extension inspector analyzes a Microsoft Edge add-on package using the same Manifest V3 model as Chromium. It shows declared permissions, host access, background configuration, content scripts and code indicators, helping you compare an add-on's capabilities with its stated purpose.",
    sections: [
      {
        heading: "Edge add-ons use Chromium manifests",
        body: [
          "Microsoft Edge Add-ons are packaged as CRX files and use the same extension platform as Chrome, with some API differences. Most Manifest V3 permissions and host permissions mean the same thing in both browsers.",
          "The report lists browser compatibility based on the manifest and background configuration. Compatibility is a technical observation, not a store endorsement.",
        ],
        links: [
          { label: "Chrome extension inspector online", slug: "chrome-extension-inspector-online" },
          { label: "browser plugin source analyzer", slug: "browser-plugin-source-analyzer" },
        ],
      },
      {
        heading: "What to review first",
        body: [
          "Start with host permissions and content scripts. These decide which pages the extension can read or modify. Then review sensitive API permissions such as debugger, cookies, history, management, proxy and nativeMessaging.",
          "The code findings help you see dynamic execution, remote script references, DOM injection, storage and messaging. Each finding includes a file and line where available.",
        ],
        list: [
          "Broad host access and all_urls",
          "Content-script match patterns",
          "Background service worker and update URL",
          "Externally connectable origins",
          "Dynamic code and remote script references",
        ],
        links: [
          { label: "JavaScript behavior analyzer", slug: "extension-javascript-behavior-analyzer" },
          { label: "content script matches explained", slug: "content-script-matches-patterns-explained" },
          { label: "Edge extension permission checker", slug: "edge-extension-permission-checker" },
        ],
      },
      {
        heading: "Manual upload and store limits",
        body: [
          "The inspector tries official retrieval when you paste a Microsoft Edge Add-ons URL. If the store blocks the request, download the package from the store and upload it manually.",
          "The analyzer does not bypass authentication, region restrictions or store controls. It only reads the file you provide or the package returned by an approved endpoint.",
        ],
        callout:
          "An extension available in a store has passed an automated and human review process to some degree. That review does not replace your own assessment of permissions and data access.",
      },
    ],
    faqs: [
      {
        question: "Can I inspect an Edge add-on before installing it?",
        answer:
          "Yes. Paste the Edge Add-ons URL or upload the CRX file. The package is parsed in your browser without installation.",
      },
      {
        question: "Are Edge permissions the same as Chrome permissions?",
        answer:
          "Most Manifest V3 permissions share the same names and meaning. Some APIs and policies differ, and availability can change between browser versions.",
      },
      {
        question: "Why does the store URL fail?",
        answer:
          "The store may block automated downloads or return an HTML page. Download the package from the store and upload the file instead.",
      },
      {
        question: "Does a high score mean an Edge add-on is malicious?",
        answer:
          "No. The score measures exposure and static indicators. A high score means investigate carefully; it is not a malware classification.",
      },
    ],
    related: [
      "chrome-extension-inspector-online",
      "browser-plugin-source-analyzer",
      "extension-javascript-behavior-analyzer",
      "how-to-audit-an-extension-before-install",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "hub",
    slug: "extension-external-domain-finder",
    cluster: "domains",
    hub: null,
    primaryKeyword: "extension external domain finder",
    intent: "analyzer",
    title: "Extension External Domain Finder: See Referenced Hosts",
    metaTitle: "Extension External Domain Finder - Find Referenced Hosts",
    description:
      "Find the external domains an extension references. Group hosts into analytics, advertising, authentication, error reporting, cloud services and unknown.",
    h1: "Extension external domain finder",
    answer:
      "An extension external domain finder extracts every URL and host pattern referenced in an extension's files. It groups domains by likely purpose so you can see whether an extension refers to analytics, advertising, authentication, error reporting or cloud services. A reference does not prove that a request was made.",
    sections: [
      {
        heading: "Where domains come from",
        body: [
          "Domains are extracted from JavaScript string literals, HTML attributes, manifest host permissions, content-script matches, update URLs, CSP directives and web-accessible resources. They are counted and linked to the files where they appear.",
          "The finder also reports wildcard host permissions as domains where possible. Patterns such as all_urls are handled separately as website access.",
        ],
        links: [
          { label: "check what domains a Chrome extension connects to", slug: "check-what-domains-a-chrome-extension-connects-to" },
          { label: "extension privacy guide", slug: "browser-extension-privacy-guide" },
        ],
      },
      {
        heading: "Categories are heuristics",
        body: [
          "Classification uses maintained hostname lists for well-known analytics, advertising, authentication, error reporting and cloud providers. Anything else is placed in the unknown category rather than being guessed.",
          "A domain can serve multiple purposes. For example, a cloud storage host may deliver legitimate assets or receive collected data. Use the category as a starting point, then inspect the surrounding code and the publisher's documentation.",
        ],
        table: {
          caption: "Domain categories used in the report",
          headers: ["Category", "Typical role", "What to check"],
          rows: [
            ["Analytics", "Usage measurement", "What events and identifiers are sent"],
            ["Advertising", "Ad delivery or attribution", "Whether personal data is shared"],
            ["Authentication", "Sign-in and tokens", "Which scopes and tokens are handled"],
            ["Error reporting", "Crash and exception data", "Whether page content is included"],
            ["Cloud services", "APIs, assets, storage", "Who controls the bucket or endpoint"],
            ["Unknown", "Unclassified", "Read the surrounding code and publisher docs"],
          ],
        },
        links: [
          { label: "does this extension track me", slug: "does-this-extension-track-me" },
          { label: "browser add-on data access checker", slug: "browser-add-on-data-access-checker" },
        ],
      },
      {
        heading: "Interpreting the list responsibly",
        body: [
          "A domain reference is a capability or a comment in code. It may be an unused constant, an optional feature, a documentation link or a URL in a bundled library. The report shows counts and files so you can distinguish a single mention from repeated use.",
          "If a domain looks unexpected, search the source file, check the publisher's privacy policy and contact the developer. Avoid assuming data collection solely from the presence of an analytics hostname.",
        ],
        callout:
          "The finder reports static references. It does not observe network traffic and cannot prove that the extension contacted any host.",
      },
    ],
    faqs: [
      {
        question: "Can this tool see what domains an extension actually calls?",
        answer:
          "No. It extracts static references from the package. Runtime monitoring is required to see real network activity.",
      },
      {
        question: "Why is a domain listed that the extension never uses?",
        answer:
          "It may be an unused constant, a bundled library reference, an optional code path or a comment. The report links each domain to files and reference counts.",
      },
      {
        question: "What does the unknown category mean?",
        answer:
          "The hostname is not in our maintained provider lists. It is not a suspicion score; it simply needs manual classification.",
      },
      {
        question: "Can I export the domain list?",
        answer:
          "Yes. The JSON export contains every extracted domain, its category, reference count and source files.",
      },
    ],
    related: [
      "check-what-domains-a-chrome-extension-connects-to",
      "does-this-extension-track-me",
      "browser-add-on-data-access-checker",
      "extension-permission-analyzer",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "hub",
    slug: "extension-content-script-inspector",
    cluster: "content-scripts",
    hub: null,
    primaryKeyword: "extension content script inspector",
    intent: "analyzer",
    title: "Extension Content Script Inspector: See Which Pages Can Be Changed",
    metaTitle: "Extension Content Script Inspector - Match Patterns",
    description:
      "Inspect extension content scripts and match patterns. Understand which websites an extension can read or modify and how run_at and all_frames affect behavior.",
    h1: "Extension content script inspector",
    answer:
      "A content script inspector shows which websites an extension injects code into and when. It reads content_scripts entries in the manifest, explains match patterns, run_at timing and all_frames behavior, and links the scripts to static code findings. Content scripts can read and change the pages they match.",
    sections: [
      {
        heading: "What a content script can do",
        body: [
          "Content scripts share the page's DOM but run in an isolated JavaScript world by default. They can read and modify page content, observe user input and communicate with the extension's background context.",
          "The match patterns decide where this happens. A pattern for one domain is narrow; patterns with wildcard schemes or all_urls are broad and deserve attention.",
        ],
        links: [
          { label: "content script match patterns explained", slug: "content-script-matches-patterns-explained" },
          { label: "extension website access inspector", slug: "extension-website-access-inspector" },
        ],
      },
      {
        heading: "Reading match patterns",
        body: [
          "A match pattern has a scheme, host and path. https://example.com/* matches pages on that host. https://*.example.com/* includes subdomains. <all_urls> covers every supported scheme and host.",
          "The inspector separates content-script matches from host_permissions, because injection access and API access are related but not identical. It also reports run_at and all_frames when declared.",
        ],
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "Chrome host permissions checker", slug: "chrome-extension-host-permissions-checker" },
        ],
      },
      {
        heading: "Questions to ask about injected scripts",
        body: [
          "Does the feature need to run on every page or only on the sites it lists? Does the script read forms, cookies or messages? Does it inject HTML or load remote code? Does it send page content to a server?",
          "The report answers what can be observed statically. It does not claim that page data was collected. For extensions that handle sensitive accounts, prefer narrow matches and visible, documented behavior.",
        ],
        steps: [
          { title: "Identify the match patterns", body: "List every host or wildcard the content script targets." },
          { title: "Check the timing", body: "document_start runs earlier than document_idle and may see different page state." },
          { title: "Review frame behavior", body: "all_frames extends injection into embedded frames." },
          { title: "Inspect the script", body: "Use the linked findings and file names to review data access." },
        ],
        callout:
          "A content script that matches a site is not automatically harmful. The question is whether its access is proportionate to the feature.",
      },
    ],
    faqs: [
      {
        question: "What is a content script?",
        answer:
          "A file an extension injects into matching web pages. It can read and change the page DOM and communicate with the rest of the extension.",
      },
      {
        question: "Does a content script run on every website?",
        answer:
          "Only where its match patterns apply. Patterns such as all_urls or wildcard schemes can cover nearly every site.",
      },
      {
        question: "What does all_frames mean?",
        answer:
          "It allows the content script to run inside iframes that match the pattern, not only the top-level page.",
      },
      {
        question: "Can content scripts read cookies?",
        answer:
          "Page scripts cannot normally read HttpOnly cookies. Content scripts may access document.cookie where cookies are not HttpOnly, and an extension with the cookies permission can use the cookie API.",
      },
    ],
    related: [
      "content-script-matches-patterns-explained",
      "extension-website-access-inspector",
      "chrome-extension-reading-all-sites-permission",
      "extension-asking-for-cookies-permission",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "hub",
    slug: "remote-script-reference-detector",
    cluster: "remote-code",
    hub: null,
    primaryKeyword: "remote script reference detector",
    intent: "analyzer",
    title: "Remote Script Reference Detector for Browser Extensions",
    metaTitle: "Remote Script Reference Detector - Extension Code Review",
    description:
      "Detect remote script references, dynamic code execution and runtime imports in browser extensions. See evidence, severity and the limits of static detection.",
    h1: "Remote script reference detector",
    answer:
      "A remote script reference detector looks for static signs that an extension may load executable JavaScript from outside its package. It flags external script elements, importScripts URLs, eval and Function constructor use. These are indicators, not proof that remote code ran.",
    sections: [
      {
        heading: "Why remote code matters",
        body: [
          "Remote code can change after the extension is reviewed. A package that looks harmless today could load different logic tomorrow. Manifest V3 restricts remote executable code for this reason, but static analysis still needs to look for older patterns and edge cases.",
          "The detector reports script elements with external sources, runtime importScripts calls, eval, Function constructors and string-based timers. Each finding carries file, line, severity and confidence.",
        ],
        links: [
          { label: "extension JavaScript behavior analyzer", slug: "extension-javascript-behavior-analyzer" },
          { label: "Manifest V2 vs V3 security differences", slug: "manifest-v2-vs-v3-security-differences" },
        ],
      },
      {
        heading: "Evaluating the evidence",
        body: [
          "Read the surrounding code. A URL in a string may be unused, used only in an optional feature, or loaded in a page context where extension rules differ. A finding with a file and line is a starting point for review.",
          "Check whether the remote host is controlled by the publisher and whether the loaded file can be replaced independently. Look for integrity checks, pinned versions or a documented update mechanism.",
        ],
        links: [
          { label: "extension CSP in Manifest V3", slug: "extension-csp-manifest-v3-explained" },
          { label: "external domain finder", slug: "extension-external-domain-finder" },
          { label: "check Chrome extension source code", slug: "check-chrome-extension-source-code" },
        ],
      },
      {
        heading: "Limits and false positives",
        body: [
          "Bundled frameworks often contain eval-like code paths that are never called by the extension. Minified code can obscure intent. Conversely, code assembled from package assets or generated at runtime may not be detected.",
          "Do not treat a single finding as proof of malicious behavior. Use the report alongside publisher transparency, store review status and runtime observation where appropriate.",
        ],
        callout:
          "No static detector can see code that is fetched and executed after installation. That limitation applies to every extension analyzer.",
      },
    ],
    faqs: [
      {
        question: "What counts as remote code in an extension?",
        answer:
          "Executable JavaScript delivered from outside the extension package. It can arrive through script tags, importScripts, dynamic imports, eval or a remote configuration that is executed.",
      },
      {
        question: "Is eval always malicious?",
        answer:
          "No. Build tools, template engines and legacy libraries use eval-like patterns. Context and reachability determine whether it is a real concern.",
      },
      {
        question: "Does Manifest V3 block remote code completely?",
        answer:
          "It restricts remote executable code and tightens CSP, but extensions can still load data, and the rules have exceptions. Static review remains useful.",
      },
      {
        question: "Can the detector inspect code loaded at runtime?",
        answer:
          "No. It only sees files in the package you upload. Runtime code must be observed with browser developer tools or network monitoring.",
      },
    ],
    related: [
      "extension-javascript-behavior-analyzer",
      "manifest-v2-vs-v3-security-differences",
      "extension-csp-manifest-v3-explained",
      "browser-plugin-source-analyzer",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "hub",
    slug: "browser-extension-tracking-analysis",
    cluster: "tracking",
    hub: null,
    primaryKeyword: "browser extension tracking analysis",
    intent: "analyzer",
    title: "Browser Extension Tracking Analysis: Find Data-Collection Signals",
    metaTitle: "Browser Extension Tracking Analysis - Data Signals",
    description:
      "Analyze browser extensions for tracking-related signals: analytics and advertising domains, storage APIs, cookie access, identifiers and messaging patterns.",
    h1: "Browser extension tracking analysis",
    answer:
      "Browser extension tracking analysis looks for combinations that could support tracking: analytics or advertising domains, cookie access, storage APIs, tab and history permissions, device identifiers and message passing. It identifies exposure and data-collection indicators, but static inspection cannot prove that tracking occurred.",
    sections: [
      {
        heading: "What tracking looks like in an extension",
        body: [
          "An extension has more reach than a website tab. It can observe navigation, read page content where content scripts run, access browser APIs and persist identifiers with storage. Tracking may be first-party analytics, attribution, error reporting or something undisclosed.",
          "The analyzer groups domain references, permission exposure and code indicators. The combination is more informative than any single signal.",
        ],
        links: [
          { label: "does this extension track me", slug: "does-this-extension-track-me" },
          { label: "external domain finder", slug: "extension-external-domain-finder" },
        ],
      },
      {
        heading: "Indicators the report surfaces",
        body: [
          "Relevant findings include cookie access, storage usage, network requests, analytics and advertising hosts, tab or history permissions and messaging to external pages. Each has a severity and confidence that reflects how direct the evidence is.",
          "A network API in a bundled library is weak evidence. A content script that reads cookies, combines them with a tab URL and sends them to an analytics host is a stronger pattern, although still not proof.",
        ],
        list: [
          "Analytics and advertising domain references",
          "Cookie, storage and identifier handling",
          "Tab, history and webRequest permissions",
          "Page content access through content scripts",
          "Messaging and externally_connectable configuration",
        ],
        links: [
          { label: "browser add-on data access checker", slug: "browser-add-on-data-access-checker" },
          { label: "cookies permission explained", slug: "extension-asking-for-cookies-permission" },
          { label: "extension data collection checker", slug: "extension-data-collection-checker" },
        ],
      },
      {
        heading: "Reduce your exposure",
        body: [
          "Remove extensions you do not use, prefer narrow host access, and check permissions after updates. Use separate browser profiles for sensitive accounts if you rely on extensions with broad access. Browser privacy settings can limit some third-party storage but cannot revoke an extension's declared permissions.",
          "Read the publisher's privacy policy and look for a clear statement of what is collected, why, where it is sent and how long it is kept. Vague policies combined with broad permissions are a warning sign.",
        ],
        callout:
          "This analysis cannot observe runtime traffic. For definitive answers about network activity, use browser developer tools with the extension installed in a controlled profile.",
      },
    ],
    faqs: [
      {
        question: "Can an extension track me without the tabs permission?",
        answer:
          "Yes, in some cases. Content scripts can observe the pages they match, and other APIs may reveal context. Permissions define much of the reach, but not every possible signal.",
      },
      {
        question: "Does the analyzer see my browsing history?",
        answer:
          "No. It only reads the uploaded package. It does not access your browser profile, history, cookies or tabs.",
      },
      {
        question: "What is the strongest tracking indicator?",
        answer:
          "A combination of sensitive data access, persistent identifiers and references to analytics or unknown hosts is stronger than any isolated domain or API reference.",
      },
      {
        question: "Can I stop an extension from tracking me?",
        answer:
          "Remove or disable it, restrict its site access in the browser, and prefer alternatives with narrower permissions. Static analysis cannot block runtime behavior.",
      },
    ],
    related: [
      "does-this-extension-track-me",
      "browser-add-on-data-access-checker",
      "extension-external-domain-finder",
      "chrome-extension-reading-all-sites-permission",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: true,
  },
  {
    kind: "hub",
    slug: "browser-extension-privacy-guide",
    cluster: "privacy-guide",
    hub: null,
    primaryKeyword: "browser extension privacy guide",
    intent: "guide",
    title: "Browser Extension Privacy Guide: Permissions, Manifests and Risk",
    metaTitle: "Browser Extension Privacy Guide - Learn Before You Install",
    description:
      "A practical browser extension privacy guide covering permissions, manifest versions, content scripts, background workers, external domains and safe inspection.",
    h1: "Browser extension privacy guide",
    answer:
      "This browser extension privacy guide explains how extensions declare access, how Manifest V2 and V3 differ, what content scripts and background workers can do, and how to inspect a package safely. The goal is proportionate caution: understand the capability, check the evidence and avoid both blind trust and false certainty.",
    sections: [
      {
        heading: "Start with the access model",
        body: [
          "Extensions are small programs with browser privileges. Permissions grant API access, host permissions grant website access, and content scripts inject code into matching pages. Background workers coordinate behavior and may make network requests.",
          "The browser shows permission warnings, but the wording can be vague. Reading the manifest and the source gives a more precise picture of what is possible.",
        ],
        links: [
          { label: "what does all_urls mean", slug: "what-does-all-urls-permission-mean" },
          { label: "how to audit an extension before install", slug: "how-to-audit-an-extension-before-install" },
          { label: "content script matches explained", slug: "content-script-matches-patterns-explained" },
        ],
      },
      {
        heading: "Manifest V2 versus V3",
        body: [
          "Manifest V3 moves background execution to service workers, separates host permissions and restricts remote executable code. It also changes network interception from blocking webRequest to declarative rules in many cases.",
          "Security depends on implementation. A V3 extension can still request broad host access or use powerful APIs. A V2 extension may be well maintained, but its platform support is shrinking.",
        ],
        table: {
          caption: "Practical differences",
          headers: ["Topic", "V2", "V3"],
          rows: [
            ["Background", "Persistent page possible", "Service worker, event-driven"],
            ["Host permissions", "Often combined with permissions", "Dedicated field"],
            ["Remote code", "Looser historical rules", "Executable code must be packaged"],
            ["Request blocking", "webRequestBlocking", "declarativeNetRequest"],
          ],
        },
        links: [
          { label: "Manifest V2 vs V3 security differences", slug: "manifest-v2-vs-v3-security-differences" },
          { label: "service worker vs background page", slug: "chrome-extension-service-worker-vs-background-page" },
          { label: "extension CSP in Manifest V3", slug: "extension-csp-manifest-v3-explained" },
        ],
      },
      {
        heading: "Inspect, then decide",
        body: [
          "Download or open the package, inspect the manifest, and review permissions and host access. Look at content scripts, external domains and dynamic code indicators. Compare what you find with the feature you actually need.",
          "No static analysis is complete. Use it to ask better questions, not to replace judgment. Remove extensions you do not use and re-check permissions after major updates.",
        ],
        links: [
          { label: "are Chrome extensions safe", slug: "are-chrome-extensions-safe" },
          { label: "how to see permissions", slug: "how-to-see-what-permissions-an-extension-has" },
          { label: "web-accessible resources security", slug: "extension-web-accessible-resources-security" },
        ],
      },
      {
        heading: "Glossary",
        body: [
          "Permission: a declared API capability. Host permission: access to URLs. Content script: code injected into matching pages. Service worker: an event-driven background script. CRX/XPI: packaged extension formats. CSP: rules limiting script sources and execution.",
          "These definitions are intentionally concise so they can be quoted and reused.",
        ],
        callout:
          "Privacy is about capability plus behavior plus transparency. Any one of these alone tells an incomplete story.",
      },
    ],
    faqs: [
      {
        question: "Are browser extensions more dangerous than websites?",
        answer:
          "They can be, because extensions may persist across sites and request browser APIs. The actual risk depends on permissions, code and the publisher's data practices.",
      },
      {
        question: "Should I avoid all extensions with broad permissions?",
        answer:
          "Not automatically. Consider whether the feature requires the access, whether the publisher is transparent and whether a narrower alternative exists.",
      },
      {
        question: "How often should I review extensions?",
        answer:
          "Review after installing, after major updates and whenever you notice unexpected behavior. Removing unused extensions reduces long-term exposure.",
      },
      {
        question: "Does this guide cover mobile browsers?",
        answer:
          "The analysis focuses on desktop Chromium and Firefox extension packages. Mobile extension support varies by browser and platform.",
      },
    ],
    related: [
      "manifest-v2-vs-v3-security-differences",
      "chrome-extension-service-worker-vs-background-page",
      "extension-web-accessible-resources-security",
      "how-to-audit-an-extension-before-install",
    ],
    lastReviewed: "2026-10-31",
    analyzerEmbed: false,
  },
];
