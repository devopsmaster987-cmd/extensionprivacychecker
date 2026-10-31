import JSZip from "jszip";

export async function buildZip(entries: Record<string, string | Uint8Array>): Promise<Uint8Array> {
  const zip = new JSZip();
  for (const [path, content] of Object.entries(entries)) {
    zip.file(path, content);
  }
  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}

export function wrapCrx3(zipBytes: Uint8Array, headerBytes = new Uint8Array([0x0a, 0x03, 0x01, 0x02, 0x03])): Uint8Array {
  const header = new Uint8Array(12 + headerBytes.byteLength + zipBytes.byteLength);
  header.set([0x43, 0x72, 0x32, 0x34], 0);
  const view = new DataView(header.buffer);
  view.setUint32(4, 3, true);
  view.setUint32(8, headerBytes.byteLength, true);
  header.set(headerBytes, 12);
  header.set(zipBytes, 12 + headerBytes.byteLength);
  return header;
}

export function wrapCrx2(
  zipBytes: Uint8Array,
  publicKey = new Uint8Array([1, 2, 3, 4]),
  signature = new Uint8Array([5, 6, 7, 8, 9]),
): Uint8Array {
  const header = new Uint8Array(16 + publicKey.byteLength + signature.byteLength + zipBytes.byteLength);
  header.set([0x43, 0x72, 0x32, 0x34], 0);
  const view = new DataView(header.buffer);
  view.setUint32(4, 2, true);
  view.setUint32(8, publicKey.byteLength, true);
  view.setUint32(12, signature.byteLength, true);
  header.set(publicKey, 16);
  header.set(signature, 16 + publicKey.byteLength);
  header.set(zipBytes, 16 + publicKey.byteLength + signature.byteLength);
  return header;
}

export const sampleManifestV3 = {
  manifest_version: 3,
  name: "Sample Privacy Extension",
  version: "1.2.3",
  description: "A fixture used by the automated tests.",
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

export const sampleBackgroundJs = `
const endpoint = "https://api.example.org/collect";
chrome.runtime.onMessage.addListener((message) => {
  fetch(endpoint, { method: "POST", body: JSON.stringify(message) });
});
document.addEventListener("keydown", () => {});
const value = document.cookie;
eval("1 + 1");
localStorage.setItem("last", value);
`;
