'use client'
import { useEffect, useRef } from 'react'
import { DOT_SPACING, gridLines } from './dotGrid'
import styles from './dotGridBackground.module.css'

// The pulsing dot grid that sits still behind a page: dots near the cursor
// brighten, and faint lines join them up while the pointer is over a link.
//
// 'home' animates on every frame. 'reading' is for pages with more to read
// and scroll: the same grid, but it idles at a lower frame rate, holds still
// for prefers-reduced-motion, and doesn't react to fingers or phone toolbars.
//
// The page puts its content above this with the .content class, and keeps
// text legible with .frost or .clearing, all in dotGridBackground.module.css.

interface Dot {
  x: number
  y: number
  opacity: number
  speed: number
  offset: number
}

interface Props {
  variant?: 'home' | 'reading'
}

const DotGridBackground = ({ variant = 'home' }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dotSize = 5 // Size of each dot
    const restingOpacity = 0.35 // The middle of each dot's pulse
    const proximityRadius = 96 // ~1 inch at 96dpi
    const minPulseOpacity = 0.2 // Dimmest point of each dot's pulse (0.35 ± 0.15)
    const nearOpacity = 0.85 // Minimum opacity of a dot right under the cursor
    const gridLineOpacity = 0.15 // Lines between the dots, while hovering a link
    const gridFadeMs = 80 // How quickly the lines fade in and out (~0.25s to settle)
    const gridSettled = 0.002 // Close enough to call the lines' fade finished
    const pulseFrameMs = 1000 / 20 - 2 // Reading pages pulse at 20fps, which is plenty

    const reading = variant === 'reading'
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    // No pulse, glow or lines: just the dots
    let still = reading && motionQuery.matches
    // Touchscreens can't hover; on a page that scrolls, following the finger
    // would flash the lines at every swipe that starts on a link
    const tracksPointer = !reading || !window.matchMedia('(hover: none)').matches
    // Something other than the pulse changed, so draw on the very next frame
    let needsFrame = true

    // Grid line positions, the lines' current opacity, and whether the
    // pointer is over a link
    let xs: number[] = []
    let ys: number[] = []
    let dots: Dot[] = []
    let mouse: { x: number; y: number } | null = null
    let gridOpacity = 0
    let overLink = false
    let width = 0
    let height = 0
    let dpr = 1

    // Function to create dots grid (shared layout with the page transitions)
    const createDots = (): Dot[] =>
      xs.flatMap((x) =>
        ys.map((y) => ({
          x,
          y,
          opacity: 0.3,
          speed: 0.001 + Math.random() * 0.002,
          offset: Math.random() * Math.PI * 2,
        }))
      )

    // Set canvas size and create initial dots
    const resizeCanvas = () => {
      if (!canvas) return

      // Draw at the screen's full resolution (crisp on Retina, and lets the
      // grid lines be a single device pixel), in CSS-pixel coordinates
      const nextDpr = window.devicePixelRatio || 1
      // A reading page measures the canvas itself: that leaves out the
      // scrollbar, and holds steady as a phone's toolbars slide away
      const nextWidth = reading ? canvas.clientWidth : window.innerWidth
      const nextHeight = reading ? canvas.clientHeight : window.innerHeight
      if (
        reading &&
        nextWidth === width &&
        nextHeight === height &&
        nextDpr === dpr
      ) {
        return
      }
      width = nextWidth
      height = nextHeight
      dpr = nextDpr
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Recreate dots for new dimensions. They're laid out from the window's
      // size like the transition's squares, then carried on down to wherever
      // the canvas ends (under a phone's toolbar, on a reading page).
      xs = gridLines(window.innerWidth)
      ys = gridLines(window.innerHeight)
      while (reading && ys.length && ys[ys.length - 1] + DOT_SPACING + ys[0] <= height) {
        ys.push(ys[ys.length - 1] + DOT_SPACING)
      }
      dots = createDots()
      needsFrame = true
    }

    resizeCanvas()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      needsFrame = true
    }
    const handleMouseLeave = () => {
      mouse = null
      needsFrame = true
    }
    // Listen on the window, not the canvas: the intro text sits on top of the
    // canvas and would otherwise swallow the mouse events
    if (tracksPointer) {
      window.addEventListener('mousemove', handleMouseMove)
      document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    }

    // The grid lines show while the pointer is over a link
    const handlePointerOver = (e: PointerEvent) => {
      overLink = !!(e.target as Element | null)?.closest?.('a')
    }
    const handlePointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) overLink = false // left the window
    }
    if (tracksPointer) {
      document.addEventListener('pointerover', handlePointerOver)
      document.addEventListener('pointerout', handlePointerOut)
    }

    // Animation function
    let frame = 0
    let lastFrameTime = performance.now()
    const animate = () => {
      if (!canvas || !ctx) return

      const now = performance.now()
      const target = overLink && !still ? gridLineOpacity : 0

      // With nothing but the pulse to draw, a reading page skips frames
      const fading = Math.abs(target - gridOpacity) > gridSettled
      if (
        reading &&
        !still &&
        !needsFrame &&
        !fading &&
        now - lastFrameTime < pulseFrameMs
      ) {
        frame = requestAnimationFrame(animate)
        return
      }
      needsFrame = false

      ctx.clearRect(0, 0, width, height)

      // Ease the grid lines' opacity toward on or off
      gridOpacity +=
        (target - gridOpacity) * (1 - Math.exp(-(now - lastFrameTime) / gridFadeMs))
      lastFrameTime = now

      // Lines connecting the dots, one device pixel wide and nudged half a
      // device pixel so they land on the pixel grid and stay crisp
      if (!still && gridOpacity > 0.005 && xs.length && ys.length) {
        const half = 0.5 / dpr
        const [left, right] = [Math.round(xs[0]), Math.round(xs[xs.length - 1])]
        const [top, bottom] = [Math.round(ys[0]), Math.round(ys[ys.length - 1])]
        ctx.beginPath()
        for (const x of xs) {
          ctx.moveTo(Math.round(x) + half, top)
          ctx.lineTo(Math.round(x) + half, bottom)
        }
        for (const y of ys) {
          ctx.moveTo(left, Math.round(y) + half)
          ctx.lineTo(right, Math.round(y) + half)
        }
        ctx.lineWidth = 1 / dpr
        ctx.strokeStyle = `rgba(217, 217, 217, ${gridOpacity})`
        ctx.stroke()
      }

      // One fill color for every dot, with each dot's brightness set through
      // globalAlpha: a number per dot instead of a new color string to build
      // and parse, 60 times a second
      ctx.fillStyle = 'rgb(217, 217, 217)'
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]
        // Calculate opacity using sine wave
        dot.opacity = still
          ? restingOpacity
          : restingOpacity + Math.sin(now * dot.speed + dot.offset) * 0.15

        // Brighten dots near the cursor
        let opacity = dot.opacity
        if (mouse && !still) {
          const dx = dot.x - mouse.x
          const dy = dot.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < proximityRadius) {
            const t = 1 - dist / proximityRadius
            // Raise the pulse's floor: from its usual minimum at the edge of
            // the radius up to nearOpacity right under the cursor
            const floor = minPulseOpacity + (nearOpacity - minPulseOpacity) * t
            opacity = Math.max(opacity, floor)
          }
        }

        // Draw dot centered on its (rounded) grid point
        ctx.globalAlpha = opacity
        ctx.fillRect(
          Math.round(dot.x) - dotSize / 2,
          Math.round(dot.y) - dotSize / 2,
          dotSize,
          dotSize
        )
      }
      ctx.globalAlpha = 1

      if (!still) frame = requestAnimationFrame(animate)
    }

    // A still grid has no loop, so it's redrawn by hand
    const handleResize = () => {
      resizeCanvas()
      if (still) animate()
    }
    window.addEventListener('resize', handleResize)

    const handleMotionChange = () => {
      still = reading && motionQuery.matches
      cancelAnimationFrame(frame)
      needsFrame = true
      animate()
    }
    if (reading) motionQuery.addEventListener('change', handleMotionChange)

    animate()

    return () => {
      // Stop the loop when leaving the page; otherwise every visit would
      // start another one that keeps running in the background
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
      motionQuery.removeEventListener('change', handleMotionChange)
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('pointerout', handlePointerOut)
    }
  }, [variant])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`${styles.canvas} ${variant === 'reading' ? styles.reading : ''}`}
    />
  )
}

export default DotGridBackground
