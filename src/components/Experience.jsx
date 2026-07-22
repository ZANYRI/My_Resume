import { useLang } from '../lang/LanguageContext'
import { useMarkdownFile } from '../content/useMarkdown'
import { parseExperience } from '../content/parseExperience'

export default function Experience() {
  const { lang, t } = useLang()
  const text = useMarkdownFile(`./content/experience.${lang}.md`)
  const jobs = parseExperience(text)

  return (
    <section className="experience">
      <h2>{t({ ru: 'Опыт работы', en: 'Experience' })}</h2>
      {jobs.map((job, i) => (
        <div className="job" key={i}>
          <h3>{job.title}</h3>
          <p><strong>{job.company}</strong> | <span>{job.period}</span></p>
          <ul>
            {job.bullets.map((bullet, j) => (
              <li key={j}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
