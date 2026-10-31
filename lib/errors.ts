export type AnalysisErrorCode =
  | "EMPTY_FILE"
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_TYPE"
  | "INVALID_ARCHIVE"
  | "INVALID_CRX"
  | "UNSUPPORTED_CRX"
  | "ZIP_LIMIT"
  | "UNSAFE_PATH"
  | "NESTED_ARCHIVE_LIMIT"
  | "MANIFEST_MISSING"
  | "MANIFEST_INVALID"
  | "STORE_URL_INVALID"
  | "STORE_HOST_BLOCKED"
  | "STORE_FETCH_FAILED"
  | "STORE_TOO_LARGE"
  | "STORE_TIMEOUT"
  | "RATE_LIMITED";

export class AnalysisError extends Error {
  readonly code: AnalysisErrorCode;

  constructor(code: AnalysisErrorCode, message: string) {
    super(message);
    this.name = "AnalysisError";
    this.code = code;
  }
}

export function toErrorCode(error: unknown): AnalysisErrorCode {
  return error instanceof AnalysisError ? error.code : "INVALID_ARCHIVE";
}
