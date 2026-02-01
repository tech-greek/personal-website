import { useEffect, useState, useCallback } from 'react'
import PortfolioLanding from './components/PortfolioLanding.jsx'
import AboutSection from './components/AboutSection.jsx'
import ProjectsSection from './components/ProjectsSection.jsx'
import WorkSection from './components/WorkSection.jsx'
import Terminal from './components/Terminal.jsx'

function smoothScrollTo(targetY, duration = 1400) {
  const startY = window.scrollY
  const diff = targetY - startY
  if (Math.abs(diff) < 1) return
  let startTime = null
  let rafId = null

  // Smooth ease-out curve for a gentle deceleration
  const ease = (t) => 1 - Math.pow(1 - t, 4)

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = ease(progress)
    window.scrollTo({ top: startY + diff * easedProgress, behavior: 'instant' })
    if (progress < 1) {
      rafId = requestAnimationFrame(step)
    }
  }
  rafId = requestAnimationFrame(step)
}

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

  const handleNavClick = useCallback((e) => {
    const href = e.currentTarget.getAttribute('href')
    if (href && href.startsWith('#')) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY
        smoothScrollTo(y, 1200)
      }
    }
  }, [])

  const pageBackground = theme === 'dark' ? 'bg-black' : 'bg-white'
  const navText = theme === 'dark' ? 'text-white/90' : 'text-black/90'
  const navBorder = theme === 'dark' ? 'border-white/10' : 'border-black/10'
  const navBg = theme === 'dark' ? 'bg-black/50' : 'bg-white/70'
  const navHover = theme === 'dark' ? 'hover:text-white' : 'hover:text-black'
  const toggleStyles =
    theme === 'dark'
      ? 'bg-white/10 text-white hover:bg-white/20'
      : 'bg-black/5 text-black hover:bg-black/10'

  return (
    <div className={`min-h-screen w-full flex flex-col relative ${pageBackground}`}>
      <nav
        className={`fixed top-6 left-1/2 z-20 w-[min(680px,90vw)] -translate-x-1/2 rounded-full border ${navBorder} ${navBg} ${navText} backdrop-blur-md`}
      >
        <div className="flex items-center justify-between px-6 py-3 text-sm">
          <div className="flex items-center gap-6">
            <a href="#about" onClick={handleNavClick} className={`transition-colors ${navHover}`}>
              About
            </a>
            <a href="#projects" onClick={handleNavClick} className={`transition-colors ${navHover}`}>
              Projects
            </a>
            <a href="#experience" onClick={handleNavClick} className={`transition-colors ${navHover}`}>
              Experience
            </a>
            <a href="#contact" onClick={handleNavClick} className={`transition-colors ${navHover}`}>
              Contact
            </a>
            <button
              type="button"
              onClick={handleToggleTheme}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${toggleStyles}`}
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      </nav>

      <div id="top">
        <PortfolioLanding theme={theme} onToggleTheme={handleToggleTheme} />
      </div>

      <AboutSection theme={theme} />

      <ProjectsSection theme={theme} />

      <WorkSection theme={theme} pageBackground={pageBackground} />

      {showTerminal && (
        <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm">
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
