import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useLang } from '../lang/LanguageContext'

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
    if (!project.file || details[project.id]) return
    try {
      const res = await fetch(`./content/projects/${project.file}`)
      if (!res.ok) throw new Error('not found')
      const text = await res.text()
      setDetails((prev) => ({ ...prev, [project.id]: text }))
    } catch {
      setDetails((prev) => ({ ...prev, [project.id]: '_Не удалось загрузить описание._' }))
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
          <article className="project-card" key={project.id}>
            <h3 className="project-card__title">{project.title}</h3>
            {project.stack && (
              <div className="project-card__stack">
                {project.stack.map((tech) => (
                  <span className="project-card__tag" key={tech}>{tech}</span>
                ))}
              </div>
            )}
            {project.status && <p className="project-card__status">{project.status}</p>}
            <div className="project-card__actions">
              {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer">{t({ ru: 'Ссылка', en: 'Link' })}</a>
              )}
              {project.file && (
                <a href="#" onClick={(e) => { e.preventDefault(); toggleDetails(project) }}>
                  {expandedId === project.id
                    ? t({ ru: 'Свернуть', en: 'Collapse' })
                    : t({ ru: 'Подробнее', en: 'Details' })}
                </a>
              )}
            </div>
            {expandedId === project.id && project.file && (
              <div className="project-detail">
                <ReactMarkdown>{details[project.id] ?? t({ ru: 'Загрузка…', en: 'Loading…' })}</ReactMarkdown>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
