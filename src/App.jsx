import { useEffect, useState } from 'react'
import PortfolioLanding from './components/PortfolioLanding.jsx'
import Terminal from './components/Terminal.jsx'

/**
 * Main App Component
 * Portfolio landing with particle bracket effect.
 */
export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    const storedTheme = window.localStorage?.getItem('theme')
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme
    }
    if (!window.matchMedia) return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })
  const [showTerminal, setShowTerminal] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isToggleTerminal = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      if (isToggleTerminal) {
        event.preventDefault()
        setShowTerminal((prev) => !prev)
        return
      }
      if (event.key === 'Escape') {
        setShowTerminal(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedTheme = window.localStorage?.getItem('theme')
    if (storedTheme === 'light' || storedTheme === 'dark') return
    if (!window.matchMedia) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => {
      setTheme(event.matches ? 'dark' : 'light')
    }
    if (media.addEventListener) {
      media.addEventListener('change', handleChange)
      return () => media.removeEventListener('change', handleChange)
    }
    media.addListener(handleChange)
    return () => media.removeListener(handleChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    window.localStorage?.setItem('theme', theme)
  }, [theme])

  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative">
      <PortfolioLanding theme={theme} onToggleTheme={handleToggleTheme} />

      {showTerminal && (
        <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-sm">
          <div className="absolute inset-6 rounded-lg overflow-hidden border border-white/10 bg-[#1e1e1e]">
            <Terminal />
          </div>
          <div className="absolute top-6 right-6 text-xs text-white/70">
            Press Esc or Command+K to close
          </div>
        </div>
      )}
    </div>
  )
}
