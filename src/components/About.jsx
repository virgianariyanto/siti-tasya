import { useContent } from '../context/useContent'

export default function About() {
  const { about } = useContent()

  return (
    <section className="py-32 relative overflow-hidden" id="about">
      {/* Section Divider (Organic Shape) */}
      <div className="absolute top-0 left-0 w-full h-32 bg-surface-container-low torn-edge transform -translate-y-1/2"></div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative mx-auto lg:mx-0 max-w-sm">
              <div className="hand-drawn-border p-6 bg-white rotate-2 shadow-xl hover:rotate-0 transition-transform duration-500">
                <img
                  className="w-full aspect-square object-cover rounded-lg"
                  src={about.avatarUrl || '/images/artist_avatar.png'}
                  alt={about.avatarAlt || 'Artist Avatar'}
                />
              </div>
              <div className="absolute -bottom-10 -left-10 scribble-accent">
                <span className="material-symbols-outlined text-8xl text-primary">ink_pen</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
            <h2 className="text-mix text-headline-md md:text-6xl text-primary leading-tight">
              {about.headlinePart1 || 'A bit'}{' '}
              <span>{about.headlinePart2 || 'about'}</span> <br />
              {about.headlinePart3 || 'my'}{' '}
              <span>{about.headlinePart4 || 'world...'}</span>
            </h2>
            <div className="space-y-6 text-on-surface-variant text-lg md:text-xl leading-relaxed">
              <p>{about.paragraph1}</p>
              {about.paragraph2 && <p>{about.paragraph2}</p>}
            </div>
            {about.toolboxIcons && about.toolboxIcons.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6">
                <span className="font-label-caps text-on-surface-variant uppercase tracking-[0.2em] text-sm">
                  {about.toolboxLabel || 'MY TOOLBOX:'}
                </span>
                <div className="flex gap-4 flex-wrap">
                  {about.toolboxIcons.map((tool) => (
                    <div
                      key={tool.id || tool.name}
                      title={tool.name}
                      className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center group hover:bg-primary/5 transition-all hover:-translate-y-1"
                    >
                      <span className="material-symbols-outlined text-primary text-4xl group-hover:scale-110 transition-transform">
                        {tool.icon}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
