import { useState, useEffect } from 'react'
import { useContent } from '../context/useContent'

function GalleryItemCard({ item, onSelect }) {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div
      onClick={onSelect}
      className="gallery-item group cursor-pointer"
      title={`Klik untuk memperbesar "${item.title}"`}
    >
      <div className="sketchbook-frame group-hover:-translate-y-2 group-hover:shadow-2xl transition-all duration-500 relative">
        <div className="relative w-full rounded-sm overflow-hidden bg-surface-container-high/30 min-h-[180px]">
          {!imgLoaded && (
            <div className="absolute inset-0 z-10 skeleton-shimmer flex flex-col items-center justify-center p-4">
              <span className="material-symbols-outlined text-outline/30 text-3xl animate-pulse mb-1">
                photo_library
              </span>
              <span className="text-[10px] font-bold text-outline/40 uppercase tracking-widest">
                Memuat Artwork...
              </span>
            </div>
          )}
          <img
            ref={(el) => {
              if (el && el.complete && el.naturalWidth > 0 && !imgLoaded) {
                setImgLoaded(true)
              }
            }}
            className={`w-full rounded-sm object-cover transition-all duration-700 group-hover:scale-105 ${
              imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            src={item.imgSrc}
            alt={item.alt || item.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
          />

          {/* Hover Zoom Overlay Badge */}
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <div className="bg-white/95 text-primary px-4 py-2 rounded-full font-bold text-xs shadow-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <span className="material-symbols-outlined text-base">zoom_in</span>
              <span>Perbesar Karya</span>
            </div>
          </div>
        </div>

        <div className="pt-4 px-2 flex justify-between items-start">
          <div>
            <p className="font-display-lg text-xl text-on-surface group-hover:text-primary transition-colors">
              {item.title}
            </p>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">
              {item.categoryTag}
            </p>
          </div>
          <span className="material-symbols-outlined text-outline/40 group-hover:text-primary transition-colors text-xl mt-1">
            fullscreen
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Gallery() {
  const { gallery, isLoading } = useContent()
  const [activeCategory, setActiveCategory] = useState('All Stories')
  const [selectedIndex, setSelectedIndex] = useState(null)

  const categories = gallery?.categories || ['All Stories', 'Characters', 'Books', 'Printed Art/Painting']
  const galleryItems = gallery?.items || []

  const filteredItems =
    activeCategory === 'All Stories'
      ? galleryItems
      : galleryItems.filter(
          (item) =>
            item.categoryKey === activeCategory ||
            item.categoryTag?.toLowerCase().includes(activeCategory.toLowerCase())
        )

  const activeItem = selectedIndex !== null ? filteredItems[selectedIndex] : null

  // Keyboard navigation and Body scroll lock for modal
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden'

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setSelectedIndex(null)
        } else if (e.key === 'ArrowRight' && filteredItems.length > 1) {
          setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
        } else if (e.key === 'ArrowLeft' && filteredItems.length > 1) {
          setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = 'unset'
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [selectedIndex, filteredItems.length])

  // Varied heights for sketchbook skeleton cards in masonry
  const skeletonHeights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-60', 'h-84']

  return (
    <section className="py-32 px-margin-mobile md:px-margin-desktop" id="work">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <h2 className="text-mix text-headline-md md:text-6xl text-primary mb-6">
              {gallery?.sectionTitle || 'Illustration Gallery'}
            </h2>
            <p className="font-body-lg text-xl text-on-surface-variant">
              {gallery?.sectionSubtitle ||
                'A window into my digital sketchbook—where paper textures meet digital dreams.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setSelectedIndex(null)
                }}
                className={`px-8 py-3 rounded-2xl font-bold storybook-button text-sm transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                    : 'bg-white text-on-surface-variant hover:text-primary shadow-sm border border-primary/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* MASONRY GALLERY */}
        {isLoading ? (
          <div className="masonry">
            {skeletonHeights.map((hClass, index) => (
              <div key={index} className="gallery-item">
                <div className="sketchbook-frame bg-surface-container-lowest border border-primary/10 rounded-2xl p-4 space-y-3">
                  <div className={`w-full ${hClass} rounded-sm skeleton-shimmer flex flex-col items-center justify-center p-4`}>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary/30 mb-2 animate-pulse">
                      <span className="material-symbols-outlined text-2xl">palette</span>
                    </div>
                    <span className="text-[10px] font-bold text-outline/40 uppercase tracking-widest">
                      Karya Galeri...
                    </span>
                  </div>
                  <div className="pt-3 px-1 space-y-2">
                    <div className="h-5 w-3/4 rounded-md skeleton-shimmer"></div>
                    <div className="h-3 w-1/3 rounded-md skeleton-shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="masonry">
            {filteredItems.map((item, index) => (
              <GalleryItemCard
                key={item.id}
                item={item}
                onSelect={() => setSelectedIndex(index)}
              />
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-16 col-span-full">
                <p className="text-on-surface-variant italic">Belum ada karya dalam kategori ini.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL (POPUP PERBESAR GAMBAR) */}
      {selectedIndex !== null && activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 md:p-10"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close Button Top Right */}
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-2.5 rounded-full transition-all cursor-pointer hover:rotate-90 shadow-lg border border-white/10"
            aria-label="Tutup"
            title="Tutup (Esc)"
          >
            <span className="material-symbols-outlined text-2xl sm:text-3xl block">close</span>
          </button>

          {/* Previous Artwork Button */}
          {filteredItems.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
              }}
              className="absolute left-2 sm:left-6 z-50 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all cursor-pointer backdrop-blur-sm hover:scale-110 shadow-lg border border-white/10"
              aria-label="Karya Sebelumnya"
              title="Karya Sebelumnya (Panah Kiri)"
            >
              <span className="material-symbols-outlined text-2xl sm:text-3xl block">arrow_back_ios_new</span>
            </button>
          )}

          {/* Next Artwork Button */}
          {filteredItems.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
              }}
              className="absolute right-2 sm:right-6 z-50 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all cursor-pointer backdrop-blur-sm hover:scale-110 shadow-lg border border-white/10"
              aria-label="Karya Selanjutnya"
              title="Karya Selanjutnya (Panah Kanan)"
            >
              <span className="material-symbols-outlined text-2xl sm:text-3xl block">arrow_forward_ios</span>
            </button>
          )}

          {/* Modal Content Card */}
          <div
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-surface-container-lowest p-3 sm:p-5 rounded-3xl border-2 border-primary/20 shadow-2xl max-w-full flex flex-col items-center overflow-hidden">
              {/* Image Frame */}
              <div className="relative overflow-hidden rounded-2xl max-h-[68vh] sm:max-h-[72vh] flex items-center justify-center bg-black/5">
                <img
                  src={activeItem.imgSrc}
                  alt={activeItem.alt || activeItem.title}
                  className="w-auto h-auto max-h-[68vh] sm:max-h-[72vh] max-w-full object-contain rounded-xl shadow-md select-none"
                />
              </div>

              {/* Artwork Details Bar */}
              <div className="w-full pt-4 px-2 sm:px-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-primary/10 mt-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display-lg text-xl sm:text-2xl font-bold text-primary">
                      {activeItem.title}
                    </h3>
                    <span className="px-3 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant text-xs font-bold">
                      {activeItem.categoryTag}
                    </span>
                    <span className="text-xs text-outline font-semibold">
                      ({activeItem.categoryKey})
                    </span>
                  </div>
                  {activeItem.alt && (
                    <p className="text-xs sm:text-sm text-on-surface-variant italic line-clamp-2">
                      "{activeItem.alt}"
                    </p>
                  )}
                </div>

                {/* Counter & Action */}
                <div className="flex items-center gap-3 text-xs text-on-surface-variant shrink-0 self-end sm:self-center">
                  <span className="px-3 py-1 rounded-xl bg-surface-container-high font-bold">
                    {selectedIndex + 1} / {filteredItems.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
