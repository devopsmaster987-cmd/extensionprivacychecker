import { NextResponse } from "next/server";
import { z } from "zod";
import { AnalysisError } from "@/lib/errors";
import { downloadStorePackage } from "@/lib/stores";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  url: z.string().trim().min(10).max(2000),
});

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const attempts = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);
  if (attempts.size > 5000) {
    for (const [entryKey, times] of attempts) {
      if (times.every((time) => now - time >= WINDOW_MS)) attempts.delete(entryKey);
    }
  }
  return recent.length > MAX_REQUESTS;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function errorResponse(error: AnalysisError, status: number) {
  return NextResponse.json({ error: { code: error.code, message: error.message } }, { status });
}

export async function POST(request: Request) {
  if (rateLimited(clientKey(request))) {
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: "Too many store requests. Please wait a minute." } },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "STORE_URL_INVALID", message: "The request body must be JSON." } },
      { status: 400 },
    );
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return errorResponse(
      new AnalysisError("STORE_URL_INVALID", "Enter a valid store URL."),
      400,
    );
  }

  try {
    const download = await downloadStorePackage(parsed.data.url);
    const body = download.bytes.buffer.slice(
      download.bytes.byteOffset,
      download.bytes.byteOffset + download.bytes.byteLength,
    ) as ArrayBuffer;

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": String(download.bytes.byteLength),
        "Content-Disposition": `attachment; filename="${download.filename}"`,
        "Cache-Control": "no-store",
        "X-Extension-Name": encodeURIComponent(download.displayName),
        "X-Extension-Store": download.store,
        "X-Extension-Filename": encodeURIComponent(download.filename),
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof AnalysisError) {
      const status =
        error.code === "STORE_TOO_LARGE"
          ? 413
          : error.code === "STORE_TIMEOUT"
            ? 504
            : error.code === "STORE_HOST_BLOCKED"
              ? 403
              : error.code === "STORE_URL_INVALID"
                ? 400
                : 502;
      return errorResponse(error, status);
    }
    return errorResponse(
      new AnalysisError(
        "STORE_FETCH_FAILED",
        "The package could not be retrieved. Download the extension and upload the file manually.",
      ),
      502,
    );
  }
}
