# connorvoelk.com — Site Plan & Progress

This document tracks the current state, known issues, and planned work for the personal website. Updated as work progresses.

---

## Road to Launch

**The strategy: launch small, then grow in public.** The site has stayed "almost ready" because the scope kept growing (10 planned pages plus the Home Scene) before anything shipped. What's already built is good enough to go live once a few content gaps are filled. New pages and the Home Scene then ship as updates to a live site instead of being prerequisites for it.

### Phase 0 — Lock in the basics (you, ~30 min)
**Decided 2026-10-21:** `connorvoelk.com`, hosted on Vercel.

- `[x]` **Registered connorvoelk.com** through Vercel (2026-10-21). Vercel runs its DNS, so there are no records to set up by hand.
- `[x]` Vercel account (existing account, not originally created with GitHub, which is fine).
- `[x]` Pushed to `github.com/connorvoelk/connorvoelk.com` (2026-10-21).
- `[x]` Vercel project `connorvoelk.com` imported from GitHub, production branch `main`. The Framework Preset had defaulted to "Other" because the repo only held a README at import time, so it was switched to **Next.js**.
- `[x]` Domains: `connorvoelk.com` redirects (308) to `www.connorvoelk.com`; SSL is valid on both.
- `[x]` **Site is live at https://www.connorvoelk.com** (2026-10-21). All pages return 200 and all 9 models render.
- `[x]` **Pushes to `main` auto-deploy** (confirmed 2026-10-21). On launch day, deploys arrived 15–20 minutes after each push because of a GitHub incident delaying webhook deliveries. Normally they start within seconds. If a push ever seems ignored, check githubstatus.com before changing any settings.

### Phase 1 — The v1 finish line (set 2026-10-27)
**Three things, in this order. Each one goes live before the next one starts.** New ideas go in the parking lot (Phase 2/3), not into the code. "Live" beats "perfect": polish later.

1. `[x]` **Resume** (built 2026-10-27)
   - `/resume` is a web page built from `src/app/resume/resumeData.ts`, transcribed from the July 2026 resume. It has a one-page **Download PDF**, and the nav's `file` link points to the same PDF.
   - **Editing the resume:** change `resumeData.ts`, then run `npm run resume:pdf` to regenerate `public/connor-voelk-resume.pdf` from the page.
   - **Privacy rule:** no phone number, address, or email anywhere on the site. The original resume PDFs (which include them) are gitignored and never copied in. `npm run build` fails if anything that looks like a phone number appears in `src/` or `public/` (`scripts/check-private-info.mjs`).
   - The timeline now matches the resume: AWS is split into its two roles with real descriptions, UW lists the Informatics/HCI degree, placeholder stops are removed, and the axis is derived from the data (it runs to 2027).
2. `[x]` **Home page** (live 2026-10-27): an intro over the dot grid with your name, a one-liner, a line on AWS, Tesla, and UW, a low-key "Currently…" line, and links to Resume, LinkedIn, and GitHub. Copy is Connor's own wording, in `src/app/page.tsx`. Also: the navbar logo links home, and hovering the profile picture shows LinkedIn, GitHub, and Instagram.
3. `[ ]` **Blog with one post**: posts are Markdown files in the repo (set up when we get here). Launch with the single post closest to done; the others stay hidden until written.
   - Needs from you: which post, plus your notes or draft. The words have to be yours.

Smaller v1 items, done in the gaps:
- `[x]` **Favicon**: the logo in its hover colors (`src/app/icon.svg`, `favicon.ico`, `apple-icon.png`).
- `[ ]` **Share image**: `src/app/opengraph-image.png` (1200×630), so links to the site get a preview card on LinkedIn, iMessage, etc.
- `[ ]` **Hale timeline stops**: "Slovenian Union of America Website" and "Hale Tech Night" still carry placeholder descriptions. They don't render yet (the stop detail view is unbuilt), so this isn't urgent.

### Phase 2 — Grow in public (after launch, any order)
Each item is a standalone update. When a page ships, flip its `ready` flag in `Navbar.tsx`.
- Home intro as a "fill in the blank" sentence whose key words change dynamically (idea from 2026-10-27; the static intro ships first)
- `[x]` **Page transitions** (live 2026-10-27): on every internal link, the next page appears square by square over the current one, with squares cut along the home page's dot grid. 0.4s total, each square fading in over ~0.1s, random order. Uses the browser's View Transitions API (`src/components/PageTransitions.tsx`, `tileMask.ts`); unsupported browsers and reduced-motion users navigate instantly. **If the transition doesn't show, check reduce motion first:** it can be on in the OS, or set per browser (Firefox and Zen have a hidden `ui.prefersReducedMotion` in `about:config`). Ideas to try later: a ripple from the click point, flashing the grid lines. Back/forward buttons don't animate yet.
- `[~]` **Home intro card** (on the `projects` branch): the smaller intro text and links sit in a dark frosted-glass card (`backdrop-filter` blur) so they read clearly over the dots; the name and headline stay on the grid.
- `[x]` **Home dot grid hover** (live 2026-10-27): dots near the cursor brighten (up to 0.85 opacity) instead of growing, and thin grid lines connecting the dots fade in to 15% while hovering any link. Tuning values sit at the top of the canvas code in `src/app/page.tsx`.
- [obj] individual pages (8 remaining) + gallery category filtering
- `[~]` **Projects** (on the `projects` branch, not merged): `/projects` index plus pages for mani, ListeningPal, Photogram, PokeDB, and Head Helper, with [obj] linking to `/obj`. All content lives in `src/app/projects/projectsData.ts`; images are WebP files in `src/app/projects/media/`. Still needed: real mani screenshots (the page shows an early Figma mockup), and Connor's read of the drafted wording. Other past projects that could join later: Death in US (Shiny app, still live), kno, Ride Share and Meal Share case studies, the sneaker video.
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
| `/resume` | `[x]` | Web resume built from `resumeData.ts`, with a one-page PDF download |
| `/file` | `[x]` | The nav's `file` link opens `/connor-voelk-resume.pdf` (no separate page) |
| `/projects` | `[~]` | Index of all projects, grouped Now / Earlier (on the `projects` branch) |
| `/projects/[slug]` | `[~]` | mani, listening-pal, photogram, pokedb, head-helper, all built from `projectsData.ts` (on the `projects` branch) |
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
- `[x]` Timeline data (`timelineData.ts`) matches the 2026 resume; only the Hale stop descriptions remain placeholders (see Bugs section)
- `[ ]` Info cards in detail panel — 3 cards rendered but empty (`{/* Card content 1/2/3 */}`)
  - Need to decide what each card shows (skills? projects? media? highlights?)
- `[ ]` Stop detail view — clicking a stop shows `selectedStop` state but nothing renders it
- `[x]` Year legend and axis range derived from the data (every five years; same scale as the lines)
- `[x]` UW placeholder stops ("Project", "Other Project") removed
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
- `[x]` `/resume` — formatted HTML resume (dates on a rail, echoing the timeline) with print styles
- `[x]` PDF download generated from the page by `npm run resume:pdf` (one Letter page, no contact details beyond city + LinkedIn/GitHub)
- `[x]` Resume data lives in `src/app/resume/resumeData.ts`, separate from the timeline (which has colors, logos, and stops the resume doesn't)
- `[x]` No PDF viewer needed — the web page is the resume

---

### Projects Section

#### Projects Index (`/projects`)
- `[x]` Index page: cards grouped Now / Earlier, each panel tinted with the project's own color; [obj] shows a turning 3D model
- `[x]` Navbar: all, mani, [obj], listening pal, pokeDB (the dropdown wraps if it ever gets longer)

#### Project pages (`/projects/[slug]`)
One template, driven by `projectsData.ts`: facts (when, role, team, built with), outside links, a screenshot gallery, and short sections.
- `[~]` **mani**: written from the mani repo's docs. Needs real phone screenshots in place of the Figma mockup.
- `[x]` **ListeningPal** (2022 capstone): screens and demo video from the team's capstone site. Code lives in a private team repo (`listeningpal/ListeningPal`) that Connor's personal GitHub can't see; `voelkc/listening-pal` only holds the Flutter starter project.
- `[x]` **Photogram**: emulator screenshots from the repo; links the public re-upload (the class repo is private).
- `[x]` **PokeDB**: ERD plus the parts Connor wrote (marked `--Connor` in the SQL).
- `[x]` **Head Helper**: screens cut from the 2020 design sheet. No code link (the repo is only the React Native starter).

#### Monolith (`/monolith`)
- `[ ]` Create page — what is this project?

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
- `[x]` AWS intern description (was copied from Tesla)
- `[x]` AWS full-time split into its two roles with descriptions from the resume
- `[x]` UW Research Assistant and UW degree descriptions (degree is Informatics/HCI, not CS)
- `[x]` UW placeholder stops removed
- `[ ]` Hale stop descriptions are the same placeholder text
- `[x]` Timeline end now derived from data (fixes the AI Practitioner cert falling off the end)
- `[x]` Date ranges showed the previous month for dates on the 1st (UTC vs local time)
- `[x]` Typos: "Contriubted", "Proffesional", "Practionier", "injestion", "processising", "acheived", "phyiscal"

### `Timeline.tsx` — Code
- `[x]` Debug `console.log`s removed
- `[x]` Year legend derived from data

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
