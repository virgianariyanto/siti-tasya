import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 4000)
  }

  return (
    <section
      className="py-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden"
      id="contact"
    >
      <div className="asymmetric-grid gap-16 items-start">
        <div className="col-span-12 lg:col-span-6 space-y-10">
          <h2 className="text-mix text-display-lg-mobile md:text-7xl text-primary leading-[1.1]">
            Let's <span>create</span> something <span>magical</span> together
          </h2>
          <p className="font-body-lg text-2xl text-on-surface-variant leading-relaxed">
            Whether you have a book idea, a brand project, or just want to say hi, my inbox is always open for new adventures.
          </p>
          <div className="space-y-8 pt-4">
            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">mail</span>
              </div>
              <span className="font-display-lg text-2xl">hello@sititasya.com</span>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">location_on</span>
              </div>
              <span className="font-display-lg text-2xl">Bekasi, Indonesia</span>
            </div>
          </div>
          <div className="flex gap-6 pt-10">
            <a
              className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center hand-drawn-border hover:bg-primary hover:text-white transition-all hover:-translate-y-2 shadow-lg"
              href="#"
            >
              <span className="font-bold text-xl">In</span>
            </a>
            <a
              className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center hand-drawn-border hover:bg-primary hover:text-white transition-all hover:-translate-y-2 shadow-lg"
              href="#"
            >
              <span className="font-bold text-xl">Ig</span>
            </a>
            <a
              className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center hand-drawn-border hover:bg-primary hover:text-white transition-all hover:-translate-y-2 shadow-lg"
              href="#"
            >
              <span className="font-bold text-xl">Be</span>
            </a>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 relative">
          <div className="absolute -top-12 -right-12 w-48 h-48 watercolor-blob from-tertiary-fixed rotate-45 -z-10"></div>
          <form
            onSubmit={handleSubmit}
            className="bg-primary/5 p-10 md:p-16 rounded-[60px] hand-drawn-border space-y-8 relative backdrop-blur-sm"
          >
            {submitted ? (
              <div className="p-8 bg-secondary-container text-on-secondary-container rounded-3xl text-center space-y-3">
                <span className="material-symbols-outlined text-5xl">auto_awesome</span>
                <h3 className="font-display-lg text-2xl font-bold">Magic Sent! ✨</h3>
                <p className="font-body-lg">Thank you for reaching out! I'll get back to you very soon.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block font-label-caps text-primary mb-2 tracking-[0.2em]">
                    NAME
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/80 border-2 border-primary/5 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg"
                    placeholder="Your name"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-label-caps text-primary mb-2 tracking-[0.2em]">
                    EMAIL
                  </label>
                  <input
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/80 border-2 border-primary/5 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg"
                    placeholder="Your email address"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-label-caps text-primary mb-2 tracking-[0.2em]">
                    MESSAGE
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/80 border-2 border-primary/5 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg"
                    placeholder="Tell me about your magic project..."
                    rows="5"
                  ></textarea>
                </div>
                <button
                  className="w-full bg-primary text-on-primary py-6 rounded-2xl storybook-button font-bold text-xl shadow-2xl shadow-primary/30"
                  type="submit"
                >
                  Send Magic ✨
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
