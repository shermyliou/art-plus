# AGENTS.md

## Project

Arts Plus（藝術加）is a Taiwan arts-event browsing and ticketing demo site built with Vue 3 + Vite. There is no backend — all data comes from local JSON fixtures (`src/data/`) and all "mutations" are simulated in Pinia stores. Live demo: https://art-plus-sigma.vercel.app/#/

## Working Rules

These rules apply to every task in this project unless explicitly overridden.
Bias: caution over speed on non-trivial work. Use judgment on trivial tasks.

### Think Before Coding
State assumptions explicitly. If uncertain, ask rather than guess.
Present multiple interpretations when ambiguity exists.
Push back when a simpler approach exists.
Stop when confused. Name what's unclear.

### Simplicity First
Minimum code that solves the problem. Nothing speculative.
No features beyond what was asked. No abstractions for single-use code.
Test: would a senior engineer say this is overcomplicated? If yes, simplify.

### Surgical Changes
Touch only what you must. Clean up only your own mess.
Don't "improve" adjacent code, comments, or formatting.
Don't refactor what isn't broken. Match existing style.

### Goal-Driven Execution
Define success criteria. Loop until verified.
Don't follow steps. Define success and iterate.
Strong success criteria let you loop independently.

### Use the model only for judgment calls
Use the model for: classification, drafting, summarization, extraction.
Do NOT use it for: routing, retries, deterministic transforms.
If code can answer, code answers.

### Surface conflicts, don't average them
If two patterns contradict, pick one (more recent / more tested).
Explain why. Flag the other for cleanup.
Don't blend conflicting patterns.

### Read before you write
Before adding code, read exports, immediate callers, shared utilities.
"Looks orthogonal" is dangerous. If unsure why code is structured a way, ask.

### Checkpoint after every significant step
Summarize what was done, what's verified, what's left.
Don't continue from a state you can't describe back.
If you lose track, stop and restate.

### Match the codebase's conventions, even if you disagree
Conformance > taste inside the codebase.
If you genuinely think a convention is harmful, surface it. Don't fork silently.

### Fail loud
"Completed" is wrong if anything was skipped silently.
"Tests pass" is wrong if any were skipped.
Default to surfacing uncertainty, not hiding it.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # Production build to dist/
npm run preview   # Preview the production build
```

There is no test suite, linter, or formatter configured. `README.md` (Traditional Chinese) lists the team and per-page ownership.

## Conventions

- Vue 3 **Composition API with `<script setup>`**, JavaScript (not TypeScript). Components are PascalCase. Give new functions JSDoc comments (the stores are good examples). 2-space indent, strict equality (`===`/`!==`).
- Use the `@` alias for imports — it maps to `src/` (configured in both `vite.config.js` and `jsconfig.json`).
- Router uses **hash history** (`createWebHashHistory`) — URLs are `/#/...`. This matters for the Vercel deploy and any link generation.
- UI text, comments, and JSDoc are in Traditional Chinese. Match this when editing.
- The `Icon` component (`@iconify/vue`, primarily Phosphor `ph:` icons) is registered globally in `main.js` — use `<Icon icon="ph:..." />` without importing it per-file. Don't add new icon packages.
- Prefer Bootstrap's existing utility/component classes before writing new CSS; reach for the design tokens (below) for any custom values.

## Architecture

### Routing & layouts (`src/router/index.js`)
Three layout shells wrap the views:
- `PublicLayout` → consumer pages: `home`, `search`, `event/:id` (EventDetail), `bootstrap` (BootstrapChecker, a token/component reference page).
- `OrganizerLayout` → `organizer` (EventEdit, the Tiptap-based event editor).
- `map` is a standalone top-level route with no shared layout.

`router.afterEach` sets `document.title` from each route's `meta.title`.

### State (Pinia, `src/stores/`)
Two stores, both seeded synchronously from JSON at definition time:

- **`useEventStore`** — On creation, `initializeEvents()` transforms the raw `events.json` into a richer shape: it derives `startDate`/`endDate` from sessions, computes `price.min/max`, aggregates unique `city` strings, calculates `ticketStatus` from remaining ticket counts, and **randomly generates** rating/ratingCount/ageLimit/comment metadata when not present in the source. Because of the randomness, derived rating-like fields are not stable across reloads — don't rely on them being deterministic.
- **`useUserStore`** — Holds all users plus a `currentUser`. **The app boots already "logged in" as the user with `id === 11`** (hardcoded in state). `login`/`logout` exist but the default session is this user. There is no real auth.

Favorites are intentionally duplicated: both stores have a `toggleFavorite`, and they keep `currentUser.favoriteEvents` in sync with the matching entry in the `users` list to simulate a backend write. The event store's `eventsWithFavoriteStatus` getter joins favorite IDs onto events. When touching favorites, keep both stores consistent.

### Components (`src/components/`)
- `common/` — layout scaffolding (the `*Layout`, `*Navbar`, `SideBar` shells).
- `ui/` — reusable presentational pieces (cards, overlays, tabs, calendar, filters, marquee).

### Styling — three-layer design token system (`src/assets/styles/`)
`main.scss` controls the entire import order, which is load-bearing. The token layers must be imported **before** Bootstrap so Bootstrap picks up the overridden SCSS variables:

1. `tokens/_primitive.scss` — raw values (`$brand-500`, `$gray-0`, spacing/radius primitives). Never reference these directly in components.
2. `tokens/_semantic.scss` — semantic SCSS vars (`$background-brand-default`, `$text-default-default`, layout dimensions) mapped from primitives. Its bottom `:root {}` block re-exports the semantic values as **CSS custom properties** (`var(--text-brand-secondary)`, `var(--page-width)`, etc.). Components and `.vue` styles should consume these CSS variables, not raw primitives.
3. `tokens/_component.scss` — remaps Bootstrap's own SCSS variables (`$primary`, `$border-radius`, fonts, nav-pills, etc.) onto the semantic/primitive tokens.

After Bootstrap, `overrides/*.scss` patch specific Bootstrap components (button, badge, nav, navtabs, page). `abstracts/_mixin.scss` defines `generate-spacing-classes`, invoked at the end of `main.scss` to emit utility classes like `.pt72px`, `.gap16px`, `.rounded8px` (step of 4, 0–72px) — these are used throughout templates instead of inline styles.

When adding a color/spacing value, add it at the appropriate token layer rather than hardcoding it in a component.

## Figma → code

This project is frequently built from Figma via the Figma MCP server. When implementing a Figma node:

1. `get_design_context` first; if truncated, `get_metadata` for the node map then re-fetch only the needed node(s). Also `get_screenshot` for visual reference before implementing.
2. Figma MCP output is React + Tailwind — treat it as a representation of design/behavior, **not** final code. Translate to Vue 3 + Bootstrap following the conventions above, reusing existing components, tokens, and the spacing utilities.
3. If the MCP server returns a localhost source for an image/SVG, use it directly — don't substitute placeholders or import new asset/icon packages.
4. The Figma source is often a rough wireframe. When it conflicts with clean layout, follow Figma's structure but apply Bootstrap styling and reasonable alignment (e.g. `align-items-center`) rather than copying unaligned frames. Validate the result against the screenshot.
