# connorvoelk.com — Site Plan & Progress

This document tracks the current state, known issues, and planned work for the personal website. Updated as work progresses.

---

## Road to Launch

**The strategy: launch small, then grow in public.** The site has stayed "almost ready" because the scope kept growing (10 planned pages plus the Home Scene) before anything shipped. What's already built is good enough to go live once a few content gaps are filled. New pages and the Home Scene then ship as updates to a live site instead of being prerequisites for it.

### Phase 0 — Lock in the basics (you, ~30 min)
**Decided 2026-10-21:** `connorvoelk.com`, hosted on Vercel.

- `[x]` **Registered connorvoelk.com** through Vercel (2026-10-21). Vercel runs its DNS, so there are no records to set up by hand.
- `[x]` Vercel account (existing account, not originally created with GitHub, which is fine).
- `[ ]` Push this repo to `github.com/connorvoelk/connorvoelk.com`.
- `[ ]` In Vercel: **Add New → Project → Import Git Repository**. Because the account wasn't made with GitHub, Vercel first asks you to connect GitHub. That installs the Vercel GitHub App; pick **Only select repositories** → `connorvoelk.com`. Then import → **Deploy** (the Next.js defaults are correct). After that, every push to `main` auto-deploys and every other branch gets its own preview URL.
- `[ ]` Project → **Settings → Domains → Add Domain** → `connorvoelk.com`. Accept Vercel's prompt to add `www` too, so one redirects to the other.

### Phase 1 — Launch v1 (content only you can write, ~1 weekend)
Things on live pages that are currently wrong or empty:
- `[ ]` **Home intro**: name, one line about you, and links (GitHub, LinkedIn, contact). Right now the home page is just the dot grid and navbar, so a visitor can't tell whose site it is.
- `[ ]` **Timeline descriptions**: AWS intern and AWS full-time are copies of the Tesla text; UW Research Assistant says "Computer Science Degree"; UW stops are "Project" / "Other Project"; the Hale stop descriptions are copied ML/CV text.
- `[ ]` **Timeline "now"**: AWS ends 2025-01-01 and the axis stops at 2025. Add your current role and extend the axis (hardcoded to 2015–2025 in `Timeline.tsx`).
- `[ ]` **Resume PDF**: drop it at `public/resume.pdf`, point the `file` nav link at it, and flip it to `ready: true` in `Navbar.tsx`.
- `[ ]` **Favicon + share image**: `src/app/icon.svg` (the CV logo works, but its white strokes need a dark background to show up in browser tabs) and `src/app/opengraph-image.png` (1200×630) for link previews. The current favicon is still the Next.js default.
- `[ ]` **Phone check**: layouts aren't responsive yet. For v1, "works but not beautiful" on mobile is acceptable.

### Phase 2 — Grow in public (after launch, any order)
Each item is a standalone update. When a page ships, flip its `ready` flag in `Navbar.tsx`.
- [obj] individual pages (8 remaining) + gallery category filtering
- Projects: listening pal, pokeDB, monolith (+ `/projects` index)
- Blog: Data Driven Design, Lapras Invasion, Dead Internet (+ `/blog` index); consider MDX for posts
- Vercel Web Analytics (free on Hobby), mobile layouts, accessibility pass

### Phase 3 — Home Scene
See [HOME-SCENE.md](./HOME-SCENE.md). Build it on a branch (Vercel gives every branch a preview URL) while v1 is live, then swap it in. Asset production is the critical path, so the AI art generation can start in parallel with Phase 2.

### Hosting decision
**Vercel Hobby.** It's made by the Next.js team, needs zero config, and is free: 100 GB/month transfer, 100 MB max per static file. After compression the whole site is ~8 MB, so it fits easily. The Home Scene's server-side API caching (weather, Spotify) also runs on Vercel functions. Alternatives considered: Cloudflare (needs the OpenNext adapter), Netlify (fine, no advantage here), and GitHub Pages (static export only, which would rule out the Home Scene's API routes).

### Done — launch prep (2026-10-20)
- `[x]` Upgraded Next.js 15.1.3 → 16.4.2 and React 19.0 → 19.3.1. 15.1.3 is vulnerable to the React2Shell RCE (CVE-2025-66478 / CVE-2025-55182). `npm audit --omit=dev` is clean.
- `[x]` Production build passes (it was failing on a type error). ESLint moved to the flat config Next 16 expects (`npm run lint`).
- `[x]` 3D models compressed from 215 MB → 8.3 MB total (meshopt geometry + WebP textures, full 2048px). Originals moved to `assets-src/` (gitignored). Re-run with `npm run optimize:models`. `ferrari.glb` is now `foggy-bridge.glb`.
- `[x]` model-viewer loads from the npm package (4.4.0) instead of Google's CDN (3.3.0), with a self-hosted meshopt decoder (`public/meshopt_decoder.js`).
- `[x]` Profile picture 23 MB (7598px) → 50 KB (512px). Original in `assets-src/images/`.
- `[x]` Navbar shows only pages that exist, so there are no 404s. Planned pages stay listed with `ready: false` in `Navbar.tsx`.
- `[x]` [obj] cards link only to pages that exist (bulbasaur).
- `[x]` Fixed the git remote, which pointed at a nonexistent `connorvoelk.com/connorvoelk.com` repo.

---

## Status Key
- `[ ]` Not started
- `[~]` In progress / partial
- `[x]` Complete

---

## Current Pages & Routes

| Route | Status | Notes |
|---|---|---|
| `/` | `[~]` | Dot-grid canvas animation exists, but page is mostly empty — no intro content, bio, or CTAs |
| `/timeline` | `[~]` | Renders, line layout algorithm works, but info panel cards are empty and data has placeholder content |
| `/obj` | `[~]` | Grid renders 3D models, but sidebar filtering is non-functional and only bulbasaur has its own page |
| `/obj/bulbasaur` | `[~]` | GBA zoom-scroll works; content section below is placeholder |
| `/resume` | `[ ]` | Hidden from nav until built (`ready: false`) |
| `/file` | `[ ]` | Hidden from nav until built |
| `/projects` | `[ ]` | Hidden from nav until built |
| `/listening-pal` | `[ ]` | Hidden from nav until built |
| `/pokedb` | `[ ]` | Hidden from nav until built |
| `/monolith` | `[ ]` | Hidden from nav until built |
| `/blog` | `[ ]` | Hidden from nav until built (whole blog section hidden until one post is ready) |
| `/data-driven-design` | `[ ]` | Hidden from nav until built |
| `/lapras-invasion` | `[ ]` | Hidden from nav until built |
| `/dead-internet` | `[ ]` | Hidden from nav until built |

---

## Section-by-Section Work

### Home Page (`/`)
- `[x]` Animated dot-grid canvas background
- `[x]` Navbar component
- `[ ]` Intro/hero content — name, tagline, short bio
- `[ ]` Navigation/entry points to other sections (visual links, not just navbar)
- `[ ]` Any other landing page content (currently just a canvas and a navbar)

---

### Timeline (`/timeline`)
- `[x]` Timeline line layout algorithm (handles overlapping date ranges)
- `[x]` Click-to-expand line detail panel
- `[x]` Clickable stops on lines
- `[x]` Logo circle appears on selected line
- `[~]` Timeline data (`timelineData.ts`): dates and typos fixed; placeholder/copied descriptions remain (see Bugs section)
- `[ ]` Info cards in detail panel — 3 cards rendered but empty (`{/* Card content 1/2/3 */}`)
  - Need to decide what each card shows (skills? projects? media? highlights?)
- `[ ]` Stop detail view — clicking a stop shows `selectedStop` state but nothing renders it
- `[ ]` Year legend — hardcoded to 2015/2020/2025; should derive from data or at least be accurate
- `[ ]` UW stops — currently placeholder names ("Project", "Other Project") with duplicate descriptions
- `[ ]` Mobile/responsive layout

---

### [obj] Gallery (`/obj`)
- `[x]` Retro Mac OS window aesthetic
- `[x]` 3D model grid using `model-viewer`
- `[x]` Sidebar with window controls (visual only)
- `[x]` Models compressed for the web (~0.4–1.9 MB each, down from 10–57 MB)
- `[~]` Individual object pages — only bulbasaur has one; need pages for all 9 objects:
  - `[ ]` `/obj/cloud` — cloud tray
  - `[~]` `/obj/bulbasaur` — see below
  - `[ ]` `/obj/garden` — garden tray
  - `[ ]` `/obj/pool` — pool soap dish
  - `[ ]` `/obj/snake` — snake pot
  - `[ ]` `/obj/volcano` — volcano incense chamber
  - `[ ]` `/obj/foggy-bridge` — foggy bridge
  - `[ ]` `/obj/big-brother` — big brother
  - `[ ]` `/obj/little-sister` — little sister
- `[~]` Items in grid link to their individual pages — add `href` to an item in `obj/page.tsx` when its page exists
- `[ ]` Sidebar category filtering ("All Works", "Bowls", "Vases") — currently `href="#"`
- `[ ]` Item categories/tags (need to decide which objects belong to which categories)
- `[ ]` Fallback/poster images for 3D models while loading (`fallbackImage` prop is supported, none provided yet)
- `[ ]` Bottom nav bar "breadcrumb" label is empty (`<strong></strong>`)

---

### Bulbasaur Page (`/obj/bulbasaur`)
- `[x]` GBA zoom-scroll structure
- `[x]` pokemon-stage.png and gba-outline.png layers
- `[ ]` Page needs actual content — description, context, photos (currently placeholder text)
- `[x]` Navigation back to `/obj`
- `[ ]` Overall the page concept needs to be fleshed out — what is the experience?

---

### Individual [obj] Pages (to be created)
Each object should have its own dedicated page. The bulbasaur page shows the intended direction — a more experiential, contextual page for each object rather than just a model viewer. Each page should include:
- `[ ]` 3D model embed (interactive)
- `[ ]` Description / story behind the piece
- `[ ]` Photos (if available)
- `[ ]` Design/process notes
- `[ ]` Navigation back to `/obj`

---

### Resume (`/resume` and `/file`)
- `[ ]` `/resume` — decide what this page is (PDF viewer? formatted HTML resume?)
- `[ ]` `/file` — likely the actual PDF/file download or embed
- `[ ]` Resume data — could reuse timeline data or have separate structured content
- `[ ]` PDF viewer component (if going that route)

---

### Projects Section

#### Projects Index (`/projects`)
- `[ ]` Create projects index page
- `[ ]` Design for listing all projects

#### Listening Pal (`/listening-pal`)
- `[ ]` Create page — what is this project?

#### PokeDB (`/pokedb`)
- `[ ]` Create page (source: github.com/connorvoelk/PokeDB)

#### Monolith (`/monolith`)
- `[ ]` Create page

---

### Blog Section

#### Blog Index (`/blog`)
- `[ ]` Create blog index / listing page

#### Data Driven Design (`/data-driven-design`)
- `[ ]` Create post page — content TBD

#### Lapras Invasion (`/lapras-invasion`)
- `[ ]` Create post page — content TBD

#### Dead Internet (`/dead-internet`)
- `[ ]` Create post page — content TBD

---

## Known Bugs & Data Issues

### `timelineData.ts` — Data Quality
- `[x]` Invalid date: `new Date('2021-06-024')` (AWS intern start) → `2021-06-24`
- `[x]` Non-standard dates `2018-05-7`, `2022-8-10` → zero-padded
- `[ ]` AWS intern description is copy-pasted from Tesla description (wrong content)
- `[ ]` AWS full-time description is also copy-pasted from Tesla description (wrong content)
- `[ ]` UW Research Assistant description is copy-pasted ("Computer Science Degree" — same as main UW line)
- `[ ]` UW stop names are placeholders ("Project", "Other Project")
- `[ ]` UW stop descriptions are placeholder/duplicate ("Machine learning research project", "Computer vision implementation")
- `[ ]` Hale stop descriptions are the same placeholder text
- `[ ]` AWS AI Practitioner cert (2025-01-03) falls after the timeline's 2025-01-01 end
- `[x]` Typos: "Contriubted", "Proffesional", "Practionier", "injestion", "processising", "acheived", "phyiscal"

### `Timeline.tsx` — Code
- `[x]` Debug `console.log`s removed
- `[ ]` Year legend is hardcoded to 2015/2020/2025

### `layout.tsx` — Metadata
- `[x]` Title still says "Create Next App"
- `[x]` Description still says "Generated by create next app"

### `globals.css`
- `[ ]` Duplicate CSS reset block (margin/padding reset appears twice)

### `obj/page.tsx`
- `[x]` `item.fallbackImage` TypeScript error (broke the production build)

---

## Planned New Features

### Home Scene — Interactive Animated Home Page
- `[~]` Requirements drafted in [HOME-SCENE.md](./HOME-SCENE.md) — personalized "lofi girl"-style animated room with stylized Connor avatar, real-time weather/time sync, and Spotify integration. Open questions to resolve before MVP build. Planned as Phase 3 (after v1 launch).

### General / Infrastructure
- `[ ]` Site metadata (OG image, favicon) — title/description done
- `[ ]` Accessibility pass (ARIA labels, semantic HTML, keyboard navigation)
- `[ ]` Mobile/responsive layouts across all pages
- `[ ]` Error boundaries for 3D model loading

### To Discuss / Scope Later
- `[ ]` Dark/light mode toggle?
- `[ ]` Contact section or contact page?
- `[ ]` Analytics? (Vercel Web Analytics is free on Hobby)
- `[ ]` Any additional projects beyond the three currently in the nav?

---

## Assets Inventory

Originals live in `assets-src/` (gitignored, local only — back it up). Web-optimized copies live in `public/`.

### 3D Models
| File in `public/` | Size | Used on |
|---|---|---|
| `cloud.glb` | 0.4 MB | `/obj` |
| `bulbasaur.glb` | 0.7 MB | `/obj`, `/obj/bulbasaur` |
| `garden.glb` | 0.5 MB | `/obj` |
| `pool.glb` | 0.4 MB | `/obj` |
| `snake.glb` | 0.8 MB | `/obj` |
| `volcano.glb` | 0.4 MB | `/obj` |
| `foggy-bridge.glb` | 1.9 MB | `/obj` (was `ferrari.glb`) |
| `big-brother.glb` | 0.4 MB | `/obj` |
| `little-sister.glb` | 0.5 MB | `/obj` |
| `*.usdz` (in `assets-src/models/`) | — | Not used; model-viewer generates iOS AR files from the .glb automatically |

### Images / Logos (in `/public`)
| File | Used |
|---|---|
| `profile-picture.jpg` | Navbar |
| `hale.avif` | Timeline |
| `uw.png` | Timeline |
| `jams.png` | Timeline |
| `ubicomplab.svg` | Timeline |
| `ischool.jpg` | Timeline |
| `tesla-icon-white.png` | Timeline |
| `aws-white.png` | Timeline |
| `pokemon-stage.png` | `/obj/bulbasaur` |
| `gba-outline.png` | `/obj/bulbasaur` (1.2 MB — could be converted to WebP) |
| `disc.png` | `/obj` bottom bar |
| `folder.png` | `/obj` bottom bar |
| `CV.svg` | Not currently used — candidate for favicon |
| `AWS Logo.png`, `aws.png`, `tesla.png`, `tesla-white.png` | Not currently used |
| `Macintosh HD 1024x1024.webp` | Not currently used |
