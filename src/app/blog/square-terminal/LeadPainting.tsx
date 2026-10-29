import styles from './theme.module.css'

// The painting the essay opens with, in a gilt frame. It's a placeholder
// until the painting exists; swap the canvas's text for the image then.
const LeadPainting = () => (
  <figure className={styles.painting}>
    <div className={styles.canvas}>
      <p>
        A painting goes here: a Rococo dinner party, and a footman presenting
        the tip screen.
      </p>
    </div>
  </figure>
)

export default LeadPainting
