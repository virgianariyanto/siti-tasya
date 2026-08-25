import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/useAuth'

export default function Login({ onNavigate }) {
  const { login, isAuthenticated } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [isCapsLockOn, setIsCapsLockOn] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  // Rate Limiting / Lockout states
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutSeconds, setLockoutSeconds] = useState(0)

  const passwordInputRef = useRef(null)

  // Direct to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      onNavigate('dashboard')
    }
  }, [isAuthenticated, onNavigate])

  // Lockout Countdown Timer
  useEffect(() => {
    let timer = null
    if (lockoutSeconds > 0) {
      timer = setInterval(() => {
        setLockoutSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setFailedAttempts(0)
            setErrorMsg(null)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [lockoutSeconds])

  // Trigger shake animation helper
  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 600)
  }

  // Live Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear general error when user types
    if (errorMsg) setErrorMsg(null)

    // Clear specific field error
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Detect Caps Lock state
  const handleKeyEvent = (e) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState('CapsLock'))
    }
  }

  // Validate form before submitting
  const validateForm = () => {
    const errors = { email: '', password: '' }
    let isValid = true

    // Email validation
    const emailValue = formData.email.trim()
    if (!emailValue) {
      errors.email = 'Alamat email admin wajib diisi.'
      isValid = false
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(emailValue)) {
        errors.email = 'Format email tidak valid (contoh: nama@domain.com).'
        isValid = false
      }
    }

    // Password validation
    const passwordValue = formData.password
    if (!passwordValue) {
      errors.password = 'Kata sandi wajib diisi.'
      isValid = false
    } else if (passwordValue.length < 6) {
      errors.password = 'Kata sandi minimal terdiri dari 6 karakter.'
      isValid = false
    }

    setFieldErrors(errors)
    return { isValid, errors }
  }

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()

    // If currently locked out, prevent submission
    if (lockoutSeconds > 0) {
      triggerShake()
      return
    }

    // Client-side validation check
    const { isValid } = validateForm()
    if (!isValid) {
      triggerShake()
      return
    }

    setIsLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const result = await login(formData.email, formData.password)
      setIsLoading(false)

      if (result.success) {
        setSuccessMsg('Autentikasi berhasil! Mengalihkan ke Admin Studio Dashboard...')
        setFailedAttempts(0)
        setTimeout(() => {
          onNavigate('dashboard')
        }, 500)
      } else {
        const nextAttempts = failedAttempts + 1
        setFailedAttempts(nextAttempts)
        triggerShake()

        if (nextAttempts >= 5) {
          setLockoutSeconds(30)
          setErrorMsg(
            'Terlalu banyak percobaan gagal berturut-turut. Akses ditangguhkan sementara selama 30 detik untuk keamanan.'
          )
        } else {
          setErrorMsg(
            result.message || 'Email atau kata sandi admin salah. Silakan periksa kembali kredensial Anda.'
          )
        }
      }
    } catch (err) {
      setIsLoading(false)
      triggerShake()
      setErrorMsg(err.message || 'Terjadi gangguan pada koneksi server. Silakan coba beberapa saat lagi.')
    }
  }

  const isLocked = lockoutSeconds > 0

  return (
    <div className="min-h-screen py-16 px-margin-mobile md:px-margin-desktop flex items-center justify-center relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-tertiary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Studio Admin Greeting & Security Info */}
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

          <p className="font-body-lg text-on-surface-variant text-base lg:text-lg leading-relaxed">
            Halaman masuk khusus pemilik studio untuk mengelola antrean project, pesan klien, dan pembaruan portofolio ilustrasi.
          </p>
        </div>

        {/* Right Column: Interactive Login Form Card */}
        <div className="lg:col-span-7">
          <div
            className={`sketchbook-frame bg-surface-container-lowest border-2 border-primary/15 rounded-3xl p-6 sm:p-10 shadow-2xl relative transition-all duration-300 ${
              isShaking ? 'animate-shake' : ''
            }`}
          >
            
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

            {/* Error Notification Alert */}
            {errorMsg && (
              <div
                className="mb-5 p-4 rounded-2xl text-sm flex items-start gap-3 bg-error-container text-on-error-container border border-error/30 animate-shake"
                role="alert"
              >
                <span className="material-symbols-outlined text-xl shrink-0 mt-0.5 text-error">
                  error
                </span>
                <div className="flex-1 space-y-1">
                  <p className="font-body-md font-bold leading-relaxed">{errorMsg}</p>
                  {failedAttempts > 0 && failedAttempts < 5 && (
                    <p className="text-xs opacity-90">
                      Percobaan gagal: <span className="font-bold">{failedAttempts}/5</span>
                      {failedAttempts >= 3 && ' (Periksa kembali email dan kata sandi Anda)'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Warning: Approaching Lockout Alert */}
            {failedAttempts >= 3 && failedAttempts < 5 && !isLocked && (
              <div className="mb-5 p-3.5 rounded-2xl text-xs flex items-center gap-2.5 bg-tertiary-fixed/40 text-on-tertiary-fixed-variant border border-tertiary/30">
                <span className="material-symbols-outlined text-lg shrink-0 text-tertiary">
                  warning
                </span>
                <span>
                  <strong>Peringatan Keamanan:</strong> Anda telah gagal {failedAttempts} kali. Sisa kesempatan sebelum akun terkunci sementara: <strong>{5 - failedAttempts} kali</strong>.
                </span>
              </div>
            )}

            {/* Lockout Notification with Countdown Bar */}
            {isLocked && (
              <div className="mb-5 p-4 rounded-2xl text-sm bg-error-container/80 text-on-error-container border-2 border-error/40 space-y-3">
                <div className="flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-xl animate-pulse text-error">
                    lock_clock
                  </span>
                  <span>Akses Terkunci Sementara ({lockoutSeconds} detik)</span>
                </div>
                <div className="w-full bg-error/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-error h-2 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(lockoutSeconds / 30) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs opacity-90">
                  Formulir dinonaktifkan sementara demi keamanan akun. Tombol akan aktif kembali secara otomatis.
                </p>
              </div>
            )}

            {/* Success Notification */}
            {successMsg && (
              <div className="mb-5 p-4 rounded-2xl text-sm flex items-start gap-3 bg-secondary-container text-on-secondary-container border border-secondary/30">
                <span className="material-symbols-outlined text-xl shrink-0 text-secondary">
                  check_circle
                </span>
                <span className="font-body-md font-bold leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email Input Field */}
              <div>
                <label
                  htmlFor="admin-email-input"
                  className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2"
                >
                  Alamat Email Admin
                </label>
                <div className="relative">
                  <span
                    className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                      fieldErrors.email ? 'text-error' : 'text-outline'
                    }`}
                  >
                    mail
                  </span>
                  <input
                    id="admin-email-input"
                    type="email"
                    name="email"
                    disabled={isLoading || isLocked}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@mail.com"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? 'email-error-msg' : undefined}
                    className={`w-full pl-12 pr-4 py-3.5 bg-surface-container-low border rounded-2xl text-on-surface focus:outline-none transition-all font-body-md text-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                      fieldErrors.email
                        ? 'border-error ring-2 ring-error/20 bg-error-container/10 focus:border-error focus:ring-error/30'
                        : 'border-outline/30 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                </div>
                {/* Email Field Error Message */}
                {fieldErrors.email && (
                  <p
                    id="email-error-msg"
                    className="mt-1.5 text-xs text-error font-bold flex items-center gap-1 animate-shake"
                  >
                    <span className="material-symbols-outlined text-sm">error</span>
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Input Field */}
              <div>
                <label
                  htmlFor="admin-password-input"
                  className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <span
                    className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                      fieldErrors.password ? 'text-error' : 'text-outline'
                    }`}
                  >
                    lock
                  </span>
                  <input
                    ref={passwordInputRef}
                    id="admin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    disabled={isLoading || isLocked}
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyEvent}
                    onKeyUp={handleKeyEvent}
                    placeholder="••••••••"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? 'password-error-msg' : undefined}
                    className={`w-full pl-12 pr-12 py-3.5 bg-surface-container-low border rounded-2xl text-on-surface focus:outline-none transition-all font-body-md text-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                      fieldErrors.password
                        ? 'border-error ring-2 ring-error/20 bg-error-container/10 focus:border-error focus:ring-error/30'
                        : 'border-outline/30 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
                    aria-label={showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {/* Caps Lock Alert Badge */}
                {isCapsLockOn && (
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-tertiary font-bold bg-tertiary-fixed/40 px-3 py-1 rounded-xl border border-tertiary/20 animate-shake">
                    <span className="material-symbols-outlined text-sm">keyboard_capslock</span>
                    <span>Caps Lock Aktif (perhatikan huruf besar dan kecil)</span>
                  </div>
                )}

                {/* Password Field Error Message */}
                {fieldErrors.password && (
                  <p
                    id="password-error-msg"
                    className="mt-1.5 text-xs text-error font-bold flex items-center gap-1 animate-shake"
                  >
                    <span className="material-symbols-outlined text-sm">error</span>
                    <span>{fieldErrors.password}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isLocked}
                className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold font-body-lg text-base storybook-button shadow-lg shadow-primary/25 flex items-center justify-center gap-2 hover:bg-primary/95 transition-all mt-4 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Memvalidasi Akses...</span>
                  </>
                ) : isLocked ? (
                  <>
                    <span className="material-symbols-outlined text-lg">lock_clock</span>
                    <span>Terkunci ({lockoutSeconds} detik)</span>
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
