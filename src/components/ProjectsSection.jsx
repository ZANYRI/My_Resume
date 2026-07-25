import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useLang } from '../lang/LanguageContext'

function parseRepo(link) {
  const match = link?.match(/github\.com\/([^/]+)\/([^/]+)\/?$/)
  if (!match) return null
  return { owner: match[1], repo: match[2] }
}

async function fetchReadme(link) {
  const repoInfo = parseRepo(link)
  if (!repoInfo) return null
  for (const branch of ['main', 'master']) {
    const res = await fetch(`https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.repo}/${branch}/README.md`)
    if (res.ok) return res.text()
  }
  return null
}

export default function ProjectsSection() {
  const { t } = useLang()
  const [projects, setProjects] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [details, setDetails] = useState({})

  useEffect(() => {
    fetch('./content/projects.json')
      .then((res) => (res.ok ? res.json() : []))
      .then(setProjects)
      .catch(() => setProjects([]))
  }, [])

  async function toggleDetails(project) {
    if (expandedId === project.id) {
      setExpandedId(null)
      return
    }
    setExpandedId(project.id)
    if (details[project.id]) return
    try {
      const readme = await fetchReadme(project.link)
      setDetails((prev) => ({
        ...prev,
        [project.id]: readme ?? t({ ru: '_В этом репозитории пока нет README._', en: '_This repository has no README yet._' }),
      }))
    } catch {
      setDetails((prev) => ({
        ...prev,
        [project.id]: t({ ru: '_Не удалось загрузить README._', en: '_Failed to load README._' }),
      }))
    }
  }

  return (
    <section className="projects" id="projects">
      <h2>{t({ ru: 'Проекты', en: 'Projects' })}</h2>
      {projects.length === 0 && (
        <p className="empty-state">{t({ ru: 'Проекты появятся здесь позже.', en: 'Projects will appear here soon.' })}</p>
      )}
      <div className="skills-grid projects__grid">
        {projects.map((project) => (
          <article
            className="project-card project-card--clickable"
            key={project.id}
            role="button"
            aria-expanded={expandedId === project.id}
            tabIndex={0}
            onClick={() => toggleDetails(project)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleDetails(project)
              }
            }}
          >
            <div className="project-card__header">
              <h3 className="project-card__title">{project.title}</h3>
              {project.link && (
                <a
                  className="project-card__github"
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="fab fa-github" />
                </a>
              )}
            </div>
            {project.stack && (
              <div className="project-card__stack">
                {project.stack.map((tech) => (
                  <span className="project-card__tag" key={tech}>{tech}</span>
                ))}
              </div>
            )}
            {project.status && <p className="project-card__status">{project.status}</p>}
            {expandedId === project.id && (
              <div className="project-detail" onClick={(e) => e.stopPropagation()}>
                <ReactMarkdown>{details[project.id] ?? t({ ru: 'Загрузка…', en: 'Loading…' })}</ReactMarkdown>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
