export const SITE = {
  name: "Extension Privacy Checker",
  shortName: "Extension Privacy Checker",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://extensionprivacychecker.example").replace(/\/$/, ""),
  email: "contact@extensionprivacychecker.example",
  lastReviewed: "2026-10-31",
  ogImageAlt: "Extension Privacy Checker - inspect browser extensions without running their code",
} as const;

export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) return `${SITE.url}/${path}`;
  return `${SITE.url}${path}`;
}
