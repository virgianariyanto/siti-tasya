export default function Footer() {
  return (
    <footer className="relative mt-20 pt-32 pb-16 overflow-hidden">
      {/* Section Divider */}
      <div className="absolute top-0 left-0 w-full h-32 bg-surface-container-highest torn-edge transform -translate-y-1/2"></div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 border-b border-primary/10 pb-16">
          <span className="font-display-lg text-5xl text-primary italic font-bold">
            Siti Tasya
          </span>
          <div className="flex flex-wrap justify-center gap-10 font-body-lg text-lg">
            <a
              className="text-on-surface-variant hover:text-primary transition-colors hover:scale-110 transition-transform"
              href="#"
            >
              Instagram
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors hover:scale-110 transition-transform"
              href="#"
            >
              Twitter
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors hover:scale-110 transition-transform"
              href="#"
            >
              Behance
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors hover:scale-110 transition-transform"
              href="#"
            >
              Email
            </a>
          </div>
        </div>
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-body-md text-on-surface-variant text-center md:text-left text-lg">
            © 2024 Siti Tasya. Hand-drawn with love in Bekasi.
          </p>
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-sm">palette</span>
            <span className="font-label-caps">Crafted with magic</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
