import styles from './theme.module.css'

// The post's lead image: the whole event as a one-line change to a spawn
// table, and what came out the other end. Drawn in code, with figures from
// the post itself.
const SpawnTable = () => (
  <figure
    className={styles.terminal}
    aria-label="A spawn table for the Tohoku coast, edited so Lapras goes from rare to common, and the result: about 100,000 visitors to Ishinomaki in 11 days, spending an estimated 2 billion yen."
  >
    <div className={styles.titleBar} aria-hidden="true">
      <span className={styles.light} />
      <span className={styles.light} />
      <span className={styles.light} />
      <span className={styles.fileName}>spawn_table.yaml</span>
    </div>
    <div className={styles.code} aria-hidden="true">
      <span className={styles.line}>
        <span className={styles.comment}># Pokémon GO · Nov 11–23, 2016</span>
      </span>
      <span className={styles.line}>
        <span className={styles.key}>region</span>: tohoku_coast
      </span>
      <span className={styles.line}>
        <span className={styles.key}>spawns</span>:
      </span>
      <span className={`${styles.line} ${styles.removed}`}>- lapras: rare</span>
      <span className={`${styles.line} ${styles.added}`}>+ lapras: common</span>
    </div>
    <div className={styles.output} aria-hidden="true">
      <p>
        <span className={styles.prompt}>ishinomaki ▸</span>
        <span>~100,000 visitors in 11 days</span>
      </p>
      <p>
        <span className={styles.prompt}>ishinomaki ▸</span>
        <span>
          est. ¥2,000,000,000 spent
          <span className={styles.cursor} />
        </span>
      </p>
    </div>
  </figure>
)

export default SpawnTable
