import ReactMarkdown from 'react-markdown'
import { useLang } from '../lang/LanguageContext'
import { useMarkdownFile } from '../content/useMarkdown'

export default function About() {
  const { lang, t } = useLang()
  const text = useMarkdownFile(`./content/about.${lang}.md`)

  return (
    <section className="about">
      <h2>{t({ ru: 'О себе', en: 'About Me' })}</h2>
      <ReactMarkdown>{text}</ReactMarkdown>
    </section>
  )
}
