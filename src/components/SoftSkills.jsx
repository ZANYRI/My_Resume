import { useLang } from '../lang/LanguageContext'
import { useMarkdownFile, linesOf } from '../content/useMarkdown'

export default function SoftSkills() {
  const { lang, t } = useLang()
  const text = useMarkdownFile(`./content/soft-skills.${lang}.md`)
  const skills = linesOf(text)

  return (
    <section className="soft-skills">
      <h2>{t({ ru: 'Социальные навыки', en: 'Soft Skills' })}</h2>
      <div className="skills-grid">
        {skills.map((skill) => (
          <div className="skill" key={skill}>{skill}</div>
        ))}
      </div>
    </section>
  )
}
