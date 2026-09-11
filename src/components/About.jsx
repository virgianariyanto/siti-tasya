import { useState } from 'react'
import { useContent } from '../context/useContent'

export default function About() {
  const { about } = useContent()
  const [avatarLoaded, setAvatarLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(about?.avatarUrl)

  // Only reset avatarLoaded if the URL actually changes from the previous one
  if (about?.avatarUrl && about.avatarUrl !== currentSrc) {
    setCurrentSrc(about.avatarUrl)
    setAvatarLoaded(false)
  }

  const showSkeleton = !avatarLoaded

  return (
    <section className="py-32 relative overflow-hidden" id="about">
      {/* Section Divider (Organic Shape) */}
      <div className="absolute top-0 left-0 w-full h-32 bg-surface-container-low torn-edge transform -translate-y-1/2"></div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative mx-auto lg:mx-0 max-w-sm">
              <div className="hand-drawn-border p-6 bg-white rotate-2 shadow-xl hover:rotate-0 transition-transform duration-500">
                <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-surface-container-high/30">
                  {showSkeleton && (
                    <div className="absolute inset-0 z-10 skeleton-shimmer flex flex-col items-center justify-center p-6 text-center rounded-lg pointer-events-none transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full bg-secondary/15 flex items-center justify-center text-secondary mb-2 animate-pulse">
                        <span className="material-symbols-outlined text-3xl">palette</span>
                      </div>
                      <div className="h-3 w-24 bg-primary/15 rounded-full mb-1.5 animate-pulse"></div>
                      <div className="h-2 w-16 bg-primary/10 rounded-full animate-pulse"></div>
                    </div>
                  )}

                  {about?.avatarUrl && (
                    <img
                      ref={(el) => {
                        if (el && el.complete && el.naturalWidth > 0 && !avatarLoaded) {
                          setAvatarLoaded(true)
                        }
                      }}
                      className={`w-full aspect-square object-cover rounded-lg transition-all duration-500 ${
                        avatarLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                      src={about.avatarUrl}
                      alt={about.avatarAlt || 'Artist Avatar'}
                      loading="eager"
                      decoding="async"
                      onLoad={() => setAvatarLoaded(true)}
                      onError={() => setAvatarLoaded(true)}
                    />
                  )}
                </div>
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
