import type { CSSProperties } from 'react'
import styles from './topBlur.module.css'

// Progressive blur along the top of the window, behind the navbar: content
// scrolled up past the nav's bottom edge gets blurrier the closer it gets to
// the top. One element's backdrop-filter can't vary across it, so this is a
// stack of strips, each blurring twice as hard as the one below and masked to
// its own band, with neighboring bands overlapping so there are no seams.
const BLURS_PX = [0.25, 0.5, 1, 2, 4, 8]

const BAND = 100 / BLURS_PX.length

const layerStyle = (blurPx: number, i: number): CSSProperties => {
  // Measured from the bottom of the strip: fade in over one band, hold for
  // one, fade out over one. The top layers' bands run past 100%, so they stay
  // solid all the way to the top edge.
  const mask = `linear-gradient(to top, transparent ${i * BAND}%, black ${
    (i + 1) * BAND
  }%, black ${(i + 2) * BAND}%, transparent ${(i + 3) * BAND}%)`
  return {
    backdropFilter: `blur(${blurPx}px)`,
    WebkitBackdropFilter: `blur(${blurPx}px)`,
    maskImage: mask,
    WebkitMaskImage: mask,
  }
}

const TopBlur = () => (
  <div className={styles.topBlur} aria-hidden="true">
    {BLURS_PX.map((blurPx, i) => (
      <div key={blurPx} className={styles.layer} style={layerStyle(blurPx, i)} />
    ))}
  </div>
)

export default TopBlur
