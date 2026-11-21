import { useState } from 'react'
import SocialIcon from './SocialIcon'

const PLATFORMS = [
  {
    id: 'fastwork',
    name: 'Fastwork',
    category: 'Commission',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    iconBg: 'bg-[#00b4d8] text-white',
    description: 'Pesan komisi ilustrasi buku & karakter bergaransi aman.',
    url: 'https://fastwork.com/user/m5omgv',
    buttonText: 'Order via Fastwork',
    buttonClass: 'bg-primary text-on-primary hover:opacity-95 shadow-sm',
    highlightBadge: 'VERIFIED',
  },
  {
    id: 'drawmarket',
    name: 'Draw Market',
    category: 'Art Store',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    iconBg: 'bg-[#f97316] text-white',
    description: 'Toko art print, aset grafis & ilustrasi digital siap unduh.',
    url: 'https://draw.market/tasha',
    buttonText: 'Kunjungi Toko',
    buttonClass: 'bg-white text-primary border border-primary/20 hover:bg-primary/5',
  },
  {
    id: 'kofi',
    name: 'Ko-fi',
    category: 'Tip Jar',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    iconBg: 'bg-[#FF5E5B] text-white',
    description: 'Dukung karya independen, traktir kopi & dapatkan sketsa eksklusif.',
    url: 'https://ko-fi.com/tasya245',
    buttonText: 'Support on Ko-fi',
    buttonClass: 'bg-[#FF5E5B] text-white hover:bg-[#e44d4a] shadow-sm',
    highlightBadge: 'REWARDS',
  },
  {
    id: 'kirke',
    name: 'Kirke Social',
    category: 'Network',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    iconBg: 'bg-[#8b5cf6] text-white',
    description: 'Jejaring sosial kreatif untuk berbagi proses karya seni.',
    url: 'https://Kirke.social/tashaillustrates/card',
    buttonText: 'Ikuti di Kirke',
    buttonClass: 'bg-white text-primary border border-primary/20 hover:bg-primary/5',
  },
  {
    id: 'artstation',
    name: 'Artstation',
    category: 'Portfolio',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    iconBg: 'bg-[#13aff0] text-white',
    description: 'Galeri portofolio profesional & concept art resolusi tinggi.',
    url: 'https://www.artstation.com/tasya_illustrate8',
    buttonText: 'Buka Artstation',
    buttonClass: 'bg-white text-primary border border-primary/20 hover:bg-primary/5',
  },
  {
    id: 'twitter',
    name: 'Twitter (X)',
    category: 'Daily WIP',
    badgeColor: 'bg-stone-100 text-stone-800 border-stone-300',
    iconBg: 'bg-neutral-900 text-white',
    description: 'Sketsa santai harian, info slot komisi & update studio.',
    url: 'https://x.com/tashaillustrates',
    buttonText: 'Follow on X',
    buttonClass: 'bg-white text-primary border border-primary/20 hover:bg-primary/5',
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'Community',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    iconBg: 'bg-[#5865F2] text-white',
    description: 'Tambahkan username pinkpanther0696 untuk chat santai & diskusi proyek.',
    username: 'pinkpanther0696',
    url: 'https://discord.com',
    buttonText: 'Salin @pinkpanther0696',
    buttonClass: 'bg-white text-primary border border-primary/20 hover:bg-primary/5',
    isDiscord: true,
  },
]

export default function CreativeHub() {
  const [copiedDiscord, setCopiedDiscord] = useState(false)

  const handleCopyDiscord = (e) => {
    e.preventDefault()
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('pinkpanther0696')
    }
    setCopiedDiscord(true)
    setTimeout(() => setCopiedDiscord(false), 2500)
  }

  return (
    <section className="py-16 md:py-20 relative overflow-hidden" id="platforms">
      <div className="absolute inset-0 bg-primary/5 torn-edge pointer-events-none"></div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        {/* Compact Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-[11px] font-bold shadow-xs">
            <span className="material-symbols-outlined text-xs">hub</span>
            <span>CREATIVE PLATFORMS & MARKETPLACES</span>
          </div>
          <h2 className="text-mix text-2xl md:text-4xl text-primary leading-tight font-bold">
            Creative Hub & Marketplaces
          </h2>
          <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
            Pesan komisi resmi, belanja art print, dukung karya mandiri, atau terhubung di platform favorit Anda.
          </p>
        </div>

        {/* Compact Responsive Grid: 4 columns on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {PLATFORMS.map((item, index) => {
            const isLast = index === PLATFORMS.length - 1

            return (
              <div
                key={item.id}
                className={`bg-white p-5 rounded-2xl hand-drawn-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group ${
                  isLast ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  {/* Top Bar: Compact Icon, Name & Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                      >
                        <SocialIcon name={item.id} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display-lg text-base font-bold text-on-surface truncate">
                          {item.name}
                        </h3>
                        <span className="text-[10px] text-on-surface-variant font-medium block">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {item.highlightBadge && (
                      <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-caps">
                        {item.highlightBadge}
                      </span>
                    )}
                  </div>

                  {/* Concise Description */}
                  <p className="font-body-md text-on-surface-variant text-xs leading-relaxed mb-4 min-h-[32px]">
                    {item.description}
                  </p>
                </div>

                {/* Action Button: Direct URL or Copy for Discord */}
                <div>
                  {item.isDiscord ? (
                    <button
                      type="button"
                      onClick={handleCopyDiscord}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 storybook-button transition-all cursor-pointer ${
                        copiedDiscord
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : item.buttonClass
                      }`}
                      title="Klik untuk menyalin username Discord: pinkpanther0696"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {copiedDiscord ? 'check' : 'content_copy'}
                      </span>
                      <span>
                        {copiedDiscord ? 'Username Tersalin! ✓' : 'Salin @pinkpanther0696'}
                      </span>
                    </button>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 storybook-button transition-all cursor-pointer ${item.buttonClass}`}
                    >
                      <span>{item.buttonText}</span>
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
