# Home Scene — Interactive Animated Home Page

**Status:** Requirements draft (v2)
**Working title:** "Lofi Connor" (placeholder — rename welcome)
**Owner:** Connor
**Last updated:** 2026-05-13

---

## 1. Overview

Replace the current home page (dot-grid canvas + navbar) with a personalized, always-on animated scene inspired by the [Lofi Girl](https://www.youtube.com/@LofiGirl) livestream. Instead of a generic studying anime character, the scene depicts a stylized version of Connor at his desk in a richly detailed room. The environment reflects Connor's actual real-world conditions — current Seattle time-of-day, season, and weather — and the scene surfaces what Connor is currently listening to (Spotify), what sports teams are playing today, and more API-driven details over time.

The home page is intended to function both as a portrait (a snapshot of what Connor is doing/listening to/seeing right now) and as a showcase of Connor's development chops, with API-driven elements continually being added.

---

## 2. Goals & Non-Goals

### Goals
- A visually distinctive home page that visitors remember and want to revisit.
- A personal, ambient, cozy feel — not a portfolio dashboard.
- Real-world signal: the scene reflects **Connor's** reality (Seattle), not the visitor's.
- Discoverable depth: clickable hotspots that reward looking closely (and link out to other parts of the site).
- **Extensibility as a design principle** — the architecture should make it easy to add new API-driven elements over time (each new API = new element in the scene). This is itself a showcase of Connor's development work.
- Graceful behavior across devices, network conditions, and accessibility needs.

### Non-Goals
- Not a real-time webcam or live video.
- Not a game or heavily interactive experience — primarily ambient with a few hotspots.
- Not a replacement for the navbar or the rest of the site's navigation.
- **Never autoplays audio.**

---

## 3. Visual Style

- **Medium:** Anime/illustrated 2D, hand-drawn aesthetic. Layered art for parallax and animation.
- **Mood reference:** Lofi Girl, Studio Ghibli interiors, cozy/lived-in anime backgrounds.
- **Color:** Driven by time-of-day lighting (warm dawn, bright day, golden dusk, cool moonlit night). Single coherent palette per time-of-day state, with season modulating outdoor colors.
- **Composition:** Connor at his desk, profile view, room around him visible. Window on the left (outside world view, drives weather + time-of-day + season), bookshelf on the right (record player + sports hats wall).

---

## 4. The Avatar — Stylized Connor

A 2D illustrated character at the desk, shown in profile from the side.

### Appearance
- Seated in a chair, facing **left** toward the computer monitor on the desk.
- **Brown hair, buzzcut.**
- Wearing a **hoodie.**
- Tea mug on the desk within easy reach.

### Animations
| State | Cadence | Implementation |
|---|---|---|
| Blinking | Every 3–6 seconds (with natural jitter) | CSS scale-Y on an eyes-layer |
| Head shifts | Subtle, every 10–20 seconds | CSS transform on a head-layer |
| Sipping tea | Every 30–90 seconds | Swap to "sipping" pose (separate AI-generated asset), hold for 2–3s, swap back |

### Notes
- The micro-motion (blink, head shift) is CSS-driven and doesn't require new AI assets — just a layered head/eyes structure.
- The tea sip is the only state that needs distinct generated pose variants. Two poses total: neutral and sipping.
- Optional v2: occasional reach for the mouse, stretch arms, glance toward window or Percy.

---

## 5. The Room

### 5.1 Percy (the cockatiel)

Connor's pet cockatiel, **white-faced variety** (grey body, white face — distinct from the more common yellow-faced cockatiel). Should read as **cute**.

**Location:** Window sill (left side of the scene).

**Animation states** (rotate naturally, weighted random transitions):

| State | Visual | Approx. duration |
|---|---|---|
| Napping | Eyes closed, fluffed up, head tucked | 30–60s |
| Stretching wings | Wings extended outward | 3–5s |
| Looking at Connor | Head turned, alert, eyes wide | 10–20s |
| Idle perched | Default standing posture, occasional tiny head bob | 20–40s |

Each state = one AI-generated pose variant. Transitions = quick crossfade or instant swap.

**Stretch:** Percy reacts to specific scene events — e.g. wing stretch when the record player starts, look-at-Connor when a Mariners game is on.

### 5.2 The Window

The largest single piece of environmental signal. Composited from sub-layers so we don't have to generate every combination.

**Static scene elements (always present):**
- Seattle skyline with **Space Needle in the far corner** (visible but not center-stage).
- Cluster of trees in the foreground/midground (Seattle is green).
- Buildings, density appropriate to neighborhood.

**Dynamic sub-layers (composited at runtime):**

| Layer | Variants | Driven by |
|---|---|---|
| Sky | Pre-dawn, dawn, day, golden hour, dusk, night | Time of day (Seattle local) |
| Trees | Spring (buds), Summer (full green), Fall (orange/red), Winter (bare/snowy) | Season (calendar) |
| Weather overlay | Clear, cloudy, light rain, heavy rain, snow, thunderstorm, fog | Weather API |
| Lighting/tint pass | Warmth/saturation curve | Combination of above |

**Asset budget:** ~6 sky × 4 tree-sets × ~6 weather overlays = ~16 sub-layer assets total, composited into far more visual combinations. (See §10 for asset production strategy.)

### 5.3 Bookshelf + Record Player (right side)

A bookshelf to Connor's right, holding:
- **Record player** on a shelf at eye level.
- **Vinyl record case / sleeve** displayed nearby (jacket art visible).
- **Books** on other shelves, with spines that can hint at projects/blog topics (easter egg, see §5.6).

**Record player behavior:**
- Default state: record sitting on the turntable, **not spinning**, music **not playing**.
- Hover state: subtle glow, cursor change.
- Click: needle drops, record starts spinning (CSS rotation), audio plays.
- Second click (or another control): needle lifts, record stops, audio pauses.
- Currently-playing track surfaced subtly (small text near record player when active).

**The album art question.** Spotify's API returns the real album artwork as an image URL. The displayed record cover and label should *feel* cartoon-styled to match the scene, but real-time AI restyling of album art is impractical (slow, expensive, inconsistent). Options:

1. **Hybrid:** Real album art image, framed in a hand-drawn cartoon-style record sleeve and label. The "real" image is small enough that the style mismatch is minor.
2. **Generic styled vinyl:** A single hand-drawn record graphic that doesn't try to reflect the real art. Track info only shown as text.
3. **Pre-bake on save:** When Connor likes a track, manually convert its art once via AI and store it. Not feasible for "currently playing" since it's live.

**Recommendation:** Option 1 (hybrid) for MVP. Keeps the data tie to real Spotify state.

### 5.4 Sports Hats Wall

On the wall, a row of hooks or pegs holding caps for Connor's favorite Seattle teams:
- **Seahawks** (NFL)
- **Mariners** (MLB)
- **Kraken** (NHL)
- **Sounders** (MLS)

**Behavior:**
- Default state: all hats hanging on the wall in muted/neutral coloring.
- If a team has a game today (per a sports-schedule API), that team's hat is **highlighted** — brighter, slightly larger, maybe a subtle glow or "spotlight."
- Optional hover: shows game info (opponent, kickoff time, score if live).
- Click: links out to the game / standings / team page (TBD).

**Per-team schedule fetching:** needs a unified sports API or four sport-specific endpoints. See §11.

### 5.5 Other room details (lower priority but desired)

- Desk with monitor (left), laptop or notebook, keyboard, mouse.
- Mug on desk (the tea mug).
- Chair Connor sits in.
- Lamp on the desk that visibly toggles on/off with time of day.
- Plants (optional, react to season).

### 5.6 Easter eggs (callbacks to other site sections)

Sprinkled around the room, each is a clickable hotspot linking to the corresponding page:

- **3D-printed objects from `/obj`** on the shelves — bulbasaur, snake pot, cloud tray, volcano, etc. Each links to its `/obj/<slug>` page.
- **Vintage Macintosh** on a side table (callback to the `/obj` Mac OS aesthetic) → links to `/obj`.
- **Bookshelf spines** with titles referencing projects/blog posts → link to relevant `/projects` and `/blog` entries.
- **Pinboard or framed photos** on the wall referencing timeline milestones (UW, Tesla, AWS) → link to `/timeline`.

MVP can ship with 2–3 easter eggs; the rest accrue over time.

---

## 6. Environmental Sync

All driven by **Connor's location (Seattle)**, same for every visitor. The scene reflects Connor's reality, not the viewer's.

### 6.1 Time of day
| State | Approx. hours | Cues |
|---|---|---|
| Pre-dawn / late night | 00:00–05:00 | Dark, moonlight, lamp on, stars |
| Dawn | 05:00–07:30 | Warm pink/orange sky, soft light |
| Day | 07:30–17:00 | Bright daylight, lamp off |
| Golden hour | 17:00–19:30 | Warm gold, long shadows |
| Dusk | 19:30–21:00 | Cooling, purple/blue, lamp turns on |
| Night | 21:00–24:00 | Dark, lamp on, stars visible |

Boundaries should shift seasonally — use real sunrise/sunset for Seattle for the current date, not fixed hours. (Open-Meteo provides this for free.)

### 6.2 Season
Driven by the calendar (Northern Hemisphere meteorological or astronomical — pick one):
- **Spring** (Mar–May): trees budding, light green, fresh look.
- **Summer** (Jun–Aug): full green canopy, brightest palette.
- **Fall** (Sep–Nov): orange/red foliage, scattered leaves.
- **Winter** (Dec–Feb): bare branches, possible snow on roofs/trees, muted palette.

Affects: trees layer, ground/skyline coloring, possibly snow accumulation on rooftops.

### 6.3 Weather
Pulled from a weather API (Connor has one). States to support:
- Clear / sunny
- Cloudy / overcast
- Light rain (window streaks)
- Heavy rain (heavier streaks, possibly audible if audio is playing)
- Snow (only meaningful in winter, but possible elsewhere)
- Thunderstorm (occasional lightning flashes)
- Fog (lower visibility, hazy skyline)

**Refresh cadence:** weather every ~15 min, time-of-day re-evaluated every minute, season every hour.

---

## 7. Music — Record Player (Spotify Integration)

See §5.3 for the visual spec. This section is the data/audio behavior.

**Data source:** Connor's existing Spotify API endpoint returning current/recent track including artwork.

**UX flow:**
1. On page load, scene fetches latest Spotify state and renders the vinyl with corresponding art (per §5.3 hybrid styling).
2. Record player is **silent and not spinning** by default.
3. Visitor clicks the record player → it starts spinning, audio begins.
4. Visitor clicks again (or a stop control) → music pauses, record stops.
5. Track title + artist surfaced unobtrusively when playing.
6. Optional: "Listen on Spotify" link out for the full track.

### Open implementation questions
- What does the existing Spotify API endpoint return — full audio playback rights, just metadata + 30s preview, or just metadata?
- Spotify Web Playback SDK requires the **listener** to have Spotify Premium. Realistic path is probably: 30s preview clip via track metadata, with a "Listen on Spotify" link. Confirm.
- Should the avatar visibly react when music is playing (head-bob)? Should Percy?

---

## 8. Interactivity & Hotspots

Mostly ambient with a defined set of clickable hotspots.

| Hotspot | Action |
|---|---|
| Record player | Toggle music play/pause (see §7) |
| Sports hat (when game today) | Show game info / link to game |
| 3D-printed objects on shelf | Link to `/obj/<slug>` |
| Macintosh on side table | Link to `/obj` |
| Bookshelf spines | Link to specific `/projects` or `/blog` entries |
| Pinboard photos | Link to `/timeline` |
| Percy | (Optional easter egg — chirp animation? wave wing?) |

**Behavior rules:**
- Every interactive element gets a hover state (glow / cursor change).
- No drag, zoom, or pan.
- Mobile: tap is the hover/click; show a one-time hint that elements are interactive.

---

## 9. Asset Production Strategy

Connor will not draw the art himself. Assets will be produced primarily via AI image generation tools — chiefly **Nano Banana (Gemini 2.5 Flash Image)** for anything requiring consistency across variants, and **GPT image-1** for one-off props.

### Key principle
> AI generates the **static building blocks**. The web app composites and animates them. AI does **not** generate animation.

### Workflow
1. **Generate the room base** — empty room composition, transparent where dynamic elements will go.
2. **Generate each character separately** on transparent backgrounds:
   - Connor — neutral pose and sipping pose. Same style, same character.
   - Percy — napping, stretching, looking, idle poses. Same bird across all.
3. **Generate each prop separately** — record player, vinyl case, lamp, each sports hat, each easter-egg object.
4. **Generate window sub-layers separately** — skies (6), tree sets (4), weather overlays (6).
5. **Composite in the browser** as ordered layers with absolute positioning.
6. **Animate via CSS/JS**:
   - Micro-motion: CSS transforms (blink, head shift, record spin).
   - Pose swaps: crossfade between AI-gen variants (tea sip, Percy state changes).
   - Environmental: swap sub-layers based on real-world state.

### Why Nano Banana for character variants
Nano Banana's strength is **consistent edits** — "same Connor, same room, but he's sipping tea now" tends to preserve identity better than re-prompting from scratch. Same for Percy poses and seasonal window variants.

### What AI tools cannot do
- **Smooth interpolation between poses.** Frames won't be coherent across separately generated images.
- **Real-time stylistic conversion** of incoming images (e.g. Spotify album art to cartoon) — too slow, too expensive, and inconsistent run-to-run.

### Asset inventory estimate (MVP)
| Category | Approx. asset count |
|---|---|
| Room base | 1 |
| Connor poses | 2 |
| Percy poses | 4 |
| Window sub-layers | ~16 (6 sky + 4 trees + 6 weather) |
| Props (record player, lamp, mug, etc.) | ~6 |
| Sports hats | 4 |
| Easter-egg objects | 3–5 (MVP), expands later |
| **Total MVP** | **~40 assets** |

Iteration is expected — most assets will need a few generation passes to land.

---

## 10. Technical Approach

> Preliminary; lock in before building.

### Implementation stack
- Lives at `/` (replaces current dot-grid). Old canvas can be kept as a "low-power" fallback or removed.
- Next.js 15 server components for the shell; client component for the scene.
- API data (weather, Spotify, sports schedule, sunrise/sunset) fetched server-side and cached:
  - Weather: 15 min
  - Spotify: 30s–1 min (so "now playing" feels live)
  - Sports schedule: 1 hour
  - Sunrise/sunset: 24 hours
- Asset hosting: static images in `/public` for room/character/prop layers. Album art proxied from Spotify.

### Animation strategy
1. **Layered absolutely-positioned `<img>`/`<svg>` elements** with CSS transforms and transitions. Default approach for MVP — lowest tech complexity.
2. **Lottie or Rive** for any element that needs more sophisticated state machines (consider for v2).
3. **Canvas / WebGL (PixiJS)** if perf becomes an issue at scale — probably overkill.

### Performance
- First meaningful paint < 1.5s on a fast connection.
- Render a static "poster" frame immediately; hydrate animations after.
- `prefers-reduced-motion` users get the static poster — no motion, but environmental state still reflects reality.
- Mobile composition may differ from desktop (tighter framing, fewer layers).

### Extensibility (this is a design priority)
Connor wants to keep adding API-driven elements over time. The scene should be structured so that:
- Adding a new element = drop a layer in the composition + wire a data fetcher + define hover/click behavior.
- Each element is self-contained, with its own data fetch, state, and rendering.
- A "scene config" object lists all active elements; adding/removing is a one-line change.

---

## 11. Phasing

### MVP (v0.1) — "It exists"
- Static room base, Connor with blink + head shift + tea sip.
- Percy on sill, idle + napping states.
- Window with current time-of-day (4 states, no blending), current Seattle weather (3 states: clear/cloudy/rain), current season (4 states).
- Record player: hybrid album art (real image + cartoon frame), click-to-play preview clip, link to Spotify.
- Sports hats: all four hung, highlighted when game today, basic hover info. One sports API integrated to start (probably MLB / Mariners — long season, frequent games for testing).
- Desktop only; mobile gets a static fallback.
- 1–2 easter eggs.

### v0.2 — "It has personality"
- Smooth blending between time-of-day states.
- Full weather state coverage (snow, thunderstorm, fog).
- Percy: all 4 animation states with weighted transitions.
- All 4 sports schedules integrated.
- Mobile-tuned composition.
- 3–5 easter eggs.

### v0.3 — "It's alive"
- Avatar reacts to music (head-bob when playing).
- Percy reacts to specific events (Mariners win → wing stretch, etc.).
- Whiteboard or pinboard with rotating doodle/note content.
- Seasonal sunrise/sunset adjustment.
- Full easter egg coverage of all site sections.

### Stretch
- Holiday / birthday special states.
- Rare animations: shooting star at night, delivery truck driving past, Percy knocking something over.
- "Snapshot" share button — captures the current scene as an image.
- Additional API-driven elements (room for whatever's next — see "future API ideas" below).

### Future API ideas (placeholder for things to add over time)
- GitHub activity → laptop screen shows a commit graph.
- Calendar → a sticky note on the monitor shows next meeting.
- Reading list → current book on the desk.
- Steam/PSN → game disc or controller visible when recently played.
- Strava → running shoes by the door when recently active.

---

## 12. Open Questions

### Resolved this round
- ~~Location~~ → Seattle, hardcoded for now.
- ~~Pet/companion~~ → Percy the white-faced cockatiel on the window sill.
- ~~Art production approach~~ → AI image gen (Nano Banana + GPT image-1) composited in browser.
- ~~Sports teams~~ → Seahawks, Mariners, Kraken, Sounders.

### Still open
1. **Spotify API scope.** Confirm what Connor's existing endpoint returns — full playback rights, 30s preview, or metadata only? Determines listener UX.
2. **Sports schedule API.** Need a unified source covering NFL + MLB + NHL + MLS. ESPN's hidden API covers all four but is unofficial. Sportradar / The Sports DB are alternatives. Pick one.
3. **Travel handling.** When Connor travels, does the scene still show Seattle, or should the location be overridable via config?
4. **Mobile fallback fidelity.** Static poster only, or simplified animated scene?
5. **Cartoon album art approach.** Confirm hybrid (real art in cartoon frame) is acceptable.
6. **Sounds.** Should weather have ambient audio (rain sounds, wind) when the music is playing? Or strictly music only?
7. **What happens at 2am when Connor's asleep IRL?** Does the avatar sleep / leave the chair / dim the scene? Or just sit there?

---

## 13. Dependencies & Risks

- **Asset production is the critical path.** Engineering can scaffold against placeholders, but visual quality is gated on AI-gen iteration time and Connor's art direction.
- **AI gen consistency.** Even Nano Banana isn't perfect — Connor's face/Percy's body may drift across pose variants. Plan for 3–5 generation passes per character pose.
- **Spotify API constraints** may limit audio to 30s previews (no Premium = no full playback for visitors).
- **Sports schedule APIs** — most public sports APIs are unofficial / unreliable / rate-limited. Risk of breakage requires graceful degradation.
- **Album art rights.** Displaying Spotify album art is generally permitted under their API terms but verify; cartoon-restyling it might cross into derivative-work territory — keep the real image as-is.
- **Performance on mobile / slow connections** — illustrated 2D can be heavy. Aggressive image optimization (AVIF, responsive sizes) required.

---

## 14. Success Criteria

- Repeat visitors notice the scene has changed between visits.
- At least one visitor per session clicks through an easter egg or hotspot (measured via analytics).
- Connor is proud to share the URL.
- Page loads in under 2s on typical broadband.
- No accessibility regression vs. the current home page (`prefers-reduced-motion` respected, alt text on key elements, keyboard navigation for hotspots).
- Architecture supports adding a new API-driven element in under a day's work.
