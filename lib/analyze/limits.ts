export const LIMITS = {
  maxUploadBytes: 25 * 1024 * 1024,
  maxEntries: 4000,
  maxNestedArchives: 3,
  maxUncompressedBytes: 60 * 1024 * 1024,
  maxSingleFileBytes: 8 * 1024 * 1024,
  maxJsFiles: 400,
  maxJsBytes: 16 * 1024 * 1024,
  maxTextFileBytes: 2 * 1024 * 1024,
  maxDomains: 250,
  maxFindings: 600,
  storeFetchTimeoutMs: 15_000,
  maxStoreDownloadBytes: 30 * 1024 * 1024,
} as const;

export const TEXT_FILE_EXTENSIONS = new Set([
  ".js",
  ".mjs",
  ".cjs",
  ".jsx",
  ".ts",
  ".tsx",
  ".html",
  ".htm",
  ".json",
  ".txt",
]);

export const ARCHIVE_EXTENSIONS = new Set([".zip", ".crx", ".xpi"]);
