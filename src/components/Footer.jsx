import { siteConfig } from '../siteConfig'
import { useLang } from '../lang/LanguageContext'
import { useMarkdownFile, linesOf } from '../content/useMarkdown'

export default function Footer() {
  const { lang } = useLang()
  const text = useMarkdownFile(`./content/profile.${lang}.md`)
  const [name] = linesOf(text)
  const year = new Date().getFullYear()

  return (
    <footer>
      <span>© {year} {name}</span>
      <a href={`mailto:${siteConfig.contacts.email}`}>{siteConfig.contacts.email}</a>
    </footer>
  )
}
