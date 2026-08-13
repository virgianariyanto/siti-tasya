import { useState } from 'react'

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All Stories')

  const categories = ['All Stories', 'Characters', 'Books', 'Packaging']

  const galleryItems = [
    {
      id: 1,
      title: "The Fox's Secret",
      categoryTag: "Book Illustration",
      categoryKey: "Books",
      imgSrc: "/images/fox_secret_illustration.png",
      alt: "A soft whimsical illustration for a children's book featuring a little girl whispering secrets to a giant, friendly fox in a moonlit forest.",
      extraClasses: "",
    },
    {
      id: 2,
      title: "Chef Mimi's Bakery",
      categoryTag: "Character Design",
      categoryKey: "Characters",
      imgSrc: "/images/chef_mimi_character.png",
      alt: "A character design sheet for a whimsical baker character with flour on her apron and a friendly smile.",
      extraClasses: "",
    },
    {
      id: 3,
      title: "Under the Toadstool",
      categoryTag: "Children's Book",
      categoryKey: "Books",
      imgSrc: "/images/mushroom_tea_party.png",
      alt: "A detailed children's book illustration showing a tea party under a giant mushroom.",
      extraClasses: "lg:mt-12",
    },
    {
      id: 4,
      title: "Golden Nectar",
      categoryTag: "Branding",
      categoryKey: "Packaging",
      imgSrc: "/images/honey_packaging_design.png",
      alt: "A packaging design for a whimsical organic honey brand.",
      extraClasses: "",
    },
    {
      id: 5,
      title: "Tropical Botanica",
      categoryTag: "Poster Art",
      categoryKey: "Packaging",
      imgSrc: "/images/tropical_botanica_poster.png",
      alt: "A poster art piece featuring a collection of whimsical Indonesian botanicals.",
      extraClasses: "lg:-mt-24",
    },
  ]

  const filteredItems = activeCategory === 'All Stories'
    ? galleryItems
    : galleryItems.filter(item => item.categoryKey === activeCategory)

  return (
    <section className="py-32 px-margin-mobile md:px-margin-desktop" id="work">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <h2 className="text-mix text-headline-md md:text-6xl text-primary mb-6">
              Illustration <span>Gallery</span>
            </h2>
            <p className="font-body-lg text-xl text-on-surface-variant">
              A window into my digital sketchbook—where paper textures meet digital dreams.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-2xl font-bold storybook-button text-sm transition-all ${
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
            <div key={item.id} className={`gallery-item group ${item.extraClasses}`}>
              <div className="sketchbook-frame group-hover:-translate-y-2 transition-transform duration-500">
                <img
                  className="w-full rounded-sm"
                  data-alt={item.alt}
                  src={item.imgSrc}
                  alt={item.title}
                />
                <div className="pt-4 px-2">
                  <p className="font-display-lg text-xl text-on-surface">
                    {item.title}
                  </p>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">
                    {item.categoryTag}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
