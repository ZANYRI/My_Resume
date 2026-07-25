import { useEffect, useMemo, useRef, useState } from 'react'
import { siteConfig } from '../siteConfig'
import { useLang } from '../lang/LanguageContext'

const MONTH_NAMES = {
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}

const WEEKDAYS = {
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}

function pluralizeRu(n, [one, few, many]) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return few
  return many
}

function tooltipFor(day, lang) {
  const date = new Date(`${day.date}T00:00:00`)
  const formatted = new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-US', {
    month: 'long',
    day: 'numeric',
  }).format(date)

  if (day.count === 0) {
    return lang === 'ru' ? `Нет вкладов ${formatted}` : `No contributions on ${formatted}`
  }
  if (lang === 'ru') {
    const word = pluralizeRu(day.count, ['вклад', 'вклада', 'вкладов'])
    return `${day.count} ${word} ${formatted}`
  }
  return `${day.count} contribution${day.count === 1 ? '' : 's'} on ${formatted}`
}

function weekdayColumn(date) {
  return ((date.getDay() + 6) % 7) + 1
}

function monthsForYear(allData, year) {
  const months = Array.from({ length: 12 }, () => [])
  allData.contributions.forEach((day) => {
    if (!day.date.startsWith(String(year))) return
    const date = new Date(`${day.date}T00:00:00`)
    months[date.getMonth()].push(day)
  })
  return months
}

function computeStreaks(allData) {
  const todayStr = new Date().toISOString().slice(0, 10)
  const days = [...allData.contributions].filter((d) => d.date <= todayStr).sort((a, b) => a.date.localeCompare(b.date))

  let longestStreak = 0
  let run = 0
  days.forEach((day) => {
    run = day.count > 0 ? run + 1 : 0
    longestStreak = Math.max(longestStreak, run)
  })

  let currentStreak = 0
  for (let i = days.length - 1; i >= 0; i -= 1) {
    if (days[i].count > 0) currentStreak += 1
    else break
  }

  return { currentStreak, longestStreak }
}

async function fetchLanguageStats(username) {
  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
  if (!reposRes.ok) throw new Error('repos fetch failed')
  const repos = await reposRes.json()

  const totals = {}
  await Promise.all(
    repos
      .filter((repo) => !repo.fork)
      .map(async (repo) => {
        const res = await fetch(repo.languages_url)
        if (!res.ok) return
        const langs = await res.json()
        Object.entries(langs).forEach(([name, bytes]) => {
          totals[name] = (totals[name] ?? 0) + bytes
        })
      }),
  )

  const totalBytes = Object.values(totals).reduce((sum, b) => sum + b, 0)
  const list = Object.entries(totals).map(([name, bytes]) => ({
    name,
    pct: totalBytes ? (bytes / totalBytes) * 100 : 0,
  }))

  return { repoCount: repos.length, list }
}

function useCountUp(target, active) {
  const [value, setValue] = useState(0)
  const frame = useRef(null)

  useEffect(() => {
    if (!active) return undefined
    const duration = 900
    const start = performance.now()

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(target * eased))
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target, active])

  return value
}

export default function GithubActivity() {
  const { t, lang } = useLang()
  const [allData, setAllData] = useState(null)
  const [error, setError] = useState(false)
  const [selectedYear, setSelectedYear] = useState(null)

  const [statsOpen, setStatsOpen] = useState(false)
  const [langStats, setLangStats] = useState(null)
  const [langError, setLangError] = useState(false)
  const [langLoading, setLangLoading] = useState(false)
  const [sortDir, setSortDir] = useState('desc')

  useEffect(() => {
    fetch('./content/github-activity.json')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('no cache'))))
      .catch(() =>
        fetch(`https://github-contributions-api.jogruber.de/v4/${siteConfig.contacts.githubHandle}?y=all`)
          .then((res) => (res.ok ? res.json() : Promise.reject(new Error('bad response')))),
      )
      .then((json) => {
        setAllData(json)
        const years = Object.keys(json.total).sort((a, b) => b - a)
        setSelectedYear(years[0])
      })
      .catch(() => setError(true))
  }, [])

  const years = useMemo(
    () => (allData ? Object.keys(allData.total).sort((a, b) => b - a) : []),
    [allData],
  )
  const months = useMemo(
    () => (allData && selectedYear ? monthsForYear(allData, selectedYear) : null),
    [allData, selectedYear],
  )
  const streaks = useMemo(() => (allData ? computeStreaks(allData) : null), [allData])

  const yearTotal = allData && selectedYear ? allData.total[selectedYear] ?? 0 : 0
  const total = useCountUp(yearTotal, Boolean(allData))
  const currentStreak = useCountUp(streaks?.currentStreak ?? 0, Boolean(streaks))
  const longestStreak = useCountUp(streaks?.longestStreak ?? 0, Boolean(streaks))

  function toggleStats() {
    const next = !statsOpen
    setStatsOpen(next)
    if (next && !langStats && !langLoading) {
      setLangLoading(true)
      setLangError(false)
      fetchLanguageStats(siteConfig.contacts.githubHandle)
        .then(setLangStats)
        .catch(() => setLangError(true))
        .finally(() => setLangLoading(false))
    }
  }

  const sortedLangs = useMemo(() => {
    if (!langStats) return []
    const list = [...langStats.list]
    list.sort((a, b) => (sortDir === 'desc' ? b.pct - a.pct : a.pct - b.pct))
    return list
  }, [langStats, sortDir])

  return (
    <section className="github-activity">
      <div className="github-activity__head">
        <h2>{t({ ru: 'Активность на GitHub', en: 'GitHub Activity' })}</h2>
        <div className="github-activity__controls">
          {years.length > 0 && (
            <select
              className="year-select"
              value={selectedYear ?? ''}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
          <button className="stats-toggle" onClick={toggleStats}>
            <i className={`fas ${statsOpen ? 'fa-calendar' : 'fa-chart-pie'}`} />{' '}
            {statsOpen ? t({ ru: 'Календарь', en: 'Calendar' }) : t({ ru: 'Вся статистика', en: 'Full stats' })}
          </button>
        </div>
      </div>

      {error && (
        <p className="empty-state">{t({ ru: 'Не удалось загрузить активность.', en: 'Could not load activity.' })}</p>
      )}
      {!error && !months && <p className="empty-state">{t({ ru: 'Загрузка…', en: 'Loading…' })}</p>}

      {months && statsOpen && (
        <div className="lang-stats">
          {langLoading && <p className="empty-state">{t({ ru: 'Загрузка…', en: 'Loading…' })}</p>}
          {langError && (
            <p className="empty-state">{t({ ru: 'Не удалось загрузить статистику.', en: 'Could not load stats.' })}</p>
          )}
          {langStats && (
            <>
              <div className="lang-stats__head">
                <span>
                  {t({ ru: 'Языки в', en: 'Languages across' })} {langStats.repoCount} {t({ ru: 'репозиториях', en: 'repositories' })}
                </span>
                <button
                  className="sort-toggle"
                  onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
                  aria-label="sort"
                >
                  {sortDir === 'desc' ? '↓' : '↑'} {t({ ru: 'по %', en: 'by %' })}
                </button>
              </div>
              <ul className="lang-stats__list">
                {sortedLangs.map((item) => (
                  <li key={item.name}>
                    <span className="lang-stats__name">{item.name}</span>
                    <span className="lang-stats__bar">
                      <span className="lang-stats__fill" style={{ width: `${item.pct}%` }} />
                    </span>
                    <span className="lang-stats__pct">{item.pct.toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {months && !statsOpen && (
        <>
          <div className="github-activity__stats">
            <div className="github-stat">
              <span className="github-stat__value">{total}</span>
              <span className="github-stat__label">{t({ ru: `вкладов в ${selectedYear}`, en: `contributions in ${selectedYear}` })}</span>
            </div>
            <div className={`github-stat github-stat--streak${streaks?.currentStreak > 0 ? ' github-stat--live' : ''}`}>
              <span className="github-stat__value">
                <span className="github-stat__flame">💪</span> {currentStreak}
              </span>
              <span className="github-stat__label">{t({ ru: 'дней подряд', en: 'day streak' })}</span>
            </div>
            <div className="github-stat">
              <span className="github-stat__value">{longestStreak}</span>
              <span className="github-stat__label">{t({ ru: 'лучшая серия', en: 'longest streak' })}</span>
            </div>
          </div>

          <div className="gh-cal-grid">
            {months.map((monthDays, monthIndex) => (
              <div className="gh-cal-month" key={monthIndex}>
                <div className="gh-cal-month__title">{MONTH_NAMES[lang][monthIndex]}</div>
                <div className="gh-cal-month__weekdays">
                  {WEEKDAYS[lang].map((wd) => (
                    <span key={wd}>{wd}</span>
                  ))}
                </div>
                <div className="gh-cal-month__grid">
                  {monthDays.map((day) => {
                    const date = new Date(`${day.date}T00:00:00`)
                    return (
                      <div
                        key={day.date}
                        className="gh-cal-day"
                        style={{ gridColumnStart: weekdayColumn(date) }}
                        data-tooltip={tooltipFor(day, lang)}
                      >
                        <span className={`gh-cal-day__bg gh-cal-day__bg--${day.level}`} />
                        <span className="gh-cal-day__num">{date.getDate()}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
