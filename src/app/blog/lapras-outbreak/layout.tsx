import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import styles from './theme.module.css'
import { isVisible } from '../posts'

// This post's own look: white type on black, with monospace details, like a
// terminal
const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
})
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export default function LaprasOutbreakLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isVisible('lapras-outbreak')) notFound()

  return (
    <div className={`${styles.theme} ${sans.variable} ${mono.variable}`}>
      <Link href="/blog" className={styles.back}>
        ← blog
      </Link>
      <article className={styles.article}>{children}</article>
    </div>
  )
}
