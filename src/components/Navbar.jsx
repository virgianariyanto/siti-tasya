import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth'

export default function Navbar({ onNavigate, currentPage = 'home' }) {
  const { isAuthenticated, logout, user } = useAuth()
  const [activeSection, setActiveSection] = useState('work')

  // ScrollSpy to track active section in viewport
  useEffect(() => {
    if (currentPage !== 'home') return

    const handleScroll = () => {
      // Check if user is near bottom of the page (activates Contact)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        setActiveSection('contact')
        return
      }

      // If near the top (Hero / top area), default to 'work'
      if (window.scrollY < 300) {
        setActiveSection('work')
        return
      }

      // Check sections from bottom to top in visual order
      const sections = [
        { id: 'contact', el: document.getElementById('contact') },
        { id: 'work', el: document.getElementById('work') },
        { id: 'services', el: document.getElementById('services') },
        { id: 'about', el: document.getElementById('about') },
      ]

      const scrollPosition = window.scrollY + 250 // Offset for header sightline

      for (const section of sections) {
        if (section.el) {
          const top = section.el.offsetTop
          if (scrollPosition >= top) {
            setActiveSection(section.id)
            return
          }
        }
      }

      setActiveSection('work')
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentPage])

  // Smooth scroll handler
  const handleNavClick = (e, sectionId) => {
    e.preventDefault()

    if (currentPage !== 'home') {
      if (onNavigate) onNavigate('home')
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 100)
    } else {
      if (sectionId === 'work' && window.scrollY < 400) {
        // If clicking Work while near top, scroll to gallery or top
        const el = document.getElementById('work')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } else {
        const el = document.getElementById(sectionId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        } else if (sectionId === 'work') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    }
  }

  const navItems = [
    { id: 'work', label: 'Work', href: '#work' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-primary/10 shadow-sm">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 md:py-5 max-w-container-max mx-auto">
        
        {/* Brand Logo */}
        <button
          onClick={() => {
            if (currentPage !== 'home' && onNavigate) {
              onNavigate('home')
            }
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="font-display-lg text-2xl sm:text-3xl text-primary italic font-bold text-left cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span>Siti Tasya</span>
          {isAuthenticated && (
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-sans font-bold not-italic">
              Admin
            </span>
          )}
        </button>

        {/* Navigation Links with dynamic active state */}
        <div className="hidden md:flex gap-8 items-center font-body-lg text-base tracking-wide">
          {navItems.map((item) => {
            const isActive = currentPage === 'home' && activeSection === item.id

            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`transition-all relative group cursor-pointer font-bold ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                ></span>
              </a>
            )
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-4 py-2 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentPage === 'dashboard'
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                <span>{user?.avatar || '🎨'}</span>
                <span className="hidden sm:inline">Dashboard Studio</span>
                <span className="sm:hidden">Admin</span>
              </button>

              <button
                onClick={() => {
                  logout()
                  onNavigate('home')
                }}
                className="p-2 sm:px-3 sm:py-2 rounded-full text-xs font-bold text-outline hover:text-error hover:bg-error-container/30 transition-colors flex items-center gap-1 cursor-pointer"
                title="Keluar dari sesi admin"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="bg-primary text-on-primary px-5 sm:px-7 py-2 rounded-full storybook-button font-bold shadow-md shadow-primary/20 text-xs sm:text-sm inline-block cursor-pointer"
              >
                Hire Me
              </a>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}
