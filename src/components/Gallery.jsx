import { useState } from 'react'
import { useContent } from '../context/useContent'

export default function Gallery() {
  const { gallery } = useContent()
  const [activeCategory, setActiveCategory] = useState('All Stories')

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
                onClick={() => setActiveCategory(cat)}
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

        <div className="masonry">
          {filteredItems.map((item) => (
            <div key={item.id} className="gallery-item group">
              <div className="sketchbook-frame group-hover:-translate-y-2 transition-transform duration-500">
                <img
                  className="w-full rounded-sm object-cover"
                  src={item.imgSrc}
                  alt={item.alt || item.title}
                />
                <div className="pt-4 px-2">
                  <p className="font-display-lg text-xl text-on-surface">{item.title}</p>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">
                    {item.categoryTag}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-16 col-span-full">
              <p className="text-on-surface-variant italic">Belum ada karya dalam kategori ini.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
