import JSZip from "jszip";
import { AnalysisError } from "../errors";
import { ARCHIVE_EXTENSIONS, LIMITS, TEXT_FILE_EXTENSIONS } from "../analyze/limits";
import type { ExtractedTextFile } from "../analyze/types";

interface JsZipInternals {
  _data?: {
    uncompressedSize?: number;
    unixPermissions?: number | null;
  };
}

export interface ArchiveExtraction {
  files: ExtractedTextFile[];
  entryCount: number;
  totalUncompressedBytes: number;
  skipped: string[];
  warnings: string[];
}

function normalizeEntryPath(rawName: string): string {
  if (rawName.includes("\0")) {
    throw new AnalysisError("UNSAFE_PATH", "An archive entry contains a null byte.");
  }
  const name = rawName.replace(/\\/g, "/");
  if (name.startsWith("/") || /^[a-zA-Z]:/.test(name)) {
    throw new AnalysisError("UNSAFE_PATH", "An archive entry uses an absolute path.");
  }
  const parts = name.split("/").filter((part) => part !== "" && part !== ".");
  if (parts.some((part) => part === "..")) {
    throw new AnalysisError("UNSAFE_PATH", "An archive entry attempts directory traversal.");
  }
  return parts.join("/");
}

function isTextCandidate(path: string): boolean {
  const lower = path.toLowerCase();
  const dot = lower.lastIndexOf(".");
  if (dot === -1) return lower.endsWith("manifest.json");
  return TEXT_FILE_EXTENSIONS.has(lower.slice(dot));
}

function isNestedArchive(path: string): boolean {
  const lower = path.toLowerCase();
  const dot = lower.lastIndexOf(".");
  return dot !== -1 && ARCHIVE_EXTENSIONS.has(lower.slice(dot));
}

function isSymlink(entry: JSZip.JSZipObject): boolean {
  const mode = (entry as unknown as JsZipInternals)._data?.unixPermissions;
  if (typeof mode !== "number") return false;
  return (mode & 0xf000) === 0xa000;
}

export async function extractArchive(bytes: Uint8Array): Promise<ArchiveExtraction> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(bytes, { checkCRC32: false, createFolders: false });
  } catch {
    throw new AnalysisError("INVALID_ARCHIVE", "The archive could not be read as a ZIP file.");
  }

  const entries = Object.values(zip.files).filter((entry) => !entry.dir);
  if (entries.length === 0) {
    throw new AnalysisError("INVALID_ARCHIVE", "The archive does not contain any files.");
  }
  if (entries.length > LIMITS.maxEntries) {
    throw new AnalysisError(
      "ZIP_LIMIT",
      `The archive contains ${entries.length} files, above the limit of ${LIMITS.maxEntries}.`,
    );
  }

  const skipped: string[] = [];
  const warnings: string[] = [];
  const files: ExtractedTextFile[] = [];
  let totalUncompressedBytes = 0;
  let nestedArchives = 0;
  let jsFiles = 0;
  let jsBytes = 0;

  for (const entry of entries) {
    const path = normalizeEntryPath(entry.name);
    if (!path) continue;

    if (isNestedArchive(path)) {
      nestedArchives += 1;
      skipped.push(path);
      continue;
    }
    if (isSymlink(entry)) {
      warnings.push(`Skipped a symbolic link entry: ${path}`);
      continue;
    }

    const declaredSize = (entry as unknown as JsZipInternals)._data?.uncompressedSize;
    if (typeof declaredSize === "number") {
      totalUncompressedBytes += declaredSize;
      if (totalUncompressedBytes > LIMITS.maxUncompressedBytes) {
        throw new AnalysisError(
          "ZIP_LIMIT",
          `The archive expands beyond the ${Math.round(LIMITS.maxUncompressedBytes / 1024 / 1024)} MB limit.`,
        );
      }
      if (declaredSize > LIMITS.maxSingleFileBytes) {
        skipped.push(path);
        continue;
      }
    }

    const isManifest = path.toLowerCase().endsWith("manifest.json");
    if (!isManifest && !isTextCandidate(path)) {
      skipped.push(path);
      continue;
    }

    const lower = path.toLowerCase();
    const isScript = /\.(mjs|cjs|js|jsx)$/.test(lower);
    if (isScript) {
      if (jsFiles >= LIMITS.maxJsFiles) {
        skipped.push(path);
        continue;
      }
      if (jsBytes + (declaredSize ?? 0) > LIMITS.maxJsBytes) {
        skipped.push(path);
        continue;
      }
      jsFiles += 1;
    }

    let data: Uint8Array;
    try {
      data = await entry.async("uint8array");
    } catch {
      warnings.push(`Could not decompress ${path}; the entry was skipped.`);
      skipped.push(path);
      continue;
    }

    if (data.byteLength > LIMITS.maxTextFileBytes) {
      skipped.push(path);
      continue;
    }
    if (typeof declaredSize !== "number") {
      totalUncompressedBytes += data.byteLength;
      if (totalUncompressedBytes > LIMITS.maxUncompressedBytes) {
        throw new AnalysisError(
          "ZIP_LIMIT",
          `The archive expands beyond the ${Math.round(LIMITS.maxUncompressedBytes / 1024 / 1024)} MB limit.`,
        );
      }
    }

    if (isScript) jsBytes += data.byteLength;

    const text = new TextDecoder("utf-8", { fatal: false }).decode(data);
    files.push({ path, text, bytes: data.byteLength });
  }

  if (nestedArchives > LIMITS.maxNestedArchives) {
    warnings.push(
      `The archive contains ${nestedArchives} nested archives. Nested archives are never opened.`,
    );
  }
  if (skipped.length) {
    warnings.push(`${skipped.length} file(s) were skipped because they are binary, too large or not relevant.`);
  }

  return {
    files,
    entryCount: entries.length,
    totalUncompressedBytes,
    skipped,
    warnings,
  };
}
