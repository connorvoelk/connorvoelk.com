'use client'
import { useEffect, useRef } from 'react'
import { loadModelViewer } from '@/components/loadModelViewer'
import styles from './projects.module.css'

// A slowly turning [obj] model for the projects index. It's display only (no
// camera controls), so clicks fall through to the card's link.
const ObjModel = ({ src, alt }: { src: string; alt: string }) => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    loadModelViewer()
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ref.current?.setAttribute('auto-rotate', '')
    }
  }, [])

  return (
    <model-viewer
      ref={ref}
      src={src}
      alt={alt}
      className={styles.model}
      auto-rotate-delay="0"
      rotation-per-second="18deg"
      interaction-prompt="none"
      camera-orbit="0deg 75deg 105%"
      field-of-view="30deg"
      shadow-intensity="1"
    />
  )
}

export default ObjModel
