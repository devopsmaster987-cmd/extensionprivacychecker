# Extension Privacy Checker

Free, multilingual static analysis for browser extensions. Upload a CRX, XPI, ZIP or `manifest.json` file and get a plain-language report on permissions, website access, external domains, code indicators, a transparent 0-100 risk score, a privacy grade and prioritized actions. Compare two package versions to see what changed. Extension code is never executed, and uploaded files are processed in the browser.

## Stack

- Next.js 16 (App Router, Turbopack) and React 19
- TypeScript, Tailwind CSS 4
- JSZip for archive handling, acorn for static JavaScript parsing
- Zod for manifest validation
- Vitest for unit tests and Playwright for browser tests
- html2canvas-pro + jsPDF for client-side PDF export

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. The proxy redirects to a locale-prefixed URL based on the `epc_locale` cookie or `Accept-Language`.

Production:

```bash
npm run build
npm run start
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Production build (prerenders all locale and content pages) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint with Next.js core-web-vitals rules |
| `npm run typecheck` | TypeScript without emitting |
| `npm test` | Vitest unit tests (15 files, 91 tests) |
| `npm run test:e2e` | Playwright tests in Chromium and mobile Chrome |
| `npm run fixtures` | Regenerate CRX/XPI/ZIP/manifest fixtures used by e2e tests |

`npm run test:e2e` starts a production server itself (`fixtures`, `build`, `start`). To point tests at an existing server, set `PLAYWRIGHT_BASE_URL`.

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://extensionprivacychecker.example` | Canonical origin for metadata, hreflang and sitemap |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | empty | Optional Google Search Console verification token |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | empty | Optional Bing Webmaster Tools verification token |
| `ALLOW_AI_CRAWLERS` | `true` | Allow search and AI crawlers in `robots.txt`; set to `false` to block the named AI agents |
| `ALLOWED_CRAWLERS` | empty | Optional comma-separated additional user agents for `robots.txt` |

Set `NEXT_PUBLIC_SITE_URL` to the real deployment origin before publishing; it is embedded at build time.

## Routes

- `/[locale]` — home page with the embedded analyzer
- `/[locale]/analyzer` — full analyzer page
- `/[locale]/compare` — side-by-side version comparison for two packages
- `/[locale]/link-to-us` — badge embeds, link snippets and citation formats
- `/badges/*.svg` — static badges for documentation and project pages
- `/[locale]/topics` and `/[locale]/topics/[slug]` — 11 topic hubs
- `/[locale]/learn` and `/[locale]/learn/[slug]` — 45 keyword articles
- `/[locale]/guides` — guides, comparisons and reference pages
- `/[locale]/{methodology,about,contact,privacy,terms,disclaimer}` — legal and trust pages
- `/api/store` — server-side retrieval of public packages from official store endpoints
- `/og` — generated Open Graph/Twitter image
- `/sitemap.xml`, `/robots.txt`, `/llms.txt` — crawl and AEO assets

Content routes are generated for all 12 locales (835 static pages). English-only articles on non-English paths render with an English fallback notice, canonicalize to `/en`, and are `noindex`.

## Project structure

```text
app/                 App Router routes, metadata routes, global 404, API
components/          Site chrome, analyzer UI, report dashboard, UI primitives
content/             Topic hubs, keyword articles, registry and route helpers
lib/analyze/         Archive-independent analysis, scoring and Web Worker
lib/archive/         CRX2/CRX3 and ZIP parsing with safety limits
lib/stores/          Official store URL validation and fetching
lib/i18n/            Locale config and message dictionaries
lib/report/          JSON and PDF report export
lib/seo.ts           Metadata, hreflang and JSON-LD builders
scripts/             Fixture generation
tests/               Vitest unit tests and Playwright e2e tests
proxy.ts             Locale redirect (Next 16 replacement for middleware)
```

## Analysis and privacy model

1. The browser reads the selected file and posts its `ArrayBuffer` to a dedicated Web Worker.
2. CRX2/CRX3 headers are stripped and the ZIP payload is validated: path traversal, oversized entries, nested archives, and unsafe names are blocked or skipped.
3. `manifest.json` is located and parsed against a strict shape; permissions, host patterns, content scripts, CSP, `externally_connectable`, web-accessible resources and update URLs are collected.
4. JavaScript and HTML text files are parsed statically with acorn and pattern rules. Code is never passed to `eval`, imported, installed or executed.
5. Referenced domains are extracted and classified. Findings include file, line, evidence, confidence and a recommendation.
6. Findings, permissions and domains produce a privacy grade and a short prioritized action list in addition to the score.
7. Six weighted categories produce the 0-100 score:
   - permission exposure 25%
   - website access 20%
   - data-collection indicators 15%
   - remote-code indicators 20%
   - external-domain exposure 10%
   - source obfuscation 10%

Bands: 0-24 low, 25-49 moderate, 50-74 high, 75-100 critical. A score is a review aid, not a malware verdict; a reference to a domain or API does not prove that the extension acted on it. Recent scans can be restored from local browser storage, and reports can be exported as JSON, CSV or PDF.

Store URLs are optional. The server only accepts official Chrome Web Store, Microsoft Edge Add-ons and Firefox Add-ons hosts, follows an allowlisted redirect path, enforces a 15-second timeout and a 30 MB download cap, and rate-limits requests. Manual upload avoids all server contact.

## Content and localization

Interface strings live in `lib/i18n/messages/`. English is the canonical dictionary; the other 11 locales provide translated home and analyzer experiences, legal page shells and report labels. Long-form content is maintained in English by design and marked as English-only where no reviewed translation exists.

When adding a message key, add it to `en.ts`, then to every locale file. `getMessages` merges each locale over English, so missing keys fall back safely, but review coverage should stay complete.

## Testing

Unit tests cover CRX parsing, ZIP safety, manifest validation, permission and host analysis, JavaScript rules, domain extraction, scoring, privacy grades and actions, content registry invariants, report help links, locale message parity, crawler-safe locale routing, sitemap coverage, hreflang reciprocity, and cited primary sources. Playwright tests cover locale redirects, all 12 supported languages, RTL, navigation, the global 404, SEO metadata, crawler locale handling, robots/sitemap/llms, analyzer uploads, JSON and PDF export, report-to-guide links and error states.

## Deployment

The app is fully static except `/api/store`. Deploy to any Node or serverless host that supports Next.js route handlers, set `NEXT_PUBLIC_SITE_URL`, and keep `ALLOW_AI_CRAWLERS` accurate for your policy. Security headers, including a restrictive CSP, are configured in `next.config.ts`.
