# Резюме

Мой сайт-резюме. Vite + React, без бэкенда — весь контент лежит в markdown/json в `public/content` и подтягивается через `fetch()` прямо в браузере. Захотел поправить текст резюме — правишь файл и коммитишь, пересобирать сайт не надо.

Есть RU/EN переключатель и светлая/тёмная тема (тумблеры в шапке, тема запоминается в localStorage).

## Архитектура

Весь текст — в `public/content/`, без единого файла: RU и EN разнесены по отдельным файлам, чтобы не городить переводы прямо в JSX.

```
public/content/
  profile.ru.md / profile.en.md        имя, роль, город (3 строки)
  about.ru.md / about.en.md            блок "о себе" + буллеты
  experience.ru.md / experience.en.md  опыт работы, формат ниже
  education.ru.md / education.en.md    образование, по одной записи на строку
  skills.md                            хард-скиллы (один файл, без языка — это термины)
  soft-skills.ru.md / soft-skills.en.md
  projects.json                        карточки проектов
  articles.json                        список статей (сейчас пустой)
  articles/                            .md-файлы самих статей
```

## Стек

- Vite + React 19
- react-markdown — рендерит контент из `public/content`
- particles.js — фон в шапке
- gh-pages — деплой одной командой
- autoprefixer — кроссбраузерные префиксы при сборке

## Ссылка на резюме: https://zanyri.github.io/My_Resume/
