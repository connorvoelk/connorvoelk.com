// The home page's intro "builds itself" on load: a handful of grey cursors
// drag out the cards and type the text, then leave. The idea comes from Joel
// Califa's Swarm (califa.github.io/swarm-site); this is a small independent
// take on it, with none of that project's code.
//
// The real content is already in the page (hidden while this runs), so the
// animation only ever reveals it, with clip-paths, and never rewrites it.
// Anything going wrong, or the visitor clicking, scrolling or typing, just
// shows the finished page.

// Quiet, see-through grey, like the dots behind them
const CURSOR_COUNT = 5
const CURSOR_COLOR = 'rgba(217, 217, 217, 0.55)'
// Every duration below is multiplied by this; smaller is faster
const SPEED = 0.7

const HIDDEN_CLIP = 'inset(0 100% 100% 0)'
const EASE = 'cubic-bezier(0.5, 0, 0.2, 1)'
const STOPPED = new Error('cursor build stopped')

interface Cursor {
  el: HTMLElement
  caret: HTMLElement
  color: string
  x: number
  y: number
}

// Where the "typing" has got to after each character: the character's right
// edge, and which line it's on (all relative to the text's own box)
interface TypeStep {
  x: number
  line: number
}
interface TypeLine {
  top: number
  bottom: number
  // Where to cut between this line and its neighbors
  clipTop: number
  clipBottom: number
}

function measureText(el: HTMLElement) {
  const box = el.getBoundingClientRect()
  const steps: TypeStep[] = []
  const lines: TypeLine[] = []
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const length = node.textContent?.length ?? 0
    for (let i = 0; i < length; i++) {
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      const rect = range.getClientRects()[0]
      if (!rect || rect.width === 0) continue // a space swallowed by a line wrap
      const top = rect.top - box.top
      const bottom = rect.bottom - box.top
      const last = lines[lines.length - 1]
      // A new line starts when a character sits below the middle of the last
      if (!last || top > (last.top + last.bottom) / 2) {
        lines.push({ top, bottom, clipTop: 0, clipBottom: 0 })
      } else {
        last.top = Math.min(last.top, top)
        last.bottom = Math.max(last.bottom, bottom)
      }
      steps.push({ x: rect.right - box.left, line: lines.length - 1 })
    }
  }
  const pad = 16 // room for descenders and the name's dark halo
  lines.forEach((line, i) => {
    const prev = lines[i - 1]
    const next = lines[i + 1]
    line.clipTop = prev ? (prev.bottom + line.top) / 2 : -pad
    line.clipBottom = next ? (line.bottom + next.top) / 2 : box.height + pad
  })
  return { box, steps, lines, pad }
}

export function runCursorBuild(intro: HTMLElement, onDone: () => void) {
  let stopped = false
  const animations: Animation[] = []
  const timers: ReturnType<typeof setTimeout>[] = []
  const touched: HTMLElement[] = []
  let frame = 0

  const overlay = document.createElement('div')
  overlay.setAttribute('aria-hidden', 'true')
  overlay.style.cssText =
    'position:fixed;inset:0;z-index:40;pointer-events:none;overflow:hidden'

  const part = (name: string) =>
    intro.querySelector<HTMLElement>(`[data-b="${name}"]`)

  const cleanup = () => {
    if (stopped) return
    stopped = true
    cancelAnimationFrame(frame)
    timers.forEach(clearTimeout)
    animations.forEach((animation) => animation.cancel())
    touched.forEach((el) => {
      el.style.clipPath = ''
      el.style.opacity = ''
    })
    overlay.remove()
    skipEvents.forEach((type) => window.removeEventListener(type, finish))
    intro.dataset.build = 'done'
  }
  // Finished, or skipped by the visitor: either way it's been seen
  const finish = () => {
    if (stopped) return
    cleanup()
    onDone()
  }
  const skipEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll', 'resize']

  const hide = (el: HTMLElement, how: 'clip' | 'fade') => {
    if (how === 'clip') el.style.clipPath = HIDDEN_CLIP
    else el.style.opacity = '0'
    touched.push(el)
  }

  const wait = (ms: number) =>
    new Promise<void>((resolve, reject) => {
      timers.push(
        setTimeout(() => (stopped ? reject(STOPPED) : resolve()), ms * SPEED)
      )
    })

  const play = async (
    el: HTMLElement,
    keyframes: Keyframe[],
    duration: number,
    easing = EASE
  ) => {
    if (stopped) throw STOPPED
    const animation = el.animate(keyframes, {
      duration: duration * SPEED,
      easing,
      fill: 'forwards',
    })
    animations.push(animation)
    await animation.finished
    return animation
  }

  const at = (x: number, y: number) => `translate(${x}px, ${y}px)`

  const makeCursor = (x: number, y: number): Cursor => {
    const color = CURSOR_COLOR
    const el = document.createElement('div')
    el.style.cssText = `position:absolute;left:0;top:0;opacity:0;transform:${at(x, y)};will-change:transform`
    el.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" style="display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))"><path d="M2 1.5l4.2 13.2 2.3-5.2 5.4-2z" fill="${color}" stroke="rgba(255,255,255,.45)" stroke-width="1" stroke-linejoin="round"/></svg>`
    const caret = document.createElement('div')
    caret.style.cssText = `position:absolute;left:0;top:0;width:2px;border-radius:1px;background:${color};opacity:0`
    overlay.append(caret, el)
    return { el, caret, color, x, y }
  }

  const moveTo = async (cursor: Cursor, x: number, y: number, ms?: number) => {
    const distance = Math.hypot(x - cursor.x, y - cursor.y)
    const duration = ms ?? Math.min(600, Math.max(260, distance * 0.9))
    const animation = await play(
      cursor.el,
      [{ transform: at(cursor.x, cursor.y) }, { transform: at(x, y) }],
      duration
    )
    cursor.x = x
    cursor.y = y
    cursor.el.style.transform = at(x, y)
    animation.cancel()
  }

  // Drag a box out from its top-left corner, revealing the card as it grows
  const drawBox = async (cursor: Cursor, card: HTMLElement) => {
    const rect = card.getBoundingClientRect()
    const radius = getComputedStyle(card).borderRadius
    await moveTo(cursor, rect.left, rect.top)
    const outline = document.createElement('div')
    outline.style.cssText = `position:absolute;left:${rect.left}px;top:${rect.top}px;width:0;height:0;border:1px solid ${cursor.color};border-radius:${radius};box-sizing:border-box`
    overlay.append(outline)
    const duration = 460
    const [reveal] = await Promise.all([
      play(
        card,
        [
          { clipPath: `inset(0 100% 100% 0 round ${radius})` },
          { clipPath: `inset(0 0 0 0 round ${radius})` },
        ],
        duration
      ),
      play(
        outline,
        [
          { width: '0px', height: '0px' },
          { width: `${rect.width}px`, height: `${rect.height}px` },
        ],
        duration
      ),
      moveTo(cursor, rect.right, rect.bottom, duration),
    ])
    card.style.clipPath = ''
    reveal.cancel()
    play(outline, [{ opacity: 1 }, { opacity: 0 }], 350).catch(() => {})
  }

  // Reveal text one character at a time, with a caret and the cursor riding
  // along. The text itself never changes; a clip-path uncovers it.
  const type = (cursor: Cursor, el: HTMLElement, duration: number) =>
    new Promise<void>((resolve, reject) => {
      const { box, steps, lines, pad } = measureText(el)
      if (!steps.length) {
        el.style.clipPath = ''
        return resolve()
      }
      const start = performance.now()
      cursor.caret.style.opacity = '1'
      const tick = (now: number) => {
        if (stopped) return reject(STOPPED)
        // A frame's timestamp can be slightly earlier than `start`
        const progress = Math.min(
          1,
          Math.max(0, (now - start) / (duration * SPEED))
        )
        const step = steps[Math.min(steps.length - 1, Math.floor(progress * steps.length))]
        const line = lines[step.line]
        const x = step.x + 1
        const right = box.width + pad
        // Everything above the current line, plus this line up to the caret
        el.style.clipPath = `polygon(${-pad}px ${-pad}px, ${right}px ${-pad}px, ${right}px ${line.clipTop}px, ${x}px ${line.clipTop}px, ${x}px ${line.clipBottom}px, ${-pad}px ${line.clipBottom}px)`
        cursor.caret.style.height = `${line.bottom - line.top}px`
        cursor.caret.style.transform = at(box.left + x + 1, box.top + line.top)
        cursor.x = box.left + x + 6
        cursor.y = box.top + line.bottom - 6
        cursor.el.style.transform = at(cursor.x, cursor.y)
        if (progress < 1) {
          frame = requestAnimationFrame(tick)
        } else {
          el.style.clipPath = ''
          cursor.caret.style.opacity = '0'
          resolve()
        }
      }
      frame = requestAnimationFrame(tick)
    })

  const typeAt = async (cursor: Cursor, el: HTMLElement, duration: number) => {
    const box = el.getBoundingClientRect()
    await moveTo(cursor, box.left, box.top + 8)
    await type(cursor, el, duration)
  }

  const leave = async (cursor: Cursor) => {
    await wait(120)
    await play(
      cursor.el,
      [
        { opacity: 1, transform: at(cursor.x, cursor.y) },
        { opacity: 0, transform: at(cursor.x + 14, cursor.y + 10) },
      ],
      380
    )
  }

  const run = async () => {
    await document.fonts.ready
    if (stopped) return

    const name = part('name')
    const leadCard = part('leadCard')
    const lead = part('lead')
    const bioCard = part('bioCard')
    const proof = part('proof')
    const now = part('now')
    const links = [...(part('links')?.querySelectorAll<HTMLElement>('a') ?? [])]
    if (!name || !leadCard || !lead || !bioCard || !proof || !now) return finish()

    // Hide everything the cursors are about to make, then lift the
    // stylesheet's own "not built yet" hiding
    ;[name, leadCard, lead, bioCard, proof, now].forEach((el) => hide(el, 'clip'))
    links.forEach((el) => hide(el, 'fade'))
    document.body.append(overlay)
    intro.dataset.build = 'running'
    skipEvents.forEach((type) =>
      window.addEventListener(type, finish, { passive: true, once: true })
    )

    // The cursors show up together, loosely bunched, then split up
    const nameBox = name.getBoundingClientRect()
    const bioBox = bioCard.getBoundingClientRect()
    const centerX = nameBox.left + Math.min(nameBox.width, 520) / 2
    const centerY = nameBox.bottom + 36
    const cursors = Array.from({ length: CURSOR_COUNT }, (_, i) => {
      const angle = (i / CURSOR_COUNT) * Math.PI * 2
      return makeCursor(centerX + Math.cos(angle) * 30, centerY + Math.sin(angle) * 22)
    })
    const [namer, leader, bioMaker, nowTyper, linker] = cursors
    await Promise.all(
      cursors.map((cursor, i) =>
        wait(i * 50).then(() => play(cursor.el, [{ opacity: 0 }, { opacity: 1 }], 220))
      )
    )
    await wait(120)

    let bioBoxDrawn = () => {}
    const bioBoxReady = new Promise<void>((resolve) => (bioBoxDrawn = resolve))

    await Promise.all([
      (async () => {
        await typeAt(namer, name, 560)
        await leave(namer)
      })(),
      (async () => {
        await drawBox(leader, leadCard)
        await typeAt(leader, lead, 950)
        await leave(leader)
      })(),
      (async () => {
        await wait(160)
        await drawBox(bioMaker, bioCard)
        bioBoxDrawn()
        await typeAt(bioMaker, proof, 1050)
        await leave(bioMaker)
      })(),
      // These two hover where the bio card will be until it's drawn
      (async () => {
        await moveTo(nowTyper, bioBox.left + bioBox.width * 0.35, bioBox.top + bioBox.height * 0.6)
        await bioBoxReady
        await wait(250)
        await typeAt(nowTyper, now, 700)
        await leave(nowTyper)
      })(),
      (async () => {
        await moveTo(linker, bioBox.left + bioBox.width * 0.7, bioBox.top + bioBox.height * 0.75)
        await bioBoxReady
        await wait(450)
        for (const link of links) {
          const box = link.getBoundingClientRect()
          await moveTo(linker, box.left + box.width / 2, box.top + box.height / 2)
          const pop = await play(
            link,
            [
              { opacity: 0, transform: 'scale(0.92)' },
              { opacity: 1, transform: 'scale(1)' },
            ],
            180,
            'ease-out'
          )
          link.style.opacity = ''
          pop.cancel()
          await wait(70)
        }
        await leave(linker)
      })(),
    ])
    finish()
  }

  // A failure anywhere just shows the finished page
  run().catch(finish)

  // For leaving the page mid-build: tidy up without counting it as seen
  return cleanup
}
