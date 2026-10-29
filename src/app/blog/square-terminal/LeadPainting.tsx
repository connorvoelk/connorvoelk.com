import Image from 'next/image'
import styles from './theme.module.css'
import painting from './lead-painting.webp'

// The painting the essay opens with, in a gilt frame
const LeadPainting = () => (
  <figure className={styles.painting}>
    <Image
      src={painting}
      alt="A Rococo-style painting of an aristocratic dinner party in a gilded salon. A footman in a blue coat holds an iPad showing a tip screen out to the nobleman at the head of the table, wincing and turning his face away, while the guests look on."
      priority
      unoptimized
      className={styles.canvas}
    />
  </figure>
)

export default LeadPainting
