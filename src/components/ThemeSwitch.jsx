import { useTheme } from '../lang/ThemeContext'

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={`theme-switch${isDark ? ' theme-switch--dark' : ' theme-switch--light'}`}
      role="switch"
      aria-checked={isDark}
      aria-label="Theme"
      onClick={toggleTheme}
    >
      <span className="theme-switch__sky">
        <span className="theme-switch__star" />
        <span className="theme-switch__star" />
        <span className="theme-switch__star" />
        <span className="theme-switch__cloud" />
        <span className="theme-switch__cloud" />
        <span className="theme-switch__mountain" />
      </span>
      <span className="theme-switch__knob">
        {isDark ? (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M20.7 15.3A8.5 8.5 0 0 1 8.7 3.3a.75.75 0 0 0-.9-1 10 10 0 1 0 13.9 13.9.75.75 0 0 0-1-.9Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="4.5" />
            <path
              strokeLinecap="round"
              stroke="currentColor"
              strokeWidth="2"
              d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"
            />
          </svg>
        )}
      </span>
    </button>
  )
}
