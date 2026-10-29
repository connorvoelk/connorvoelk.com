// Every post lives in its own folder, src/app/blog/<slug>/, with its own
// layout.tsx and theme.module.css, so each one can look and behave completely
// differently. The words go in that folder's page.mdx.
//
// Flip a post to 'published' once its content is final. Until then it's a
// draft: visible locally and on preview deployments, but hidden on the
// production site (no nav link, no index entry, and its URL 404s).

export interface Post {
  slug: string
  title: string
  // A shorter name for the navbar, when the title is too long for it
  navTitle?: string
  status: 'draft' | 'published'
}

export const posts: Post[] = [
  { slug: 'blue-bubble-boy', title: 'Blue Bubble Boy', status: 'published' },
  {
    slug: 'square-terminal',
    title: 'The Proliferation of the Square Terminal',
    navTitle: 'Square Terminal',
    status: 'published',
  },
  { slug: 'data-driven-design', title: 'Data Driven Design', status: 'draft' },
  { slug: 'lapras-invasion', title: 'Lapras Invasion', status: 'draft' },
  { slug: 'dead-internet', title: 'Dead Internet', status: 'draft' },
]

// SHOW_DRAFTS is set at build time in next.config.ts
const showDrafts = process.env.SHOW_DRAFTS === 'true'

export const visiblePosts = posts.filter(
  (post) => post.status === 'published' || showDrafts
)

export const isVisible = (slug: string) =>
  visiblePosts.some((post) => post.slug === slug)
