import { useState } from 'react'
import { useContent } from '../context/useContent'
import { useAuth } from '../context/useAuth'

export default function Contact() {
  const { contact } = useContent()
  const { addInquiry } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: "Children's Book Series",
    budgetRange: 'Rp 10.000.000 - Rp 20.000.000',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return

    // Add inquiry to Auth/Admin system
    addInquiry({
      name: formData.name,
      email: formData.email,
      service: formData.service,
      budgetRange: formData.budgetRange,
      message: formData.message,
    })

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: '',
        email: '',
        service: "Children's Book Series",
        budgetRange: 'Rp 10.000.000 - Rp 20.000.000',
        message: '',
      })
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
            {contact?.sectionTitle || "Let's create something magical together"}
          </h2>
          <p className="font-body-lg text-2xl text-on-surface-variant leading-relaxed">
            {contact?.sectionSubtitle ||
              'Whether you have a book idea, a brand project, or just want to say hi, my inbox is always open for new adventures.'}
          </p>
          <div className="space-y-8 pt-4">
            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">mail</span>
              </div>
              <a
                href={`mailto:${contact?.email || 'hello@sititasya.com'}`}
                className="font-display-lg text-2xl hover:text-primary transition-colors"
              >
                {contact?.email || 'hello@sititasya.com'}
              </a>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">location_on</span>
              </div>
              <span className="font-display-lg text-2xl">
                {contact?.location || 'Bekasi, Indonesia'}
              </span>
            </div>
          </div>
          {contact?.socialLinks && contact.socialLinks.length > 0 && (
            <div className="flex gap-6 pt-10">
              {contact.socialLinks.map((social) => (
                <a
                  key={social.id || social.name}
                  className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center hand-drawn-border hover:bg-primary hover:text-white transition-all hover:-translate-y-2 shadow-lg font-bold text-xl"
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  title={social.name}
                >
                  <span>{social.label || social.name.slice(0, 2)}</span>
                </a>
              ))}
            </div>
          )}
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
                <p className="font-body-lg">
                  Terima kasih sudah menghubungi! Pesan Anda telah terkirim langsung ke inbox studio Siti Tasya.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block font-label-caps text-primary mb-2 tracking-[0.2em]">
                    NAMA LENGKAP
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/80 border-2 border-primary/5 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg"
                    placeholder="Nama Anda atau Penerbit"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-label-caps text-primary mb-2 tracking-[0.2em]">
                    ALAMAT EMAIL
                  </label>
                  <input
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/80 border-2 border-primary/5 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg"
                    placeholder="email@penerbit.com"
                    type="email"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-caps text-primary mb-2 tracking-[0.2em] text-xs font-bold">
                      LAYANAN ILUSTRASI
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-white/80 border-2 border-primary/5 rounded-2xl px-4 py-4 text-base focus:border-primary"
                    >
                      <option value="Children's Book Series">Children's Book Series</option>
                      <option value="Character Design & Sheet">Character Design</option>
                      <option value="Editorial & Book Cover">Editorial & Book Cover</option>
                      <option value="Packaging & Mascot">Packaging & Mascot</option>
                      <option value="Other Project">Lainnya / Diskusi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-caps text-primary mb-2 tracking-[0.2em] text-xs font-bold">
                      ESTIMASI ANGGARAN
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full bg-white/80 border-2 border-primary/5 rounded-2xl px-4 py-4 text-base focus:border-primary"
                    >
                      <option value="< Rp 5.000.000">&lt; Rp 5.000.000</option>
                      <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
                      <option value="Rp 10.000.000 - Rp 20.000.000">Rp 10.000.000 - Rp 20.000.000</option>
                      <option value="> Rp 20.000.000">&gt; Rp 20.000.000</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block font-label-caps text-primary mb-2 tracking-[0.2em]">
                    CERITAKAN PROYEK ANDA
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/80 border-2 border-primary/5 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg"
                    placeholder="Ceritakan tentang cerita, konsep, atau jumlah halaman ilustrasi yang Anda butuhkan..."
                    rows="4"
                  ></textarea>
                </div>
                <button
                  className="w-full bg-primary text-on-primary py-6 rounded-2xl storybook-button font-bold text-xl shadow-2xl shadow-primary/30 cursor-pointer"
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
