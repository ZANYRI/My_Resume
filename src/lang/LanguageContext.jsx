import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ru')

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')

  const { lang, setLang } = ctx
  const t = (obj) => (obj && typeof obj === 'object' ? obj[lang] ?? obj.ru ?? '' : obj)

  return { lang, setLang, t }
}
