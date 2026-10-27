'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import Navbar from '@/components/Navbar'
import { gridLines } from '@/components/dotGrid'

interface Dot {
  x: number
  y: number
  opacity: number
  speed: number
  offset: number
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dotsRef = useRef<Dot[]>([])
  const mouseRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dotSize = 5 // Size of each dot
    const proximityRadius = 96 // ~1 inch at 96dpi
    const minPulseOpacity = 0.2 // Dimmest point of each dot's pulse (0.35 ± 0.15)
    const nearOpacity = 0.85 // Minimum opacity of a dot right under the cursor
    const gridLineOpacity = 0.15 // Lines between the dots, while hovering a link
    const gridFadeMs = 80 // How quickly the lines fade in and out (~0.25s to settle)

    // Grid line positions, the lines' current opacity, and whether the
    // pointer is over a link
    let xs: number[] = []
    let ys: number[] = []
    let gridOpacity = 0
    let overLink = false
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
      dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Recreate dots for new dimensions
      xs = gridLines(window.innerWidth)
      ys = gridLines(window.innerHeight)
      dotsRef.current = createDots()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const handleMouseLeave = () => {
      mouseRef.current = null
    }
    // Listen on the window, not the canvas: the intro text sits on top of the
    // canvas and would otherwise swallow the mouse events
    window.addEventListener('mousemove', handleMouseMove)
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)

    // The grid lines show while the pointer is over a link
    const handlePointerOver = (e: PointerEvent) => {
      overLink = !!(e.target as Element | null)?.closest?.('a')
    }
    const handlePointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) overLink = false // left the window
    }
    document.addEventListener('pointerover', handlePointerOver)
    document.addEventListener('pointerout', handlePointerOut)

    // Animation function
    let frame = 0
    let lastFrameTime = performance.now()
    const animate = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Ease the grid lines' opacity toward on or off
      const now = performance.now()
      const target = overLink ? gridLineOpacity : 0
      gridOpacity +=
        (target - gridOpacity) * (1 - Math.exp(-(now - lastFrameTime) / gridFadeMs))
      lastFrameTime = now

      // Lines connecting the dots, one device pixel wide and nudged half a
      // device pixel so they land on the pixel grid and stay crisp
      if (gridOpacity > 0.005 && xs.length && ys.length) {
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

      const mouse = mouseRef.current

      dotsRef.current.forEach((dot) => {
        // Calculate opacity using sine wave
        dot.opacity =
          0.35 + Math.sin(performance.now() * dot.speed + dot.offset) * 0.15

        // Brighten dots near the cursor
        let opacity = dot.opacity
        if (mouse) {
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
        const cx = Math.round(dot.x)
        const cy = Math.round(dot.y)
        ctx.fillStyle = `rgba(217, 217, 217, ${opacity})`
        ctx.fillRect(cx - dotSize / 2, cy - dotSize / 2, dotSize, dotSize)
      })

      frame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      // Stop the loop when leaving the page; otherwise every visit to the
      // home page would start another one that keeps running in the background
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('pointerout', handlePointerOut)
    }
  }, [])

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.backgroundCanvas} />
      <main className={styles.main}>
        <Navbar />
        <section className={styles.intro}>
          <h1 className={styles.name}>Connor Voelk</h1>
          <p className={styles.lead}>
            I build applications with GenAI and cloud products, working
            backwards from requirements.
          </p>
          <p className={styles.proof}>
            Software engineer in Seattle. Four years at AWS building for
            enterprise customers, and before that, Tesla and the University of
            Washington&apos;s Information School and Paul G. Allen School of
            Computer Science &amp; Engineering.
          </p>
          <p className={styles.now}>
            <strong>Currently</strong> building my own projects, and open to my
            next full-time role.
          </p>
          <div className={styles.links}>
            <Link href="/resume" className={styles.primaryLink}>
              Resume
            </Link>
            <a
              href="https://www.linkedin.com/in/connorvoelk"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/connorvoelk"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
