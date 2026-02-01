import { useEffect, useRef, useState } from 'react'

const BLOCKS = [
  {
    title: 'Curious',
    body: 'I like to learn how things work and try new tools and ideas.',
    side: 'left',
  },
  {
    title: 'Ship fast',
    body: 'I focus on clarity and iteration so we can ship and learn.',
    side: 'right',
  },
  {
    title: 'Clear communication',
    body: 'I keep docs and feedback simple so teams stay aligned.',
    side: 'left',
  },
]

function getElementProgress(el) {
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  const h = window.innerHeight
  const start = h * 0.9
  const end = h * 0.6
  if (rect.top >= start) return 0
  if (rect.top <= end) return 1
  return Math.max(0, Math.min(1, (start - rect.top) / (start - end)))
}

const SLIDE_OFFSET = 80

export default function AboutSection({ theme }) {
  const blockRefs = useRef([])
  const [blockProgress, setBlockProgress] = useState([0, 0, 0])
  const rafRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const progress = blockRefs.current.map((el) => getElementProgress(el))
        setBlockProgress(progress)
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
  const accentColors = ['text-cyan-400', 'text-blue-400', 'text-violet-400']

  return (
    <section
      id="about"
      className={`relative z-10 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
    >
      <div className="mx-auto max-w-5xl px-6 py-28 md:py-44">
        <h2
          className={`text-center text-3xl font-semibold tracking-tight md:text-5xl ${textColor}`}
        >
          About me
        </h2>

        <div className="mt-14 flex flex-col gap-8 md:gap-14">
          {BLOCKS.map((block, index) => {
            const p = blockProgress[index]
            const fromLeft = block.side === 'left'
            const translateX = fromLeft
              ? -SLIDE_OFFSET * (1 - p)
              : SLIDE_OFFSET * (1 - p)
            return (
              <div
                key={block.title}
                ref={(el) => {
                  blockRefs.current[index] = el
                }}
                className={`max-w-2xl ${fromLeft ? 'mr-auto' : 'ml-auto'} ${fromLeft ? 'text-left' : 'text-right'}`}
                style={{
                  opacity: p,
                  transform: `translateX(${translateX}px)`,
                }}
              >
                <h3
                  className={`text-xl font-bold tracking-tight md:text-2xl ${accentColors[index]}`}
                >
                  {block.title}
                </h3>
                <p
                  className={`mt-3 text-base leading-relaxed md:text-lg ${subTextColor}`}
                >
                  {block.body}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
