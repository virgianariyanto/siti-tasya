import { useAuth } from '../context/useAuth'

export default function Navbar({ onNavigate, currentPage = 'home' }) {
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-primary/10 shadow-sm">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 md:py-5 max-w-container-max mx-auto">
        
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate && onNavigate('home')}
          className="font-display-lg text-2xl sm:text-3xl text-primary italic font-bold text-left cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span>Siti Tasya</span>
          {isAuthenticated && (
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-sans font-bold not-italic">
              Admin
            </span>
          )}
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 items-center font-body-lg text-base tracking-wide">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className={`transition-all relative group cursor-pointer font-bold ${
              currentPage === 'home' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Work
            <span
              className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform transition-transform ${
                currentPage === 'home' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}
            ></span>
          </button>

          <a
            className="text-on-surface-variant hover:text-primary transition-all relative group font-bold"
            href={currentPage === 'home' ? '#about' : '#'}
            onClick={() => currentPage !== 'home' && onNavigate && onNavigate('home')}
          >
            About
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </a>

          <a
            className="text-on-surface-variant hover:text-primary transition-all relative group font-bold"
            href={currentPage === 'home' ? '#services' : '#'}
            onClick={() => currentPage !== 'home' && onNavigate && onNavigate('home')}
          >
            Services
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </a>

          <a
            className="text-on-surface-variant hover:text-primary transition-all relative group font-bold"
            href={currentPage === 'home' ? '#contact' : '#'}
            onClick={() => currentPage !== 'home' && onNavigate && onNavigate('home')}
          >
            Contact
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </a>
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
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 rounded-full font-bold text-xs sm:text-sm text-primary hover:bg-primary/10 transition-all flex items-center gap-1.5 cursor-pointer border border-primary/20"
                title="Masuk ke portal admin"
              >
                <span className="material-symbols-outlined text-base">lock</span>
                <span>Admin</span>
              </button>

              <a
                href={currentPage === 'home' ? '#contact' : '#'}
                onClick={() => currentPage !== 'home' && onNavigate && onNavigate('home')}
                className="bg-primary text-on-primary px-5 sm:px-7 py-2 rounded-full storybook-button font-bold shadow-md shadow-primary/20 text-xs sm:text-sm inline-block"
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
