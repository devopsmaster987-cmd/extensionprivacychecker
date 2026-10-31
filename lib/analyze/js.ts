import * as acorn from "acorn";
import * as walk from "acorn-walk";
import type { Finding, FindingRule, Severity, Confidence } from "./types";

interface RuleDefinition {
  severity: Severity;
  confidence: Confidence;
  explanation: string;
  recommendation: string;
}

const RULES: Record<FindingRule, RuleDefinition> = {
  eval: {
    severity: "high",
    confidence: "high",
    explanation:
      "The eval() function executes a string as JavaScript at runtime. Static analysis cannot reveal what code will be executed.",
    recommendation:
      "Inspect the argument passed to eval(). Legitimate extensions rarely need runtime string evaluation.",
  },
  "function-constructor": {
    severity: "high",
    confidence: "high",
    explanation:
      "The Function constructor creates executable code from a string. It is a common dynamic-code technique.",
    recommendation:
      "Check where the function body originates. Avoid extensions that build executable code from network responses.",
  },
  "timer-string": {
    severity: "medium",
    confidence: "high",
    explanation:
      "Passing a string to setTimeout or setInterval causes the browser to evaluate it as code.",
    recommendation: "Prefer a function callback instead of a string argument.",
  },
  "remote-script": {
    severity: "high",
    confidence: "medium",
    explanation:
      "The code appears to create or reference a script element that loads JavaScript from an external URL.",
    recommendation:
      "Identify the script URL and whether its content can change after the extension is published. Manifest V3 generally disallows remote code.",
  },
  "import-scripts": {
    severity: "high",
    confidence: "medium",
    explanation:
      "importScripts() loads additional JavaScript at runtime. A remote URL means the executable code is not part of the reviewed package.",
    recommendation:
      "Verify that all imported scripts are bundled with the extension and cannot be replaced remotely.",
  },
  obfuscation: {
    severity: "medium",
    confidence: "medium",
    explanation:
      "The file contains indicators often produced by JavaScript obfuscators, such as repeated hexadecimal identifiers, escaped strings or very long encoded values. Minified or bundled code can produce similar patterns.",
    recommendation:
      "Prefer a readable build of the extension for review. Obfuscation alone does not prove malicious intent.",
  },
  "dom-injection": {
    severity: "low",
    confidence: "high",
    explanation:
      "The code writes HTML into the page using a DOM injection API. Unsafe use can introduce cross-site scripting if untrusted data reaches it.",
    recommendation:
      "Check whether the inserted content comes from the page, the network or user input.",
  },
  "document-write": {
    severity: "medium",
    confidence: "high",
    explanation:
      "document.write() injects markup into the document and can execute scripts in some contexts.",
    recommendation:
      "Review what is written and whether any part of it is user-controlled or remote.",
  },
  "network-request": {
    severity: "info",
    confidence: "high",
    explanation:
      "The code contains a network request API. This shows that the extension can send or receive data, not that it actually does.",
    recommendation:
      "Match each request to the declared purpose and review the destination domains.",
  },
  websocket: {
    severity: "low",
    confidence: "high",
    explanation:
      "The code opens a WebSocket or EventSource connection, which can maintain a persistent channel to a server.",
    recommendation:
      "Identify the endpoint and the data sent over the connection.",
  },
  storage: {
    severity: "info",
    confidence: "high",
    explanation:
      "The code uses browser storage APIs. Extensions commonly store settings and cached data.",
    recommendation:
      "Check whether personal or browsing data is retained and for how long.",
  },
  messaging: {
    severity: "info",
    confidence: "high",
    explanation:
      "The code uses extension messaging APIs to communicate between extension contexts or pages.",
    recommendation:
      "Review which contexts exchange data and whether message senders are verified.",
  },
  "native-messaging": {
    severity: "high",
    confidence: "high",
    explanation:
      "The code communicates with a native application through native messaging, reaching outside the browser sandbox.",
    recommendation:
      "Confirm the companion application is trusted and installed deliberately.",
  },
  "cookie-access": {
    severity: "medium",
    confidence: "high",
    explanation:
      "The code reads or writes document.cookie, which can include session identifiers.",
    recommendation:
      "Check which cookies are handled and whether their values leave the page.",
  },
  "credential-access": {
    severity: "medium",
    confidence: "low",
    explanation:
      "The code references password fields or credential-like elements. Static analysis cannot show whether values are read or transmitted.",
    recommendation:
      "Review the surrounding code to see whether values are accessed, stored or sent.",
  },
  "keyboard-listeners": {
    severity: "low",
    confidence: "medium",
    explanation:
      "The code registers keyboard event listeners, a common pattern in shortcuts and a potential data-collection indicator.",
    recommendation:
      "Check whether keystrokes are only used locally for shortcuts.",
  },
  "manifest-warning": {
    severity: "low",
    confidence: "high",
    explanation: "The manifest contains a value that may need attention.",
    recommendation: "Review the related manifest field.",
  },
};

export interface JsAnalysisResult {
  findings: Finding[];
  parseError: string | null;
}

const MAX_FINDINGS_PER_FILE = 40;
const MAX_NETWORK_FINDINGS_PER_FILE = 4;
const MAX_STORAGE_FINDINGS_PER_FILE = 3;
const MAX_MESSAGING_FINDINGS_PER_FILE = 4;

function lineOf(node: any): number | null {
  return typeof node?.loc?.start?.line === "number" ? node.loc.start.line : null;
}

function columnOf(node: any): number | null {
  return typeof node?.loc?.start?.column === "number" ? node.loc.start.column + 1 : null;
}

function snippet(code: string, node: any, max = 180): string {
  if (typeof node?.start !== "number" || typeof node?.end !== "number") return "";
  const raw = code.slice(node.start, node.end).replace(/\s+/g, " ").trim();
  return raw.length > max ? `${raw.slice(0, max - 1)}…` : raw;
}

function memberName(node: any): string | null {
  if (!node || node.type !== "MemberExpression" || node.computed) return null;
  return node.property?.type === "Identifier" ? node.property.name : null;
}

function calleeName(callee: any): string | null {
  if (!callee) return null;
  if (callee.type === "Identifier") return callee.name;
  if (callee.type === "ChainExpression") return calleeName(callee.expression);
  if (callee.type === "MemberExpression") {
    const object = calleeName(callee.object);
    const property = callee.computed ? null : callee.property?.name ?? null;
    if (object && property) return `${object}.${property}`;
    return property ?? object;
  }
  return null;
}

function nameEndsWith(name: string | null, suffix: string): boolean {
  if (!name) return false;
  return name === suffix || name.endsWith(`.${suffix}`);
}

function literalString(node: any): string | null {
  if (!node) return null;
  if (node.type === "Literal" && typeof node.value === "string") return node.value;
  if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
    return node.quasis.map((part: any) => part.value.cooked ?? "").join("");
  }
  return null;
}

const SCRIPT_REMOTE_PATTERN = /createElement\s*\(\s*['"`]script['"`]\s*\)/;
const SCRIPT_SRC_PATTERN = /(?:<script[^>]*\bsrc\s*=|\.src\s*=\s*['"`](?:https?:)?\/\/)/i;
const PASSWORD_PATTERN = /(?:type\s*=\s*['"`]?password|input\[type\s*=\s*['"`]?password)/i;

function detectObfuscation(code: string): { suspicious: boolean; evidence: string } {
  const hexIdentifiers = (code.match(/\b_0x[0-9a-fA-F]{2,}\b/g) ?? []).length;
  const hexEscapes = (code.match(/\\x[0-9a-fA-F]{2}/g) ?? []).length;
  const unicodeEscapes = (code.match(/\\u[0-9a-fA-F]{4}/g) ?? []).length;
  const atobCalls = (code.match(/\batob\s*\(/g) ?? []).length;
  const longBase64 = (code.match(/["'`][A-Za-z0-9+/]{400,}={0,2}["'`]/g) ?? []).length;
  const reasons: string[] = [];

  if (hexIdentifiers >= 6) reasons.push(`${hexIdentifiers} hexadecimal-style identifiers`);
  if (hexEscapes >= 20) reasons.push(`${hexEscapes} hexadecimal escape sequences`);
  if (unicodeEscapes >= 30) reasons.push(`${unicodeEscapes} unicode escape sequences`);
  if (atobCalls >= 1 && longBase64 >= 1) reasons.push("long base64 value decoded with atob()");
  if (longBase64 >= 2) reasons.push(`${longBase64} very long base64-like strings`);

  return {
    suspicious: reasons.length > 0,
    evidence: reasons.join("; "),
  };
}

export function analyzeJavaScriptFile(path: string, code: string): JsAnalysisResult {
  const findings: Finding[] = [];
  const seen = new Set<string>();
  let parseError: string | null = null;

  const push = (
    rule: FindingRule,
    node: any,
    evidence: string,
    overrides: Partial<Pick<Finding, "severity" | "confidence" | "explanation" | "recommendation">> = {},
  ) => {
    if (findings.length >= MAX_FINDINGS_PER_FILE) return;
    const line = lineOf(node);
    const key = `${rule}:${line ?? "file"}:${evidence.slice(0, 60)}`;
    if (seen.has(key)) return;
    seen.add(key);
    const definition = RULES[rule];
    findings.push({
      id: `${path}:${line ?? 0}:${rule}:${findings.length}`,
      rule,
      category:
        rule === "eval" || rule === "function-constructor" || rule === "timer-string"
          ? "dynamic-code"
          : rule === "remote-script" || rule === "import-scripts"
            ? "remote-code"
            : rule === "obfuscation"
              ? "obfuscation"
              : rule === "dom-injection" || rule === "document-write"
                ? "dom-injection"
                : rule === "network-request" || rule === "websocket"
                  ? "network"
                  : rule === "storage"
                    ? "storage"
                    : rule === "messaging" || rule === "native-messaging"
                      ? "messaging"
                      : rule === "manifest-warning"
                        ? "manifest"
                        : "sensitive-data",
      file: path,
      line,
      column: columnOf(node),
      severity: overrides.severity ?? definition.severity,
      confidence: overrides.confidence ?? definition.confidence,
      evidence,
      explanation: overrides.explanation ?? definition.explanation,
      recommendation: overrides.recommendation ?? definition.recommendation,
    });
  };

  let ast: acorn.Node | null = null;
  const attempts: acorn.Options[] = [
    { ecmaVersion: "latest", sourceType: "module", locations: true, allowHashBang: true },
    { ecmaVersion: "latest", sourceType: "script", locations: true, allowHashBang: true, allowReturnOutsideFunction: true },
    { ecmaVersion: "latest", sourceType: "script", locations: true, allowHashBang: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true },
  ];

  for (const options of attempts) {
    try {
      ast = acorn.parse(code, options);
      break;
    } catch (error) {
      parseError = error instanceof Error ? error.message : String(error);
    }
  }

  const networkLines: number[] = [];
  let storageCount = 0;
  let messagingCount = 0;
  let hasNetworkApi = false;

  if (ast) {
    try {
      walk.full(ast, (node: any) => {
        switch (node.type) {
          case "CallExpression": {
            const name = calleeName(node.callee);
            const firstArgument = node.arguments?.[0];

            if (name === "eval") {
              push("eval", node, snippet(code, node));
            } else if (nameEndsWith(name, "setTimeout") || nameEndsWith(name, "setInterval")) {
              if (literalString(firstArgument) !== null) push("timer-string", node, snippet(code, node));
            } else if (nameEndsWith(name, "fetch") || name === "navigator.sendBeacon") {
              hasNetworkApi = true;
              if (networkLines.length < MAX_NETWORK_FINDINGS_PER_FILE) {
                networkLines.push(lineOf(node) ?? 0);
                push("network-request", node, snippet(code, node));
              }
            } else if (name === "XMLHttpRequest" || nameEndsWith(name, "XMLHttpRequest")) {
              hasNetworkApi = true;
              if (networkLines.length < MAX_NETWORK_FINDINGS_PER_FILE) {
                networkLines.push(lineOf(node) ?? 0);
                push("network-request", node, snippet(code, node));
              }
            } else if (name === "importScripts") {
              push("import-scripts", node, snippet(code, node));
            } else if (name === "document.write" || name === "document.writeln") {
              push("document-write", node, snippet(code, node));
            } else if (nameEndsWith(name, "insertAdjacentHTML")) {
              push("dom-injection", node, snippet(code, node));
            } else if (name === "document.createElement" && literalString(firstArgument) === "script") {
              if (SCRIPT_SRC_PATTERN.test(code)) {
                push("remote-script", node, snippet(code, node));
              }
            } else if (name === "chrome.runtime.connectNative" || name === "chrome.runtime.sendNativeMessage") {
              push("native-messaging", node, snippet(code, node));
            } else if (
              name === "chrome.runtime.sendMessage" ||
              name === "chrome.runtime.connect" ||
              nameEndsWith(name, "postMessage")
            ) {
              if (messagingCount < MAX_MESSAGING_FINDINGS_PER_FILE) {
                messagingCount += 1;
                push("messaging", node, snippet(code, node));
              }
            } else if (name === "WebSocket" || name === "EventSource") {
              push("websocket", node, snippet(code, node));
            } else if (
              name === "localStorage.getItem" ||
              name === "localStorage.setItem" ||
              name === "sessionStorage.getItem" ||
              name === "sessionStorage.setItem" ||
              name === "indexedDB.open" ||
              nameEndsWith(name, "storage.local.get") ||
              nameEndsWith(name, "storage.local.set") ||
              nameEndsWith(name, "storage.sync.get") ||
              nameEndsWith(name, "storage.sync.set")
            ) {
              if (storageCount < MAX_STORAGE_FINDINGS_PER_FILE) {
                storageCount += 1;
                push("storage", node, snippet(code, node));
              }
            }
            break;
          }
          case "NewExpression": {
            const name = calleeName(node.callee);
            if (name === "Function") push("function-constructor", node, snippet(code, node));
            if (name === "WebSocket" || name === "EventSource") push("websocket", node, snippet(code, node));
            if (name === "XMLHttpRequest") {
              hasNetworkApi = true;
              if (networkLines.length < MAX_NETWORK_FINDINGS_PER_FILE) {
                networkLines.push(lineOf(node) ?? 0);
                push("network-request", node, snippet(code, node));
              }
            }
            break;
          }
          case "AssignmentExpression": {
            const property = memberName(node.left);
            if (property === "innerHTML" || property === "outerHTML") {
              push("dom-injection", node, snippet(code, node));
            }
            if (property === "onkeydown" || property === "onkeypress" || property === "onkeyup") {
              push("keyboard-listeners", node, snippet(code, node));
            }
            break;
          }
          case "MemberExpression": {
            if (
              node.object?.type === "Identifier" &&
              node.object.name === "document" &&
              !node.computed &&
              node.property?.name === "cookie"
            ) {
              push("cookie-access", node, snippet(code, node));
            }
            break;
          }
          default:
            break;
        }
      });
    } catch (error) {
      parseError = error instanceof Error ? error.message : String(error);
      findings.length = 0;
    }
  }

  const addEventListenerPattern = /addEventListener\s*\(\s*['"`]key(?:down|press|up)['"`]/;
  if (addEventListenerPattern.test(code)) {
    const index = code.search(addEventListenerPattern);
    const line = code.slice(0, index).split("\n").length;
    push("keyboard-listeners", { loc: { start: { line, column: 0 } } }, "addEventListener('keydown'|'keypress'|'keyup')");
  }

  if (PASSWORD_PATTERN.test(code)) {
    const index = code.search(PASSWORD_PATTERN);
    const line = code.slice(0, index).split("\n").length;
    push(
      "credential-access",
      { loc: { start: { line, column: 0 } } },
      "password field selector or markup",
      hasNetworkApi
        ? {
            severity: "medium",
            confidence: "low",
            explanation:
              "The file references password fields and also contains a network request API. This does not prove credential collection, but it is a pattern worth reviewing.",
          }
        : undefined,
    );
  }

  if (SCRIPT_REMOTE_PATTERN.test(code) && SCRIPT_SRC_PATTERN.test(code)) {
    const index = code.search(SCRIPT_REMOTE_PATTERN);
    const line = code.slice(0, index).split("\n").length;
    push("remote-script", { loc: { start: { line, column: 0 } } }, "dynamic script element with external src");
  }

  const obfuscation = detectObfuscation(code);
  if (obfuscation.suspicious) {
    push(
      "obfuscation",
      { loc: { start: { line: 1, column: 0 } } },
      obfuscation.evidence,
      { confidence: "medium" },
    );
  }

  return { findings, parseError };
}
