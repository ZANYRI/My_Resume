import { useLang } from '../lang/LanguageContext'

export const SECTIONS = [
  { id: 'github-activity', ru: 'Активность', en: 'Activity', color: 'var(--color-border-github)' },
  { id: 'about', ru: 'О себе', en: 'About', color: 'var(--color-border-about)' },
  { id: 'experience', ru: 'Опыт', en: 'Experience', color: 'var(--color-border-experience)' },
  { id: 'projects', ru: 'Проекты', en: 'Projects', color: 'var(--color-border-projects)' },
  { id: 'articles', ru: 'Статьи', en: 'Articles', color: 'var(--color-border-articles)' },
  { id: 'education', ru: 'Образование', en: 'Education', color: 'var(--color-border-education)' },
  { id: 'skills', ru: 'Тех. навыки', en: 'Tech skills', color: 'var(--color-border-skills)' },
  { id: 'soft-skills', ru: 'Соц. навыки', en: 'Soft skills', color: 'var(--color-border-soft-skills)' },
]

function Pill({ active, color, onClick, className = '', children }) {
  return (
    <button
      type="button"
      className={`section-filter__pill ${className}${active ? ' active' : ''}`}
      style={{ borderColor: color }}
      onClick={onClick}
    >
      <span className="section-filter__pill-fill section-filter__pill-fill--left" style={{ background: color }} />
      <span className="section-filter__pill-fill section-filter__pill-fill--right" style={{ background: color }} />
      <span className="section-filter__pill-label">{children}</span>
    </button>
  )
}

export default function SectionFilter({ selected, onToggle, onShowAll }) {
  const { t } = useLang()
  const showingAll = selected.length === 0

  return (
    <div className="section-filter">
      <Pill
        active={showingAll}
        color="var(--color-accent)"
        onClick={onShowAll}
        className="section-filter__pill--all"
      >
        {t({ ru: 'Всё', en: 'All' })}
      </Pill>
      {SECTIONS.map((section) => (
        <Pill
          key={section.id}
          active={selected.includes(section.id)}
          color={section.color}
          onClick={() => onToggle(section.id)}
        >
          {t(section)}
        </Pill>
      ))}
    </div>
  )
}
