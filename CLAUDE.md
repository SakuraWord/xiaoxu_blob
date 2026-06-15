# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Project-Specific

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

### Quick Start

```bash
pnpm dev        # Start dev server at http://localhost:3000
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

This is a personal portfolio site built with Next.js 15 (App Router), React 19, Tailwind CSS, and Framer Motion. Dark cyberpunk aesthetic with green (#00ff88) and cyan (#00d4ff) accents.

### Architecture

#### Page structure (single-page with project detail sub-route)

- `src/app/page.tsx` — Root home page, composes all sections: Navbar → Hero → Skills → Interests → Projects → Repos → CombinedActivity → Footer
- `src/app/projects/layout.tsx` — Layout for `/projects/[slug]` detail route (Navbar + Footer)
- `src/app/projects/[slug]/page.tsx` — Static-generated project detail page, params from `projects.json`

#### Data flow

**Static data** (compiled at build time):
- `src/data/projects.json` — Featured projects
- `src/data/skills.json` — Skill categories and proficiency levels
- `src/data/interests.json` — Personal interest cards

**Live data** (runtime via API routes):
- `src/lib/github.ts` — GitHub API client: `getRepos()`, `getActivityStats()`, `getTopRepos()`
- `src/lib/gitee.ts` — Gitee API client, same interface
- `src/app/api/repos/route.ts` — GET `?platform=github|gitee&user=<username>`
- `src/app/api/activity/route.ts` — GET `?platform=github|gitee&user=<username>`

APIs use `revalidate: 3600` (1-hour ISR cache). Optional `GITHUB_TOKEN` env var for rate limit boost.

**Client-side aggregation**: `CombinedActivity` fetches both platforms in parallel, merges stats, renders unified charts.

#### Components

All components default to Server Components; those using hooks are marked `'use client'`:

| Component | Type | Purpose |
|---|---|---|
| `navbar` | Client | Fixed nav, scroll tracking, active section highlight, mobile hamburger |
| `hero` | Client | Full-screen intro with canvas particles + typewriter effect |
| `skills` | Client | Grouped skill bars, animated progress |
| `interests` | Client | Emoji icon card grid |
| `projects` | Client | Card grid, hover-expand details, routes to `/projects/[slug]` |
| `repos` | Client | Platform-switchable repo list with sort/language filter |
| `combined-activity` | Client | Unified GitHub+Gitee dashboard: stats, bar chart, event timeline, language tags |
| `activity` | Client | Mock-data placeholder, superseded by `combined-activity`, not imported anywhere |
| `footer` | Client | Social icons, nav links, copyright |

**UI primitives** (all client):
- `card.tsx` — Container with optional green/cyan glow on hover
- `badge.tsx` — Colored pill label with variant/size
- `progress-bar.tsx` — Animated width fill via viewport intersection

#### Types

`src/types/index.ts` — `Skill`, `Interest`, `Project`, `Repo`, `ActivityStats`, `ActivityEvent`, `ContactLink`.

#### Styling

- Tailwind custom theme: `background: #0a0a0a`, accent colors, JetBrains Mono headings, Inter body
- `globals.css`: scrollbar, selection, glow utilities
- All sections use `framer-motion` `motion.div` with `whileInView` entrance animations

### Key Details

- Path alias: `@/*` → `./src/*`
- ESLint disabled during builds (`next.config.ts`)
- No test framework configured
- `cache.ts` provides file-based caching but is unused
- Hardcoded: GitHub = `SakuraWord`, Gitee = `yingnuo`
