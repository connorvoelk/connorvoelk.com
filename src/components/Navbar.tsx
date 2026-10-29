// Navbar.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useRef } from 'react'
import styles from './navbar.module.css'
import { visiblePosts } from '@/app/blog/posts'

// Pages that aren't built yet stay listed with ready: false so they're hidden
// from the nav instead of 404ing. Flip the flag when a page ships.
const sections = [
  {
    id: 'resume',
    href: '/resume',
    ready: true,
    links: [
      { label: 'overview', href: '/resume', ready: true },
      { label: 'timeline', href: '/timeline', ready: false },
      { label: 'file', href: '/connor-voelk-resume.pdf', ready: true },
    ],
  },
  {
    id: 'projects',
    href: '/projects',
    ready: true,
    links: [
      { label: 'mani', href: '/projects/mani', ready: true },
      { label: '[obj]', href: '/obj', ready: true },
      { label: 'listening pal', href: '/projects/listening-pal', ready: true },
      { label: 'pokeDB', href: '/projects/pokedb', ready: true },
      { label: 'monolith', href: '/monolith', ready: false },
    ],
  },
  {
    id: 'blog',
    href: '/blog',
    // Built from the post list, which hides drafts on the production site
    ready: visiblePosts.length > 0,
    links: visiblePosts.map((post) => ({
      label: post.navTitle ?? post.title,
      href: `/blog/${post.slug}`,
      ready: true,
    })),
  },
]

// A section shows if its own page exists or it has at least one live link;
// until its own page exists, the top-level link goes to its first live link.
const liveSections = sections
  .map((section) => ({
    ...section,
    links: section.links.filter((link) => link.ready),
  }))
  .filter((section) => section.ready || section.links.length > 0)

// Shown when hovering the profile picture
const profileLinks = [
  { label: 'linkedin', href: 'https://www.linkedin.com/in/connorvoelk' },
  { label: 'github', href: 'https://github.com/connorvoelk' },
  { label: 'instagram', href: 'https://www.instagram.com/connor.voelk' },
]

const Navbar = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [visibleSection, setVisibleSection] = useState<string | null>(null)
  const [isNavHovered, setIsNavHovered] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleNavMouseLeave = () => {
    setIsNavHovered(false)
    setActiveSection(null)
    closeTimerRef.current = setTimeout(() => setVisibleSection(null), 300)
  }

  const handleSectionEnter = (section: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setActiveSection(section)
    setVisibleSection(section)
  }

  const visibleLinks =
    visibleSection === 'profile'
      ? profileLinks
      : liveSections.find((section) => section.id === visibleSection)?.links ??
        []

  return (
    <nav
      className={styles.navbar}
      onMouseLeave={handleNavMouseLeave}
      onMouseEnter={() => setIsNavHovered(true)}
    >
      <div className={styles.container}>
        <div
          className={`${styles.navContent} ${
            isNavHovered ? styles.expanded : ''
          } ${activeSection ? styles.hasActiveSection : ''}`}
        >
          {/* Primary Nav Container */}
          <div className={styles.primaryNavContainer}>
            <div className={styles.mainNav}>
              <Link href="/" className={styles.logo} aria-label="Home">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 280.79 172.91"
                >
                  <defs>
                    <linearGradient
                      id="circleGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        className={styles.gradientStop1}
                        offset="0%"
                        stopColor="#22c55e"
                      />
                      <stop
                        className={styles.gradientStop2}
                        offset="100%"
                        stopColor="#06b6d4"
                      />
                    </linearGradient>
                    <linearGradient
                      id="triangleGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        className={styles.gradientStop3}
                        offset="0%"
                        stopColor="#1d4ed8"
                      />
                      <stop
                        className={styles.gradientStop4}
                        offset="100%"
                        stopColor="#6d28d9"
                      />
                    </linearGradient>
                  </defs>

                  <path
                    className={styles.outlinePath}
                    d="M86.76,3.39c-45.91,0-83.14,37.22-83.14,83.14s37.22,83.14,83.14,83.14h82.97L275.18,3.39H87.06l82.67,166.27"
                    stroke="white"
                    strokeWidth="6"
                    strokeMiterlimit="10"
                    fill="transparent"
                  />

                  <path
                    className={styles.gradientPath}
                    d="M86.76,3.39c-45.91,0-83.14,37.22-83.14,83.14s37.22,83.14,83.14,83.14h82.97"
                    fill="transparent"
                  />

                  <path
                    className={styles.trianglePath}
                    d="M169.73,169.67 L275.18,3.39H87.06l82.67,166.27"
                    fill="transparent"
                  />
                </svg>
              </Link>

              <div className={styles.navLinks}>
                {liveSections.map((section) => (
                  <span
                    key={section.id}
                    className={`${styles.linkWrapper} ${
                      activeSection === section.id ? styles.active : ''
                    }`}
                    onMouseEnter={() => handleSectionEnter(section.id)}
                  >
                    <Link
                      href={section.ready ? section.href : section.links[0].href}
                      className={styles.link}
                    >
                      {section.id}
                    </Link>
                  </span>
                ))}
              </div>

              <div
                className={`${styles.profilePic} ${
                  activeSection === 'profile' ? styles.active : ''
                }`}
                onMouseEnter={() => handleSectionEnter('profile')}
              >
                <Image
                  src="/profile-picture.jpg"
                  alt="Connor Voelk"
                  width={48}
                  height={48}
                />
              </div>
            </div>
          </div>

          {/* Secondary Nav Container — always in DOM so CSS transitions play on close */}
          <div className={styles.secondaryNavContainer}>
            <div className={styles.divider} />
            <div className={styles.secondaryNav}>
              {visibleLinks.map((link) => {
                const external = link.href.startsWith('http')
                // Other sites and files (like the resume PDF) aren't pages in
                // this app, so they skip Next's client-side navigation
                return external || link.href.endsWith('.pdf') ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className={styles.secondaryLink}
                    {...(external && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={styles.secondaryLink}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Rendered once in the root layout, so the nav stays mounted (and open, if
// it's being hovered) across page changes and sits above the page transition.
// Pages that are their own world go without: [obj]'s full-screen window UI,
// and each blog post (every post has its own look and a link back to /blog).
// Unmounting there means the nav comes back closed.
const SiteNav = () => {
  const pathname = usePathname()
  if (pathname.startsWith('/obj') || /^\/blog\/[^/]+/.test(pathname)) {
    return null
  }
  return <Navbar />
}

export default SiteNav
