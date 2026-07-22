import { useLang } from '../lang/LanguageContext'

export default function LanguageSwitch() {
  const { lang, setLang } = useLang()
  const isEn = lang === 'en'

  return (
    <button
      type="button"
      className="lang-switch"
      role="switch"
      aria-checked={isEn}
      aria-label="RU / EN"
      onClick={() => setLang(isEn ? 'ru' : 'en')}
    >
      <span className={`lang-switch__option${isEn ? '' : ' lang-switch__option--active'}`}>RU</span>
      <span className={`lang-switch__option${isEn ? ' lang-switch__option--active' : ''}`}>EN</span>
      <span className={`lang-switch__knob${isEn ? ' lang-switch__knob--en' : ''}`} />
    </button>
  )
}
