import { useContent } from '../context/useContent'

export default function Footer() {
  const { footer, contact } = useContent()

  const links = footer?.footerLinks || [
    { id: 'f1', label: 'Instagram', url: '#' },
    { id: 'f2', label: 'Twitter', url: '#' },
    { id: 'f3', label: 'Behance', url: '#' },
    { id: 'f4', label: 'Email', url: `mailto:${contact?.email || 'hello@sititasya.com'}` },
  ]

  return (
    <footer className="relative mt-20 pt-32 pb-16 overflow-hidden">
      {/* Section Divider */}
      <div className="absolute top-0 left-0 w-full h-32 bg-surface-container-highest torn-edge transform -translate-y-1/2"></div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 border-b border-primary/10 pb-16">
          <span className="font-display-lg text-5xl text-primary italic font-bold">
            {footer?.brandName || 'Siti Tasya'}
          </span>
          <div className="flex flex-wrap justify-center gap-10 font-body-lg text-lg">
            {links.map((link) => (
              <a
                key={link.id || link.label}
                className="text-on-surface-variant hover:text-primary transition-all hover:scale-110"
                href={link.url}
                target={link.url?.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-body-md text-on-surface-variant text-center md:text-left text-lg">
            {footer?.copyright || '© 2024 Siti Tasya. Hand-drawn with love in Bekasi.'}
          </p>
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-sm">palette</span>
            <span className="font-label-caps">{footer?.craftBadge || 'Crafted with magic'}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
