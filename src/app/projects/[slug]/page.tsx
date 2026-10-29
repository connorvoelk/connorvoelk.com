import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from '../projects.module.css'
import { githubLink, projectPages, type Project } from '../projectsData'
import { githubLogo, TagList } from '../tags'

// Only the projects in projectsData have pages; anything else is a 404
export const dynamicParams = false

export function generateStaticParams() {
  return projectPages.map((project) => ({ slug: project.slug }))
}

type Props = { params: Promise<{ slug: string }> }

const findProject = async (params: Props['params']) => {
  const { slug } = await params
  return projectPages.find((project) => project.slug === slug) ?? notFound()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await findProject(params)
  return {
    title: `${project.name} – Connor Voelk`,
    description: project.tagline,
  }
}

const Gallery = ({ gallery }: { gallery: Project['gallery'] }) => {
  if (gallery.images.length === 0) return null

  if (gallery.layout === 'wide') {
    const [image] = gallery.images
    return (
      <figure className={`${styles.gallery} ${styles.galleryWide}`}>
        {/* Diagrams are dense, so the image opens full size */}
        <a href={image.src.src} target="_blank" rel="noopener noreferrer">
          <Image src={image.src} alt={image.alt} unoptimized />
        </a>
        {image.caption && <figcaption>{image.caption}</figcaption>}
      </figure>
    )
  }

  return (
    <div>
      <div className={styles.gallery}>
        <div className={styles.track}>
          {gallery.images.map((image) => (
            <figure key={image.alt} className={styles.shot}>
              <Image src={image.src} alt={image.alt} unoptimized />
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
      {gallery.note && <p className={styles.galleryNote}>{gallery.note}</p>}
    </div>
  )
}

export default async function ProjectPage({ params }: Props) {
  const project = await findProject(params)
  const index = projectPages.indexOf(project)
  const next = projectPages[(index + 1) % projectPages.length]
  const github = githubLink(project)

  const facts = [
    { label: 'Role', value: project.role },
    { label: 'Team', value: project.team },
    { label: 'Built with', value: project.stack.join(', ') },
  ].filter((fact) => fact.value)

  return (
    <div
      className={styles.page}
      style={{ '--accent': project.accent } as React.CSSProperties}
    >
      <main className={styles.article}>
        <Link href="/projects" className={styles.back}>
          ← All projects
        </Link>

        <header>
          <p className={styles.kind}>{project.kind}</p>
          <div className={styles.nameRow}>
            {project.logo && (
              <Image
                src={project.logo}
                alt=""
                unoptimized
                className={styles.titleLogo}
              />
            )}
            <h1 className={styles.title}>{project.name}</h1>
          </div>
          <p className={styles.tagline}>{project.tagline}</p>
          <TagList ids={project.tags} className={styles.pageTags} />

          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          {project.links.length > 0 && (
            <div className={styles.links}>
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    link === github ? `${styles.pill} ${styles.codePill}` : styles.pill
                  }
                >
                  {link === github && githubLogo}
                  {link.label}
                  <span aria-hidden="true"> ↗</span>
                </a>
              ))}
            </div>
          )}
        </header>

        <Gallery gallery={project.gallery} />

        {project.sections.map((section) => (
          <section key={section.title} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
            {section.bullets && (
              <ul className={styles.bullets}>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <nav className={styles.nextProject} aria-label="More projects">
          <Link href="/projects">All projects</Link>
          <Link href={`/projects/${next.slug}`}>
            Next: {next.name} <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </main>
    </div>
  )
}
