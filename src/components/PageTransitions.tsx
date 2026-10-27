'use client'
import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { tileTransitionStyles } from './tileMask'

// TEMPORARY debugging aid: an on-screen log of each transition step, turned
// on per browser tab by visiting any page with ?debug-transitions. Off for
// everyone else. Delete before merging page-transitions.
function debug(line: string) {
  try {
    if (new URLSearchParams(window.location.search).has('debug-transitions')) {
      sessionStorage.setItem('debug-transitions', '1')
    }
    if (sessionStorage.getItem('debug-transitions') !== '1') return
  } catch {
    return
  }
  let panel = document.getElementById('transition-debug')
  if (!panel) {
    panel = document.createElement('pre')
    panel.id = 'transition-debug'
    panel.style.cssText =
      'position:fixed;left:8px;bottom:8px;z-index:9999;max-width:calc(100vw - 16px);margin:0;padding:8px 10px;border-radius:8px;background:rgba(0,0,0,.85);color:#7dd3fc;font:12px/1.45 monospace;white-space:pre-wrap;pointer-events:none'
    document.body.append(panel)
  }
  const time = new Date().toLocaleTimeString([], { hour12: false })
  panel.textContent = [`${time}  ${line}`, ...(panel.textContent ?? '').split('\n')]
    .slice(0, 10)
    .join('\n')
}

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
    debug(`page shown: ${pathname}`)
    pageRendered.current?.()
    pageRendered.current = null
  }, [pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      try {
        // Leave modified clicks (new tab, etc.) and already-handled clicks alone
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        ) {
          debug('ignored: modified or already-handled click')
          return
        }
        const target = e.target as Node | null
        const link = (target instanceof Element ? target : target?.parentElement)?.closest('a')
        if (!link || link.target || link.hasAttribute('download')) {
          debug(`ignored: not a same-tab link (clicked ${target?.nodeName})`)
          return
        }

        const url = new URL(link.href, window.location.href)
        const isOtherPage =
          url.origin === window.location.origin &&
          url.pathname !== window.location.pathname &&
          // Files like the resume PDF aren't pages
          !/\.[a-z0-9]+$/i.test(url.pathname)
        if (!isOtherPage) {
          debug(`ignored: ${url.pathname} isn't another page on this site`)
          return
        }

        if (!document.startViewTransition) {
          debug('ignored: no View Transitions in this browser')
          return
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          debug('ignored: reduce motion is on')
          return
        }

        // Take over from <Link>, which skips navigating when the click is
        // already handled
        e.preventDefault()
        debug(`transition → ${url.pathname}`)

        // The tile animation is plain CSS added just for this transition (see
        // tileTransitionStyles for why it isn't driven from JavaScript)
        const style = document.createElement('style')
        style.textContent = tileTransitionStyles(
          window.innerWidth,
          window.innerHeight
        )
        document.head.append(style)

        const start = performance.now()
        const transition = document.startViewTransition(
          () =>
            new Promise<void>((resolve) => {
              // A click during a running transition replaces it
              pageRendered.current?.()
              pageRendered.current = resolve
              router.push(url.pathname + url.search + url.hash)
            })
        )

        transition.updateCallbackDone.then(
          () => debug(`new page ready after ${Math.round(performance.now() - start)}ms`),
          (err: Error) => debug(`page update failed: ${err.message}`)
        )
        // A skipped transition (e.g. the tab is hidden) still navigates
        transition.ready.then(
          () => debug('animating squares'),
          (err: Error) => debug(`skipped: ${err.message}`)
        )
        transition.finished.finally(() => {
          style.remove()
          debug(`done after ${Math.round(performance.now() - start)}ms`)
        })
      } catch (err) {
        debug(`error: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    // Capture phase, so this runs before <Link>'s own click handler
    document.addEventListener('click', onClick, true)
    debug('transitions active')
    return () => document.removeEventListener('click', onClick, true)
  }, [router])

  return null
}

export default PageTransitions
