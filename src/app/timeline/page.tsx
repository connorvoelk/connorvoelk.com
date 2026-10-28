import type { Metadata } from 'next'
import Timeline from '@/components/Timeline'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Timeline – Connor Voelk',
  description:
    'Everything I have done and am doing, from Nathan Hale High School to AWS, drawn as a subway line.',
}

export default function TimelinePage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header>
          <h1 className={styles.title}>Timeline</h1>
          <p className={styles.intro}>
            School, work, teaching, and my own projects, all on one line. Scroll
            along it and pick a stop.
          </p>
        </header>
        <Timeline />
      </main>
    </div>
  )
}
