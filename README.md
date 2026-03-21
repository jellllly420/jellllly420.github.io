# jellllly420.github.io

Personal website for Jelly (Zejun Zhao) — built with [Astro](https://astro.build), styled after the [claude.ai](https://claude.ai) aesthetic.

**Live:** [jellllly420.github.io](https://jellllly420.github.io)

## Sections

- **Blog** — Technical posts (MDX with code highlighting, math, diagrams)
- **Shelf** — Notes on books, movies, and other media
- **Travel** — Travel logs
- **Slides** — Presentations built with [Slidev](https://sli.dev)
- **About** — Bio and links

## Tech Stack

- **Astro v5** — static site generator with React islands
- **TypeScript** — all source code
- **MDX** — content authoring with rich media (KaTeX, Mermaid, Shiki)
- **Slidev** — Markdown-based slide decks with custom theme
- **Vitest** — unit tests
- **Playwright** — E2E tests

## Development

```bash
npm install
npm run dev          # dev server on localhost:4321
npm run build        # production build (slides + site)
npm run preview      # preview production build
npm run lint         # eslint + prettier
npm run check        # astro type check
npm test             # unit tests
npm run test:e2e     # E2E tests (requires build first)
```

## Adding Content

**Blog post** — create `src/content/blog/<slug>.mdx`:
```yaml
---
title: "Post Title"
date: 2026-03-21
tags: ["tag"]
excerpt: "One-line summary."
---
```

**Shelf entry** — create `src/content/shelf/<slug>.mdx`:
```yaml
---
title: "Review Title"
date: 2026-03-21
mediaType: book  # book | movie | show | podcast | article
mediaTitle: "Media Name"
mediaAuthor: "Author/Director"
tags: ["tag"]
excerpt: "Brief take."
---
```

**Travel log** — create `src/content/travel/<slug>.mdx`:
```yaml
---
title: "Trip Title"
date: 2026-03-21
tags: ["place"]
excerpt: "Brief summary."
---
```

**Slide deck:**
1. Create `slides/<slug>/slides.md` (Slidev format)
2. Add metadata in `src/content/slides/<slug>.mdx` with `slug: "<slug>"`
3. `npm run build:slides` to generate static HTML

## Deploy

Automated via GitHub Actions on push to `main`. Builds, tests, and deploys to GitHub Pages.
