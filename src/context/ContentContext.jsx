import { useState, useEffect } from 'react'
import { ContentContext } from './content-core'

const DEFAULT_CONTENT = {
  hero: {
    statusBadge: 'AVAILABLE FOR FREELANCE',
    titleName: 'Siti Tasya',
    titleRole: 'Illustrator',
    titleCity: 'Bekasi',
    titleCountry: 'Indonesia',
    subtitle:
      "Creating magical worlds and gentle characters for children's stories. I turn daydreams into tactile digital art with a heart.",
    btn1Text: 'View My Work',
    btn1Link: '#work',
    btn2Text: 'Hire Me',
    btn2Link: '#contact',
    stat1Value: '50+',
    stat1Label: 'Books Illustrated',
    stat2Value: '120+',
    stat2Label: 'Character Designs',
    imageUrl: '/images/hero_illustration.png',
    imageAlt: 'Whimsical Hero Illustration',
  },
  about: {
    headlinePart1: 'A bit',
    headlinePart2: 'about',
    headlinePart3: 'my',
    headlinePart4: 'world...',
    paragraph1:
      "Hello! I'm Siti, a visual storyteller specialized in children's book illustration and character design. Living in the vibrant city of Bekasi, I draw inspiration from both urban hustle and the quiet moments of imagination.",
    paragraph2:
      'My work is characterized by organic textures, warm palettes, and a sense of wonder. I believe every character has a secret story waiting to be told through a single brushstroke.',
    avatarUrl: '/images/artist_avatar.png',
    avatarAlt: 'Siti Tasya Avatar',
    toolboxLabel: 'MY TOOLBOX:',
    toolboxIcons: [
      { id: 't1', icon: 'photo_library', name: 'Photoshop' },
      { id: 't2', icon: 'format_paint', name: 'Procreate' },
      { id: 't3', icon: 'brush', name: 'Traditional Inks' },
    ],
  },
  services: {
    sectionTitle: 'Magical Services',
    sectionSubtitle:
      'Bringing your creative visions to life with a gentle touch and story-driven artistry.',
    items: [
      {
        id: 'srv-1',
        icon: 'menu_book',
        title: "Children's Books",
        description: 'Full-page spreads and covers that spark childhood imagination and wonder.',
        price: 'FROM $1,000+',
        iconColor: 'text-secondary',
        bgColor: 'bg-secondary-container/40',
        hoverShadow: 'hover:shadow-secondary/10',
        rotation: 'group-hover:rotate-6',
        offset: '',
      },
      {
        id: 'srv-2',
        icon: 'face_6',
        title: 'Character Design',
        description: 'Developing unique personalities and expressive visual identities for stories.',
        price: 'FROM $350+',
        iconColor: 'text-primary',
        bgColor: 'bg-primary-fixed/40',
        hoverShadow: 'hover:shadow-primary/10',
        rotation: 'group-hover:-rotate-6',
        offset: 'lg:translate-y-8',
      },
      {
        id: 'srv-3',
        icon: 'palette',
        title: 'Brand Illustration',
        description: 'Custom illustrations to give your brand a human, friendly, and organic feel.',
        price: 'FROM $500+',
        iconColor: 'text-tertiary',
        bgColor: 'bg-tertiary-fixed/40',
        hoverShadow: 'hover:shadow-tertiary/10',
        rotation: 'group-hover:rotate-6',
        offset: '',
      },
      {
        id: 'srv-4',
        icon: 'frame_person',
        title: 'Poster Art',
        description: 'Limited edition prints and decorative botanical wall art for collectors.',
        price: 'FROM $200+',
        iconColor: 'text-outline',
        bgColor: 'bg-surface-container-highest',
        hoverShadow: 'hover:shadow-outline/10',
        rotation: 'group-hover:-rotate-6',
        offset: 'lg:translate-y-8',
      },
    ],
  },
  gallery: {
    sectionTitle: 'Illustration Gallery',
    sectionSubtitle: 'A window into my digital sketchbook—where paper textures meet digital dreams.',
    categories: ['All Stories', 'Characters', 'Books', 'Packaging'],
    items: [
      {
        id: 'gal-1',
        title: "The Fox's Secret",
        categoryTag: 'Book Illustration',
        categoryKey: 'Books',
        imgSrc: '/images/fox_secret_illustration.png',
        alt: 'A soft whimsical illustration for a children\'s book featuring a little girl whispering secrets to a giant, friendly fox in a moonlit forest.',
        extraClasses: '',
      },
      {
        id: 'gal-2',
        title: "Chef Mimi's Bakery",
        categoryTag: 'Character Design',
        categoryKey: 'Characters',
        imgSrc: '/images/chef_mimi_character.png',
        alt: 'A character design sheet for a whimsical baker character with flour on her apron and a friendly smile.',
        extraClasses: '',
      },
      {
        id: 'gal-3',
        title: 'Under the Toadstool',
        categoryTag: "Children's Book",
        categoryKey: 'Books',
        imgSrc: '/images/mushroom_tea_party.png',
        alt: 'A detailed children\'s book illustration showing a tea party under a giant mushroom.',
        extraClasses: 'lg:mt-12',
      },
      {
        id: 'gal-4',
        title: 'Golden Nectar',
        categoryTag: 'Branding',
        categoryKey: 'Packaging',
        imgSrc: '/images/honey_packaging_design.png',
        alt: 'A packaging design for a whimsical organic honey brand.',
        extraClasses: '',
      },
      {
        id: 'gal-5',
        title: 'Tropical Botanica',
        categoryTag: 'Poster Art',
        categoryKey: 'Packaging',
        imgSrc: '/images/tropical_botanica_poster.png',
        alt: 'A poster art piece featuring a collection of whimsical Indonesian botanicals.',
        extraClasses: 'lg:-mt-24',
      },
    ],
  },
  testimonials: {
    sectionTitle: 'Kind words from storytellers',
    items: [
      {
        id: 'test-1',
        quote:
          '"Siti didn\'t just illustrate my book; she breathed a soul into the characters. Her attention to detail and ability to capture emotion through color is truly magical."',
        author: 'Elena R.',
        role: 'Author, UK',
        bgColor: 'bg-secondary-fixed-dim',
        transform: 'transform -rotate-1',
      },
      {
        id: 'test-2',
        quote:
          '"Working with Siti on our branding was a dream. She captured the handmade, organic feel we wanted perfectly. Our customers love her illustrations!"',
        author: 'Mark J.',
        role: 'Tea & Co Founder',
        bgColor: 'bg-primary-fixed-dim',
        transform: 'transform rotate-2 lg:translate-y-6',
      },
      {
        id: 'test-3',
        quote:
          '"Professional, imaginative, and incredibly talented. Siti delivered more than what was briefed. She is now our go-to illustrator for all poster art."',
        author: 'Siska K.',
        role: 'Event Organizer',
        bgColor: 'bg-tertiary-fixed',
        transform: 'transform -rotate-1 md:hidden lg:block',
      },
    ],
  },
  contact: {
    sectionTitle: "Let's create something magical together",
    sectionSubtitle:
      'Whether you have a book idea, a brand project, or just want to say hi, my inbox is always open for new adventures.',
    email: 'hello@sititasya.com',
    location: 'Bekasi, Indonesia',
    socialLinks: [
      { id: 's1', name: 'LinkedIn', label: 'In', url: 'https://linkedin.com' },
      { id: 's2', name: 'Instagram', label: 'Ig', url: 'https://instagram.com' },
      { id: 's3', name: 'Behance', label: 'Be', url: 'https://behance.net' },
    ],
  },
  footer: {
    brandName: 'Siti Tasya',
    copyright: '© 2024 Siti Tasya. Hand-drawn with love in Bekasi.',
    craftBadge: 'Crafted with magic',
    footerLinks: [
      { id: 'f1', label: 'Instagram', url: '#' },
      { id: 'f2', label: 'Twitter', url: '#' },
      { id: 'f3', label: 'Behance', url: '#' },
      { id: 'f4', label: 'Email', url: 'mailto:hello@sititasya.com' },
    ],
  },
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem('siti_tasya_dynamic_content')
      return saved ? JSON.parse(saved) : DEFAULT_CONTENT
    } catch {
      return DEFAULT_CONTENT
    }
  })

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('siti_tasya_dynamic_content', JSON.stringify(content))
    } catch (e) {
      console.error(e)
    }
  }, [content])

  // Section updaters
  const updateHero = (newHeroData) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...newHeroData },
    }))
  }

  const updateAbout = (newAboutData) => {
    setContent((prev) => ({
      ...prev,
      about: { ...prev.about, ...newAboutData },
    }))
  }

  // Services CRUD
  const updateServicesMeta = (newMeta) => {
    setContent((prev) => ({
      ...prev,
      services: { ...prev.services, ...newMeta },
    }))
  }

  const addService = (newService) => {
    const serviceWithId = {
      ...newService,
      id: `srv-${Date.now()}`,
      bgColor: newService.bgColor || 'bg-secondary-container/40',
      iconColor: newService.iconColor || 'text-primary',
      hoverShadow: 'hover:shadow-primary/10',
      rotation: 'group-hover:rotate-6',
      offset: '',
    }
    setContent((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        items: [...prev.services.items, serviceWithId],
      },
    }))
    return serviceWithId
  }

  const updateService = (id, updatedService) => {
    setContent((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        items: prev.services.items.map((item) =>
          String(item.id) === String(id) ? { ...item, ...updatedService } : item
        ),
      },
    }))
  }

  const deleteService = (id) => {
    setContent((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        items: prev.services.items.filter((item) => String(item.id) !== String(id)),
      },
    }))
  }

  // Gallery CRUD
  const updateGalleryMeta = (newMeta) => {
    setContent((prev) => ({
      ...prev,
      gallery: { ...prev.gallery, ...newMeta },
    }))
  }

  const addGalleryItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: `gal-${Date.now()}`,
      extraClasses: '',
    }
    setContent((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        items: [itemWithId, ...prev.gallery.items],
      },
    }))
    return itemWithId
  }

  const updateGalleryItem = (id, updatedItem) => {
    setContent((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        items: prev.gallery.items.map((item) =>
          String(item.id) === String(id) ? { ...item, ...updatedItem } : item
        ),
      },
    }))
  }

  const deleteGalleryItem = (id) => {
    setContent((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        items: prev.gallery.items.filter((item) => String(item.id) !== String(id)),
      },
    }))
  }

  // Testimonials CRUD
  const updateTestimonialsMeta = (newMeta) => {
    setContent((prev) => ({
      ...prev,
      testimonials: { ...prev.testimonials, ...newMeta },
    }))
  }

  const addTestimonial = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: `test-${Date.now()}`,
      bgColor: newItem.bgColor || 'bg-secondary-fixed-dim',
      transform: 'transform -rotate-1',
    }
    setContent((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: [...prev.testimonials.items, itemWithId],
      },
    }))
    return itemWithId
  }

  const updateTestimonial = (id, updatedItem) => {
    setContent((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: prev.testimonials.items.map((item) =>
          String(item.id) === String(id) ? { ...item, ...updatedItem } : item
        ),
      },
    }))
  }

  const deleteTestimonial = (id) => {
    setContent((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: prev.testimonials.items.filter((item) => String(item.id) !== String(id)),
      },
    }))
  }

  // Contact & Footer
  const updateContact = (newContactData) => {
    setContent((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...newContactData },
    }))
  }

  const updateFooter = (newFooterData) => {
    setContent((prev) => ({
      ...prev,
      footer: { ...prev.footer, ...newFooterData },
    }))
  }

  // Reset to default
  const resetToDefaultContent = () => {
    setContent(DEFAULT_CONTENT)
  }

  return (
    <ContentContext.Provider
      value={{
        content,
        hero: content.hero,
        about: content.about,
        services: content.services,
        gallery: content.gallery,
        testimonials: content.testimonials,
        contact: content.contact,
        footer: content.footer,
        updateHero,
        updateAbout,
        updateServicesMeta,
        addService,
        updateService,
        deleteService,
        updateGalleryMeta,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        updateTestimonialsMeta,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        updateContact,
        updateFooter,
        resetToDefaultContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

export default ContentProvider
