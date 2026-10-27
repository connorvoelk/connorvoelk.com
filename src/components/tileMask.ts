import { gridLines } from './dotGrid'

export const TRANSITION_MS = 700
// How many distinct moments a square can flip at. More is smoother but makes
// a bigger mask; 24 over 0.7s is about one new batch of squares per 30ms.
export const MASK_FRAMES = 24

// Builds an SVG "film strip" of MASK_FRAMES frames, each one viewport tall.
// Frame 0 shows no squares and the last frame shows all of them; every square
// switches on at a random frame in between. Stepping through the strip as a
// mask reveals the incoming page square by square, with squares cut along the
// dot grid so the dots sit on their corners.
export function buildTileMask(width: number, height: number): string {
  const xs = [0, ...gridLines(width), width]
  const ys = [0, ...gridLines(height), height]

  const squares: string[] = []
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      squares.push(`M${xs[i]} ${ys[j]}H${xs[i + 1]}V${ys[j + 1]}H${xs[i]}Z`)
    }
  }

  // Shuffle so the squares flip in a random order (Fisher–Yates)
  for (let i = squares.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[squares[i], squares[j]] = [squares[j], squares[i]]
  }

  // Each frame reuses the previous one and adds its own batch of squares,
  // so every square is written into the SVG only once
  const perFrame = squares.length / (MASK_FRAMES - 1)
  let frames = '<g id="f0"/>'
  let strip = '<use href="#f0"/>'
  for (let k = 1; k < MASK_FRAMES; k++) {
    const batch = squares
      .slice(Math.round((k - 1) * perFrame), Math.round(k * perFrame))
      .join('')
    frames += `<g id="f${k}"><use href="#f${k - 1}"/><path d="${batch}"/></g>`
    strip += `<use href="#f${k}" y="${k * height}"/>`
  }

  const stripHeight = height * MASK_FRAMES
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${stripHeight}" ` +
    `viewBox="0 0 ${width} ${stripHeight}" preserveAspectRatio="none" ` +
    `fill="#fff" shape-rendering="crispEdges"><defs>${frames}</defs>${strip}</svg>`

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

// The CSS for one transition: instead of the browser's default cross-fade,
// the new page's snapshot sits over the old one, masked by the tile strip,
// stepping one frame at a time. It's plain CSS rather than element.animate()
// because Firefox can't target view-transition pseudo-elements from
// JavaScript yet (Mozilla bug 1977916), and the mask is written in directly
// rather than via a custom property so nothing depends on inheritance into
// the view-transition pseudo-elements.
export function tileTransitionStyles(
  width: number,
  height: number,
  durationMs = TRANSITION_MS
): string {
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
      animation: tile-reveal ${durationMs}ms steps(${MASK_FRAMES}, jump-none) both;
    }
    @keyframes tile-reveal {
      from { mask-position: 0% 0%; }
      to { mask-position: 0% 100%; }
    }
  `
}
