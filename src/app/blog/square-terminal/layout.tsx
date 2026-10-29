import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EB_Garamond } from 'next/font/google'
import styles from './theme.module.css'
import { isVisible } from '../posts'

// This post's own look: a traditional printed essay, black serif on white
const serif = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

export default function SquareTerminalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isVisible('square-terminal')) notFound()

  return (
    <div className={`${styles.theme} ${serif.variable}`}>
      <Link href="/blog" className={styles.back}>
        ← Blog
      </Link>
      <article className={styles.article}>{children}</article>
    </div>
  )
}
