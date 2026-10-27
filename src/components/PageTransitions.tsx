'use client'
import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { buildTileMask, MASK_FRAMES, TRANSITION_MS } from './tileMask'

// Turns every link to another page on this site into a square-by-square
// transition: the browser snapshots the old page (View Transitions API), the
// new page renders underneath, and a random tile mask reveals it along the
// dot grid. Browsers without View Transitions, and people who prefer reduced
// motion, just navigate normally.
const PageTransitions = () => {
  const router = useRouter()
  const pathname = usePathname()
  // Resolves the in-flight transition once the new page has rendered
  const pageRendered = useRef<(() => void) | null>(null)

  useEffect(() => {
    pageRendered.current?.()
    pageRendered.current = null
  }, [pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Leave modified clicks (new tab, etc.) and already-handled clicks alone
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return
      }
      const link = (e.target as Element | null)?.closest('a')
      if (!link || link.target || link.hasAttribute('download')) return

      const url = new URL(link.href, window.location.href)
      const isOtherPage =
        url.origin === window.location.origin &&
        url.pathname !== window.location.pathname &&
        // Files like the resume PDF aren't pages
        !/\.[a-z0-9]+$/i.test(url.pathname)
      if (!isOtherPage) return

      if (
        !document.startViewTransition ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return
      }

      // Take over from <Link>, which skips navigating when the click is
      // already handled
      e.preventDefault()

      const root = document.documentElement
      root.style.setProperty(
        '--tile-mask',
        buildTileMask(window.innerWidth, window.innerHeight)
      )
      root.style.setProperty('--tile-frames', String(MASK_FRAMES))

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            // A click during a running transition replaces it
            pageRendered.current?.()
            pageRendered.current = resolve
            router.push(url.pathname + url.search + url.hash)
          })
      )

      transition.ready
        .then(() => {
          // Step through the mask's frames, one per step, over 0.7s
          root.animate(
            { maskPosition: ['0% 0%', '0% 100%'] },
            {
              duration: TRANSITION_MS,
              easing: `steps(${MASK_FRAMES}, jump-none)`,
              pseudoElement: '::view-transition-new(root)',
            }
          )
        })
        .catch(() => {
          // The transition was skipped; the navigation still happens
        })

      transition.finished.finally(() => {
        root.style.removeProperty('--tile-mask')
        root.style.removeProperty('--tile-frames')
      })
    }

    // Capture phase, so this runs before <Link>'s own click handler
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [router])

  return null
}

export default PageTransitions
