# Hero comparison tool

## Objective
Create a local, offline HTML comparison studio using authentic assets from Website_261107-1. Keep the source website untouched.

## Phases
- [x] Inspect original hero, authentic assets, project instructions, and runtime.
- [x] Implement adjustable preview, four presets, A/B comparison, persistence, and export.
- [x] Inspect the completed tool and validate controls, exported files, and asset paths.
- [x] Deliver local entry point and concise usage notes.

## Scope and decisions
- Local-only HTML/CSS/JavaScript. No package installation, external libraries, network assets, publishing, or Git operations.
- Preserve original English product claims, logos, and destination links.
- UI switches between Traditional Chinese and English within the same index. Four presets include the original visual baseline and three suggested directions.
- Embed preview assets as data URLs to support standalone export without an HTTP server.

## Errors
- No AGENTS.md files or existing graphify graph found; use provided user instructions and targeted source reads.
- File-protocol preview unavailable in the in-app browser. Used a loopback-only HTTP server scoped to the output folder; delivery remains an offline file.
- Mechanical design detector was degraded due to absent optional parser modules; retained the authentic supplied Inter font despite its generic-font warning.

## Same-page language update
- [x] Add adjacent Chinese and English buttons to the shared index header.
- [x] Translate existing DOM text and accessibility labels without replacing controls or preview documents.
- [x] Preserve design state, store language independently, and rebuild the standalone HTML.
- [x] Verify Chinese-English-Chinese round-trip and language preference after reload in the browser.
