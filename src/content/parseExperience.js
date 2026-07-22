export function parseExperience(text) {
  return text
    .split(/\n(?=###\s)/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
      const title = lines[0].replace(/^###\s*/, '')
      const [company, period] = (lines[1] ?? '').split('|').map((part) => part.trim())
      const bullets = lines.slice(2).map((line) => line.replace(/^-\s*/, ''))
      return { title, company, period, bullets }
    })
}
