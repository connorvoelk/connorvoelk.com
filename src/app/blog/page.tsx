import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import DotGridBackground from '@/components/DotGridBackground'
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
      <DotGridBackground variant="reading" />
      <main className={styles.blog}>
        <h1 className={styles.title}>Blog</h1>
        <ul className={styles.posts}>
          {visiblePosts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className={styles.post}>
                <span className={styles.postTitle}>{post.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
