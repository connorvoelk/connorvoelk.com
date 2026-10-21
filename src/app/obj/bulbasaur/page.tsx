'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import { loadModelViewer } from '@/components/loadModelViewer'

// Screen-window geometry measured from gba-outline.png's transparent region,
// expressed as a percentage of the GBA image. Because the screen is a child of
// the frame, these lock the Pokémon scene inside the bezel at every screen size.
const SCREEN = { width: 49.896, height: 59.074 }
const FRAME_ASPECT = 1920 / 1080

export default function BulbasaurPage() {
  const frameRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)
  // Scale at which the screen window exactly covers the viewport (zoom endpoint).
  const scaleEndRef = useRef(1)
  // Once the zoom completes, the scene "releases" so the page scrolls normally.
  const [released, setReleased] = useState(false)

  useEffect(() => {
    loadModelViewer()
  }, [])

  useEffect(() => {
    const computeScaleEnd = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      // Frame is contained 16:9, so its base size is deterministic from the viewport.
      const frameW = Math.min(vw, vh * FRAME_ASPECT)
      const frameH = frameW / FRAME_ASPECT
      const screenW = frameW * (SCREEN.width / 100)
      const screenH = frameH * (SCREEN.height / 100)
      // Cover: whichever axis needs more scale to fill the viewport wins.
      scaleEndRef.current = Math.max(vw / screenW, vh / screenH)
    }

    let ticking = false
    const update = () => {
      ticking = false
      // Zoom progress is measured against the zoom section only. The scene is
      // sticky within it, so the zoom completes exactly as the section releases;
      // scrolling past that point scrolls the page normally.
      const distance = zoomRef.current
        ? zoomRef.current.offsetHeight - window.innerHeight
        : 0
      const t = distance > 0 ? Math.min(window.scrollY / distance, 1) : 0
      // Smoothstep for a gentler start/finish.
      const eased = t * t * (3 - 2 * t)
      const scale = 1 + (scaleEndRef.current - 1) * eased
      frameRef.current?.style.setProperty('--scale', String(scale))
      // Pin (fixed) while zooming; release (absolute) once the zoom is done so
      // further scrolling moves the page into the content below.
      const shouldRelease = t >= 1
      setReleased((prev) => (prev === shouldRelease ? prev : shouldRelease))
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    const onResize = () => {
      computeScaleEnd()
      update()
    }

    computeScaleEnd()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <Link href="/obj" className={styles.backLink}>
        ← [obj]
      </Link>

      <div ref={zoomRef} className={styles.zoomSection}>
        <div
          className={`${styles.scene} ${released ? styles.sceneReleased : ''}`}
        >
          <div ref={frameRef} className={styles.gbaFrame}>
            <div className={styles.screen}>
              <img
                className={styles.stage}
                src="/pokemon-stage.png"
                alt="Pokémon battle scene"
              />
              <model-viewer
                className={styles.model}
                src="/bulbasaur.glb"
                camera-controls
                disable-zoom
                interaction-prompt="none"
                camera-orbit="0deg 80deg 105%"
                field-of-view="30deg"
                shadow-intensity="0"
                alt="Bulbasaur 3D model"
              />
            </div>
            <img
              className={styles.outline}
              src="/gba-outline.png"
              alt="Game Boy Advance"
            />
          </div>
        </div>
      </div>

      {/* Placeholder content to test the scroll handoff after the zoom. */}
      <section className={styles.content}>
        <h1>Bulbasaur</h1>
        <p>
          Placeholder content. Once the Pokémon screen fills the viewport, the
          zoom stops and the page scrolls normally into this section.
        </p>
        <p>
          Description, process notes, and photos of the piece will live here.
        </p>
        <div className={styles.spacer}>Keep scrolling…</div>
        <div className={styles.spacer}>More content below.</div>
      </section>
    </>
  )
}
