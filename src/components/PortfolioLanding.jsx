import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const POINT_COUNT = 1400
const FIELD_WIDTH = 1200
const FIELD_HEIGHT = 600
const FIELD_DEPTH = 600

export default function PortfolioLanding({ theme = 'light', onToggleTheme }) {
  const containerRef = useRef(null)
  const mouseRef = useRef(new THREE.Vector2(0, 0))
  const scrollRef = useRef(0)

  useEffect(() => {
    const isDark = theme === 'dark'
    const backgroundColor = isDark ? 0x000000 : 0xffffff
    const pointColor = isDark ? 0x60a5fa : 0x2563eb

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(backgroundColor)
    scene.fog = new THREE.Fog(backgroundColor, 200, 900)

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      2000
    )
    camera.position.set(0, 0, 550)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(POINT_COUNT * 3)
    const basePositions = new Float32Array(POINT_COUNT * 3)
    const velocities = new Float32Array(POINT_COUNT * 3)
    const circleTargets = new Float32Array(POINT_COUNT * 3)
    const circleSet = new Uint8Array(POINT_COUNT)

    for (let i = 0; i < POINT_COUNT; i++) {
      const i3 = i * 3
      const x = (Math.random() - 0.5) * FIELD_WIDTH
      const y = (Math.random() - 0.5) * FIELD_HEIGHT
      const z = (Math.random() - 0.5) * FIELD_DEPTH
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      basePositions[i3] = x
      basePositions[i3 + 1] = y
      basePositions[i3 + 2] = z
      velocities[i3] = (Math.random() - 0.5) * 0.064575
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.064575
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.064575
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: pointColor,
      size: 2.4,
      opacity: 0.8,
      transparent: true,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    const handleScroll = () => {
      scrollRef.current = window.scrollY || 0
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })

    let time = 0
    let animationId

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.001617

      const pos = geometry.attributes.position.array
      const scale = 1 + Math.sin(time) * 0.01

      const isNearText =
        Math.abs(mouseRef.current.x) < 0.4 && Math.abs(mouseRef.current.y) < 0.25

      if (isNearText) {
        const circleCount = Math.floor(POINT_COUNT * 0.6)
        if (circleSet[0] === 0) {
          for (let i = 0; i < POINT_COUNT; i++) {
            const i3 = i * 3
            circleSet[i] = i < circleCount ? 1 : 2
            if (circleSet[i] === 1) {
              const angle = (i / circleCount) * Math.PI * 2
              const width = 280
              const height = 170
              const centerX = 0
              const centerY = 25
              const x = Math.sin(angle) * width
              const y = Math.sin(angle) * Math.cos(angle) * height
              circleTargets[i3] = x + centerX
              circleTargets[i3 + 1] = y + centerY
              circleTargets[i3 + 2] = (Math.random() - 0.5) * 80
            }
          }
        }
      } else {
        circleSet.fill(0)
      }

      const mouseX = mouseRef.current.x * 300
      const mouseY = mouseRef.current.y * 200

      for (let i = 0; i < POINT_COUNT; i++) {
        const i3 = i * 3

        basePositions[i3] += velocities[i3]
        basePositions[i3 + 1] += velocities[i3 + 1]
        basePositions[i3 + 2] += velocities[i3 + 2]

        if (basePositions[i3] < -FIELD_WIDTH / 2 || basePositions[i3] > FIELD_WIDTH / 2) {
          velocities[i3] *= -1
        }
        if (basePositions[i3 + 1] < -FIELD_HEIGHT / 2 || basePositions[i3 + 1] > FIELD_HEIGHT / 2) {
          velocities[i3 + 1] *= -1
        }
        if (basePositions[i3 + 2] < -FIELD_DEPTH / 2 || basePositions[i3 + 2] > FIELD_DEPTH / 2) {
          velocities[i3 + 2] *= -1
        }

        const dx = basePositions[i3] - mouseX
        const dy = basePositions[i3 + 1] - mouseY
        const dist = Math.hypot(dx, dy)
        if (dist < 120 && dist > 0) {
          const push = (1 - dist / 120) * 0.6
          basePositions[i3] += (dx / dist) * push
          basePositions[i3 + 1] += (dy / dist) * push
        }

        if (circleSet[i] === 1) {
          pos[i3] += (circleTargets[i3] - pos[i3]) * 0.040425
          pos[i3 + 1] += (circleTargets[i3 + 1] - pos[i3 + 1]) * 0.040425
          pos[i3 + 2] += (circleTargets[i3 + 2] - pos[i3 + 2]) * 0.040425
        } else {
          const targetX = basePositions[i3] * scale
          const targetY = basePositions[i3 + 1] * scale
          const targetZ = basePositions[i3 + 2] * scale
          pos[i3] += (targetX - pos[i3]) * 0.04851
          pos[i3 + 1] += (targetY - pos[i3 + 1]) * 0.04851
          pos[i3 + 2] += (targetZ - pos[i3 + 2]) * 0.04851
        }
      }
      geometry.attributes.position.needsUpdate = true

      const targetX = mouseRef.current.x * 50
      const targetY = mouseRef.current.y * 30
      camera.position.x += (targetX - camera.position.x) * 0.024255
      camera.position.y += (targetY - camera.position.y) * 0.024255
      camera.lookAt(0, 0, 0)

      const fadeProgress = Math.min(1, scrollRef.current / window.innerHeight)
      material.opacity = 0.8 * (1 - fadeProgress)

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      if (animationId) cancelAnimationFrame(animationId)
      containerRef.current?.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [theme])

  const textColor = theme === 'dark' ? 'text-white' : 'text-black'
  const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const scrollColor = theme === 'dark' ? 'text-cyan-400' : 'text-blue-500'
  const backgroundClass = theme === 'dark' ? 'bg-black' : 'bg-white'

  const headingText = 'Hi, I am Amey'
  const leadText = 'Hi'
  const trailingText = headingText.slice(leadText.length)
  const letterDelayStep = 0.099
  const trailingStartDelay = leadText.length * letterDelayStep + 0.248

  return (
    <div className={`relative w-full h-screen overflow-hidden ${backgroundClass}`}>
      {/* Three.js canvas container */}
      <div ref={containerRef} className="absolute top-0 left-0 w-full h-full" />

      {/* Center content */}
      <div className="relative z-10 flex items-center justify-center h-full pointer-events-none">
        <div className="text-center">
          <h1 className={`text-[3.375rem] md:text-[5.4rem] font-semibold mb-4 tracking-tight ${textColor}`}>
            {leadText.split('').map((char, index) => (
              <span
                key={`lead-${char}-${index}`}
                className="letter-appear inline-block"
                style={{ animationDelay: `${index * letterDelayStep}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
            {trailingText.split('').map((char, index) => (
              <span
                key={`trail-${char}-${index}`}
                className="letter-appear inline-block"
                style={{ animationDelay: `${trailingStartDelay + index * letterDelayStep}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          {/* Scroll indicator */}
          <div className="mt-12 animate-bounce">
            <svg
              className={`w-6 h-6 mx-auto ${scrollColor}`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
