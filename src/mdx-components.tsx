import type { MDXComponents } from 'mdx/types'

// Required by Next.js for .mdx pages. Each blog post styles its own elements
// in its folder's theme, so nothing is overridden globally here.
const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
