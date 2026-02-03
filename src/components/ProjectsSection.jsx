import { useState, useRef, useCallback, useEffect } from 'react'
import { content } from '../data/content.js'

const projects = content.projects
const n = projects.length

function getProject(index) {
  return projects[((index % n) + n) % n]
}

const POSITIONS = {
  farLeft: {
    transform: 'translate(-50%, -50%) translateX(-250%) translateZ(-200px) rotateY(35deg)',
    zIndex: 0,
    opacity: 0,
  },
  offLeft: {
    transform: 'translate(-50%, -50%) translateX(-200%) translateZ(-100px) rotateY(30deg)',
    zIndex: 1,
    opacity: 0,
  },
  left: {
    transform: 'translate(-50%, -50%) translateX(-120%) translateZ(40px) rotateY(25deg)',
    zIndex: 2,
    opacity: 0.9,
  },
  center: {
    transform: 'translate(-50%, -50%) translateX(0) translateZ(-60px) rotateY(0deg)',
    zIndex: 1,
    opacity: 1,
  },
  right: {
    transform: 'translate(-50%, -50%) translateX(120%) translateZ(40px) rotateY(-25deg)',
    zIndex: 2,
    opacity: 0.9,
  },
  offRight: {
    transform: 'translate(-50%, -50%) translateX(200%) translateZ(-100px) rotateY(-30deg)',
    zIndex: 1,
    opacity: 0,
  },
  farRight: {
    transform: 'translate(-50%, -50%) translateX(250%) translateZ(-200px) rotateY(-35deg)',
    zIndex: 0,
    opacity: 0,
  },
}

const DURATION_MS = 500

// 5 slots: [offLeft, left, center, right, offRight] so a card can enter from left or right
const REST_SLOTS = ['offLeft', 'left', 'center', 'right', 'offRight']
// Move right: offLeft→farLeft, left→offLeft, center→left, right→center, offRight→right
const NEXT_SLOTS = ['farLeft', 'offLeft', 'left', 'center', 'right']
// Move left: offLeft→left, left→center, center→right, right→offRight, offRight→farRight
const PREV_SLOTS = ['left', 'center', 'right', 'offRight', 'farRight']

export default function ProjectsSection({ theme }) {
  const initialCenterIndex = projects.findIndex((p) => p.name === 'Climate Resilience Decision Dashboard')
  const [activeIndex, setActiveIndex] = useState(initialCenterIndex >= 0 ? initialCenterIndex : 0)
  const [slotPositions, setSlotPositions] = useState(REST_SLOTS)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [noTransition, setNoTransition] = useState(false)
  const timeoutRef = useRef(null)
  const sectionRef = useRef(null)
  const wheelAccumRef = useRef(0)
  const isTransitioningRef = useRef(false)
  const touchStartXRef = useRef(null)

  const textColor = theme === 'dark' ? 'text-white' : 'text-black'
  const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-white/[0.06]' : 'bg-gray-50'
  const cardBorder = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const pillBg = theme === 'dark' ? 'bg-white/10' : 'bg-black/5'
  const pillText = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const accentColor = theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'

  // Spotlight colors
  const spotlightGradient = theme === 'dark'
    ? 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.08) 40%, transparent 70%)'
    : 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%)'

  const goNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSlotPositions(NEXT_SLOTS)
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % n)
      setNoTransition(true)
      setSlotPositions(REST_SLOTS)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setNoTransition(false)
          setIsTransitioning(false)
        })
      })
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }, DURATION_MS)
  }, [isTransitioning])

  const goPrev = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSlotPositions(PREV_SLOTS)
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((i) => (i - 1 + n) % n)
      setNoTransition(true)
      setSlotPositions(REST_SLOTS)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setNoTransition(false)
          setIsTransitioning(false)
        })
      })
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }, DURATION_MS)
  }, [isTransitioning])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    isTransitioningRef.current = isTransitioning
  }, [isTransitioning])

  // Horizontal trackpad / wheel scroll over cards: swipe left = next, swipe right = prev
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const WHEEL_THRESHOLD = 60
    const handleWheel = (e) => {
      const dx = e.deltaX
      // Only handle horizontal scroll; ignore vertical so page can still scroll
      if (Math.abs(dx) < 1) return
      // Prevent browser back/forward gesture when user is swiping horizontally over projects
      e.preventDefault()
      if (isTransitioningRef.current) {
        wheelAccumRef.current = 0
        return
      }
      // Reset accumulation when scroll direction changes
      if (dx > 0 && wheelAccumRef.current < 0) wheelAccumRef.current = 0
      if (dx < 0 && wheelAccumRef.current > 0) wheelAccumRef.current = 0
      wheelAccumRef.current += dx
      // Swipe left (negative deltaX) = prev; swipe right (positive deltaX) = next
      if (wheelAccumRef.current <= -WHEEL_THRESHOLD) {
        wheelAccumRef.current += WHEEL_THRESHOLD
        goPrev()
      } else if (wheelAccumRef.current >= WHEEL_THRESHOLD) {
        wheelAccumRef.current -= WHEEL_THRESHOLD
        goNext()
      }
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [goNext, goPrev])

  // Touch swipe on mobile: swipe left = next, swipe right = prev
  const SWIPE_THRESHOLD = 50
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const handleTouchStart = (e) => {
      touchStartXRef.current = e.touches[0].clientX
    }
    const handleTouchEnd = (e) => {
      if (touchStartXRef.current == null) return
      if (isTransitioningRef.current) {
        touchStartXRef.current = null
        return
      }
      const endX = e.changedTouches[0].clientX
      const delta = endX - touchStartXRef.current
      touchStartXRef.current = null
      if (delta < -SWIPE_THRESHOLD) goNext()
      else if (delta > SWIPE_THRESHOLD) goPrev()
    }
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [goNext, goPrev])

  const slotContents = [
    getProject(activeIndex - 2),
    getProject(activeIndex - 1),
    getProject(activeIndex),
    getProject(activeIndex + 1),
    getProject(activeIndex + 2),
  ]

  return (
    <section ref={sectionRef} id="projects" className="relative py-28 md:py-44">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          className={`text-center text-3xl font-semibold tracking-tight md:text-5xl mb-16 ${textColor}`}
        >
          Projects
        </h2>

        <div
          className="relative flex justify-center items-center overflow-visible h-[320px] sm:h-[380px] md:h-[420px]"
          style={{
            perspective: '1200px',
            perspectiveOrigin: 'center center',
          }}
        >
          {/* Spotlight glow beneath center card */}
          <div
            className="absolute pointer-events-none w-[90vw] max-w-[500px] h-[200px] sm:h-[250px] md:h-[300px] bottom-[-10px] left-1/2 -translate-x-1/2 blur-[20px] z-0"
            style={{
              background: spotlightGradient,
            }}
          />

          {slotContents.map((project, slotIndex) => {
            const posKey = slotPositions[slotIndex]
            const pos = POSITIONS[posKey]
            const isLeft = posKey === 'left'
            const isRight = posKey === 'right'
            const isSide = isLeft || isRight
            const isVisible = posKey !== 'farLeft' && posKey !== 'offLeft' && posKey !== 'offRight' && posKey !== 'farRight'

            return (
              <div
                key={`slot-${slotIndex}-${project.id}`}
                role={isSide ? 'button' : undefined}
                tabIndex={isSide ? 0 : undefined}
                onClick={isSide ? (isLeft ? goPrev : goNext) : undefined}
                onKeyDown={(e) => {
                  if (!isSide) return
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    isLeft ? goPrev() : goNext()
                  }
                }}
                className={`absolute w-[320px] md:w-[380px] rounded-2xl border ${cardBorder} ${cardBg} p-6 md:p-8 shadow-xl ${isSide ? 'cursor-pointer select-none' : ''}`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: pos.transform,
                  zIndex: pos.zIndex,
                  opacity: pos.opacity,
                  transformStyle: 'preserve-3d',
                  transition: noTransition
                    ? 'none'
                    : `transform ${DURATION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${DURATION_MS}ms ease-out`,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
              >
                <h3
                  className={`text-lg md:text-xl font-bold tracking-tight ${accentColor}`}
                >
                  {project.name}
                </h3>
                <p
                  className={`mt-3 text-sm md:text-base leading-relaxed ${subTextColor}`}
                >
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${pillBg} ${pillText}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-4">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`inline-flex items-center gap-1.5 text-sm font-medium ${accentColor} hover:underline`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`inline-flex items-center gap-1.5 text-sm font-medium ${accentColor} hover:underline`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                      Live
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={isTransitioning}
            aria-label="Previous project"
            className={`p-2 rounded-full border ${cardBorder} ${cardBg} ${textColor} hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={isTransitioning}
            aria-label="Next project"
            className={`p-2 rounded-full border ${cardBorder} ${cardBg} ${textColor} hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
