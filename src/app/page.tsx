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

    // Function to create dots grid (shared layout with the page transitions)
    const createDots = (width: number, height: number): Dot[] => {
      const ys = gridLines(height)
      return gridLines(width).flatMap((x) =>
        ys.map((y) => ({
          x,
          y,
          opacity: 0.3,
          speed: 0.001 + Math.random() * 0.002,
          offset: Math.random() * Math.PI * 2,
        }))
      )
    }

    // Set canvas size and create initial dots
    const resizeCanvas = () => {
      if (!canvas) return

      // Set canvas size to window size
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Recreate dots for new dimensions
      dotsRef.current = createDots(canvas.width, canvas.height)
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

    // Animation function
    const animate = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mouse = mouseRef.current

      dotsRef.current.forEach((dot) => {
        // Calculate opacity using sine wave
        dot.opacity =
          0.35 + Math.sin(performance.now() * dot.speed + dot.offset) * 0.15

        // Scale dot size based on proximity to cursor
        let size = dotSize
        if (mouse) {
          const dx = dot.x - mouse.x
          const dy = dot.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < proximityRadius) {
            const t = 1 - dist / proximityRadius
            size = dotSize * (1 + t) // grows up to 2x at center
          }
        }

        // Draw dot (round center, not offset, to prevent jitter as size changes)
        const cx = Math.round(dot.x)
        const cy = Math.round(dot.y)
        ctx.fillStyle = `rgba(217, 217, 217, ${dot.opacity})`
        ctx.fillRect(cx - size / 2, cy - size / 2, size, size)
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
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
