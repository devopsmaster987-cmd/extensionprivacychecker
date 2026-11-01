# Backlink and Link-Earning Strategy

## Reality check

A repository cannot create external backlinks by itself. Backlinks come from other people publishing a link on a site you do not control. This document turns the site into a link-earning asset and gives a repeatable outreach process. It does not use paid links, private blog networks, automated link drops or reciprocal-link schemes.

## Linkable assets on the site

| Asset | URL | Why someone would link |
| --- | --- | --- |
| Free analyzer | `/en/analyzer` | Actionable tool for extension reviews |
| Version comparison | `/en/compare` | Before/after permission and domain diff |
| Methodology | `/en/methodology` | Transparent scoring and limits |
| Permission hubs | `/en/topics/...` | Reference material for permission questions |
| Guides | `/en/guides` | How-to, comparison and reference intent |
| Link and citation page | `/en/link-to-us` | Ready-made HTML, Markdown, badges and citations |
| Badge SVGs | `/badges/...` | Project pages, docs and READMEs |

## Priority targets

1. **Open-source project documentation**
   - Browser-extension boilerplates, privacy tools, security utilities and awesome lists.
   - Offer a short “audit your extension” link for contributor docs.
2. **Privacy and security directories**
   - Privacy-tool directories, browser-hardening guides and security-resource pages.
   - Submit only where the tool genuinely fits the directory’s scope.
3. **Developer communities**
   - Extension-development forums, Discord/Slack communities and subreddits.
   - Answer real questions first; link only when the analyzer directly helps.
4. **Comparisons and alternatives pages**
   - “Extension privacy checker alternatives”, “CRX analyzer tools”, “XPI inspector” listicles.
   - Send a concise correction or addition request with the exact page and a factual reason.
5. **Journalists and researchers**
   - Privacy, ad-tech and browser-security reporters.
   - Pitch a concrete finding or a methodology explainer, not a generic “please link to us” email.
6. **Educational material**
   - University security courses, digital-literacy guides and library privacy pages.
   - Offer the methodology page as a citable reference.
7. **Product directories and launch platforms**
   - Product Hunt, AlternativeTo, Slant and similar directories.
   - Use a factual listing; avoid vote rings and fake reviews.
8. **Community answers**
   - Stack Exchange, Reddit and support forums where the question matches the tool.
   - Disclose affiliation and avoid repetitive link dropping.

## 30/60/90 plan

### Days 1–30: foundation

- Publish the analyzer, methodology, comparison page and link-to-us page.
- Add badges to your own GitHub repositories and documentation.
- Submit to 5–10 relevant directories with accurate descriptions.
- Create a press one-pager with the tool’s scope, limits and canonical URL.
- Set up Search Console and a backlink tracker.

### Days 31–60: outreach

- Build a list of 50 relevant pages with a broken, outdated or missing tool reference.
- Send 10 personalized outreach emails per week.
- Publish one original data or methodology article that others can cite.
- Answer 5–10 real community questions without dropping links unless useful.
- Follow up once after 7–10 days; stop after that.

### Days 61–90: compounding

- Refresh the best-performing guides with new examples and review dates.
- Pitch a comparison or data story to 5 journalists or newsletters.
- Ask satisfied users and open-source maintainers for optional documentation links.
- Prune low-quality targets and double down on categories that produced real referrals.

## Outreach templates

### Directory or list inclusion

Subject: Tool suggestion for [page title]

Hi [name],

I maintain Extension Privacy Checker, a free static analyzer for CRX, XPI, ZIP and manifest.json packages. It runs locally, never executes extension code, and explains permissions, host access, domains and code findings.

I noticed [page title] lists tools for [specific use case]. If it fits your criteria, the analyzer is here: https://extensionprivacychecker.example/en/analyzer

A short factual description: “Free browser extension privacy checker that inspects packages locally and reports permissions, website access, external domains and static code indicators.”

No payment or reciprocal link is requested. Thanks for maintaining the list.

### Open-source README

Subject: Optional audit link for [project]

Hi [name],

Thanks for maintaining [project]. If your contributor docs ever need a way to inspect a packaged extension before release, Extension Privacy Checker is free and runs entirely in the browser: https://extensionprivacychecker.example/en/analyzer

It supports CRX, XPI, ZIP and standalone manifests and does not execute uploaded code. Feel free to ignore this if it is not useful for your readers.

### Journalist or researcher

Subject: Data/methodology for [topic]

Hi [name],

I saw your coverage of [specific article]. I maintain Extension Privacy Checker, which scores browser-extension packages on permissions, host access, data-collection indicators, remote code and obfuscation.

If useful, the methodology and limits are documented here: https://extensionprivacychecker.example/en/methodology

I can provide a short comment on why static extension analysis cannot prove malicious behavior, or walk through a specific permission pattern. No link request attached.

### Correction request

Subject: Correction on [page title]

Hi [name],

[Page title] says [specific claim]. The current documentation says [correct fact] and is reviewed at [URL].

If you update the page, this source may help: [methodology or guide URL]. Thanks for checking.

## Anchor text mix

Use natural variation:

- Extension Privacy Checker
- browser extension privacy checker
- extension permission analyzer
- CRX/XPI analyzer
- inspect extension permissions
- extension version comparison
- naked URL or brand-only anchor

Avoid exact-match anchors on every link and avoid linking the same URL repeatedly from one page.

## Quality rules

- Relevance beats volume. One link from a maintained security resource is worth more than dozens of unrelated directory links.
- No paid links, PBNs, link farms, comment spam or automated forum drops.
- Disclose affiliation in communities.
- Do not imply certification, endorsement or an official audit.
- Prefer editorial links in body content over footer or sidebar link blocks.
- Keep the destination page useful even without the link.

## Tracking

Track at minimum:

| Field | Example |
| --- | --- |
| Source URL | Page where the link appears |
| Domain | example.org |
| Target URL | `/en/analyzer` |
| Anchor text | “browser extension analyzer” |
| Date found | 2026-11-01 |
| Status | prospect / contacted / live / rejected |
| Contact | Editor or maintainer |
| Referral visits | From analytics |
| Notes | Follow-up date and context |

Review monthly. Remove targets that never respond after one follow-up. Prioritize sources that send referral traffic or appear in relevant search results.

## Measurement

- Search Console: links report, referring pages, impressions for branded queries.
- Analytics: referral sessions and assisted conversions.
- Rank tracking: branded and tool-intent queries.
- Outreach tracker: response rate, live-link rate and referral quality.

Backlinks are a distribution channel, not a substitute for useful pages. The strongest long-term link asset is the analyzer plus a methodology page that other people can cite.
