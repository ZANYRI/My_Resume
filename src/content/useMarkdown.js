import { useEffect, useState } from 'react'

export function useMarkdownFile(path) {
  const [text, setText] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch(path)
      .then((res) => (res.ok ? res.text() : ''))
      .then((body) => {
        if (!cancelled) setText(body)
      })
      .catch(() => {
        if (!cancelled) setText('')
      })
    return () => {
      cancelled = true
    }
  }, [path])

  return text
}

export function linesOf(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}
