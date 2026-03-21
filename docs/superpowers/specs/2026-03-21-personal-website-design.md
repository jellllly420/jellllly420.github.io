# Personal Website — Design Specification

**Author:** Jelly (Zejun Zhao)
**Date:** 2026-03-21
**Repository:** jellllly420/jellllly420.github.io
**Hosting:** GitHub Pages (static)

## Overview

A personal website hosted on GitHub Pages, styled after the claude.ai / Anthropic design aesthetic. The site serves as a self-introduction (interactive timeline CV), tech blog, reading notes, travel logs, and meeting slides hub.

## Architecture

### Framework & Stack

- **Astro v5** — static site generator, content-first
- **React** — interactive islands via `@astrojs/react` (timeline CV, theme toggle, image lightbox)
- **TypeScript** — all source code, config, and components
- **MDX** — content authoring for blog, reading notes, travel logs
- **Slidev** — Markdown-based slide decks with custom theme
- **CSS custom properties** — theming (dark/light mode), no CSS framework

### Key Dependencies

| Package | Purpose |
|---|---|
| `astro` | Static site generator |
| `@astrojs/react` | React island integration |
| `@astrojs/mdx` | MDX content support |
| `@astrojs/sitemap` | Auto-generated sitemap |
| `remark-math` + `rehype-katex` | LaTeX math rendering |
| `rehype-mermaid` | Diagram rendering (build-time SVG) |
| `shiki` | Code syntax highlighting (Astro built-in) |
| `slidev` | Slide deck authoring and static export |
| `vitest` | Unit testing |
| `playwright` | E2E testing |
| `eslint` | Code linting |
| `prettier` | Code formatting |

### Project Structure

```
jellllly420.github.io/
├── src/
│   ├── components/          # Reusable Astro components
│   │   └── react/           # React islands (timeline, theme toggle, lightbox)
│   ├── content/             # Astro Content Collections
│   │   ├── blog/            # Tech blog posts (MDX)
│   │   ├── reading/         # Reading notes (MDX)
│   │   ├── travel/          # Travel logs (MDX)
│   │   └── slides/          # Slide deck metadata + Markdown sources
│   ├── layouts/             # Page layouts (Base, Post, Slides)
│   ├── pages/               # File-based routing
│   │   ├── index.astro      # Homepage (hero + timeline CV)
│   │   ├── blog/
│   │   │   ├── index.astro  # Blog listing (card grid)
│   │   │   └── [slug].astro # Individual blog post
│   │   ├── reading/
│   │   │   ├── index.astro  # Reading notes listing
│   │   │   └── [slug].astro # Individual reading note
│   │   ├── travel/
│   │   │   ├── index.astro  # Travel logs listing
│   │   │   └── [slug].astro # Individual travel log
│   │   └── slides/
│   │       └── index.astro  # Slides gallery (decks served from public/ as raw static HTML)
│   └── styles/              # Global CSS, theme variables, typography
│       ├── global.css       # Reset, base styles, animations
│       ├── theme.css        # CSS custom properties (light/dark)
│       └── typography.css   # Font definitions, heading scale
├── public/                  # Static assets
│   ├── fonts/               # Self-hosted DM Sans, JetBrains Mono
│   └── slides/              # Pre-built Slidev static exports
├── slidev-theme/            # Custom Slidev theme matching site aesthetic
│   ├── styles/
│   └── layouts/
├── slides/                  # Slidev deck source Markdown files
├── astro.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── .eslintrc.cjs
├── .prettierrc
└── .github/
    └── workflows/
        └── deploy.yml       # Build + test + deploy pipeline
```

## Content Collection Schemas

### Blog (`src/content/blog/`)

```yaml
title: string (required)
date: date (required)
tags: string[] (optional)
excerpt: string (optional — auto-generated from first paragraph if missing)
pinned: boolean (optional, default false — marks as featured hero card)
cardColor: string (optional — one of: terracotta, sand, sage, slate, clay, dusk; defaults to rotation by index)
```

### Reading (`src/content/reading/`)

```yaml
title: string (required)
date: date (required)
bookTitle: string (required)
bookAuthor: string (required)
tags: string[] (optional)
excerpt: string (optional)
pinned: boolean (optional)
cardColor: string (optional)
```

### Travel (`src/content/travel/`)

```yaml
title: string (required)
date: date (required)
heroImage: string (optional — path to hero image)
tags: string[] (optional)
excerpt: string (optional)
pinned: boolean (optional)
cardColor: string (optional)
```

### Slides (`src/content/slides/`)

```yaml
title: string (required)
date: date (required)
slug: string (required — maps to public/slides/[slug]/)
tags: string[] (optional)
excerpt: string (optional)
cardColor: string (optional)
```

### Card Color Assignment

Card background colors are assigned by **rotating through the palette by index** (terracotta → sand → sage → slate → clay → dusk → repeat). Authors can override per-post via the `cardColor` frontmatter field.

## Design System

### Typography

- **Body + Headings:** DM Sans (Google Fonts, self-hosted)
  - Headings differentiated by weight (600–700) and size, not font family
  - Body: 400 weight, 1rem, line-height 1.7
  - Reading width capped at ~65ch
- **Code:** JetBrains Mono (self-hosted)
  - No ligatures (`font-variant-ligatures: none`)
  - 0.9rem size
  - Syntax highlighting via Shiki

### Color Palette

**Light mode (default warm):**

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#FAF9F6` | Page background |
| `--surface` | `#FFFFFF` | Cards, content areas |
| `--text` | `#1A1A1A` | Primary text |
| `--text-muted` | `#6B6560` | Secondary text, dates |
| `--accent` | `#C4642D` | Links, highlights, primary accent |
| `--border` | `#E8E2D9` | Dividers, card borders |

**Dark mode:**

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#1A1A1A` | Page background |
| `--surface` | `#2A2A28` | Cards, content areas |
| `--text` | `#ECECEA` | Primary text |
| `--text-muted` | `#A8A29E` | Secondary text, dates |
| `--accent` | `#E07A3A` | Links, highlights, primary accent |
| `--border` | `#333330` | Dividers, card borders |

**Card background palette (used for card top areas):**

| Name | Value |
|---|---|
| terracotta | `#C4642D` |
| sand | `#D4A574` |
| sage | `#7D8B6E` |
| slate | `#6B7B8D` |
| clay | `#B07856` |
| dusk | `#8B6F7E` |

### Theme Switching

- Respects `prefers-color-scheme` OS preference on first visit
- Manual toggle in nav bar overrides and persists choice to `localStorage`
- Theme applied via `data-theme="light|dark"` attribute on `<html>`
- Smooth 200ms transition on all themed properties

### Motion & Animation

- **Page load:** Fade-in (opacity 0→1) + subtle upward translate (8px), 300ms ease-out
- **Scroll reveals:** IntersectionObserver triggers fade-in as elements enter viewport
- **Hover states:** Color transitions (150ms), cards lift with soft shadow on hover
- **Reduced motion:** All animations respect `prefers-reduced-motion: reduce`

## Page Designs

### Navigation

- Top nav bar, sticky
- Left: site name "Jelly" (link to home)
- Right: Blog · Reading · Travel · Slides · About + theme toggle icon
- Collapses to hamburger menu on mobile
- Subtle bottom border, transparent/matching background

### About (`/about/`)

- Brief personal narrative / bio
- Links to GitHub, LinkedIn, email
- Minimal page — could expand later

### Homepage (`/`)

- **Hero section:** Name "Jelly", one-liner tagline, subtle entrance animation
- **Interactive timeline CV** (React island):
  - Vertical timeline with nodes for education/career milestones
  - Nodes connected by a vertical line
  - Each node expands on click to reveal details
  - Scroll-triggered animation — nodes fade in as they enter viewport
  - Mobile: full-width stacked cards

### Listing Pages (`/blog/`, `/reading/`, `/travel/`, `/slides/`)

- **Page header:** Section title + tagline
- **Hero/featured card:** Large card for the latest or pinned post, terracotta background, two-column layout (text left, visual right)
- **Card grid:** 3-column grid of near-square cards (`aspect-ratio: 1 / 1.05`)
  - Colored top area (from card palette) with placeholder art or category icon
  - White body area with: category tag, title (2-line clamp), excerpt (2-line clamp), date
  - Hover: lift + soft shadow
- **Container:** Centered, `max-width: 1280px`
- Responsive: 2 columns on tablet, 1 on mobile

### Post Pages (`/blog/[slug]/`, `/reading/[slug]/`, `/travel/[slug]/`)

- Single-column, centered, max-width ~720px
- Title + date + tags at top
- MDX body with rich media:
  - **Code blocks:** Shiki highlighting, copy button, optional filename header
  - **Images:** Click-to-expand lightbox (React island), lazy loading, captions
  - **YouTube:** Custom `<YouTube>` MDX component, responsive 16:9 embed
  - **Math:** KaTeX via remark-math + rehype-katex
  - **Diagrams:** Mermaid rendered to SVG at build time
  - **Callouts:** Styled blockquote variants (info, warning, tip)
- Table of contents sidebar on wide screens (auto-generated from headings), hidden on mobile
- Previous/next post links at bottom

### Reading Notes Specifics

- Same layout as blog posts
- Additional metadata: book title, author displayed in post header

### Travel Logs Specifics

- Same layout as blog posts
- Optional hero image per post
- Emphasis on image-heavy content rendering

### Slides (`/slides/`)

- Card grid listing of available slide decks (same grid as other sections)
- Each deck links to `/slides/[slug]/` serving pre-built Slidev static HTML
- Slidev static exports live in `public/slides/[slug]/` and are served directly by Astro (no `.astro` page wrapper) — they use Slidev's own navigation and the custom theme provides visual consistency
- Slidev decks authored in Markdown with a custom theme matching the site aesthetic

## Slides Integration

### Slidev Custom Theme

- Local theme directory `slidev-theme/` in the repo
- Applies DM Sans, terracotta/sand/sage color palette, warm backgrounds
- Custom layouts: cover, default, two-column, section divider
- Each deck references theme via frontmatter: `theme: ./slidev-theme`

### Build Pipeline

- Slide deck source files live in `slides/` directory (Markdown)
- Pre-build script runs `slidev build` for each deck
- Static HTML output goes to `public/slides/[slug]/`
- Astro then bundles these into the final `dist/`

## Build & Deploy

### GitHub Actions Workflow

```yaml
# Trigger: push to main
# Steps:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run lint (eslint + prettier --check)
5. Run type check (astro check)
6. Run unit tests (vitest)
7. Pre-build Slidev decks (slidev build for each deck)
8. Build site (astro build)
9. Run E2E tests (playwright against built site)
10. Deploy dist/ to GitHub Pages
```

### Development

- `npm run dev` — Astro dev server on port 4321
- `npm run build` — full production build
- `npm run preview` — preview production build locally
- `npm run lint` — eslint + prettier check
- `npm run test` — vitest unit tests
- `npm run test:e2e` — playwright E2E tests

## Testing Strategy

### Unit Tests (vitest)

- Theme toggle logic (localStorage persistence, OS preference detection)
- Content collection helpers (date formatting, slug generation, tag extraction)
- Utility functions

### E2E Tests (playwright)

- Navigation between all sections
- Dark/light mode toggle + persistence across page loads
- Blog post rendering (code blocks, images, math, diagrams)
- Timeline CV interactivity (expand/collapse nodes)
- Responsive layout at mobile/tablet/desktop breakpoints
- Slide deck loading and navigation
- Card grid layout and hover interactions

### CI Checks

- `astro check` — TypeScript + Astro template validation
- `eslint` — code quality, unused imports, accessibility
- `prettier --check` — consistent formatting
- All checks must pass before deploy
