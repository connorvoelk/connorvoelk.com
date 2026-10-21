// src/app/timeline/page.tsx
import Navbar from '@/components/Navbar'
import Timeline from '@/components/Timeline'
import styles from './page.module.css'

export default function TimelinePage() {
  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <canvas className={styles.backgroundCanvas} />
      </div>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.content}>
          <Timeline />
        </div>
      </main>
    </div>
  )
}
