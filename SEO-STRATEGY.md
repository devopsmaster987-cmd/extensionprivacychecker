# SEO and Answer-Engine Strategy

## Objective

Own the "can I trust this browser extension" decision moment with a free, private, evidence-based analyzer, then convert that trust into repeat use of the analyzer and its reports. Search is the primary acquisition channel; answer engines (ChatGPT, Claude, Perplexity, Gemini, Copilot) are the secondary channel.

## Audience and intent

| Audience | Intent | Primary pages |
| --- | --- | --- |
| Cautious installers | "Is this extension safe / what can it see?" | Home, analyzer, permissions hubs |
| Chrome/Edge users | "Check CRX permissions before installing" | CRX and Chrome permissions hubs, how-to guides |
| Firefox users | "Inspect an XPI file" | Firefox XPI hub, XPI analyzer article |
| Developers and reviewers | "What does this manifest field or permission mean?" | Manifest viewer, permission reference pages |
| Privacy researchers and journalists | "Compare extension privacy tools" | Comparisons, methodology, about |

## Positioning

- Free, no account, no upload of extension files.
- Static analysis with visible evidence, not a black-box trust score.
- Explicit limits: a high score is not a malware verdict, and a referenced domain is not proof of contact.
- Honest about language coverage: the interface is translated; long-form articles are English-only and labelled as such.

## URL architecture

- Locale prefix for every page: `/en`, `/es`, `/fr`, `/de`, `/it`, `/pt`, `/nl`, `/pl`, `/tr`, `/ar`, `/ur`, `/hi`.
- Home and analyzer are translated and self-canonical.
- Topic hubs: `/topics/[slug]` (11 hubs).
- Keyword articles: `/learn/[slug]` (31 articles).
- Guides and comparisons: `/guides` lists guide, comparison and reference intents.
- English-only content on non-English paths canonicalizes to `/en` and is `noindex`.
- Trailing-slash variants are avoided; canonical URLs are absolute and locale-explicit.

## Keyword clusters

1. **Tool intent** — browser extension privacy checker, extension permission checker, CRX analyzer, XPI analyzer, manifest viewer, extension risk scanner.
2. **Permission intent** — what does `<all_urls>` mean, tabs vs activeTab, cookies permission, host permissions, optional permissions, Manifest V3 permission list.
3. **File-format intent** — what is a CRX file, what is an XPI file, open CRX without installing, inspect ZIP extension.
4. **Risk intent** — extension reading browsing history, extension keylogging risk, remote code in extensions, extension data collection, obfuscated extension code.
5. **Comparison intent** — extension privacy checker vs antivirus, Chrome Web Store safety, Edge add-on review, Firefox add-on permissions.
6. **Developer intent** — Manifest V2 vs V3, content script matches, CSP in extensions, `externally_connectable`, web-accessible resources.

Each cluster has one hub and supporting keyword pages. Hubs link down to cluster pages; articles link up to the hub, sideways to related pages and into the analyzer.

## On-page standards

- Unique title (absolute, under ~60 characters where practical) and meta description per page.
- One `h1`; descriptive `h2`/`h3` hierarchy; short answer block near the top of every article.
- Visible "last reviewed" date and a methodology link on analysis-related pages.
- Internal links use descriptive anchors, not "click here".
- Tables for permission and risk comparisons; lists for steps; no thin pages.
- Every article includes an analyzer entry point and a link to the methodology or disclaimer.

## Structured data

- `Organization`, `WebSite` and `WebApplication` on the home page.
- `FAQPage` for home FAQs and article FAQs.
- `Article` for hubs and keyword pages, with `dateModified` tied to `lastReviewed`.
- `HowTo` where an article contains numbered steps.
- `BreadcrumbList` on all content pages.
- `ItemList` on topic, learn and guide indexes.
- Do not mark generated reports as reviews, ratings or official audits.

## International SEO

- `hreflang` for all 12 locales on translated paths, with `x-default` pointing to English.
- Non-translated paths expose only `en` and `x-default`.
- `lang` and `dir` are set on `<html>`; Arabic and Urdu render RTL.
- Locale cookie preserves choice but never overrides an explicit locale URL.
- Translated pages must not contain untranslated boilerplate that changes meaning; long-form English fallback is disclosed in the UI.

## AEO (answer-engine optimization)

- `llms.txt` summarizes the tool, scoring, limits, key pages, topic hubs and articles.
- `robots.txt` allows reputable AI crawlers by default (`ALLOW_AI_CRAWLERS`), with an easy opt-out.
- Answer-first paragraphs: a direct 1-3 sentence answer before detail.
- Stable, quotable facts: scoring weights, bands, file limits, processing model, supported formats.
- Clear attribution guidance in `llms.txt`; no claim of official audit or endorsement.
- Keep the methodology page as the canonical source for how scores are produced.

## Conversion path

1. Organic landing page answers the intent and explains limits.
2. Inline analyzer or a prominent "Analyze an extension" CTA.
3. Report shows evidence, category breakdown, JSON/PDF export and a new-scan path.
4. Related topic and guide links keep the session alive after a report.

## Measurement

- Search Console: impressions, clicks and queries by cluster; index coverage for locale and canonical rules.
- Analytics: analyzer starts, completed analyses, store fetches, exports, error rate and locale distribution. Avoid third-party analytics that contradict the privacy policy; use aggregate, privacy-respecting measurement.
- Track pages that rank but do not convert to analyzer starts; adjust CTA placement and answer blocks.
- Monitor 404s and redirect loops from locale inference and fixed content slugs.

## Content roadmap

1. Expand the highest-impression permission and file-format clusters with updated screenshots and examples.
2. Add comparison pages only where the comparison is factual, dated and methodologically fair.
3. Add developer-facing reference pages for manifest fields and CSP behavior.
4. Review and translate the highest-performing articles when a qualified reviewer is available; never publish machine-only translations as reviewed.
5. Refresh `lastReviewed` only after a real content review, not on every deploy.

## Risks and guardrails

- **Overclaiming:** never say an extension is safe or malicious based on a score.
- **Stale store behavior:** store endpoints change; keep manual upload prominent and document failures.
- **Translation drift:** translated UI must match the English meaning; long-form fallback must be labelled.
- **Duplicate content:** enforce canonical and `noindex` rules for English-only paths.
- **Thin programmatic pages:** every hub and keyword page must answer a distinct query with original analysis.
- **Crawl waste:** keep `/api/` disallowed and avoid indexing error or utility routes.
