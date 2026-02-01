import { useEffect, useRef, useState } from 'react'

function getSectionProgress(el) {
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  const h = window.innerHeight
  const start = h * 0.75
  const end = h * 0.25
  if (rect.top >= start) return 0
  if (rect.top <= end) return 1
  return Math.max(0, Math.min(1, (start - rect.top) / (start - end)))
}

export default function WorkSection({ theme, pageBackground }) {
  const sectionRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setScrollProgress(getSectionProgress(el))
        rafRef.current = null
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const textColor = theme === 'dark' ? 'text-white' : 'text-black'
  const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const opacity = Math.max(0, Math.min(1, scrollProgress * 1.2))
  const translateY = 24 * (1 - scrollProgress)

  return (
    <section
      id="work"
      ref={sectionRef}
      className={`relative z-10 min-h-[120vh] ${pageBackground}`}
    >
      <div
        className="mx-auto max-w-4xl px-6 py-24 md:py-32"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <h2
          className={`text-2xl md:text-3xl font-semibold tracking-tight ${textColor}`}
        >
          More about the work
        </h2>
        <p className={`mt-6 text-base md:text-lg ${subTextColor}`}>
          This space is intentionally long to let the landing experience breathe.
          The hero stays centered while the particles fade out as you scroll,
          creating a gentle transition into the rest of the page.
        </p>
        <p className={`mt-6 text-base md:text-lg ${subTextColor}`}>
          You can replace this copy with project highlights, featured case
          studies, or anything else you want to showcase below the hero.
        </p>
      </div>
    </section>
  )
}
