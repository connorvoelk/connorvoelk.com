import { gridLines } from './dotGrid'

export const TRANSITION_MS = 400
// Frames in the mask strip; 24 over 0.4s is about one per screen refresh
export const MASK_FRAMES = 24
// How many frames each square takes to fade in (6 of 24 ≈ 0.1s)
const FADE_FRAMES = 6

// Builds an SVG "film strip" of MASK_FRAMES frames, each one viewport tall.
// Frame 0 shows no squares and the last frame shows all of them; in between,
// every square starts fading in at a random frame and reaches full opacity
// FADE_FRAMES later. Stepping through the strip as a mask reveals the incoming
// page square by square, with squares cut along the dot grid so the dots sit
// on their corners.
export function buildTileMask(width: number, height: number): string {
  const xs = [0, ...gridLines(width), width]
  const ys = [0, ...gridLines(height), height]

  const squares: string[] = []
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      squares.push(`M${xs[i]} ${ys[j]}H${xs[i + 1]}V${ys[j + 1]}H${xs[i]}Z`)
    }
  }

  // Shuffle so the squares start in a random order (Fisher–Yates)
  for (let i = squares.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[squares[i], squares[j]] = [squares[j], squares[i]]
  }

  // Split the squares into batches by the frame they start fading in at,
  // from frame 1 to the last frame that still leaves time to finish the fade.
  // Each batch is written into the SVG once and reused by every frame.
  const lastStart = MASK_FRAMES - FADE_FRAMES
  const perBatch = squares.length / lastStart
  let defs = ''
  for (let s = 1; s <= lastStart; s++) {
    const batch = squares
      .slice(Math.round((s - 1) * perBatch), Math.round(s * perBatch))
      .join('')
    defs += `<path id="b${s}" d="${batch}"/>`
  }

  // Frame k: batches that have finished fading are fully opaque (kept as a
  // running group so each frame builds on the last), and the ones still
  // fading are drawn at (frames since they started) / FADE_FRAMES opacity
  let opaque = 'o0'
  defs += '<g id="o0"/>'
  let strip = ''
  for (let k = 0; k < MASK_FRAMES; k++) {
    const finished = k - FADE_FRAMES + 1
    if (finished >= 1 && finished <= lastStart) {
      defs += `<g id="o${k}"><use href="#${opaque}"/><use href="#b${finished}"/></g>`
      opaque = `o${k}`
    }
    let fading = ''
    for (let s = Math.max(1, finished + 1); s <= Math.min(k, lastStart); s++) {
      const opacity = ((k - s + 1) / FADE_FRAMES).toFixed(3)
      fading += `<use href="#b${s}" opacity="${opacity}"/>`
    }
    strip += `<g transform="translate(0 ${k * height})"><use href="#${opaque}"/>${fading}</g>`
  }

  const stripHeight = height * MASK_FRAMES
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${stripHeight}" ` +
    `viewBox="0 0 ${width} ${stripHeight}" preserveAspectRatio="none" ` +
    `fill="#fff" shape-rendering="crispEdges"><defs>${defs}</defs>${strip}</svg>`

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

// The CSS for one transition: instead of the browser's default cross-fade,
// the new page's snapshot sits over the old one, masked by the tile strip,
// which steps one frame at a time.
//
// The navbar (view-transition-name: site-nav) is captured separately, so it
// isn't cut into squares: it stays put, live, on top of the reveal. On pages
// without it ([obj]), it fades out or in instead.
export function tileTransitionStyles(width: number, height: number): string {
  return `
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }
    ::view-transition-new(root) {
      mask-image: ${buildTileMask(width, height)};
      mask-size: 100% ${MASK_FRAMES * 100}%;
      mask-repeat: no-repeat;
      animation: tile-reveal ${TRANSITION_MS}ms steps(${MASK_FRAMES}, jump-none) both;
    }
    @keyframes tile-reveal {
      from { mask-position: 0% 0%; }
      to { mask-position: 0% 100%; }
    }

    ::view-transition-group(site-nav),
    ::view-transition-new(site-nav) {
      animation: none;
      mix-blend-mode: normal;
    }
    ::view-transition-old(site-nav) {
      display: none;
    }
    ::view-transition-old(site-nav):only-child {
      display: block;
      animation: nav-fade ${TRANSITION_MS}ms ease both reverse;
    }
    ::view-transition-new(site-nav):only-child {
      animation: nav-fade ${TRANSITION_MS}ms ease both;
    }
    @keyframes nav-fade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `
}
