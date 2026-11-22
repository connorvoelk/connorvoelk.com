'use client'
import { useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import DotGridBackground from '@/components/DotGridBackground'
import { runCursorBuild } from '@/components/cursorBuild'
import LiveHeadline from '@/components/LiveHeadline'

// The intro's cursor build-in plays once per page load, not again each time
// you come back to the home page from elsewhere on the site
let introBuilt = false

export default function Home() {
  const introRef = useRef<HTMLElement | null>(null)
  // The headline starts retyping itself once the cursors have built the page
  const [built, setBuilt] = useState(introBuilt)

  // Before the first paint, so there's no flash of the finished intro
  useLayoutEffect(() => {
    const intro = introRef.current
    if (!intro) return
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (introBuilt || reducedMotion) {
      intro.dataset.build = 'done'
      return
    }
    return runCursorBuild(intro, () => {
      introBuilt = true
      setBuilt(true)
    })
  }, [])

  return (
    <div className={styles.container}>
      <DotGridBackground />
      <main className={styles.main}>
        <section ref={introRef} className={styles.intro} data-build="pending">
          <h1 className={styles.name} data-b="name">Connor Voelk</h1>
          <div className={`${styles.card} ${styles.leadCard}`} data-b="leadCard">
            {/* The moving version is for the eyes only; screen readers get
                one steady sentence instead */}
            <p className={styles.lead} data-b="lead" aria-hidden="true">
              <LiveHeadline active={built} />
            </p>
            <p className={styles.srOnly}>
              I design, build and ship GenAI and agentic AI applications,
              cloud infrastructure, mobile SDKs and user experiences, working
              backwards from requirements.
            </p>
          </div>
          <div className={styles.card} data-b="bioCard">
            <p className={styles.proof} data-b="proof">
              Software engineer in Seattle. Four years at AWS building for
              enterprise customers. Previously at Tesla and the University of
              Washington&apos;s iSchool &amp; Allen School of Computer Science.
            </p>
            <p className={styles.now} data-b="now">
              <strong>Currently</strong> building my own projects, and open to
              my next full-time role.
            </p>
            <div className={styles.links} data-b="links">
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
          </div>
        </section>
      </main>
    </div>
  )
}
