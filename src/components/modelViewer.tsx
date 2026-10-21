'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './model-viewer.module.css'
import { loadModelViewer } from './loadModelViewer'

interface ModelViewerProps {
  glbSrc: string
  fallbackImage?: string
  alt: string
  title: string
  // Only objects with their own page get a link
  href?: string
}

const ModelViewer = ({
  glbSrc,
  fallbackImage,
  alt,
  title,
  href,
}: ModelViewerProps) => {
  const modelViewerRef = useRef<HTMLElement & { cameraOrbit: string }>(null)

  useEffect(() => {
    loadModelViewer()
    modelViewerRef.current?.addEventListener('error', (error) => {
      console.error('Error loading model:', error)
    })
  }, [])

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (modelViewerRef.current) {
      const rect = modelViewerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2

      // Simple left/right rotation
      const isLeftSide = e.clientX < centerX
      const rotationAngle = isLeftSide ? -30 : 30

      // Apply smooth rotation
      modelViewerRef.current.setAttribute('interpolation-decay', '300')
      modelViewerRef.current.cameraOrbit = `${rotationAngle}deg 75deg 105%`
    }
  }

  const handleMouseLeave = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.cameraOrbit = `0deg 75deg 105%`
    }
  }

  return (
    <div
      className={styles.modelContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <model-viewer
        ref={modelViewerRef}
        src={glbSrc}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        poster={fallbackImage}
        shadow-intensity="1"
        interaction-prompt="none"
        animation-duration="0"
        camera-orbit="0deg 75deg 105%"
        min-camera-orbit="auto auto 50%"
        max-camera-orbit="auto auto 150%"
        field-of-view="30deg"
        alt={alt}
        className={styles.model}
      >
        {/* AR button for supported devices */}
        <button slot="ar-button" className={styles.arButton}>
          View in AR
        </button>

        {/* Loading UI */}
        <div className={styles.loadingContainer} slot="poster">
          {fallbackImage && <img src={fallbackImage} alt={`Loading ${alt}`} />}
          <div className={styles.spinner}></div>
        </div>
      </model-viewer>
      <div className={styles.modelInfo}>
        {href ? (
          <Link href={href}>
            <h3 className={styles.modelTitle}>{title}</h3>
          </Link>
        ) : (
          <h3 className={styles.modelTitle}>{title}</h3>
        )}
      </div>
    </div>
  )
}

export default ModelViewer
