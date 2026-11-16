'use client'
import { useEffect, useState } from 'react'
import styles from './liveHeadline.module.css'
import {
  FIRST_SENTENCE,
  nextFitting,
  wordAt,
  type Sentence,
} from './headlinePhrases'

// The home page headline: "I <verb> <thing>, <ending>" with one text caret.
// The caret sits after one of the three parts, waits, deletes that part and
// types another from its list, then moves on to the next part and waits
// again, like someone editing the sentence live.
// headlinePhrases.ts holds the lists and the rules that keep every sentence
// sensible.

// Which part changes next: the thing, then the ending, then the verb
const TURNS = [1, 2, 0]

// After each change the sentence is left alone this long so it can be read
const READ_MS = 5000
// How long the caret rests where it just typed before moving to the next part
const LINGER_MS = 700

interface Props {
  // Stays on the first sentence, with no carets, until this turns true
  active: boolean
}

const LiveHeadline = ({ active }: Props) => {
  const [texts, setTexts] = useState(() =>
    FIRST_SENTENCE.map((index, slot) => wordAt(slot, index))
  )
  // The part the caret sits after, once there is a caret
  const [caretSlot, setCaretSlot] = useState<number | null>(null)
  // Solid while it's deleting or typing, blinking while it waits
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (!active) return
    // With reduced motion it simply stays on the first sentence
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms)
      })
    let onVisible: (() => void) | null = null
    const visible = () =>
      new Promise<void>((resolve) => {
        onVisible = () => {
          if (document.hidden) return
          document.removeEventListener('visibilitychange', onVisible!)
          onVisible = null
          resolve()
        }
        document.addEventListener('visibilitychange', onVisible)
      })
    const setSlot = (slot: number, text: string) =>
      setTexts((current) => current.map((t, i) => (i === slot ? text : t)))

    const run = async () => {
      const sentence: Sentence = [...FIRST_SENTENCE]
      let turn = 0
      // Whose turn is next and the word it will get, passing over any part
      // that has no other word fitting the rest of the sentence right now
      const pickNext = () => {
        for (let tries = 0; tries < TURNS.length; tries++) {
          const slot = TURNS[turn++ % TURNS.length]
          const index = nextFitting(sentence, slot)
          if (index !== null) return { slot, index }
        }
        return null
      }

      let next = pickNext()
      while (!cancelled && next) {
        // The caret waits at the part it's about to change
        setCaretSlot(next.slot)
        await sleep(READ_MS - LINGER_MS)
        // Nothing changes while the tab is in the background
        if (document.hidden) await visible()
        if (cancelled) return
        const { slot, index } = next
        const from = wordAt(slot, sentence[slot])
        const to = wordAt(slot, index)
        sentence[slot] = index

        setTyping(true)
        for (let n = from.length - 1; n >= 0 && !cancelled; n--) {
          setSlot(slot, from.slice(0, n))
          await sleep(22)
        }
        await sleep(220)
        for (let n = 1; n <= to.length && !cancelled; n++) {
          setSlot(slot, to.slice(0, n))
          await sleep(38 + Math.random() * 40) // slightly uneven, like typing
        }
        setTyping(false)
        await sleep(LINGER_MS)
        next = pickNext()
      }
    }
    run()

    return () => {
      cancelled = true
      clearTimeout(timer)
      if (onVisible) document.removeEventListener('visibilitychange', onVisible)
    }
  }, [active])

  // Only ever one caret. It takes no room in the line, so the text doesn't
  // shift when it moves from one part to another.
  const caret = (slot: number) =>
    caretSlot === slot && (
      <span
        className={`${styles.caret} ${styles.on} ${typing ? styles.typing : ''}`}
      />
    )

  return (
    <>
      I {texts[0]}
      {caret(0)} {texts[1]}
      {caret(1)}, {texts[2]}
      {caret(2)}
    </>
  )
}

export default LiveHeadline
