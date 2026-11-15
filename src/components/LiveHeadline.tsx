'use client'
import { useEffect, useState } from 'react'
import styles from './liveHeadline.module.css'
import {
  FIRST_SENTENCE,
  nextFitting,
  wordAt,
  type Sentence,
} from './headlinePhrases'

// The home page headline: "I <verb> <thing>, <ending>" with a text caret
// after each of the three parts. Every few seconds one caret deletes its part
// and types another from its list, like someone editing the sentence live.
// headlinePhrases.ts holds the lists and the rules that keep every sentence
// sensible.

// Which part changes next: the thing, then the ending, then the verb
const TURNS = [1, 2, 0]

// Only one part changes at a time, and after each change the sentence is
// left alone this long so it can be read
const READ_MS = 5000

interface Props {
  // Stays on the first sentence, with no carets, until this turns true
  active: boolean
}

const LiveHeadline = ({ active }: Props) => {
  const [texts, setTexts] = useState(() =>
    FIRST_SENTENCE.map((index, slot) => wordAt(slot, index))
  )
  // The part being retyped right now, if any
  const [typingSlot, setTypingSlot] = useState<number | null>(null)
  const [caretsOn, setCaretsOn] = useState(false)

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
    const setSlot = (slot: number, text: string) =>
      setTexts((current) => current.map((t, i) => (i === slot ? text : t)))

    const run = async () => {
      setCaretsOn(true)
      const sentence: Sentence = [...FIRST_SENTENCE]
      for (let turn = 0; !cancelled; ) {
        await sleep(READ_MS)
        if (cancelled) return
        // Whose turn it is, passing over any part that has no other word
        // fitting the rest of the sentence right now
        let slot = -1
        let nextIndex: number | null = null
        for (let tries = 0; tries < TURNS.length && nextIndex === null; tries++) {
          slot = TURNS[turn++ % TURNS.length]
          nextIndex = nextFitting(sentence, slot)
        }
        if (nextIndex === null) continue
        const current = wordAt(slot, sentence[slot])
        const next = wordAt(slot, nextIndex)
        sentence[slot] = nextIndex

        setTypingSlot(slot)
        for (let n = current.length - 1; n >= 0 && !cancelled; n--) {
          setSlot(slot, current.slice(0, n))
          await sleep(22)
        }
        await sleep(220)
        for (let n = 1; n <= next.length && !cancelled; n++) {
          setSlot(slot, next.slice(0, n))
          await sleep(38 + Math.random() * 40) // slightly uneven, like typing
        }
        setTypingSlot(null)
      }
    }
    run()

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [active])

  const caret = (slot: number) => (
    <span
      className={`${styles.caret} ${caretsOn ? styles.on : ''} ${
        typingSlot === slot ? styles.typing : ''
      }`}
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
