import { siteConfig } from '../siteConfig'
import { useLang } from '../lang/LanguageContext'
import { useMarkdownFile, linesOf } from '../content/useMarkdown'
import { notify } from './Notification'
import LanguageSwitch from './LanguageSwitch'
import ThemeSwitch from './ThemeSwitch'

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    notify(`Скопировано: ${text}`)
  }).catch((err) => {
    console.error('Ошибка копирования: ', err)
  })
}

export default function Header() {
  const { lang } = useLang()
  const { contacts, photo, locationMapUrl } = siteConfig
  const text = useMarkdownFile(`./content/profile.${lang}.md`)
  const [name, role, location] = linesOf(text)

  return (
    <header className="header">
      <div className="profile">
        <img src={photo} alt={name} className="profile-photo" />
        <div className="profile-info">
          <h1>{name}</h1>
          <p>{role}</p>
        </div>
      </div>
      <div className="header-right">
        <div className="contact-info">
          <p className="location" onClick={() => window.open(locationMapUrl, '_blank')}>
            <i className="fas fa-map-marker-alt" /> <span>{location}</span>
          </p>
          <p className="copyable" onClick={() => copyToClipboard(contacts.email)}>
            <i className="fas fa-envelope" />
            <a href={`mailto:${contacts.email}`} onClick={(e) => e.stopPropagation()}>{contacts.email}</a>
          </p>
          <p>
            <i className="fab fa-telegram" />
            <a href={contacts.telegram} target="_blank" rel="noreferrer" className="telegram-link">{contacts.telegramHandle}</a>
          </p>
          <p>
            <a href={contacts.github} target="_blank" rel="noreferrer">
              <i className="fab fa-github" /> <span>{contacts.githubHandle}</span>
            </a>
          </p>
        </div>
        <div className="switchers">
          <LanguageSwitch />
          <ThemeSwitch />
        </div>
      </div>
    </header>
  )
}
