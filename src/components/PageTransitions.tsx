'use client'
import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { tileTransitionStyles } from './tileMask'

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

      // The tile animation is plain CSS added just for this transition (see
      // tileTransitionStyles for why it isn't driven from JavaScript)
      const style = document.createElement('style')
      style.textContent = tileTransitionStyles(
        window.innerWidth,
        window.innerHeight
      )
      document.head.append(style)

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            // A click during a running transition replaces it
            pageRendered.current?.()
            pageRendered.current = resolve
            router.push(url.pathname + url.search + url.hash)
          })
      )

      // A skipped transition (e.g. the tab is hidden) still navigates
      transition.ready.catch(() => {})
      transition.finished.finally(() => style.remove())
    }

    // Capture phase, so this runs before <Link>'s own click handler
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [router])

  return null
}

export default PageTransitions
