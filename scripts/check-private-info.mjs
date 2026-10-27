// Fails the build if anything that looks like a phone number shows up in the
// site's source or public files. Personal contact details (phone, address)
// must never be published on connorvoelk.com — this runs before every build,
// locally and on Vercel, so one can't slip through.
import { readdirSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'

const ROOTS = ['src', 'public']
const TEXT_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.mjs', '.css', '.md', '.mdx', '.json', '.html', '.txt', '.svg',
])
// Matches (206) 555-0100, 206-555-0100, 206.555.0100, +1 206 555 0100.
// Separators are required so long digit runs (hashes, encoded data) don't match.
const PHONE = /(?:\+?1[\s.-]+)?\(?\b\d{3}\)?[\s.-]+\d{3}[\s.-]+\d{4}\b/

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else if (TEXT_EXTENSIONS.has(extname(entry.name))) yield path
  }
}

const hits = []
for (const root of ROOTS) {
  for (const file of walk(root)) {
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (PHONE.test(line)) hits.push(`${file}:${i + 1}`)
      })
  }
}

if (hits.length > 0) {
  console.error('Possible phone number found — personal contact info must not be published:')
  for (const hit of hits) console.error(`  ${hit}`)
  process.exit(1)
}
