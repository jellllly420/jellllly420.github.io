# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal website for Jelly (Zejun Zhao) hosted on GitHub Pages, styled after claude.ai's aesthetic, with blog, reading notes, travel logs, slides, and an interactive timeline CV.

**Architecture:** Astro v5 static site with React islands for interactivity (theme toggle, timeline CV, image lightbox). Content authored in MDX with rich media support. Slidev for slide decks with a custom theme. Borderless, text-forward card design with DM Sans typography.

**Tech Stack:** Astro 5, React 19, TypeScript, MDX, Slidev, Vitest, Playwright, ESLint, Prettier

**Spec:** `docs/superpowers/specs/2026-03-21-personal-website-design.md`

---

## File Map

### New Files

```
# Config & tooling
astro.config.ts                    — Astro config with React, MDX, sitemap integrations
src/content.config.ts              — Content collection schemas (blog, reading, travel, slides)
tsconfig.json                      — TypeScript config extending Astro's strictest preset
vitest.config.ts                   — Vitest config for unit tests
playwright.config.ts               — Playwright config for E2E tests
.eslintrc.cjs                      — ESLint config (Astro + React + TypeScript)
.prettierrc                        — Prettier config
.prettierignore                    — Ignore dist, node_modules, public/slides
.gitignore                         — Node + Astro ignores
package.json                       — Dependencies and scripts

# Styles
src/styles/theme.css               — CSS custom properties for light/dark themes
src/styles/typography.css           — DM Sans + JetBrains Mono font-face, type scale
src/styles/global.css              — Reset, base styles, animations, scroll reveal

# Layouts
src/layouts/BaseLayout.astro       — HTML shell, head, nav, footer, theme script
src/layouts/PostLayout.astro       — Single post layout (blog/reading/travel)
src/layouts/ListingLayout.astro    — Section listing layout (header + card grid)

# Components — Astro
src/components/Nav.astro           — Top nav bar with mobile hamburger
src/components/Footer.astro        — Site footer
src/components/Card.astro          — Borderless text-forward post card
src/components/FeaturedPost.astro  — Featured/pinned post with larger typography
src/components/CardGrid.astro      — 3-column responsive card grid
src/components/PostHeader.astro    — Post title, date, tags display
src/components/PostNav.astro       — Previous/next post navigation
src/components/TableOfContents.astro — Auto-generated TOC sidebar
src/components/YouTube.astro       — YouTube embed MDX component
src/components/Callout.astro       — Styled blockquote variants (info/warning/tip)
src/components/CodeBlock.astro     — Code block wrapper with copy button + filename

# Components — React islands
src/components/react/ThemeToggle.tsx    — Dark/light mode toggle button
src/components/react/Timeline.tsx       — Interactive CV timeline
src/components/react/Lightbox.tsx       — Image click-to-expand lightbox
src/components/react/MobileMenu.tsx     — Mobile hamburger menu

# Pages
src/pages/index.astro             — Homepage (hero + timeline CV)
src/pages/about.astro             — About / bio page
src/pages/blog/index.astro        — Blog listing
src/pages/blog/[slug].astro       — Blog post
src/pages/reading/index.astro     — Reading notes listing
src/pages/reading/[slug].astro    — Reading note post
src/pages/travel/index.astro      — Travel logs listing
src/pages/travel/[slug].astro     — Travel log post
src/pages/slides/index.astro      — Slides gallery

# Utilities
src/utils/theme.ts                — Theme detection, persistence, toggle logic
src/utils/content.ts              — Content helpers (sort, filter, featured post)
src/utils/date.ts                 — Date formatting utility

# Content — sample posts
src/content/blog/hello-world.mdx  — Sample blog post
src/content/reading/sample.mdx    — Sample reading note
src/content/travel/sample.mdx     — Sample travel log
src/content/slides/sample.mdx     — Sample slide deck metadata

# Static assets
public/fonts/DMSans-Regular.woff2
public/fonts/DMSans-Medium.woff2
public/fonts/DMSans-SemiBold.woff2
public/fonts/DMSans-Bold.woff2
public/fonts/JetBrainsMono-Regular.woff2
public/fonts/JetBrainsMono-Medium.woff2
public/favicon.svg

# Slidev
slidev-theme/package.json         — Theme metadata
slidev-theme/styles/index.ts      — Theme style entry
slidev-theme/styles/base.css      — Base styles matching site aesthetic
slidev-theme/layouts/cover.vue    — Cover slide layout
slidev-theme/layouts/default.vue  — Default slide layout
slides/sample/slides.md           — Sample Slidev deck
scripts/build-slides.sh           — Pre-build script for all Slidev decks

# CI/CD
.github/workflows/deploy.yml      — GitHub Actions build + test + deploy

# Tests
src/utils/__tests__/theme.test.ts    — Theme logic unit tests
src/utils/__tests__/content.test.ts  — Content helper unit tests
src/utils/__tests__/date.test.ts     — Date formatting unit tests
tests/e2e/navigation.spec.ts         — E2E: nav between sections
tests/e2e/theme.spec.ts              — E2E: dark/light mode toggle
tests/e2e/blog.spec.ts               — E2E: blog listing + post rendering
tests/e2e/homepage.spec.ts           — E2E: hero + timeline
```

---

## Task 1: Project Scaffolding & Tooling

**Files:**

- Create: `package.json`, `astro.config.ts`, `tsconfig.json`, `.eslintrc.cjs`, `.prettierrc`, `.prettierignore`, `.gitignore`, `vitest.config.ts`, `playwright.config.ts`

- [ ] **Step 1: Initialize Astro project**

Run:

```bash
cd /workspaces/jellllly420.github.io
npm create astro@latest -- --template minimal --no-install --typescript strictest .
```

This creates a minimal Astro project in the current directory. Say yes to overwriting if prompted.

- [ ] **Step 2: Install core dependencies**

Run:

```bash
npm install astro @astrojs/react @astrojs/mdx @astrojs/sitemap react react-dom remark-math rehype-katex rehype-mermaid
```

- [ ] **Step 3: Install dev dependencies**

Run:

```bash
npm install -D typescript @types/react @types/react-dom vitest @testing-library/react @testing-library/jest-dom jsdom eslint eslint-plugin-astro @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier prettier-plugin-astro @playwright/test
```

- [ ] **Step 4: Configure Astro**

Write `astro.config.ts`:

```typescript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';

export default defineConfig({
  site: 'https://jellllly420.github.io',
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, [rehypeMermaid, { strategy: 'pre-mermaid' }]],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
```

- [ ] **Step 5: Configure TypeScript**

Write `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strictest",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 6: Configure Vitest**

Write `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/__tests__/**/*.test.ts', 'src/**/__tests__/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

- [ ] **Step 7: Configure Playwright**

Write `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'npm run preview',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:4321',
  },
});
```

- [ ] **Step 8: Configure ESLint**

Write `.eslintrc.cjs`:

```javascript
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  ],
};
```

- [ ] **Step 9: Configure Prettier**

Write `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": { "parser": "astro" }
    }
  ]
}
```

Write `.prettierignore`:

```
dist
node_modules
public/slides
public/fonts
```

- [ ] **Step 10: Write .gitignore**

Write `.gitignore`:

```
node_modules/
dist/
.astro/
.superpowers/
*.env
.DS_Store
```

- [ ] **Step 11: Add npm scripts to package.json**

Add to the `"scripts"` section of `package.json`:

```json
{
  "dev": "astro dev --host 0.0.0.0",
  "build": "astro build",
  "preview": "astro preview --host 0.0.0.0",
  "check": "astro check",
  "lint": "eslint . --ext .ts,.tsx,.astro && prettier --check .",
  "lint:fix": "eslint . --ext .ts,.tsx,.astro --fix && prettier --write .",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

- [ ] **Step 12: Install Playwright browsers**

Run:

```bash
npx playwright install --with-deps chromium
```

- [ ] **Step 13: Verify setup builds**

Run:

```bash
npm run build
```

Expected: Clean build with no errors.

- [ ] **Step 14: Commit**

```bash
git add package.json package-lock.json astro.config.ts tsconfig.json vitest.config.ts playwright.config.ts .eslintrc.cjs .prettierrc .prettierignore .gitignore src/
git commit -m "feat: scaffold Astro project with React, MDX, tooling"
```

---

## Task 2: Design System — Fonts & CSS

**Files:**

- Create: `src/styles/theme.css`, `src/styles/typography.css`, `src/styles/global.css`
- Create: `public/fonts/` (font files), `public/favicon.svg`

- [ ] **Step 1: Download DM Sans font files**

Run:

```bash
mkdir -p public/fonts
# Download DM Sans woff2 files from Google Fonts
curl -L "https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwA_C5SQw.woff2" -o public/fonts/DMSans-Regular.woff2
curl -L "https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAoi5SQw.woff2" -o public/fonts/DMSans-Medium.woff2
curl -L "https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwATC5SQw.woff2" -o public/fonts/DMSans-SemiBold.woff2
curl -L "https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwARy5SQw.woff2" -o public/fonts/DMSans-Bold.woff2
```

- [ ] **Step 2: Download JetBrains Mono font files**

Run:

```bash
curl -L "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOTk6OThhvA.woff2" -o public/fonts/JetBrainsMono-Regular.woff2
curl -L "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTPlOTk6OThhvA.woff2" -o public/fonts/JetBrainsMono-Medium.woff2
```

- [ ] **Step 3: Create favicon**

Write `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#C4642D"/>
  <text x="16" y="23" font-family="system-ui,sans-serif" font-size="20" font-weight="700" fill="white" text-anchor="middle">J</text>
</svg>
```

- [ ] **Step 4: Write typography.css**

Write `src/styles/typography.css`:

```css
@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/DMSans-Regular.woff2') format('woff2');
}

@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/DMSans-Medium.woff2') format('woff2');
}

@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/DMSans-SemiBold.woff2') format('woff2');
}

@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/DMSans-Bold.woff2') format('woff2');
}

@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
}

@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/JetBrainsMono-Medium.woff2') format('woff2');
}

body {
  font-family:
    'DM Sans',
    system-ui,
    -apple-system,
    sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.7;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family:
    'DM Sans',
    system-ui,
    -apple-system,
    sans-serif;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
}
h2 {
  font-size: 1.75rem;
  font-weight: 700;
}
h3 {
  font-size: 1.25rem;
  font-weight: 600;
}
h4 {
  font-size: 1.1rem;
  font-weight: 600;
}

code,
pre,
kbd,
samp {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-variant-ligatures: none;
  font-size: 0.9rem;
}
```

- [ ] **Step 5: Write theme.css**

Write `src/styles/theme.css`:

```css
:root,
[data-theme='light'] {
  --bg: #faf9f6;
  --surface: #ffffff;
  --text: #1a1a1a;
  --text-muted: #6b6560;
  --accent: #c4642d;
  --accent-subtle: rgba(196, 100, 45, 0.08);
  --border: #e8e2d9;
  color-scheme: light;
}

[data-theme='dark'] {
  --bg: #1a1a1a;
  --surface: #2a2a28;
  --text: #ececea;
  --text-muted: #a8a29e;
  --accent: #e07a3a;
  --accent-subtle: rgba(224, 122, 58, 0.1);
  --border: #333330;
  color-scheme: dark;
}
```

- [ ] **Step 6: Write global.css**

Write `src/styles/global.css`:

```css
@import './theme.css';
@import './typography.css';

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition:
    background-color 0.2s,
    color 0.2s;
}

a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.15s;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Container */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Reading width for post content */
.prose {
  max-width: 720px;
  margin: 0 auto;
}

.prose > * + * {
  margin-top: 1.5rem;
}

.prose h2 {
  margin-top: 2.5rem;
}

.prose h3 {
  margin-top: 2rem;
}

.prose ul,
.prose ol {
  padding-left: 1.5rem;
}

.prose blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  color: var(--text-muted);
  font-style: italic;
}

.prose pre {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  overflow-x: auto;
}

.prose code:not(pre code) {
  background: var(--accent-subtle);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.prose img {
  border-radius: 8px;
  cursor: pointer;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeInUp 0.3s ease-out both;
}

.scroll-reveal {
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.4s ease-out,
    transform 0.4s ease-out;
}

.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }

  .scroll-reveal {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 7: Verify lint passes**

Run:

```bash
npm run lint
```

Fix any issues.

- [ ] **Step 8: Commit**

```bash
git add src/styles/ public/fonts/ public/favicon.svg
git commit -m "feat: add design system — DM Sans, JetBrains Mono, theme tokens, animations"
```

---

## Task 3: Theme Toggle Logic (TDD)

**Files:**

- Create: `src/utils/theme.ts`, `src/utils/__tests__/theme.test.ts`
- Create: `src/components/react/ThemeToggle.tsx`

- [ ] **Step 1: Write failing tests for theme utility**

Write `src/utils/__tests__/theme.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getInitialTheme, toggleTheme, applyTheme } from '../theme';

describe('theme utils', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('getInitialTheme', () => {
    it('returns stored theme from localStorage', () => {
      localStorage.setItem('theme', 'dark');
      expect(getInitialTheme()).toBe('dark');
    });

    it('returns light when localStorage is empty and no OS preference', () => {
      expect(getInitialTheme()).toBe('light');
    });

    it('returns dark when OS prefers dark and no stored theme', () => {
      vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
      expect(getInitialTheme()).toBe('dark');
      vi.unstubAllGlobals();
    });
  });

  describe('toggleTheme', () => {
    it('toggles light to dark', () => {
      expect(toggleTheme('light')).toBe('dark');
    });

    it('toggles dark to light', () => {
      expect(toggleTheme('dark')).toBe('light');
    });
  });

  describe('applyTheme', () => {
    it('sets data-theme attribute on document', () => {
      applyTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('persists theme to localStorage', () => {
      applyTheme('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npx vitest run src/utils/__tests__/theme.test.ts
```

Expected: FAIL — module `../theme` not found.

- [ ] **Step 3: Implement theme utility**

Write `src/utils/theme.ts`:

```typescript
export type Theme = 'light' | 'dark';

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function toggleTheme(current: Theme): Theme {
  return current === 'light' ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
npx vitest run src/utils/__tests__/theme.test.ts
```

Expected: All 5 tests PASS.

- [ ] **Step 5: Write ThemeToggle React component**

Write `src/components/react/ThemeToggle.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { getInitialTheme, toggleTheme, applyTheme, type Theme } from '@/utils/theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const next = toggleTheme(theme);
    setTheme(next);
    applyTheme(next);
  };

  if (!mounted) return <button className="theme-toggle" aria-label="Toggle theme" />;

  return (
    <button
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/utils/theme.ts src/utils/__tests__/theme.test.ts src/components/react/ThemeToggle.tsx
git commit -m "feat: add theme toggle with TDD — localStorage persistence, OS preference"
```

---

## Task 4: Base Layout & Navigation

**Files:**

- Create: `src/layouts/BaseLayout.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`, `src/components/react/MobileMenu.tsx`

- [ ] **Step 1: Write MobileMenu React island**

Write `src/components/react/MobileMenu.tsx`:

```tsx
import { useState } from 'react';

interface Props {
  links: { href: string; label: string }[];
  currentPath: string;
}

export default function MobileMenu({ links, currentPath }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>
      {open && (
        <div className="mobile-menu-overlay" onClick={() => setOpen(false)}>
          <nav className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className={currentPath.startsWith(href) ? 'active' : ''}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Write Nav component**

Write `src/components/Nav.astro`:

```astro
---
import ThemeToggle from './react/ThemeToggle';
import MobileMenu from './react/MobileMenu';

const links = [
  { href: '/blog', label: 'Blog' },
  { href: '/reading', label: 'Reading' },
  { href: '/travel', label: 'Travel' },
  { href: '/slides', label: 'Slides' },
  { href: '/about', label: 'About' },
];

const currentPath = Astro.url.pathname;
---

<header class="nav-header">
  <div class="container nav-container">
    <a href="/" class="nav-brand">Jelly</a>
    <div class="nav-links">
      {
        links.map(({ href, label }) => (
          <a href={href} class:list={[{ active: currentPath.startsWith(href) }]}>
            {label}
          </a>
        ))
      }
      <ThemeToggle client:load />
    </div>
    <div class="nav-mobile">
      <ThemeToggle client:load />
      <MobileMenu client:load links={links} currentPath={currentPath} />
    </div>
  </div>
</header>

<style>
  .nav-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    transition: background-color 0.2s;
  }

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
  }

  .nav-brand {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text);
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .nav-links a {
    color: var(--text-muted);
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.15s;
  }

  .nav-links a:hover,
  .nav-links a.active {
    color: var(--text);
  }

  .nav-mobile {
    display: none;
    align-items: center;
    gap: 0.5rem;
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
    .nav-mobile {
      display: flex;
    }
  }
</style>
```

- [ ] **Step 3: Write Footer component**

Write `src/components/Footer.astro`:

```astro
---
const year = new Date().getFullYear();
---

<footer class="footer">
  <div class="container">
    <p>&copy; {year} Jelly. Built with Astro.</p>
  </div>
</footer>

<style>
  .footer {
    padding: 2rem 0;
    border-top: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 0.85rem;
    text-align: center;
    margin-top: 4rem;
  }
</style>
```

- [ ] **Step 4: Write BaseLayout**

Write `src/layouts/BaseLayout.astro`:

```astro
---
import Nav from '@/components/Nav.astro';
import Footer from '@/components/Footer.astro';
import '@/styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Technical musings, random thoughts, and other stuff.' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.css" />
    <title>{title} | Jelly</title>
    <script is:inline>
      (function () {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark' || stored === 'light') {
          document.documentElement.setAttribute('data-theme', stored);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      })();
    </script>
  </head>
  <body>
    <Nav />
    <main class="animate-in">
      <slot />
    </main>
    <Footer />
    <script>
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.1 },
      );
      document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    </script>
  </body>
</html>
```

Note: The inline `<script>` in `<head>` prevents flash of wrong theme (FOUC). It runs before paint, synchronously setting the `data-theme` attribute.

- [ ] **Step 5: Create a minimal index page to verify**

Write `src/pages/index.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout title="Home">
  <div class="container" style="padding: 4rem 2rem;">
    <h1>Jelly</h1>
    <p style="color: var(--text-muted); margin-top: 0.5rem;">Site under construction.</p>
  </div>
</BaseLayout>
```

- [ ] **Step 6: Verify dev server runs**

Run:

```bash
npm run dev
```

Expected: Server starts on port 4321. Page shows nav with all links, "Jelly" brand, theme toggle, and footer.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/ src/components/Nav.astro src/components/Footer.astro src/components/react/MobileMenu.tsx src/pages/index.astro
git commit -m "feat: add base layout, navigation, footer, mobile menu"
```

---

## Task 5: Content Collections & Utility Helpers (TDD)

**Files:**

- Create: `src/content.config.ts`, `src/utils/content.ts`, `src/utils/date.ts`
- Create: `src/utils/__tests__/content.test.ts`, `src/utils/__tests__/date.test.ts`
- Create: sample content files

- [ ] **Step 1: Write failing tests for date utility**

Write `src/utils/__tests__/date.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate, formatDateShort } from '../date';

describe('date utils', () => {
  it('formats date as "March 21, 2026"', () => {
    expect(formatDate(new Date('2026-03-21'))).toBe('March 21, 2026');
  });

  it('formats date short as "Mar 21, 2026"', () => {
    expect(formatDateShort(new Date('2026-03-21'))).toBe('Mar 21, 2026');
  });

  it('handles string dates', () => {
    expect(formatDate(new Date('2023-02-21'))).toBe('February 21, 2023');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/__tests__/date.test.ts`

Expected: FAIL.

- [ ] **Step 3: Implement date utility**

Write `src/utils/date.ts`:

```typescript
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/utils/__tests__/date.test.ts`

Expected: All 3 tests PASS.

- [ ] **Step 5: Write failing tests for content utility**

Write `src/utils/__tests__/content.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { sortByDate, getFeaturedPost } from '../content';

const mockPosts = [
  { data: { title: 'Old', date: new Date('2023-01-01'), pinned: false } },
  { data: { title: 'New', date: new Date('2024-06-15'), pinned: false } },
  { data: { title: 'Mid', date: new Date('2023-06-15'), pinned: false } },
];

const mockPostsWithPinned = [
  { data: { title: 'Old', date: new Date('2023-01-01'), pinned: true } },
  { data: { title: 'New', date: new Date('2024-06-15'), pinned: false } },
];

describe('content utils', () => {
  describe('sortByDate', () => {
    it('sorts posts newest first', () => {
      const sorted = sortByDate(mockPosts);
      expect(sorted[0].data.title).toBe('New');
      expect(sorted[1].data.title).toBe('Mid');
      expect(sorted[2].data.title).toBe('Old');
    });
  });

  describe('getFeaturedPost', () => {
    it('returns pinned post when available', () => {
      const featured = getFeaturedPost(mockPostsWithPinned);
      expect(featured.data.title).toBe('Old');
    });

    it('returns newest post when no pinned post', () => {
      const featured = getFeaturedPost(mockPosts);
      expect(featured.data.title).toBe('New');
    });
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/utils/__tests__/content.test.ts`

Expected: FAIL.

- [ ] **Step 7: Implement content utility**

Write `src/utils/content.ts`:

```typescript
interface HasDate {
  data: { date: Date; pinned?: boolean };
}

export function sortByDate<T extends HasDate>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getFeaturedPost<T extends HasDate>(posts: T[]): T {
  const pinned = posts.find((p) => p.data.pinned);
  if (pinned) return pinned;
  return sortByDate(posts)[0];
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/utils/__tests__/content.test.ts`

Expected: All 3 tests PASS.

- [ ] **Step 9: Define content collection schemas**

Write `src/content.config.ts`:

```typescript
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional().default([]),
    excerpt: z.string().optional(),
    pinned: z.boolean().optional().default(false),
  }),
});

const reading = defineCollection({
  loader: glob({ base: './src/content/reading', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    bookTitle: z.string(),
    bookAuthor: z.string(),
    tags: z.array(z.string()).optional().default([]),
    excerpt: z.string().optional(),
    pinned: z.boolean().optional().default(false),
  }),
});

const travel = defineCollection({
  loader: glob({ base: './src/content/travel', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    excerpt: z.string().optional(),
    pinned: z.boolean().optional().default(false),
  }),
});

const slides = defineCollection({
  loader: glob({ base: './src/content/slides', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    slug: z.string(),
    tags: z.array(z.string()).optional().default([]),
    excerpt: z.string().optional(),
  }),
});

export const collections = { blog, reading, travel, slides };
```

- [ ] **Step 10: Create sample blog post**

Write `src/content/blog/hello-world.mdx`:

```mdx
---
title: 'Hello World'
date: 2023-02-21
tags: ['meta']
excerpt: 'The obligatory first post. Why I started this blog and what to expect.'
pinned: true
---

# Hello World

Welcome to my blog! This is where I'll share technical musings, random thoughts, and other stuff.

## What to Expect

Mostly posts about:

- Systems programming
- Linux and DevOps
- Whatever catches my interest

Stay tuned!
```

- [ ] **Step 11: Create sample reading note**

Write `src/content/reading/sample.mdx`:

```mdx
---
title: 'Notes on Designing Data-Intensive Applications'
date: 2024-01-15
bookTitle: 'Designing Data-Intensive Applications'
bookAuthor: 'Martin Kleppmann'
tags: ['distributed-systems', 'databases']
excerpt: 'Key takeaways from DDIA, focusing on replication and partitioning.'
---

# Notes on Designing Data-Intensive Applications

A phenomenal book on the foundations of modern data systems.

## Key Takeaways

- Replication strategies have fundamental trade-offs
- Partitioning is about distributing data and load evenly
- Transactions provide safety guarantees but at a cost
```

- [ ] **Step 12: Create sample travel log**

Write `src/content/travel/sample.mdx`:

```mdx
---
title: 'Weekend in Kyoto'
date: 2024-03-10
tags: ['japan', 'travel']
excerpt: "A brief visit to Kyoto's temples and gardens."
---

# Weekend in Kyoto

A short trip to explore the ancient capital.

## Highlights

- Fushimi Inari Shrine at sunrise
- Arashiyama bamboo grove
- Amazing matcha everything
```

- [ ] **Step 13: Create sample slide deck metadata**

Write `src/content/slides/sample.mdx`:

```mdx
---
title: 'Intro to Distributed Systems'
date: 2024-06-01
slug: 'intro-distributed-systems'
tags: ['talk', 'distributed-systems']
excerpt: 'A beginner-friendly overview of distributed systems concepts.'
---
```

- [ ] **Step 14: Verify build with content collections**

Run: `npm run build`

Expected: Build succeeds, content collections are detected.

- [ ] **Step 15: Run all unit tests**

Run: `npx vitest run`

Expected: All tests pass.

- [ ] **Step 16: Commit**

```bash
git add src/content.config.ts src/utils/content.ts src/utils/date.ts src/utils/__tests__/ src/content/
git commit -m "feat: add content collections, date/content utils with tests, sample content"
```

---

## Task 6: Shared UI Components — Cards & Listing Layout

**Files:**

- Create: `src/components/Card.astro`, `src/components/FeaturedPost.astro`, `src/components/CardGrid.astro`, `src/layouts/ListingLayout.astro`

- [ ] **Step 1: Write Card component**

Write `src/components/Card.astro`:

```astro
---
import { formatDateShort } from '@/utils/date';

interface Props {
  title: string;
  href: string;
  date: Date;
  tag?: string;
  excerpt?: string;
}

const { title, href, date, tag, excerpt } = Astro.props;
---

<a href={href} class="card">
  {tag && <span class="card-tag">{tag}</span>}
  <h3 class="card-title">{title}</h3>
  {excerpt && <p class="card-excerpt">{excerpt}</p>}
  <time class="card-date">{formatDateShort(date)}</time>
</a>

<style>
  .card {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 0;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s;
  }

  .card:hover {
    transform: translateY(-2px);
    text-decoration: none;
  }

  .card-tag {
    display: inline-block;
    align-self: flex-start;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    margin-bottom: 0.5rem;
  }

  .card-title {
    font-size: 1.05rem;
    font-weight: 600;
    line-height: 1.35;
    margin-bottom: 0.4rem;
    color: var(--text);
  }

  .card-excerpt {
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-date {
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-top: 0.75rem;
  }
</style>
```

- [ ] **Step 2: Write FeaturedPost component**

Write `src/components/FeaturedPost.astro`:

```astro
---
import { formatDateShort } from '@/utils/date';

interface Props {
  title: string;
  href: string;
  date: Date;
  tag?: string;
  excerpt?: string;
}

const { title, href, date, tag, excerpt } = Astro.props;
---

<a href={href} class="featured">
  {tag && <span class="featured-tag">{tag}</span>}
  <h2 class="featured-title">{title}</h2>
  {excerpt && <p class="featured-excerpt">{excerpt}</p>}
  <time class="featured-date">{formatDateShort(date)}</time>
</a>

<style>
  .featured {
    display: block;
    padding: 1rem 0 2rem;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s;
  }

  .featured:hover {
    transform: translateY(-2px);
    text-decoration: none;
  }

  .featured-tag {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    background: var(--accent-subtle);
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    margin-bottom: 0.75rem;
  }

  .featured-title {
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 0.75rem;
    max-width: 700px;
    color: var(--text);
  }

  .featured-excerpt {
    font-size: 0.95rem;
    color: var(--text-muted);
    line-height: 1.65;
    max-width: 640px;
    margin-bottom: 0.75rem;
  }

  .featured-date {
    font-size: 0.8rem;
    color: var(--text-muted);
  }
</style>
```

- [ ] **Step 3: Write CardGrid component**

Write `src/components/CardGrid.astro`:

```astro
---

---

<div class="card-grid">
  <slot />
</div>

<style>
  .card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    padding-bottom: 4rem;
  }

  @media (max-width: 900px) {
    .card-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .card-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 4: Write ListingLayout**

Write `src/layouts/ListingLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  description?: string;
  tagline?: string;
}

const { title, description, tagline } = Astro.props;
---

<BaseLayout title={title} description={description}>
  <div class="container">
    <div class="page-header">
      <h1>{title}</h1>
      {tagline && <p class="tagline">{tagline}</p>}
    </div>
    <slot />
  </div>
</BaseLayout>

<style>
  .page-header {
    padding: 3rem 0 2rem;
  }

  .page-header h1 {
    margin-bottom: 0.5rem;
  }

  .tagline {
    color: var(--text-muted);
    font-size: 1.05rem;
  }
</style>
```

- [ ] **Step 5: Verify build**

Run: `npm run build`

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/Card.astro src/components/FeaturedPost.astro src/components/CardGrid.astro src/layouts/ListingLayout.astro
git commit -m "feat: add Card, FeaturedPost, CardGrid components and ListingLayout"
```

---

## Task 7: Blog Pages

**Files:**

- Create: `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`
- Create: `src/layouts/PostLayout.astro`, `src/components/PostHeader.astro`, `src/components/PostNav.astro`, `src/components/TableOfContents.astro`

- [ ] **Step 1: Write PostHeader component**

Write `src/components/PostHeader.astro`:

```astro
---
import { formatDate } from '@/utils/date';

interface Props {
  title: string;
  date: Date;
  tags?: string[];
  bookTitle?: string;
  bookAuthor?: string;
  heroImage?: string;
}

const { title, date, tags = [], bookTitle, bookAuthor, heroImage } = Astro.props;
---

<header class="post-header">
  {
    tags.length > 0 && (
      <div class="post-tags">
        {tags.map((tag) => (
          <span class="tag">{tag}</span>
        ))}
      </div>
    )
  }
  <h1>{title}</h1>
  {
    bookTitle && (
      <p class="book-info">
        <em>{bookTitle}</em> by {bookAuthor}
      </p>
    )
  }
  <time>{formatDate(date)}</time>
  {heroImage && <img src={heroImage} alt="" class="hero-image" />}
</header>

<style>
  .post-header {
    padding: 3rem 0 2rem;
    max-width: 720px;
    margin: 0 auto;
  }

  .post-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
  }

  .tag {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    background: var(--accent-subtle);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
  }

  h1 {
    margin-bottom: 0.5rem;
  }

  .book-info {
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  time {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .hero-image {
    margin-top: 1.5rem;
    border-radius: 12px;
    width: 100%;
  }
</style>
```

- [ ] **Step 2: Write PostNav component**

Write `src/components/PostNav.astro`:

```astro
---
interface Props {
  prev?: { slug: string; title: string; basePath: string };
  next?: { slug: string; title: string; basePath: string };
}

const { prev, next } = Astro.props;
---

{
  (prev || next) && (
    <nav class="post-nav">
      <div>
        {prev && (
          <a href={`${prev.basePath}/${prev.slug}`} class="post-nav-link prev">
            <span class="post-nav-label">Previous</span>
            <span class="post-nav-title">{prev.title}</span>
          </a>
        )}
      </div>
      <div>
        {next && (
          <a href={`${next.basePath}/${next.slug}`} class="post-nav-link next">
            <span class="post-nav-label">Next</span>
            <span class="post-nav-title">{next.title}</span>
          </a>
        )}
      </div>
    </nav>
  )
}

<style>
  .post-nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem 0;
    border-top: 1px solid var(--border);
    margin-top: 3rem;
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
  }

  .post-nav-link {
    text-decoration: none;
    color: inherit;
  }

  .post-nav-link.next {
    text-align: right;
  }

  .post-nav-label {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    display: block;
    margin-bottom: 0.25rem;
  }

  .post-nav-title {
    font-weight: 500;
    color: var(--accent);
    font-size: 0.9rem;
  }
</style>
```

- [ ] **Step 3: Write TableOfContents component**

Write `src/components/TableOfContents.astro`:

```astro
---
interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  headings: Heading[];
}

const { headings } = Astro.props;
const tocHeadings = headings.filter((h) => h.depth >= 2 && h.depth <= 3);
---

{
  tocHeadings.length > 0 && (
    <aside class="toc">
      <p class="toc-title">On this page</p>
      <ul>
        {tocHeadings.map((h) => (
          <li class:list={[{ depth3: h.depth === 3 }]}>
            <a href={`#${h.slug}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

<style>
  .toc {
    position: sticky;
    top: 5rem;
    max-height: calc(100vh - 6rem);
    overflow-y: auto;
    padding-left: 2rem;
    font-size: 0.8rem;
  }

  .toc-title {
    font-weight: 600;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 0.4rem;
  }

  li.depth3 {
    padding-left: 1rem;
  }

  a {
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.15s;
  }

  a:hover {
    color: var(--accent);
  }

  @media (max-width: 1200px) {
    .toc {
      display: none;
    }
  }
</style>
```

- [ ] **Step 4: Write PostLayout**

Write `src/layouts/PostLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import PostHeader from '@/components/PostHeader.astro';
import PostNav from '@/components/PostNav.astro';
import TableOfContents from '@/components/TableOfContents.astro';

interface Props {
  title: string;
  date: Date;
  tags?: string[];
  bookTitle?: string;
  bookAuthor?: string;
  heroImage?: string;
  headings: { depth: number; slug: string; text: string }[];
  prev?: { slug: string; title: string; basePath: string };
  next?: { slug: string; title: string; basePath: string };
}

const { title, date, tags, bookTitle, bookAuthor, heroImage, headings, prev, next } = Astro.props;
---

<BaseLayout title={title}>
  <div class="container post-layout">
    <article>
      <PostHeader
        title={title}
        date={date}
        tags={tags}
        bookTitle={bookTitle}
        bookAuthor={bookAuthor}
        heroImage={heroImage}
      />
      <div class="prose">
        <slot />
      </div>
      <PostNav prev={prev} next={next} />
    </article>
    <TableOfContents headings={headings} />
  </div>
</BaseLayout>

<style>
  .post-layout {
    display: grid;
    grid-template-columns: 1fr 200px;
    gap: 2rem;
    align-items: start;
  }

  article {
    min-width: 0;
  }

  @media (max-width: 1200px) {
    .post-layout {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 5: Write blog listing page**

Write `src/pages/blog/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import ListingLayout from '@/layouts/ListingLayout.astro';
import FeaturedPost from '@/components/FeaturedPost.astro';
import CardGrid from '@/components/CardGrid.astro';
import Card from '@/components/Card.astro';
import { sortByDate, getFeaturedPost } from '@/utils/content';

const posts = await getCollection('blog');
const sorted = sortByDate(posts);
const featured = getFeaturedPost(posts);
const rest = sorted.filter((p) => p.id !== featured.id);
---

<ListingLayout title="Blog" tagline="Technical musings, random thoughts, and other stuff.">
  <FeaturedPost
    title={featured.data.title}
    href={`/blog/${featured.id}`}
    date={featured.data.date}
    tag={featured.data.tags?.[0]}
    excerpt={featured.data.excerpt}
  />
  <div style="height: 1px; background: var(--border); margin-bottom: 2rem;"></div>
  <CardGrid>
    {
      rest.map((post) => (
        <Card
          title={post.data.title}
          href={`/blog/${post.id}`}
          date={post.data.date}
          tag={post.data.tags?.[0]}
          excerpt={post.data.excerpt}
        />
      ))
    }
  </CardGrid>
</ListingLayout>
```

- [ ] **Step 6: Write blog post page**

Write `src/pages/blog/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import { render } from 'astro:content';
import PostLayout from '@/layouts/PostLayout.astro';
import { sortByDate } from '@/utils/content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const sorted = sortByDate(posts);
  return sorted.map((post, i) => ({
    params: { slug: post.id },
    props: {
      post,
      prev: sorted[i + 1]
        ? { slug: sorted[i + 1].id, title: sorted[i + 1].data.title, basePath: '/blog' }
        : undefined,
      next: sorted[i - 1]
        ? { slug: sorted[i - 1].id, title: sorted[i - 1].data.title, basePath: '/blog' }
        : undefined,
    },
  }));
}

const { post, prev, next } = Astro.props;
const { Content, headings } = await render(post);
---

<PostLayout
  title={post.data.title}
  date={post.data.date}
  tags={post.data.tags}
  headings={headings}
  prev={prev}
  next={next}
>
  <Content />
</PostLayout>
```

- [ ] **Step 7: Verify blog pages render**

Run: `npm run dev`

Navigate to `http://localhost:4321/blog/` — should show the listing with featured post and card grid.
Navigate to `http://localhost:4321/blog/hello-world` — should show the post content.

- [ ] **Step 8: Commit**

```bash
git add src/components/PostHeader.astro src/components/PostNav.astro src/components/TableOfContents.astro src/layouts/PostLayout.astro src/pages/blog/
git commit -m "feat: add blog listing and post pages with TOC, prev/next nav"
```

---

## Task 8: MDX Rich Media Components

**Files:**

- Create: `src/components/YouTube.astro`, `src/components/Callout.astro`, `src/components/CodeBlock.astro`, `src/components/react/Lightbox.tsx`

- [ ] **Step 1: Write YouTube embed component**

Write `src/components/YouTube.astro`:

```astro
---
interface Props {
  id: string;
  title?: string;
}

const { id, title = 'YouTube video' } = Astro.props;
---

<div class="youtube-embed">
  <iframe
    src={`https://www.youtube-nocookie.com/embed/${id}`}
    title={title}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    loading="lazy"></iframe>
</div>

<style>
  .youtube-embed {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    border-radius: 8px;
    overflow: hidden;
  }

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
</style>
```

- [ ] **Step 2: Write Callout component**

Write `src/components/Callout.astro`:

```astro
---
interface Props {
  type?: 'info' | 'warning' | 'tip';
}

const { type = 'info' } = Astro.props;

const icons: Record<string, string> = {
  info: 'ℹ',
  warning: '⚠',
  tip: '💡',
};

const labels: Record<string, string> = {
  info: 'Info',
  warning: 'Warning',
  tip: 'Tip',
};
---

<aside class:list={['callout', `callout-${type}`]}>
  <p class="callout-label">{icons[type]} {labels[type]}</p>
  <slot />
</aside>

<style>
  .callout {
    border-left: 3px solid var(--accent);
    padding: 1rem 1.25rem;
    border-radius: 0 8px 8px 0;
    background: var(--accent-subtle);
    font-size: 0.9rem;
  }

  .callout-label {
    font-weight: 600;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
    color: var(--accent);
  }

  .callout-warning {
    border-left-color: #d97706;
  }

  .callout-warning .callout-label {
    color: #d97706;
  }

  .callout-tip {
    border-left-color: #059669;
  }

  .callout-tip .callout-label {
    color: #059669;
  }
</style>
```

- [ ] **Step 3: Write CodeBlock component with copy button**

Write `src/components/CodeBlock.astro`:

```astro
---
interface Props {
  filename?: string;
}

const { filename } = Astro.props;
---

<div class="code-block">
  {filename && <div class="code-block-filename">{filename}</div>}
  <div class="code-block-content">
    <slot />
  </div>
  <button class="code-block-copy" aria-label="Copy code" data-copy>
    <svg
      class="icon-copy"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    <svg
      class="icon-check"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      style="display:none"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  </button>
</div>

<style>
  .code-block {
    position: relative;
  }

  .code-block-filename {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: var(--text-muted);
    background: var(--surface);
    border: 1px solid var(--border);
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    padding: 0.5rem 1rem;
  }

  .code-block-filename + .code-block-content :global(pre) {
    border-radius: 0 0 8px 8px;
  }

  .code-block-copy {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.35rem;
    cursor: pointer;
    color: var(--text-muted);
    opacity: 0;
    transition: opacity 0.15s;
  }

  .code-block:hover .code-block-copy {
    opacity: 1;
  }

  .code-block-copy:hover {
    color: var(--accent);
    border-color: var(--accent);
  }
</style>

<script>
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.closest('.code-block');
      const code = codeBlock?.querySelector('pre')?.textContent ?? '';
      navigator.clipboard.writeText(code);
      const iconCopy = btn.querySelector('.icon-copy') as HTMLElement;
      const iconCheck = btn.querySelector('.icon-check') as HTMLElement;
      if (iconCopy) iconCopy.style.display = 'none';
      if (iconCheck) iconCheck.style.display = 'block';
      setTimeout(() => {
        if (iconCopy) iconCopy.style.display = 'block';
        if (iconCheck) iconCheck.style.display = 'none';
      }, 2000);
    });
  });
</script>
```

- [ ] **Step 4: Write Lightbox React island**

Write `src/components/react/Lightbox.tsx`:

```tsx
import { useState, useEffect, useCallback } from 'react';

export default function Lightbox() {
  const [src, setSrc] = useState<string | null>(null);
  const [alt, setAlt] = useState('');

  const close = useCallback(() => setSrc(null), []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && target.closest('.prose')) {
        setSrc((target as HTMLImageElement).src);
        setAlt((target as HTMLImageElement).alt);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [close]);

  if (!src) return null;

  return (
    <div
      className="lightbox-overlay"
      onClick={close}
      role="dialog"
      aria-label={alt || 'Image preview'}
    >
      <button className="lightbox-close" onClick={close} aria-label="Close">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <img src={src} alt={alt} className="lightbox-image" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}
```

- [ ] **Step 5: Add Lightbox to BaseLayout and add global lightbox styles**

Add to `src/layouts/BaseLayout.astro` — import Lightbox and place before closing `</body>`:

```astro
import Lightbox from '@/components/react/Lightbox';
```

Add in the body, after `<Footer />`:

```astro
<Lightbox client:idle />
```

Add to `src/styles/global.css`:

```css
/* Lightbox */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  cursor: zoom-out;
}

.lightbox-image {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
  cursor: default;
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
}

/* Theme toggle button */
.theme-toggle {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;
}

.theme-toggle:hover {
  border-color: var(--accent);
}

/* Mobile menu */
.mobile-menu-btn {
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 0.25rem;
}

.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 60;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 260px;
  height: 100vh;
  background: var(--bg);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 61;
}

.mobile-menu a {
  color: var(--text);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
}

.mobile-menu a.active {
  color: var(--accent);
}
```

- [ ] **Step 6: Verify build**

Run: `npm run build`

Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/YouTube.astro src/components/Callout.astro src/components/CodeBlock.astro src/components/react/Lightbox.tsx src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat: add YouTube, Callout, CodeBlock, Lightbox MDX components"
```

---

## Task 9: Reading Notes & Travel Log Pages

**Files:**

- Create: `src/pages/reading/index.astro`, `src/pages/reading/[slug].astro`
- Create: `src/pages/travel/index.astro`, `src/pages/travel/[slug].astro`

- [ ] **Step 1: Write reading notes listing page**

Write `src/pages/reading/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import ListingLayout from '@/layouts/ListingLayout.astro';
import FeaturedPost from '@/components/FeaturedPost.astro';
import CardGrid from '@/components/CardGrid.astro';
import Card from '@/components/Card.astro';
import { sortByDate, getFeaturedPost } from '@/utils/content';

const posts = await getCollection('reading');
const sorted = sortByDate(posts);
const featured = getFeaturedPost(posts);
const rest = sorted.filter((p) => p.id !== featured.id);
---

<ListingLayout title="Reading" tagline="Notes on books and papers.">
  <FeaturedPost
    title={featured.data.title}
    href={`/reading/${featured.id}`}
    date={featured.data.date}
    tag={featured.data.bookAuthor}
    excerpt={featured.data.excerpt}
  />
  <div style="height: 1px; background: var(--border); margin-bottom: 2rem;"></div>
  <CardGrid>
    {
      rest.map((post) => (
        <Card
          title={post.data.title}
          href={`/reading/${post.id}`}
          date={post.data.date}
          tag={post.data.bookAuthor}
          excerpt={post.data.excerpt}
        />
      ))
    }
  </CardGrid>
</ListingLayout>
```

- [ ] **Step 2: Write reading note post page**

Write `src/pages/reading/[slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '@/layouts/PostLayout.astro';
import { sortByDate } from '@/utils/content';

export async function getStaticPaths() {
  const posts = await getCollection('reading');
  const sorted = sortByDate(posts);
  return sorted.map((post, i) => ({
    params: { slug: post.id },
    props: {
      post,
      prev: sorted[i + 1]
        ? { slug: sorted[i + 1].id, title: sorted[i + 1].data.title, basePath: '/reading' }
        : undefined,
      next: sorted[i - 1]
        ? { slug: sorted[i - 1].id, title: sorted[i - 1].data.title, basePath: '/reading' }
        : undefined,
    },
  }));
}

const { post, prev, next } = Astro.props;
const { Content, headings } = await render(post);
---

<PostLayout
  title={post.data.title}
  date={post.data.date}
  tags={post.data.tags}
  bookTitle={post.data.bookTitle}
  bookAuthor={post.data.bookAuthor}
  headings={headings}
  prev={prev}
  next={next}
>
  <Content />
</PostLayout>
```

- [ ] **Step 3: Write travel logs listing page**

Write `src/pages/travel/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import ListingLayout from '@/layouts/ListingLayout.astro';
import FeaturedPost from '@/components/FeaturedPost.astro';
import CardGrid from '@/components/CardGrid.astro';
import Card from '@/components/Card.astro';
import { sortByDate, getFeaturedPost } from '@/utils/content';

const posts = await getCollection('travel');
const sorted = sortByDate(posts);
const featured = getFeaturedPost(posts);
const rest = sorted.filter((p) => p.id !== featured.id);
---

<ListingLayout title="Travel" tagline="Adventures and explorations.">
  <FeaturedPost
    title={featured.data.title}
    href={`/travel/${featured.id}`}
    date={featured.data.date}
    tag={featured.data.tags?.[0]}
    excerpt={featured.data.excerpt}
  />
  <div style="height: 1px; background: var(--border); margin-bottom: 2rem;"></div>
  <CardGrid>
    {
      rest.map((post) => (
        <Card
          title={post.data.title}
          href={`/travel/${post.id}`}
          date={post.data.date}
          tag={post.data.tags?.[0]}
          excerpt={post.data.excerpt}
        />
      ))
    }
  </CardGrid>
</ListingLayout>
```

- [ ] **Step 4: Write travel log post page**

Write `src/pages/travel/[slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '@/layouts/PostLayout.astro';
import { sortByDate } from '@/utils/content';

export async function getStaticPaths() {
  const posts = await getCollection('travel');
  const sorted = sortByDate(posts);
  return sorted.map((post, i) => ({
    params: { slug: post.id },
    props: {
      post,
      prev: sorted[i + 1]
        ? { slug: sorted[i + 1].id, title: sorted[i + 1].data.title, basePath: '/travel' }
        : undefined,
      next: sorted[i - 1]
        ? { slug: sorted[i - 1].id, title: sorted[i - 1].data.title, basePath: '/travel' }
        : undefined,
    },
  }));
}

const { post, prev, next } = Astro.props;
const { Content, headings } = await render(post);
---

<PostLayout
  title={post.data.title}
  date={post.data.date}
  tags={post.data.tags}
  heroImage={post.data.heroImage}
  headings={headings}
  prev={prev}
  next={next}
>
  <Content />
</PostLayout>
```

- [ ] **Step 5: Verify all listing pages render**

Run: `npm run build`

Expected: Build succeeds. All 6 pages generated (3 listings + 3 posts).

- [ ] **Step 6: Commit**

```bash
git add src/pages/reading/ src/pages/travel/
git commit -m "feat: add reading notes and travel log listing + post pages"
```

---

## Task 10: Homepage — Hero & Interactive Timeline CV

**Files:**

- Create: `src/components/react/Timeline.tsx`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write Timeline React island**

Write `src/components/react/Timeline.tsx`:

```tsx
import { useState, useEffect, useRef } from 'react';

interface TimelineEntry {
  year: string;
  title: string;
  subtitle: string;
  details: string;
}

interface Props {
  entries: TimelineEntry[];
}

export default function Timeline({ entries }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 },
    );

    nodeRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const toggle = (i: number) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  return (
    <div className="timeline">
      <div className="timeline-line" />
      {entries.map((entry, i) => (
        <div
          key={i}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          className={`timeline-node scroll-reveal ${i % 2 === 0 ? 'left' : 'right'}`}
          onClick={() => toggle(i)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') toggle(i);
          }}
          role="button"
          tabIndex={0}
          aria-expanded={expandedIndex === i}
        >
          <div className="timeline-dot" />
          <div className="timeline-content">
            <span className="timeline-year">{entry.year}</span>
            <h3 className="timeline-title">{entry.title}</h3>
            <p className="timeline-subtitle">{entry.subtitle}</p>
            {expandedIndex === i && <p className="timeline-details">{entry.details}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Add Timeline CSS to global.css**

Add to `src/styles/global.css`:

```css
/* Timeline */
.timeline {
  position: relative;
  padding: 2rem 0;
  max-width: 800px;
  margin: 0 auto;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border);
  transform: translateX(-50%);
}

.timeline-node {
  position: relative;
  width: 45%;
  padding: 1rem 0;
  cursor: pointer;
}

.timeline-node.left {
  margin-right: auto;
  text-align: right;
  padding-right: 2.5rem;
}

.timeline-node.right {
  margin-left: auto;
  text-align: left;
  padding-left: 2.5rem;
}

.timeline-dot {
  position: absolute;
  top: 1.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid var(--bg);
  z-index: 1;
}

.timeline-node.left .timeline-dot {
  right: -6px;
}

.timeline-node.right .timeline-dot {
  left: -6px;
}

.timeline-year {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
}

.timeline-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0.25rem 0;
}

.timeline-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.timeline-details {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .timeline-line {
    left: 1rem;
  }

  .timeline-node,
  .timeline-node.left,
  .timeline-node.right {
    width: 100%;
    text-align: left;
    padding-left: 3rem;
    padding-right: 0;
    margin-left: 0;
  }

  .timeline-dot,
  .timeline-node.left .timeline-dot,
  .timeline-node.right .timeline-dot {
    left: 0.5rem;
    right: auto;
  }
}
```

- [ ] **Step 3: Update homepage**

Rewrite `src/pages/index.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Timeline from '@/components/react/Timeline';

const timelineEntries = [
  {
    year: '2020',
    title: 'Started University',
    subtitle: 'Computer Science',
    details:
      'Began studying computer science, diving into algorithms, systems programming, and distributed systems.',
  },
  {
    year: '2022',
    title: 'First Internship',
    subtitle: 'Software Engineering',
    details: 'Built backend services and learned about production systems at scale.',
  },
  {
    year: '2023',
    title: 'Started This Blog',
    subtitle: 'jellllly420.github.io',
    details: 'Began writing about programming, Linux, and whatever catches my interest.',
  },
  {
    year: '2024',
    title: 'Open Source Contributions',
    subtitle: 'Various Projects',
    details: 'Contributing to open source projects in the Go and Rust ecosystems.',
  },
];
---

<BaseLayout
  title="Home"
  description="Jelly's personal website — technical musings, random thoughts, and other stuff."
>
  <div class="container">
    <section class="hero animate-in">
      <h1 class="hero-name">Jelly</h1>
      <p class="hero-tagline">Technical musings, random thoughts, and other stuff.</p>
    </section>
    <section class="timeline-section">
      <h2 class="section-heading scroll-reveal">Timeline</h2>
      <Timeline client:visible entries={timelineEntries} />
    </section>
  </div>
</BaseLayout>

<style>
  .hero {
    padding: 6rem 0 4rem;
    text-align: center;
  }

  .hero-name {
    font-size: 3.5rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    margin-bottom: 0.75rem;
  }

  .hero-tagline {
    font-size: 1.15rem;
    color: var(--text-muted);
    max-width: 500px;
    margin: 0 auto;
  }

  .timeline-section {
    padding: 2rem 0 4rem;
  }

  .section-heading {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.5rem;
  }
</style>
```

Note: `client:visible` means the Timeline React island only hydrates when it scrolls into view — optimal for performance.

- [ ] **Step 4: Verify homepage renders**

Run: `npm run dev`

Navigate to `http://localhost:4321/` — should show hero with "Jelly", tagline, and interactive timeline.

- [ ] **Step 5: Commit**

```bash
git add src/components/react/Timeline.tsx src/pages/index.astro src/styles/global.css
git commit -m "feat: add homepage with hero section and interactive timeline CV"
```

---

## Task 11: About Page

**Files:**

- Create: `src/pages/about.astro`

- [ ] **Step 1: Write about page**

Write `src/pages/about.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout title="About" description="About Jelly — software engineer, open source enthusiast.">
  <div class="container">
    <div class="about animate-in">
      <h1>About Me</h1>
      <div class="prose">
        <p>
          Hi, I'm <strong>Jelly</strong> (Zejun Zhao). I'm a software engineer interested in systems programming,
          distributed systems, and the occasional deep dive into whatever catches my attention.
        </p>
        <p>
          This site is where I write about technical topics, share reading notes, and document my
          travels. It's built with Astro and styled after the claude.ai aesthetic.
        </p>
        <h2>Links</h2>
        <ul>
          <li>
            <a href="https://github.com/jellllly420" target="_blank" rel="noopener">GitHub</a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/zejun-zhao-1b1463267/"
              target="_blank"
              rel="noopener">LinkedIn</a
            >
          </li>
          <li><a href="mailto:jelly.zhao.42@gmail.com">Email</a></li>
        </ul>
      </div>
    </div>
  </div>
</BaseLayout>

<style>
  .about {
    padding: 3rem 0 4rem;
    max-width: 720px;
  }

  h1 {
    margin-bottom: 1.5rem;
  }
</style>
```

- [ ] **Step 2: Verify it renders**

Run: `npm run build`

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add about page with bio and social links"
```

---

## Task 12: Slides Integration — Slidev Theme, Build Script, Gallery

**Files:**

- Create: `slidev-theme/package.json`, `slidev-theme/styles/index.ts`, `slidev-theme/styles/base.css`, `slidev-theme/layouts/cover.vue`, `slidev-theme/layouts/default.vue`
- Create: `slides/sample/slides.md`, `scripts/build-slides.sh`
- Create: `src/pages/slides/index.astro`

- [ ] **Step 1: Create Slidev custom theme**

Write `slidev-theme/package.json`:

```json
{
  "name": "slidev-theme-jelly",
  "version": "0.1.0",
  "slidev": {
    "colorSchema": "both",
    "defaults": {
      "fonts": {
        "sans": "DM Sans",
        "mono": "JetBrains Mono"
      }
    }
  }
}
```

Write `slidev-theme/styles/index.ts`:

```typescript
import './base.css';
```

Write `slidev-theme/styles/base.css`:

```css
:root {
  --slidev-theme-primary: #c4642d;
  --slidev-theme-bg: #faf9f6;
  --slidev-theme-text: #1a1a1a;
}

.dark {
  --slidev-theme-primary: #e07a3a;
  --slidev-theme-bg: #1a1a1a;
  --slidev-theme-text: #ececea;
}

.slidev-layout {
  background: var(--slidev-theme-bg);
  color: var(--slidev-theme-text);
  font-family: 'DM Sans', system-ui, sans-serif;
}

.slidev-layout h1,
.slidev-layout h2,
.slidev-layout h3 {
  color: var(--slidev-theme-text);
}

.slidev-layout a {
  color: var(--slidev-theme-primary);
}

.slidev-layout code {
  font-family: 'JetBrains Mono', monospace;
  font-variant-ligatures: none;
}
```

Write `slidev-theme/layouts/cover.vue`:

```vue
<template>
  <div class="slidev-layout cover">
    <div class="cover-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cover {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.cover-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.cover-content p {
  font-size: 1.1rem;
  color: var(--slidev-theme-primary);
}
</style>
```

Write `slidev-theme/layouts/default.vue`:

```vue
<template>
  <div class="slidev-layout default">
    <slot />
  </div>
</template>

<style scoped>
.default {
  padding: 2rem 3rem;
}
</style>
```

- [ ] **Step 2: Create sample slide deck**

Write `slides/sample/slides.md`:

```markdown
---
theme: ../../slidev-theme
title: Intro to Distributed Systems
---

# Intro to Distributed Systems

A beginner-friendly overview

---

## What is a Distributed System?

A collection of independent computers that appears to its users as a single coherent system.

- **Scalability** — handle more load
- **Fault tolerance** — survive failures
- **Latency** — serve users closer

---

## Key Challenges

1. Network is unreliable
2. Clocks are approximate
3. Processes can crash

---

## Thank You

Questions?
```

- [ ] **Step 3: Write slide build script**

Write `scripts/build-slides.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

SLIDES_DIR="slides"
OUT_DIR="public/slides"

if [ ! -d "$SLIDES_DIR" ]; then
  echo "No slides directory found, skipping."
  exit 0
fi

for deck_dir in "$SLIDES_DIR"/*/; do
  if [ ! -f "${deck_dir}slides.md" ]; then
    continue
  fi

  deck_name=$(basename "$deck_dir")
  echo "Building slide deck: $deck_name"

  npx slidev build "${deck_dir}slides.md" \
    --out "../../${OUT_DIR}/${deck_name}" \
    --base "/slides/${deck_name}/"
done

echo "All slide decks built."
```

Run: `chmod +x scripts/build-slides.sh`

- [ ] **Step 4: Install Slidev**

Run:

```bash
npm install -D @slidev/cli @slidev/theme-default
```

- [ ] **Step 5: Write slides gallery page**

Write `src/pages/slides/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import ListingLayout from '@/layouts/ListingLayout.astro';
import CardGrid from '@/components/CardGrid.astro';
import Card from '@/components/Card.astro';
import { sortByDate } from '@/utils/content';

const decks = await getCollection('slides');
const sorted = sortByDate(decks);
---

<ListingLayout title="Slides" tagline="Talks and presentations.">
  <CardGrid>
    {
      sorted.map((deck) => (
        <Card
          title={deck.data.title}
          href={`/slides/${deck.data.slug}/`}
          date={deck.data.date}
          tag={deck.data.tags?.[0]}
          excerpt={deck.data.excerpt}
        />
      ))
    }
  </CardGrid>
</ListingLayout>
```

- [ ] **Step 6: Add build-slides script to package.json**

Add to `package.json` scripts:

```json
"build:slides": "bash scripts/build-slides.sh",
"build": "npm run build:slides && astro build"
```

Note: Update the existing `"build"` script to chain the slides build first.

- [ ] **Step 7: Test slide build**

Run:

```bash
npm run build:slides
```

Expected: Outputs static HTML to `public/slides/sample/`.

- [ ] **Step 8: Test full build**

Run: `npm run build`

Expected: Build succeeds. Slides are included in `dist/slides/sample/`.

- [ ] **Step 9: Commit**

```bash
git add slidev-theme/ slides/ scripts/ src/pages/slides/ src/content/slides/ package.json
git commit -m "feat: add Slidev integration with custom theme, build script, gallery page"
```

---

## Task 13: GitHub Actions CI/CD

**Files:**

- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write deploy workflow**

Write `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run check

      - name: Unit tests
        run: npm test

      - name: Build slides
        run: npm run build:slides

      - name: Build site
        run: npx astro build

      - name: Install Playwright
        run: npx playwright install --with-deps chromium

      - name: E2E tests
        run: npx playwright test

      - name: Upload artifact
        if: github.ref == 'refs/heads/main'
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions workflow for build, test, and deploy"
```

---

## Task 14: E2E Tests

**Files:**

- Create: `tests/e2e/navigation.spec.ts`, `tests/e2e/theme.spec.ts`, `tests/e2e/blog.spec.ts`, `tests/e2e/homepage.spec.ts`

- [ ] **Step 1: Write navigation E2E test**

Write `tests/e2e/navigation.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('nav links navigate to correct pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.nav-brand')).toHaveText('Jelly');

    await page.click('a[href="/blog"]');
    await expect(page).toHaveURL('/blog/');
    await expect(page.locator('h1')).toHaveText('Blog');

    await page.click('a[href="/reading"]');
    await expect(page).toHaveURL('/reading/');
    await expect(page.locator('h1')).toHaveText('Reading');

    await page.click('a[href="/travel"]');
    await expect(page).toHaveURL('/travel/');
    await expect(page.locator('h1')).toHaveText('Travel');

    await page.click('a[href="/slides"]');
    await expect(page).toHaveURL('/slides/');
    await expect(page.locator('h1')).toHaveText('Slides');

    await page.click('a[href="/about"]');
    await expect(page).toHaveURL('/about/');
    await expect(page.locator('h1')).toHaveText('About Me');
  });

  test('brand link goes home', async ({ page }) => {
    await page.goto('/blog/');
    await page.click('.nav-brand');
    await expect(page).toHaveURL('/');
  });
});
```

- [ ] **Step 2: Write theme toggle E2E test**

Write `tests/e2e/theme.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test('toggles between light and dark mode', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');
    expect(['light', 'dark']).toContain(initialTheme);

    await page.click('.theme-toggle');
    const newTheme = await html.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
  });

  test('persists theme across page loads', async ({ page }) => {
    await page.goto('/');
    await page.click('.theme-toggle');
    const themeAfterToggle = await page.locator('html').getAttribute('data-theme');

    await page.goto('/blog/');
    const themeAfterNav = await page.locator('html').getAttribute('data-theme');
    expect(themeAfterNav).toBe(themeAfterToggle);
  });
});
```

- [ ] **Step 3: Write blog E2E test**

Write `tests/e2e/blog.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test('listing shows featured post and cards', async ({ page }) => {
    await page.goto('/blog/');
    await expect(page.locator('.featured-title, h2').first()).toBeVisible();
  });

  test('can navigate to a blog post', async ({ page }) => {
    await page.goto('/blog/');
    await page.click('a[href*="/blog/"]');
    await expect(page.locator('.post-header h1, header h1')).toBeVisible();
  });

  test('blog post renders content', async ({ page }) => {
    await page.goto('/blog/hello-world');
    await expect(page.locator('h1')).toContainText('Hello World');
    await expect(page.locator('.prose')).toBeVisible();
  });
});
```

- [ ] **Step 4: Write homepage E2E test**

Write `tests/e2e/homepage.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('shows hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-name')).toHaveText('Jelly');
    await expect(page.locator('.hero-tagline')).toBeVisible();
  });

  test('shows timeline section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.timeline')).toBeVisible();
  });

  test('timeline nodes are expandable', async ({ page }) => {
    await page.goto('/');
    const node = page.locator('.timeline-node').first();
    await node.scrollIntoViewIfNeeded();
    await node.click();
    await expect(page.locator('.timeline-details').first()).toBeVisible();
  });
});
```

- [ ] **Step 5: Build the site for E2E testing**

Run:

```bash
npm run build
```

- [ ] **Step 6: Run E2E tests**

Run:

```bash
npx playwright test
```

Expected: All tests pass.

- [ ] **Step 7: Commit**

```bash
git add tests/e2e/
git commit -m "test: add E2E tests for navigation, theme, blog, homepage"
```

---

## Task 15: Final Lint, Type Check, and Cleanup

- [ ] **Step 1: Run full lint**

Run:

```bash
npm run lint
```

Fix any issues.

- [ ] **Step 2: Run type check**

Run:

```bash
npm run check
```

Fix any issues.

- [ ] **Step 3: Run all unit tests**

Run:

```bash
npm test
```

Expected: All pass.

- [ ] **Step 4: Run full build + E2E tests**

Run:

```bash
npm run build && npx playwright test
```

Expected: All pass.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "chore: lint fixes and cleanup"
```

- [ ] **Step 6: Verify dev server runs cleanly**

Run:

```bash
npm run dev
```

Manually verify: homepage, blog listing, blog post, reading, travel, slides, about page, theme toggle, mobile menu all work.
