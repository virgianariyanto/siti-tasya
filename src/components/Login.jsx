import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth'

export default function Login({ onNavigate }) {
  const { login, isAuthenticated, adminCredentials } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  // If already authenticated as admin, automatically direct to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      onNavigate('dashboard')
    }
  }, [isAuthenticated, onNavigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errorMsg) setErrorMsg(null)
  }

  const handleQuickFill = () => {
    setFormData({
      email: adminCredentials?.email || 'admin@sititasya.com',
      password: adminCredentials?.password || 'admin123',
    })
    setErrorMsg(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    setTimeout(() => {
      const result = login(formData.email, formData.password)
      setIsLoading(false)

      if (result.success) {
        setSuccessMsg('Autentikasi berhasil! Mengalihkan ke Admin Studio Dashboard...')
        setTimeout(() => {
          onNavigate('dashboard')
        }, 600)
      } else {
        setErrorMsg(result.message)
      }
    }, 600)
  }

  return (
    <div className="min-h-screen py-16 px-margin-mobile md:px-margin-desktop flex items-center justify-center relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-tertiary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Studio Admin Greeting */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left space-y-6">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-primary font-bold hover:underline self-start group transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined transform group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span>Kembali ke Portofolio</span>
          </button>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-xs self-start shadow-sm font-bold">
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            <span>Studio Management Portal</span>
          </div>

          <h1 className="font-display-lg text-4xl lg:text-5xl text-primary leading-tight font-bold">
            Akses <span className="italic underline decoration-tertiary decoration-wavy">Admin</span> Studio
          </h1>

          <p className="font-body-lg text-on-surface-variant text-base lg:text-lg">
            Halaman masuk khusus pemilik studio untuk mengelola antrean proyek komisi, pesan klien, dan pembaruan portofolio ilustrasi.
          </p>

          {/* Quick Demo Info Box */}
          <div className="p-4 rounded-2xl bg-surface-container/80 border border-primary/20 backdrop-blur-sm relative space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase font-label-caps flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">key</span> Kredensial Default Admin
              </span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs font-bold text-primary underline hover:text-primary/80 cursor-pointer"
              >
                Isi Otomatis
              </button>
            </div>
            <p className="text-xs text-on-surface-variant font-mono bg-surface-container-lowest/80 p-2 rounded-xl border border-primary/10">
              Email: <span className="text-primary font-bold">admin@sititasya.com</span>
              <br />
              Sandi: <span className="text-primary font-bold">admin123</span>
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Login Form Card */}
        <div className="lg:col-span-7">
          <div className="sketchbook-frame bg-surface-container-lowest border-2 border-primary/15 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            
            {/* Form Header */}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-2xl">lock</span>
              </div>
              <h2 className="font-display-lg text-3xl font-bold text-on-surface">
                Masuk ke Panel Admin
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant mt-1">
                Masukkan kredensial administrator untuk melanjutkan
              </p>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="mb-5 p-4 rounded-2xl text-sm flex items-start gap-3 bg-error-container text-on-error-container border border-error/30 animate-shake">
                <span className="material-symbols-outlined text-xl shrink-0">error</span>
                <span className="font-body-md font-bold leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMsg && (
              <div className="mb-5 p-4 rounded-2xl text-sm flex items-start gap-3 bg-secondary-container text-on-secondary-container border border-secondary/30">
                <span className="material-symbols-outlined text-xl shrink-0">check_circle</span>
                <span className="font-body-md font-bold leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                  Alamat Email Admin
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                    mail
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@sititasya.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline/30 rounded-2xl text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                  Kata Sandi
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border border-outline/30 rounded-2xl text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors focus:outline-none cursor-pointer"
                    aria-label="Toggle Password Visibility"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Quick Fill Button */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">flash_on</span>
                  <span>Isi Otomatis Kredensial Admin</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold font-body-lg text-base storybook-button shadow-lg shadow-primary/25 flex items-center justify-center gap-2 hover:bg-primary/95 transition-all mt-4 disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Memvalidasi Akses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
