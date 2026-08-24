import { useState, useEffect } from 'react'
import AuthProvider from './context/AuthContext'
import ContentProvider from './context/ContentContext'
import { useAuth } from './context/useAuth'
import DoodlesBackground from './components/DoodlesBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Login from './components/Login'
import AdminDashboard from './components/AdminDashboard'

function AppContent() {
  const { isAuthenticated } = useAuth()

  const getInitialPage = () => {
    const path = window.location.pathname.toLowerCase()
    if (path.startsWith('/admin') || path.startsWith('/dashboard')) {
      return 'dashboard'
    }
    if (path.startsWith('/login')) {
      return 'login'
    }
    return 'home'
  }

  const [currentPage, setCurrentPage] = useState(getInitialPage)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Protected route check
  useEffect(() => {
    if (currentPage === 'dashboard' && !isAuthenticated) {
      setCurrentPage('login')
      if (window.location.pathname !== '/login') {
        window.history.pushState({}, '', '/login')
      }
    }
  }, [currentPage, isAuthenticated])

  const handleNavigate = (page) => {
    // Check if trying to access protected dashboard without login
    if (page === 'dashboard' && !isAuthenticated) {
      setCurrentPage('login')
      if (window.location.pathname !== '/login') {
        window.history.pushState({}, '', '/login')
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setCurrentPage(page)
    let targetPath = '/'
    if (page === 'login') targetPath = '/login'
    if (page === 'dashboard') targetPath = '/admin'

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      <DoodlesBackground />
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      
      {currentPage === 'login' ? (
        <main>
          <Login onNavigate={handleNavigate} />
        </main>
      ) : currentPage === 'dashboard' ? (
        <main>
          <AdminDashboard onNavigate={handleNavigate} />
        </main>
      ) : (
        <main>
          <Hero />
          <About />
          <Services />
          <Gallery />
          <Testimonials />
          <Contact />
        </main>
      )}

      {currentPage === 'home' && <Footer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <AppContent />
      </ContentProvider>
    </AuthProvider>
  )
}

export default App
