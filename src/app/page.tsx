'use client'
import { useEffect, useRef } from 'react'
import styles from './page.module.css'
import Navbar from '@/components/Navbar'

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

    const spacing = 40 // Space between dots
    const dotSize = 5 // Size of each dot
    const proximityRadius = 96 // ~1 inch at 96dpi

    // Function to create dots grid
    const createDots = (width: number, height: number): Dot[] => {
      const dots: Dot[] = []

      // Calculate number of dots that can fit in each dimension
      const numDotsX = Math.floor(width / spacing)
      const numDotsY = Math.floor(height / spacing)

      // Calculate padding to center the grid
      const paddingX = (width - (numDotsX - 1) * spacing) / 2
      const paddingY = (height - (numDotsY - 1) * spacing) / 2

      // Create dots grid
      for (let i = 0; i < numDotsX; i++) {
        for (let j = 0; j < numDotsY; j++) {
          dots.push({
            x: paddingX + i * spacing,
            y: paddingY + j * spacing,
            opacity: 0.3,
            speed: 0.001 + Math.random() * 0.002,
            offset: Math.random() * Math.PI * 2,
          })
        }
      }

      return dots
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
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

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
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.backgroundCanvas} />
      <main className={styles.main}>
        <Navbar />

      </main>
    </div>
  )
}
