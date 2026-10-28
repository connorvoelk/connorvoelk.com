// src/app/timeline/page.tsx
import Timeline from '@/components/Timeline'
import styles from './page.module.css'

export default function TimelinePage() {
  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <canvas className={styles.backgroundCanvas} />
      </div>
      <main className={styles.main}>
        <div className={styles.content}>
          <Timeline />
        </div>
      </main>
    </div>
  )
}
