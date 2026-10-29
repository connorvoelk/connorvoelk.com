import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ObjModel from './ObjModel'
import styles from './projects.module.css'
import { githubLink, projects, projectHref, type Project } from './projectsData'
import { githubLogo, TagList } from './tags'

export const metadata: Metadata = {
  title: 'Projects – Connor Voelk',
  description: "What I'm building now, and what I built before.",
}

const groups = [
  { id: 'now', title: 'Now' },
  { id: 'earlier', title: 'Earlier' },
] as const

const Cover = ({ project }: { project: Project }) => {
  if (project.model) {
    return <ObjModel src={project.model} alt={`${project.name} 3D model`} />
  }

  // A logo sits centered on the panel; it's decorative next to the name too
  if (project.logo) {
    return (
      <Image
        src={project.logo}
        alt=""
        unoptimized
        className={styles.coverLogo}
      />
    )
  }

  const cover = project.cover ?? project.gallery.images[0]
  if (!cover) return null

  // The card's text already names the project, so the image is decorative
  return (
    <Image
      src={cover.src}
      alt=""
      unoptimized
      className={
        project.gallery.layout === 'wide' ? styles.coverWide : styles.coverPhone
      }
    />
  )
}

const ProjectCard = ({ project }: { project: Project }) => {
  const github = githubLink(project)
  return (
    <li className={styles.cardItem}>
      <Link
        href={projectHref(project)}
        className={styles.card}
        style={{ '--accent': project.accent } as React.CSSProperties}
      >
        <div className={styles.cover}>
          <Cover project={project} />
        </div>
        <div className={styles.cardHeading}>
          <h3 className={styles.cardName}>{project.name}</h3>
          {project.years && <span className={styles.years}>{project.years}</span>}
        </div>
        <p className={styles.cardTagline}>{project.tagline}</p>
        <TagList ids={project.tags} className={styles.cardTags} />
      </Link>
      {/* Beside the card's link, not inside it, since links can't nest */}
      {github && (
        <a
          href={github.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.codeLink}
          aria-label={`${project.name} code on GitHub`}
        >
          {githubLogo}
          Code
        </a>
      )}
    </li>
  )
}

export default function ProjectsPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.intro}>
            What I&apos;m building now, and what I built before.
          </p>
        </header>

        {groups.map((group) => (
          <section
            key={group.id}
            className={styles.group}
            aria-labelledby={group.id}
          >
            <h2 id={group.id} className={styles.groupTitle}>
              {group.title}
            </h2>
            <ul className={styles.grid}>
              {projects
                .filter((project) => project.group === group.id)
                .map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  )
}
