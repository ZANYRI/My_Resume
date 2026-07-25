# Сайт-резюме

## *Ссылка на резюме: https://zanyri.github.io/My_Resume/*

Vite + React, без бэкенда. Весь текст резюме лежит в markdown/json-файлах и подтягивается через `fetch()` прямо в браузере — чтобы поправить текст, не нужно ничего пересобирать руками, достаточно отредактировать файл и закоммитить (деплой подхватит остальное сам).

Возможности:
- RU/EN переключатель и светлая/тёмная тема (тумблеры в шапке, тема запоминается в `localStorage`)
- Блок «Активность на GitHub»: календарь вкладов по годам + стрики + статистика языков по репозиториям — тянется с публичных API GitHub, без токена
- Фильтр разделов (кнопки под шапкой, комбинируются)
- Автодеплой на GitHub Pages через GitHub Actions

Если хочешь сделать такой же сайт себе — ниже пошагово всё, что нужно поменять.

## 1. Скопировать проект

```bash
git clone <URL-этого-репозитория> my-resume
cd my-resume
npm install
```

## 2. Свои данные

### 2.1 Контакты и фото — `src/siteConfig.js`

```js
export const siteConfig = {
  photo: './assets/image/photo.jpg',
  locationMapUrl: 'https://www.google.com/maps/place/...', // ссылка на карту при клике на город
  contacts: {
    email: 'you@example.com',
    telegram: 'https://t.me/yourhandle',
    telegramHandle: '@yourhandle',
    github: 'https://github.com/yourusername',
    githubHandle: 'yourusername', // используется для блока GitHub-активности
  },
}
```

Замени `public/assets/image/photo.jpg` и `public/assets/image/favicon.ico` на свои.

### 2.2 Текст резюме — `public/content/`

Всё редактируется без пересборки, RU/EN разнесены по отдельным файлам:

```
public/content/
  profile.ru.md / profile.en.md        имя, роль, город — по одной строке каждая
  about.ru.md / about.en.md            блок "о себе": абзац + буллеты (обычный markdown)
  experience.ru.md / experience.en.md  опыт работы, формат см. ниже
  education.ru.md / education.en.md    образование, формат см. ниже
  skills.md                            хард-скиллы, по строке на навык (один файл — язык-независимые термины)
  soft-skills.ru.md / soft-skills.en.md  гибкие навыки, по строке на пункт
  projects.json                        карточки проектов
  articles.json                        список статей (можно оставить пустым массивом [])
  articles/                            .md-файлы самих статей
  github-activity.json                 кэш GitHub-активности, см. раздел 3 — генерируется автоматически, руками не трогать
```

**Формат `experience.*.md`:**
```
### Должность
Компания | Период
- буллет
- буллет

### Следующая должность
...
```

**Формат `education.*.md`** — рендерится как обычный markdown, поэтому отступы и переносы настраиваются прямо в файле:
- строка, заканчивающаяся на `\` — перенос без большого отступа (остаётся частью той же записи)
- пустая строка — начинается новая запись с отступом побольше

**Формат `projects.json`:**
```json
[
  {
    "id": "my-project",
    "title": "My Project",
    "stack": ["Go", "PostgreSQL"],
    "status": "Краткое описание",
    "link": "https://github.com/you/my-project"
  }
]
```
Клик по карточке разворачивает README репозитория (тянется напрямую с `raw.githubusercontent.com` по ссылке из `link`, поддерживает и `main`, и `master`).

**Формат `articles.json`:**
```json
[{ "title": "Название статьи", "date": "2026-08-01", "file": "moy-post.md" }]
```
Файл `moy-post.md` кладётся в `public/content/articles/`.

### 2.3 Заголовок вкладки — `index.html`

Поправь `<title>` и `<meta name="description">`.

## 3. Блок «Активность на GitHub»

Компонент `src/components/GithubActivity.jsx` берёт `githubHandle` из `siteConfig.js` автоматически — отдельно ничего менять не нужно, **кроме одного места**:

`.github/workflows/update-github-activity.yml` — там имя пользователя **захардкожено** в URL:
```yaml
curl -sf "https://github-contributions-api.jogruber.de/v4/ZANYRI?y=all" -o public/content/github-activity.json
```
Замени `ZANYRI` на свой ник.

Как это работает: этот workflow раз в час дёргает публичный API и перезаписывает `public/content/github-activity.json`, коммитя изменения в `main`. Компонент на сайте сначала пробует прочитать этот закэшированный файл и только при его отсутствии/ошибке идёт в живой fetch к тому же API — так сайт не зависит от лимита запросов стороннего API на каждого посетителя.

Статистика языков (кнопка «Вся статистика») кэша не имеет — дёргает `api.github.com` напрямую при открытии панели (без токена, лимит 60 запросов/час с IP посетителя).

## 4. Деплой на GitHub Pages

1. Создай репозиторий на GitHub и запушь туда проект.
2. Поправь `base` в `vite.config.js` под имя своего репозитория:
   ```js
   base: '/<название-репозитория>/',
   ```
3. В **Settings → Actions → General → Workflow permissions** выбери **"Read and write permissions"** — без этого workflow'ы не смогут пушить в ветку `gh-pages` и коммитить кэш активности.
4. Запушь в `main` — сработает `.github/workflows/deploy.yaml`: соберёт проект и запушит `dist/` в ветку `gh-pages`.
5. **Settings → Pages** → Source: **Deploy from a branch** → ветка `gh-pages`, папка `/(root)` → Save.
6. Сайт появится на `https://<твой-логин>.github.io/<название-репозитория>/`.

Деплоить можно и вручную, без Actions: `npm run deploy` (пакет `gh-pages`) — соберёт и запушит `dist/` в `gh-pages` с твоей машины.

### ⚠️ Важно: не переключай Source на "GitHub Actions"

В Settings → Pages есть два режима: **"Deploy from a branch"** (то, что описано выше) и **"GitHub Actions"**. Этот проект настроен именно под первый вариант. Если по ошибке выбрать второй без соответствующего workflow (с `actions/upload-pages-artifact` + `actions/deploy-pages`) — деплои будут виснуть или конфликтовать друг с другом с ошибкой вида:

```
Error: Deployment request failed ... due to in progress deployment. Please cancel ... first or wait for it to complete.
```

Если это всё же случилось — сбрасывается через **Settings → Pages**: поставь Source в `None`, сохрани, подожди ~15 секунд, верни обратно на `gh-pages`/`root`, сохрани снова.

## 5. Локальная разработка

```bash
npm run dev       # http://localhost:5173
npm run build     # сборка в dist/
npm run preview   # локальный просмотр собранной версии
npm run lint      # oxlint
```

## Стек

- Vite + React 19
- react-markdown — рендерит контент из `public/content`
- particles.js — фон в шапке
- gh-pages — ручной деплой одной командой
- GitHub Actions — автодеплой + почасовое обновление кэша GitHub-активности
- autoprefixer — кроссбраузерные CSS-префиксы при сборке
