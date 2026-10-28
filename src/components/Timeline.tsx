'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './timeline.module.css'
import {
  nextStop,
  stations,
  threads,
  type Station,
  type ThreadId,
} from './timelineData'

const NEXT_STOP_ID = 'next-stop'

const Bullet = ({ id }: { id: ThreadId }) => {
  const thread = threads[id]
  return (
    <span
      className={styles.bullet}
      style={{ background: thread.color, color: thread.text }}
      title={thread.name}
      aria-hidden="true"
    >
      {thread.letter}
    </span>
  )
}

// The line's own bullet is the site logo, like the A in a subway car
const LineBullet = () => (
  <span className={styles.lineBullet} aria-hidden="true">
    <svg viewBox="0 0 280.79 172.91">
      <path
        d="M86.76,3.39c-45.91,0-83.14,37.22-83.14,83.14s37.22,83.14,83.14,83.14h82.97L275.18,3.39H87.06l82.67,166.27"
        stroke="white"
        strokeWidth="14"
        strokeMiterlimit="10"
        fill="none"
      />
    </svg>
  </span>
)

const linkLabel = (href: string) => {
  if (href.startsWith('/projects/')) return 'Read about the project'
  if (href === '/projects') return 'See my projects'
  if (href === '/resume') return 'See my resume'
  return 'Go to the home page'
}

const Timeline = () => {
  const [selectedId, setSelectedId] = useState('now')
  const scrollerRef = useRef<HTMLDivElement>(null)

  const selected: Pick<Station, 'title' | 'when' | 'threads' | 'description' | 'href'> =
    selectedId === NEXT_STOP_ID
      ? { title: nextStop.label, when: 'Next', threads: [], ...nextStop }
      : stations.find((station) => station.id === selectedId)!

  // Open at the present end of the line, with Now in view (on a phone there's
  // only room for Now and the start of NEXT STOP), and let a mouse wheel
  // (which only scrolls up and down) ride the line sideways while there's
  // line left
  useEffect(() => {
    const scroller = scrollerRef.current
    const now = scroller?.querySelector<HTMLElement>('[data-station="now"]')
    if (!scroller || !now) return
    const nowX =
      now.getBoundingClientRect().left -
      scroller.getBoundingClientRect().left +
      scroller.scrollLeft
    const share = scroller.clientWidth < 600 ? 0.25 : 0.6
    scroller.scrollLeft = nowX - scroller.clientWidth * share

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      const max = scroller.scrollWidth - scroller.clientWidth
      const canScroll =
        (e.deltaY < 0 && scroller.scrollLeft > 0) ||
        (e.deltaY > 0 && scroller.scrollLeft < max)
      if (!canScroll) return
      e.preventDefault()
      scroller.scrollLeft += e.deltaY
    }
    scroller.addEventListener('wheel', onWheel, { passive: false })
    return () => scroller.removeEventListener('wheel', onWheel)
  }, [])

  const select = (id: string, button?: HTMLElement | null) => {
    setSelectedId(id)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    button?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  }

  // Left and right arrows move along the line
  const ids = [...stations.map((station) => station.id), NEXT_STOP_ID]
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const index = ids.indexOf(selectedId)
    const nextIndex = Math.min(
      ids.length - 1,
      Math.max(0, index + (e.key === 'ArrowRight' ? 1 : -1))
    )
    const button = scrollerRef.current?.querySelector<HTMLElement>(
      `[data-station="${ids[nextIndex]}"]`
    )
    button?.focus()
    select(ids[nextIndex], button)
  }

  return (
    <div className={styles.timeline}>
      <section className={styles.display} aria-label="Timeline, as a subway line">
        <div className={styles.sign}>
          <LineBullet />
          <p className={styles.lineName}>Voelk Av Express</p>
          <p className={styles.destinations}>
            Nathan Hale
            <br />
            University of Washington
            <br />
            Tesla
            <br />
            AWS
            <br />
            What&apos;s next
          </p>
        </div>

        <div className={styles.scroller} ref={scrollerRef}>
          <ol
            className={styles.strip}
            style={{ '--stations': stations.length } as React.CSSProperties}
            onKeyDown={onKeyDown}
          >
            {stations.map((station, i) => {
              const year = station.date.slice(0, 4)
              const newYear = i === 0 || stations[i - 1].date.slice(0, 4) !== year
              const isSelected = station.id === selectedId
              return (
                <li key={station.id} className={styles.station}>
                  <button
                    type="button"
                    data-station={station.id}
                    className={`${styles.stop} ${isSelected ? styles.selected : ''}`}
                    aria-pressed={isSelected}
                    onClick={(e) => select(station.id, e.currentTarget)}
                  >
                    <span className={styles.label}>{station.label}</span>
                    <span className={styles.dot} />
                    <span className={styles.srOnly}>, {station.when}</span>
                  </button>
                  <span className={styles.transfers}>
                    {station.threads.map((id) => (
                      <Bullet key={id} id={id} />
                    ))}
                  </span>
                  {newYear && <span className={styles.year}>{year}</span>}
                </li>
              )
            })}

            <li className={`${styles.station} ${styles.nextStop}`}>
              <button
                type="button"
                data-station={NEXT_STOP_ID}
                className={`${styles.stop} ${
                  selectedId === NEXT_STOP_ID ? styles.selected : ''
                }`}
                aria-pressed={selectedId === NEXT_STOP_ID}
                onClick={(e) => select(NEXT_STOP_ID, e.currentTarget)}
              >
                <span className={styles.label}>
                  <span className={styles.caption}>Next stop</span>
                  <span className={styles.pill}>{nextStop.label}</span>
                </span>
                <span className={styles.dot} />
              </button>
            </li>
          </ol>
        </div>
      </section>

      <section className={styles.detail} aria-live="polite">
        <div className={styles.detailHeader}>
          {selected.threads.length > 0 && (
            <span className={styles.transfers}>
              {selected.threads.map((id) => (
                <Bullet key={id} id={id} />
              ))}
            </span>
          )}
          <span className={styles.when}>{selected.when}</span>
        </div>
        <h2 className={styles.detailTitle}>{selected.title}</h2>
        <p className={styles.detailText}>{selected.description}</p>
        {selected.href && (
          <Link href={selected.href} className={styles.detailLink}>
            {linkLabel(selected.href)} <span aria-hidden="true">→</span>
          </Link>
        )}
      </section>

      <ul className={styles.legend} aria-label="Lines">
        {(Object.keys(threads) as ThreadId[]).map((id) => (
          <li key={id}>
            <Bullet id={id} />
            {threads[id].name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Timeline
