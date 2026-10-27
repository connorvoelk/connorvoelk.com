'use client'
// TEMPORARY test page for debugging the page transition in Firefox-based
// browsers. Not linked anywhere; delete before merging page-transitions.
import { useState } from 'react'
import { flushSync } from 'react-dom'
import { gridLines } from '@/components/dotGrid'
import { MASK_FRAMES, tileTransitionStyles } from '@/components/tileMask'

const DURATION_MS = 3000

type Technique = 'fade' | 'mask' | 'clip'

const LABELS: Record<Technique, string> = {
  fade: '1. Plain fade',
  mask: '2. Tile mask',
  clip: '3. Tile clip',
}

// Same random square-by-square reveal as the mask, but cut out with
// clip-path vector shapes (one keyframe per frame) instead of a mask image
function tileClipStyles(width: number, height: number): string {
  const xs = [0, ...gridLines(width), width]
  const ys = [0, ...gridLines(height), height]
  const squares: string[] = []
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      squares.push(`M${xs[i]} ${ys[j]}H${xs[i + 1]}V${ys[j + 1]}H${xs[i]}Z`)
    }
  }
  for (let i = squares.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[squares[i], squares[j]] = [squares[j], squares[i]]
  }
  const perFrame = squares.length / (MASK_FRAMES - 1)
  const keyframes = Array.from({ length: MASK_FRAMES }, (_, k) => {
    const shown = squares.slice(0, Math.round(k * perFrame)).join('') || 'M0 0Z'
    return `${((k / (MASK_FRAMES - 1)) * 100).toFixed(3)}% { clip-path: path('${shown}'); }`
  }).join('\n')
  return `
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }
    ::view-transition-new(root) {
      animation: tile-clip ${DURATION_MS}ms step-end both;
    }
    @keyframes tile-clip { ${keyframes} }
  `
}

function stylesFor(technique: Technique): string {
  if (technique === 'fade') {
    // The browser's own default cross-fade, just slowed down
    return `::view-transition-old(root), ::view-transition-new(root) { animation-duration: ${DURATION_MS}ms; }`
  }
  if (technique === 'mask') {
    return tileTransitionStyles(window.innerWidth, window.innerHeight, DURATION_MS)
  }
  return tileClipStyles(window.innerWidth, window.innerHeight)
}

// Plays one slow transition and reports what the browser says about it
function runTransition(
  technique: Technique,
  flip: () => void,
  report: (line: string) => void
) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!('startViewTransition' in document)) {
    report(`${technique}: this browser doesn't support View Transitions`)
    return
  }
  report(`${technique}: starting (reduce motion ${reducedMotion ? 'ON' : 'off'})`)
  const style = document.createElement('style')
  style.textContent = stylesFor(technique)
  document.head.append(style)
  const start = performance.now()
  const transition = document.startViewTransition(() => flushSync(flip))
  transition.ready.then(
    () => report(`${technique}: running`),
    (e: Error) => report(`${technique}: skipped (${e.message})`)
  )
  transition.finished.finally(() => {
    style.remove()
    report(`${technique}: finished after ${Math.round(performance.now() - start)}ms`)
  })
}

export default function TransitionLab() {
  const [flipped, setFlipped] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const report = (line: string) => setLog((lines) => [line, ...lines].slice(0, 12))

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background: flipped ? '#f4f4f4' : '#000',
        color: flipped ? '#000' : '#fff',
        fontFamily: 'var(--font-plus-jakarta-sans), sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2rem' }}>Transition test</h1>
      <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>
        Each button plays a slow 3-second transition to the other screen. Note
        which ones visibly animate.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        {(Object.keys(LABELS) as Technique[]).map((technique) => (
          <button
            key={technique}
            onClick={() => runTransition(technique, () => setFlipped((f) => !f), report)}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: 999,
              border: '1px solid currentColor',
              background: 'transparent',
              color: 'inherit',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            {LABELS[technique]}
          </button>
        ))}
      </div>
      <p aria-hidden style={{ marginTop: '2rem', fontSize: 'min(40vw, 22rem)', fontWeight: 700, lineHeight: 1 }}>
        {flipped ? 'B' : 'A'}
      </p>
      <pre style={{ marginTop: '1rem', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
        {log.length ? log.join('\n') : 'Press a button to start.'}
      </pre>
    </main>
  )
}
