import { useEffect, useState } from 'react'
import { useLang } from '../lang/LanguageContext'

export default function ArticlesSection() {
  const { t } = useLang()
  const [articles, setArticles] = useState([])

  useEffect(() => {
    fetch('./content/articles.json')
      .then((res) => (res.ok ? res.json() : []))
      .then(setArticles)
      .catch(() => setArticles([]))
  }, [])

  return (
    <section className="articles" id="articles">
      <h2>{t({ ru: 'Статьи', en: 'Articles' })}</h2>
      {articles.length === 0 ? (
        <p className="empty-state">{t({ ru: 'Пока нет статей — скоро появятся.', en: 'No articles yet — coming soon.' })}</p>
      ) : (
        <ul className="articles__list">
          {articles.map((article) => (
            <li className="article-item" key={article.file}>
              <a href={`./content/articles/${article.file}`} target="_blank" rel="noreferrer">
                {article.title}
              </a>
              <span className="article-item__date">{article.date}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
