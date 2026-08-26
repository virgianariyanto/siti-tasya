import { useState, useEffect } from 'react'
import { ContentContext } from './content-core'
import {
  contentApi,
  servicesApi,
  galleryApi,
  testimonialsApi,
} from '../services/api'

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
    items: [],
  },
  gallery: {
    sectionTitle: 'Illustration Gallery',
    sectionSubtitle: 'A window into my digital sketchbook—where paper textures meet digital dreams.',
    categories: ['All Stories', 'Characters', 'Books', 'Printed Art/Painting'],
    items: [],
  },
  testimonials: {
    sectionTitle: 'Kind words from storytellers',
    items: [],
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

const CACHE_KEY = 'site_content_cache'

function getInitialContent() {
  if (typeof window === 'undefined') return DEFAULT_CONTENT
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      return {
        ...DEFAULT_CONTENT,
        ...parsed,
        hero: { ...DEFAULT_CONTENT.hero, ...(parsed.hero || {}) },
        about: { ...DEFAULT_CONTENT.about, ...(parsed.about || {}) },
        contact: { ...DEFAULT_CONTENT.contact, ...(parsed.contact || {}) },
        footer: { ...DEFAULT_CONTENT.footer, ...(parsed.footer || {}) },
        services: {
          ...DEFAULT_CONTENT.services,
          ...(parsed.services || {}),
          items: Array.isArray(parsed.services?.items) ? parsed.services.items : DEFAULT_CONTENT.services.items,
        },
        gallery: {
          ...DEFAULT_CONTENT.gallery,
          ...(parsed.gallery || {}),
          items: Array.isArray(parsed.gallery?.items) ? parsed.gallery.items : DEFAULT_CONTENT.gallery.items,
        },
        testimonials: {
          ...DEFAULT_CONTENT.testimonials,
          ...(parsed.testimonials || {}),
          items: Array.isArray(parsed.testimonials?.items) ? parsed.testimonials.items : DEFAULT_CONTENT.testimonials.items,
        },
      }
    }
  } catch (e) {
    console.warn('Gagal membaca cache konten:', e)
  }
  return DEFAULT_CONTENT
}

function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch (e) {
    // Abaikan jika storage penuh atau private mode
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(getInitialContent)

  // Fetch all dynamic content from PostgreSQL on mount
  useEffect(() => {
    async function loadContent() {
      try {
        const [siteData, srvs, gals, tests] = await Promise.all([
          contentApi.getAll().catch(() => ({})),
          servicesApi.getAll().catch(() => []),
          galleryApi.getAll().catch(() => []),
          testimonialsApi.getAll().catch(() => []),
        ])

        setContent((prev) => {
          const updated = {
            ...prev,
            hero: siteData.hero || prev.hero,
            about: siteData.about || prev.about,
            contact: siteData.contact || prev.contact,
            footer: siteData.footer || prev.footer,
            services: {
              ...prev.services,
              items: srvs || [],
            },
            gallery: {
              ...prev.gallery,
              items: gals || [],
            },
            testimonials: {
              ...prev.testimonials,
              items: tests || [],
            },
          }
          saveCache(updated)
          return updated
        })
      } catch (err) {
        console.error('Gagal mengambil konten dari PostgreSQL:', err)
      }
    }

    loadContent()
  }, [])

  // Section updaters
  const updateHero = async (newHeroData) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        hero: { ...prev.hero, ...newHeroData },
      }
      saveCache(updated)
      return updated
    })
    try {
      await contentApi.updateSection('hero', newHeroData)
    } catch (err) {
      console.error('Gagal menyimpan Hero ke PostgreSQL:', err)
    }
  }

  const updateAbout = async (newAboutData) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        about: { ...prev.about, ...newAboutData },
      }
      saveCache(updated)
      return updated
    })
    try {
      await contentApi.updateSection('about', newAboutData)
    } catch (err) {
      console.error('Gagal menyimpan About ke PostgreSQL:', err)
    }
  }

  // Services CRUD
  const addService = async (newService) => {
    try {
      const created = await servicesApi.create(newService)
      setContent((prev) => ({
        ...prev,
        services: {
          ...prev.services,
          items: [...prev.services.items, created],
        },
      }))
      return created
    } catch (err) {
      console.error('Gagal menambahkan layanan ke PostgreSQL:', err)
    }
  }

  const updateService = async (id, updatedService) => {
    setContent((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        items: prev.services.items.map((item) =>
          String(item.id) === String(id) ? { ...item, ...updatedService } : item
        ),
      },
    }))
    try {
      await servicesApi.update(id, updatedService)
    } catch (err) {
      console.error('Gagal memperbarui layanan di PostgreSQL:', err)
    }
  }

  const deleteService = async (id) => {
    setContent((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        items: prev.services.items.filter((item) => String(item.id) !== String(id)),
      },
    }))
    try {
      await servicesApi.delete(id)
    } catch (err) {
      console.error('Gagal menghapus layanan dari PostgreSQL:', err)
    }
  }

  // Gallery CRUD
  const addGalleryItem = async (newItem) => {
    try {
      const created = await galleryApi.create(newItem)
      setContent((prev) => ({
        ...prev,
        gallery: {
          ...prev.gallery,
          items: [created, ...prev.gallery.items],
        },
      }))
      return created
    } catch (err) {
      console.error('Gagal menambahkan karya ke PostgreSQL:', err)
    }
  }

  const updateGalleryItem = async (id, updatedItem) => {
    setContent((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        items: prev.gallery.items.map((item) =>
          String(item.id) === String(id) ? { ...item, ...updatedItem } : item
        ),
      },
    }))
    try {
      await galleryApi.update(id, updatedItem)
    } catch (err) {
      console.error('Gagal memperbarui karya di PostgreSQL:', err)
    }
  }

  const deleteGalleryItem = async (id) => {
    setContent((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        items: prev.gallery.items.filter((item) => String(item.id) !== String(id)),
      },
    }))
    try {
      await galleryApi.delete(id)
    } catch (err) {
      console.error('Gagal menghapus karya dari PostgreSQL:', err)
    }
  }

  // Testimonials CRUD
  const addTestimonial = async (newItem) => {
    try {
      const created = await testimonialsApi.create(newItem)
      setContent((prev) => ({
        ...prev,
        testimonials: {
          ...prev.testimonials,
          items: [...prev.testimonials.items, created],
        },
      }))
      return created
    } catch (err) {
      console.error('Gagal menambahkan testimoni ke PostgreSQL:', err)
    }
  }

  const updateTestimonial = async (id, updatedItem) => {
    setContent((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: prev.testimonials.items.map((item) =>
          String(item.id) === String(id) ? { ...item, ...updatedItem } : item
        ),
      },
    }))
    try {
      await testimonialsApi.update(id, updatedItem)
    } catch (err) {
      console.error('Gagal memperbarui testimoni di PostgreSQL:', err)
    }
  }

  const deleteTestimonial = async (id) => {
    setContent((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: prev.testimonials.items.filter((item) => String(item.id) !== String(id)),
      },
    }))
    try {
      await testimonialsApi.delete(id)
    } catch (err) {
      console.error('Gagal menghapus testimoni dari PostgreSQL:', err)
    }
  }

  // Contact & Footer
  const updateContact = async (newContactData) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        contact: { ...prev.contact, ...newContactData },
      }
      saveCache(updated)
      return updated
    })
    try {
      await contentApi.updateSection('contact', newContactData)
    } catch (err) {
      console.error('Gagal menyimpan Kontak ke PostgreSQL:', err)
    }
  }

  const updateFooter = async (newFooterData) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        footer: { ...prev.footer, ...newFooterData },
      }
      saveCache(updated)
      return updated
    })
    try {
      await contentApi.updateSection('footer', newFooterData)
    } catch (err) {
      console.error('Gagal menyimpan Footer ke PostgreSQL:', err)
    }
  }

  // Reset to default
  const resetToDefaultContent = () => {
    try {
      localStorage.removeItem(CACHE_KEY)
    } catch (e) {}
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
        addService,
        updateService,
        deleteService,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
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
