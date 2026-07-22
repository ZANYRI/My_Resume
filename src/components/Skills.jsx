import { useLang } from '../lang/LanguageContext'
import { useMarkdownFile, linesOf } from '../content/useMarkdown'

export default function Skills() {
  const { t } = useLang()
  const text = useMarkdownFile('./content/skills.md')
  const skills = linesOf(text)

  return (
    <section className="skills">
      <h2>{t({ ru: 'Технические навыки', en: 'Hard Skills' })}</h2>
      <div className="skills-grid">
        {skills.map((skill) => (
          <div className="skill" key={skill}>{skill}</div>
        ))}
      </div>
    </section>
  )
}
