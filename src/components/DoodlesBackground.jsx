import { useEffect, useRef } from 'react'

export default function DoodlesBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const doodles = containerRef.current.querySelectorAll('.scribble-accent')
      const scrolled = window.pageYOffset
      doodles.forEach((doodle, index) => {
        const speed = 0.05 + index * 0.02
        const rotationSpeed = index % 2 === 0 ? 0.03 : -0.03
        doodle.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * rotationSpeed}deg)`
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <span className="material-symbols-outlined absolute top-40 left-[5%] text-4xl scribble-accent rotate-12">
        auto_awesome
      </span>
      <span className="material-symbols-outlined absolute top-1/4 right-[8%] text-6xl scribble-accent -rotate-45">
        potted_plant
      </span>
      <span className="material-symbols-outlined absolute bottom-1/3 left-[2%] text-8xl scribble-accent rotate-[150deg]">
        brush
      </span>
      <span className="material-symbols-outlined absolute bottom-20 right-[5%] text-5xl scribble-accent rotate-12">
        temp_preferences_custom
      </span>
      <span className="material-symbols-outlined absolute top-1/2 left-[10%] text-3xl scribble-accent">
        star_rate
      </span>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 watercolor-blob from-secondary-container"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] watercolor-blob from-primary-fixed"></div>
    </div>
  )
}
