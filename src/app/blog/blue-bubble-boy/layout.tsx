import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from './theme.module.css'
import { isVisible } from '../posts'

// This post's own look: a clean product page, white and black, in the
// system's own font, with a frosted bar across the top
export default function BlueBubbleBoyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isVisible('blue-bubble-boy')) notFound()

  return (
    <div className={styles.theme}>
      <nav className={styles.bar} aria-label="Post">
        <span className={styles.barTitle}>Blue Bubble Boy</span>
        <Link href="/blog" className={styles.barButton}>
          All posts
        </Link>
      </nav>
      <article className={styles.article}>{children}</article>
    </div>
  )
}
