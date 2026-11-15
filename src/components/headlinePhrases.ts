// The words the home page headline rotates through, "I <verb> <thing>,
// <ending>", and the rules for which of them make sense together.
//
// Every thing has a kind. Each verb and each ending lists the kinds it reads
// well with, and a few verb + ending pairs are ruled out by name. The headline
// only ever types a word that fits the other two parts on screen, so a
// sentence like "I code cloud infrastructure, from Figma to production."
// can't come up.
//
// To add a phrase: put it in its list with the kinds it fits. Leave a kind
// out whenever the sentence would sound off.

// app: software with an interface people use
// experience: the interface and interaction design itself
// platform: something other engineers build on
// system: infrastructure and back-end systems, with no interface of their own
type Kind = 'app' | 'experience' | 'platform' | 'system'

const ALL: Kind[] = ['app', 'experience', 'platform', 'system']

interface Thing {
  text: string
  kind: Kind
}
interface Fitted {
  text: string
  fits: Kind[]
}

export const VERBS: Fitted[] = [
  { text: 'build', fits: ALL },
  { text: 'design', fits: ALL },
  { text: 'architect', fits: ['app', 'platform', 'system'] },
  { text: 'ship', fits: ['app', 'experience', 'platform'] },
  { text: 'code', fits: ['app', 'experience', 'platform'] },
]

export const THINGS: Thing[] = [
  { text: 'GenAI applications', kind: 'app' },
  { text: 'agentic AI platforms', kind: 'platform' },
  { text: 'data-intensive applications', kind: 'app' },
  { text: 'engaging user experiences', kind: 'experience' },
  { text: 'cloud infrastructure', kind: 'system' },
  { text: 'mobile SDKs', kind: 'platform' },
  { text: 'real-time IoT systems', kind: 'system' },
  { text: 'ML-powered tools', kind: 'app' },
  { text: 'live-streaming tools', kind: 'app' },
  { text: 'full-stack web apps', kind: 'app' },
]

export const ENDINGS: Fitted[] = [
  { text: 'working backwards from requirements.', fits: ALL },
  { text: 'from architecture to launch.', fits: ['app', 'platform', 'system'] },
  { text: 'for enterprise customers.', fits: ALL },
  // Figma is for interfaces, so only things that have one
  { text: 'from Figma to production.', fits: ['app', 'experience'] },
  { text: 'shaped directly by customer feedback.', fits: ['app', 'experience', 'platform'] },
  { text: 'end to end.', fits: ALL },
]

// Verb + ending pairs that clash whatever the thing is
const CLASHES: [verb: string, ending: string][] = [
  ['architect', 'from architecture to launch.'], // says "architect" twice
  ['architect', 'from Figma to production.'], // architecture isn't done in Figma
]

// The sentence as positions in the three lists: [verb, thing, ending]
export type Sentence = [number, number, number]

export const FIRST_SENTENCE: Sentence = [0, 0, 0]

export function reads([v, t, e]: Sentence): boolean {
  const verb = VERBS[v]
  const kind = THINGS[t].kind
  const ending = ENDINGS[e]
  return (
    verb.fits.includes(kind) &&
    ending.fits.includes(kind) &&
    !CLASHES.some(([cv, ce]) => cv === verb.text && ce === ending.text)
  )
}

const LISTS = [VERBS, THINGS, ENDINGS]

export const wordAt = (slot: number, index: number) => LISTS[slot][index].text

// The next word for one part (0 verb, 1 thing, 2 ending) that still reads
// well with the other two as they stand: the first fitting one after the
// current word in its list. Null if nothing else fits right now.
export function nextFitting(sentence: Sentence, slot: number): number | null {
  const length = LISTS[slot].length
  for (let step = 1; step < length; step++) {
    const candidate: Sentence = [...sentence]
    candidate[slot] = (sentence[slot] + step) % length
    if (reads(candidate)) return candidate[slot]
  }
  return null
}
