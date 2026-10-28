import type { Metadata } from 'next'
import styles from './page.module.css'
import { resume, type ResumeRole, type RichText } from './resumeData'

// Connor's own PDF export (a copy without his phone number). Swap in a new
// export when the base resume changes, and update resumeData.ts to match.
const PDF_PATH = '/connor-voelk-resume.pdf'

export const metadata: Metadata = {
  title: 'Resume – Connor Voelk',
  description: resume.summary,
}

// External links open in a new tab; in the PDF they stay clickable
const ExternalLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={styles.inlineLink}
  >
    {children}
  </a>
)

const Rich = ({ text }: { text: RichText }) =>
  text.map((piece, i) =>
    typeof piece === 'string' ? (
      piece
    ) : (
      <ExternalLink key={i} href={piece.href}>
        {piece.text}
      </ExternalLink>
    )
  )

const Bullets = ({ items }: { items: string[] }) => (
  <ul className={styles.bullets}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)

const Role = ({ role }: { role: ResumeRole }) => (
  <article
    className={`${styles.row} ${styles.role}`}
    style={{ '--dot': role.dotColor } as React.CSSProperties}
  >
    <p className={styles.dates}>{role.dates}</p>
    <div>
      <h4 className={styles.roleTitle}>{role.title}</h4>
      {role.summary && <p className={styles.roleSummary}>{role.summary}</p>}
      {role.projects?.map((project) => (
        <div key={project.name} className={styles.project}>
          <h5 className={styles.projectName}>{project.name}</h5>
          <p className={styles.projectClient}>
            {project.client}, {project.contractValue} contract
          </p>
          <Bullets items={project.bullets} />
        </div>
      ))}
      {role.bullets && <Bullets items={role.bullets} />}
    </div>
  </article>
)

export default function ResumePage() {
  const { education } = resume

  return (
    <div className={styles.page}>
      <main className={styles.resume}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.name}>{resume.name}</h1>
            <a
              className={styles.download}
              href={PDF_PATH}
              download="Connor Voelk Resume.pdf"
            >
              Download PDF
            </a>
          </div>
          <p className={styles.contact}>
            <span>{resume.location}</span>
            {resume.links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </p>
          <p className={styles.summary}>{resume.summary}</p>
        </header>

        <section className={styles.section} aria-labelledby="experience">
          <h2 id="experience" className={styles.sectionTitle}>
            Experience
          </h2>
          <div className={styles.entries}>
            {resume.experience.map((company) => (
              <div key={company.name} className={styles.company}>
                <div className={styles.row}>
                  <div className={styles.companyHeader}>
                    <h3 className={styles.companyName}>
                      <ExternalLink href={company.href}>
                        {company.name}
                      </ExternalLink>
                    </h3>
                    <span className={styles.location}>{company.location}</span>
                  </div>
                </div>
                {company.roles.map((role) => (
                  <Role key={role.title} role={role} />
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="education">
          <h2 id="education" className={styles.sectionTitle}>
            Education
          </h2>
          <div className={styles.entries}>
            <article
              className={`${styles.row} ${styles.role}`}
              style={{ '--dot': education.dotColor } as React.CSSProperties}
            >
              <p className={styles.dates}>{education.year}</p>
              <div>
                <div className={styles.companyHeader}>
                  <h3 className={styles.companyName}>
                    <ExternalLink href={education.href}>
                      {education.school}
                    </ExternalLink>
                  </h3>
                  <span className={styles.location}>{education.location}</span>
                </div>
                <p className={styles.roleTitle}>
                  <Rich text={education.degree} />
                </p>
                <p className={styles.roleSummary}>
                  <Rich text={education.honors} />
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="skills">
          <h2 id="skills" className={styles.sectionTitle}>
            Skills
          </h2>
          <dl className={styles.skills}>
            {resume.skills.map((group) => (
              <div key={group.name} className={styles.row}>
                <dt className={styles.skillName}>{group.name}</dt>
                <dd className={styles.skillItems}>
                  <Rich text={group.items} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  )
}
