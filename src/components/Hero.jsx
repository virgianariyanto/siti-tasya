import { useContent } from '../context/useContent'

export default function Hero() {
  const { hero } = useContent()

  return (
    <header className="relative pt-40 pb-20 md:pt-56 md:pb-36 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="asymmetric-grid gap-y-12 items-center">
        {/* Left Column - Content */}
        <div className="col-span-12 lg:col-span-7 z-10 space-y-8 lg:pr-10">
          {/* Status Badge */}
          {hero.statusBadge && (
            <div className="inline-flex items-center gap-3 bg-secondary-container/80 backdrop-blur-sm text-on-secondary-container px-5 py-2.5 rounded-full text-label-caps pulse-badge font-bold">
              <span className="w-2.5 h-2.5 bg-secondary rounded-full"></span>
              {hero.statusBadge}
            </div>
          )}

          {/* Main Headline */}
          <div>
            <h1 className="text-mix text-display-lg-mobile md:text-display-lg text-primary mb-6 leading-[1.1]">
              {hero.titleName || 'Siti Tasya'}, <br />
              <span>{hero.titleRole || 'Illustrator'}</span> based in <br />
              <span>{hero.titleCity || 'Bekasi'}</span>, {hero.titleCountry || 'Indonesia'}
            </h1>
            <p className="font-body-lg text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed">
              {hero.subtitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-6 pt-2">
            <a
              className="bg-primary text-on-primary px-10 py-5 rounded-2xl storybook-button font-bold text-lg shadow-xl shadow-primary/20"
              href={hero.btn1Link || '#work'}
            >
              {hero.btn1Text || 'View My Work'}
            </a>
            <a
              className="bg-white/60 backdrop-blur-sm text-primary px-10 py-5 rounded-2xl storybook-button font-bold text-lg border-2 border-primary/20"
              href={hero.btn2Link || '#contact'}
            >
              {hero.btn2Text || 'Hire Me'}
            </a>
          </div>

          {/* Key Stats Counter */}
          <div className="pt-8 border-t border-primary/10 flex items-center gap-12 max-w-md">
            <div>
              <p className="font-display-lg text-3xl text-primary font-bold">{hero.stat1Value || '50+'}</p>
              <p className="text-xs font-body-md text-on-surface-variant uppercase tracking-wider font-semibold">
                {hero.stat1Label || 'Books Illustrated'}
              </p>
            </div>
            <div>
              <p className="font-display-lg text-3xl text-primary font-bold">{hero.stat2Value || '120+'}</p>
              <p className="text-xs font-body-md text-on-surface-variant uppercase tracking-wider font-semibold">
                {hero.stat2Label || 'Character Designs'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Overlapping Hero Image */}
        <div className="col-span-12 lg:col-span-5 relative mt-8 lg:mt-0">
          <div className="relative w-full aspect-square max-w-lg mx-auto lg:ml-auto">
            {/* Decorative Frame Behind */}
            <div className="absolute -top-10 -left-10 w-full h-full bg-secondary-container/40 rounded-[60px] rotate-6 -z-10"></div>
            <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-primary/10 rounded-[40px] -rotate-3 -z-10"></div>

            {/* Main Sketchbook Frame */}
            <div className="w-full h-full sketchbook-frame relative overflow-hidden shadow-2xl scale-105 transition-transform duration-700 hover:scale-[1.07]">
              <img
                className="w-full h-full object-cover rounded-sm transition-transform duration-1000 hover:scale-105"
                src={hero.imageUrl || '/images/hero.JPG'}
                alt={hero.imageAlt || 'Hero Illustration'}
              />
            </div>

            {/* Floating Element Over Image */}
            <div className="absolute -top-12 -right-8 scribble-accent text-primary/60 scale-150">
              <span className="material-symbols-outlined text-6xl">magic_button</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
