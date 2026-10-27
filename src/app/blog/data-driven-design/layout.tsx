import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IBM_Plex_Sans } from 'next/font/google'
import styles from './theme.module.css'
import { isVisible } from '../posts'

// This post's own look: everything about it lives in this folder
const plex = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '600'] })

export default function DataDrivenDesignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isVisible('data-driven-design')) notFound()

  return (
    <div className={`${styles.theme} ${plex.className}`}>
      <Link href="/blog" className={styles.back}>
        ← blog
      </Link>
      <article className={styles.article}>{children}</article>
    </div>
  )
}
