import { useLang } from '../lang/LanguageContext'
import { useMarkdownFile, linesOf } from '../content/useMarkdown'

function parseEntry(line) {
  const [school, details] = line.split(/\s—\s/)
  return { school: school ?? line, details: details ?? '' }
}

export default function Education() {
  const { lang, t } = useLang()
  const text = useMarkdownFile(`./content/education.${lang}.md`)
  const entries = linesOf(text).map(parseEntry)

  return (
    <section className="education">
      <h2>{t({ ru: 'Образование', en: 'Education' })}</h2>
      {entries.map((entry, i) => (
        <p key={i}>
          <strong>{entry.school}</strong>
          {entry.details && <><br /><span>{entry.details}</span></>}
        </p>
      ))}
    </section>
  )
}
