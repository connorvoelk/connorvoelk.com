import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from './theme.module.css'
import { isVisible } from '../posts'

// This post's own look: everything about it lives in this folder. It uses
// the browser's own default fonts on purpose, like the early web.
export default function DeadInternetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isVisible('dead-internet')) notFound()

  return (
    <div className={styles.theme}>
      <Link href="/blog" className={styles.back}>
        ← blog
      </Link>
      <article className={styles.article}>{children}</article>
    </div>
  )
}
