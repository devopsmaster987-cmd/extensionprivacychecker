import { AnalysisError } from "../errors";

const CRX_MAGIC = [0x43, 0x72, 0x32, 0x34];

export function isCrx(bytes: Uint8Array): boolean {
  return CRX_MAGIC.every((value, index) => bytes[index] === value);
}

export function isZip(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 4 &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07) &&
    (bytes[3] === 0x04 || bytes[3] === 0x06 || bytes[3] === 0x08)
  );
}

export function crxVersion(bytes: Uint8Array): number | null {
  if (!isCrx(bytes) || bytes.length < 12) return null;
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(4, true);
}

export function extractZipFromCrx(bytes: Uint8Array): { zip: Uint8Array; version: number } {
  if (!isCrx(bytes)) {
    throw new AnalysisError("INVALID_CRX", "The file does not start with the CRX magic bytes.");
  }
  if (bytes.length < 16) {
    throw new AnalysisError("INVALID_CRX", "The CRX header is truncated.");
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const version = view.getUint32(4, true);
  let zipOffset: number;

  if (version === 3) {
    if (bytes.length < 12) throw new AnalysisError("INVALID_CRX", "The CRX3 header is truncated.");
    const headerSize = view.getUint32(8, true);
    if (headerSize <= 0 || headerSize > bytes.length - 12) {
      throw new AnalysisError("INVALID_CRX", "The CRX3 header size is invalid.");
    }
    zipOffset = 12 + headerSize;
  } else if (version === 2) {
    if (bytes.length < 16) throw new AnalysisError("INVALID_CRX", "The CRX2 header is truncated.");
    const publicKeySize = view.getUint32(8, true);
    const signatureSize = view.getUint32(12, true);
    zipOffset = 16 + publicKeySize + signatureSize;
    if (zipOffset <= 16 || zipOffset >= bytes.length) {
      throw new AnalysisError("INVALID_CRX", "The CRX2 key or signature length is invalid.");
    }
  } else {
    throw new AnalysisError("UNSUPPORTED_CRX", `Unsupported CRX version: ${version}.`);
  }

  const zip = bytes.subarray(zipOffset);
  if (!isZip(zip)) {
    throw new AnalysisError("INVALID_CRX", "No ZIP archive was found after the CRX header.");
  }

  return { zip, version };
}
