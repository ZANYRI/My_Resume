import ReactMarkdown from 'react-markdown'
import { useLang } from '../lang/LanguageContext'
import { useMarkdownFile } from '../content/useMarkdown'

export default function Education() {
  const { lang, t } = useLang()
  const text = useMarkdownFile(`./content/education.${lang}.md`)

  return (
    <section className="education">
      <h2>{t({ ru: 'Образование', en: 'Education' })}</h2>
      <ReactMarkdown>{text}</ReactMarkdown>
    </section>
  )
}
