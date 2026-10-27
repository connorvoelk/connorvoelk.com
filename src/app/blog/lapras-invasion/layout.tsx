import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Nunito, Press_Start_2P } from 'next/font/google'
import styles from './theme.module.css'
import { isVisible } from '../posts'

// This post's own look: everything about it lives in this folder
const pixel = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pixel',
})
const body = Nunito({ subsets: ['latin'], variable: '--font-body' })

export default function LaprasInvasionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isVisible('lapras-invasion')) notFound()

  return (
    <div className={`${styles.theme} ${pixel.variable} ${body.variable}`}>
      <Link href="/blog" className={styles.back}>
        ← blog
      </Link>
      <article className={styles.article}>{children}</article>
    </div>
  )
}
