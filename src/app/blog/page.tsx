import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import styles from './page.module.css'
import { visiblePosts } from './posts'

export const metadata: Metadata = {
  title: 'Blog – Connor Voelk',
}

export default function BlogPage() {
  // No published posts yet means no blog on the production site
  if (visiblePosts.length === 0) notFound()

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.blog}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.intro}>
          Each post is built as its own experience, with its own look.
        </p>
        <ul className={styles.posts}>
          {visiblePosts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className={styles.post}>
                <span className={styles.postTitle}>{post.title}</span>
                {post.status === 'draft' && (
                  <span className={styles.draft}>Draft</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
