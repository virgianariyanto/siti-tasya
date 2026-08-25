import { useState, useRef } from 'react'
import { useAuth } from '../context/useAuth'
import { useContent } from '../context/useContent'

export default function AdminDashboard({ onNavigate }) {
  const {
    user,
    logout,
    commissions,
    updateCommissionStatus,
    addCommission,
    deleteCommission,
    inquiries,
    toggleInquiryStatus,
    deleteInquiry,
    changePassword,
    changeEmail,
  } = useAuth()

  const {
    hero,
    about,
    services,
    gallery,
    testimonials,
    contact,
    footer,
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
  } = useContent()

  const [activeTab, setActiveTab] = useState('cms') // cms, commissions, inquiries, settings
  const [cmsSubTab, setCmsSubTab] = useState('gallery') // gallery, services, hero, about, testimonials, contact
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [notification, setNotification] = useState(null)

  // In-app custom confirmation modal (never blocked by browser)
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
  })

  // Local Form States for CMS
  const [heroForm, setHeroForm] = useState(hero)
  const [aboutForm, setAboutForm] = useState(about)
  const [contactForm, setContactForm] = useState(contact)
  const [footerForm, setFooterForm] = useState(footer)

  // Modals for CRUD
  const [serviceModal, setServiceModal] = useState({ open: false, isEdit: false, data: null })
  const [galleryModal, setGalleryModal] = useState({ open: false, isEdit: false, data: null })
  const [testimonialModal, setTestimonialModal] = useState({ open: false, isEdit: false, data: null })

  // File input refs
  const galleryFileInputRef = useRef(null)
  const heroFileInputRef = useRef(null)
  const aboutFileInputRef = useRef(null)

  // New Commission Form State
  const [newProject, setNewProject] = useState({
    clientName: '',
    clientCompany: '',
    clientEmail: '',
    projectTitle: '',
    category: 'Children Book',
    budget: '',
    deadline: '',
    status: 'Briefing',
    progress: 10,
    deliverables: '',
    notes: '',
  })

  // Password change state
  const [pwState, setPwState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const notify = (type, text) => {
    setNotification({ type, text })
    setTimeout(() => setNotification(null), 4000)
  }

  const requestConfirm = (title, message, onConfirmCallback) => {
    setConfirmModal({
      open: true,
      title,
      message,
      onConfirm: () => {
        onConfirmCallback()
        setConfirmModal({ open: false, title: '', message: '', onConfirm: null })
      },
    })
  }

  // Handle File Upload to Base64
  const handleFileUpload = (file, onSuccess) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      notify('error', 'Mohon pilih berkas gambar yang valid (PNG, JPG, SVG, WebP).')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      onSuccess(event.target.result)
      notify('success', `Gambar "${file.name}" berhasil diunggah!`)
    }
    reader.readAsDataURL(file)
  }

  // Handle Project Status Step Change
  const handleStepStatus = (id, currentStatus) => {
    let nextStatus = currentStatus
    let nextProgress = 50

    if (currentStatus.includes('Briefing')) {
      nextStatus = 'Sketsa Kasar'
      nextProgress = 35
    } else if (currentStatus.includes('Sketsa')) {
      nextStatus = 'In Progress (Pewarnaan)'
      nextProgress = 70
    } else if (currentStatus.includes('Pewarnaan')) {
      nextStatus = 'Finalisasi & Review'
      nextProgress = 90
    } else if (currentStatus.includes('Finalisasi')) {
      nextStatus = 'Selesai'
      nextProgress = 100
    } else {
      nextStatus = 'Briefing'
      nextProgress = 15
    }

    updateCommissionStatus(id, nextStatus, nextProgress)
    notify('success', `Status proyek berhasil diperbarui ke: ${nextStatus}`)
  }

  const handleAddProjectSubmit = (e) => {
    e.preventDefault()
    if (!newProject.projectTitle || !newProject.clientName) {
      notify('error', 'Mohon isi nama klien dan judul proyek.')
      return
    }

    addCommission(newProject)
    setShowAddModal(false)
    setNewProject({
      clientName: '',
      clientCompany: '',
      clientEmail: '',
      projectTitle: '',
      category: 'Children Book',
      budget: '',
      deadline: '',
      status: 'Briefing',
      progress: 15,
      deliverables: '',
      notes: '',
    })
    notify('success', 'Project baru berhasil ditambahkan!')
  }

  const [emailState, setEmailState] = useState({
    newEmail: '',
    confirmPassword: '',
  })
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    const cleanEmail = emailState.newEmail.trim().toLowerCase()
    if (!cleanEmail) {
      notify('error', 'Alamat email baru wajib diisi.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      notify('error', 'Format alamat email baru tidak valid (contoh: nama@sititasya.com).')
      return
    }
    if (cleanEmail === user?.email?.toLowerCase()) {
      notify('warning', 'Alamat email baru tidak boleh sama dengan email aktif saat ini.')
      return
    }
    if (!emailState.confirmPassword) {
      notify('error', 'Kata sandi saat ini diperlukan untuk otorisasi perubahan email.')
      return
    }

    setIsUpdatingEmail(true)
    const res = await changeEmail(emailState.confirmPassword, cleanEmail)
    setIsUpdatingEmail(false)

    if (res.success) {
      notify('success', res.message || 'Alamat email admin berhasil diperbarui!')
      setEmailState({ newEmail: '', confirmPassword: '' })
    } else {
      notify('error', res.message || 'Gagal mengubah alamat email admin.')
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (pwState.newPassword !== pwState.confirmPassword) {
      notify('error', 'Konfirmasi kata sandi baru tidak cocok.')
      return
    }
    if (pwState.newPassword.length < 6) {
      notify('error', 'Kata sandi baru minimal 6 karakter.')
      return
    }

    setIsUpdatingPassword(true)
    const res = await changePassword(pwState.currentPassword, pwState.newPassword)
    setIsUpdatingPassword(false)

    if (res.success) {
      notify('success', res.message || 'Kata sandi admin berhasil diperbarui!')
      setPwState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      notify('error', res.message || 'Gagal mengubah kata sandi.')
    }
  }

  // CMS Save Handlers
  const handleSaveHero = (e) => {
    e.preventDefault()
    updateHero(heroForm)
    notify('success', 'Konten Hero Section berhasil disimpan!')
  }

  const handleSaveAbout = (e) => {
    e.preventDefault()
    updateAbout(aboutForm)
    notify('success', 'Konten About Section berhasil disimpan!')
  }

  const handleSaveContact = (e) => {
    e.preventDefault()
    updateContact(contactForm)
    updateFooter(footerForm)
    notify('success', 'Informasi Kontak & Footer berhasil disimpan!')
  }

  // Service Save
  const handleServiceSubmit = (e) => {
    e.preventDefault()
    const { isEdit, data } = serviceModal
    if (!data.title) return

    if (isEdit) {
      updateService(data.id, data)
      notify('success', `Layanan "${data.title}" berhasil diperbarui!`)
    } else {
      addService(data)
      notify('success', `Layanan baru "${data.title}" berhasil ditambahkan!`)
    }
    setServiceModal({ open: false, isEdit: false, data: null })
  }

  // Gallery Save
  const handleGallerySubmit = (e) => {
    e.preventDefault()
    const { isEdit, data } = galleryModal
    if (!data.title) {
      notify('error', 'Mohon isi judul karya.')
      return
    }
    if (!data.imgSrc) {
      notify('error', 'Mohon upload berkas gambar untuk karya ini.')
      return
    }

    if (isEdit) {
      updateGalleryItem(data.id, data)
      notify('success', `Karya "${data.title}" berhasil diperbarui!`)
    } else {
      addGalleryItem(data)
      notify('success', `Karya baru "${data.title}" berhasil ditambahkan ke galeri!`)
    }
    setGalleryModal({ open: false, isEdit: false, data: null })
  }

  // Testimonial Save
  const handleTestimonialSubmit = (e) => {
    e.preventDefault()
    const { isEdit, data } = testimonialModal
    if (!data.author || !data.quote) return

    if (isEdit) {
      updateTestimonial(data.id, data)
      notify('success', `Testimoni dari "${data.author}" berhasil diperbarui!`)
    } else {
      addTestimonial(data)
      notify('success', `Testimoni baru dari "${data.author}" berhasil ditambahkan!`)
    }
    setTestimonialModal({ open: false, isEdit: false, data: null })
  }

  const filteredCommissions = commissions.filter((c) => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'active') return c.status !== 'Selesai'
    if (filterStatus === 'completed') return c.status === 'Selesai'
    return true
  })

  const activeProjectsCount = commissions.filter((c) => c.status !== 'Selesai').length
  const completedProjectsCount = commissions.filter((c) => c.status === 'Selesai').length
  const unreadInquiriesCount = inquiries.filter((i) => !i.isRead).length

  return (
    <div className="min-h-screen pt-24 pb-20 px-margin-mobile md:px-margin-desktop bg-surface relative">
      <div className="max-w-container-max mx-auto space-y-8">
        
        {/* Toast Notification */}
        {notification && (
          <div
            className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border transition-all animate-bounce-short ${
              notification.type === 'success'
                ? 'bg-secondary-container text-on-secondary-container border-secondary/30'
                : notification.type === 'info'
                ? 'bg-primary-fixed text-on-primary-fixed-variant border-primary/30'
                : 'bg-error-container text-on-error-container border-error/30'
            }`}
          >
            <span className="material-symbols-outlined">
              {notification.type === 'success' ? 'check_circle' : notification.type === 'info' ? 'info' : 'error'}
            </span>
            <span className="font-body-md font-bold text-sm">{notification.text}</span>
          </div>
        )}

        {/* Top Header Card */}
        <div className="sketchbook-frame bg-surface-container-lowest border border-primary/20 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-3xl shadow-inner">
              {user?.avatar || '🎨'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display-lg text-2xl sm:text-3xl font-bold text-primary">
                  Studio Admin — {user?.name || 'Siti Tasya'}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold font-label-caps uppercase">
                  Studio Owner
                </span>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant mt-1">
                Kelola konten website secara dinamis, antrean project, dan pesan calon klien.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-primary/30 text-primary font-bold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">visibility</span>
              <span>Lihat Web</span>
            </button>
            {/* <button
              onClick={() => {
                logout()
                onNavigate('home')
              }}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-error text-white font-bold text-sm shadow-md hover:bg-error/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span>Keluar</span>
            </button> */}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-primary/15 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">draw</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider block">
                Proyek Berjalan
              </span>
              <span className="font-display-lg text-2xl font-bold text-on-surface">
                {activeProjectsCount} Proyek
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-primary/15 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">mark_email_unread</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider block">
                Pesan Masuk
              </span>
              <span className="font-display-lg text-2xl font-bold text-on-surface">
                {unreadInquiriesCount} Belum Dibalas
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-primary/15 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">photo_library</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider block">
                Galeri Portofolio
              </span>
              <span className="font-display-lg text-2xl font-bold text-on-surface">
                {gallery?.items?.length || 0} Karya
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-primary/15 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider block">
                Akun Admin Aktif
              </span>
              <span className="font-bold text-sm text-primary font-mono block truncate max-w-[140px]" title={user?.email || 'admin@sititasya.com'}>
                {user?.email || 'admin@sititasya.com'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-primary/15 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('cms')}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'cms'
                ? 'bg-primary text-on-primary shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-lg">edit_document</span>
            <span>Kelola Konten Web (CMS)</span>
          </button>

          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'commissions'
                ? 'bg-primary text-on-primary shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-lg">assignment</span>
            <span>Kelola Project ({commissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap relative ${
              activeTab === 'inquiries'
                ? 'bg-primary text-on-primary shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-lg">mail</span>
            <span>Inbox Permintaan ({inquiries.length})</span>
            {unreadInquiriesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-error inline-block"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-primary text-on-primary shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-lg">settings</span>
            <span>Pengaturan & Sandi</span>
          </button>
        </div>

        {/* TAB CMS: MANAGE WEBSITE CONTENT */}
        {activeTab === 'cms' && (
          <div className="space-y-6">
            
            {/* Sub Tabs for CMS Sections */}
            <div className="flex items-center justify-between flex-wrap gap-3 bg-surface-container-lowest p-2 rounded-2xl border border-primary/15">
              <div className="flex gap-2 overflow-x-auto p-1">
                {[
                  { key: 'gallery', label: `Galeri (${gallery?.items?.length || 0})`, icon: 'collections' },
                  { key: 'services', label: `Layanan (${services?.items?.length || 0})`, icon: 'palette' },
                  { key: 'hero', label: 'Hero Banner', icon: 'flag' },
                  { key: 'about', label: 'About Artis', icon: 'person' },
                  { key: 'testimonials', label: `Testimoni (${testimonials?.items?.length || 0})`, icon: 'forum' },
                  { key: 'contact', label: 'Kontak & Footer', icon: 'contact_mail' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setCmsSubTab(tab.key)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      cmsSubTab === tab.key
                        ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  requestConfirm(
                    'Reset Seluruh Konten',
                    'Apakah Anda yakin ingin mengembalikan semua teks, gambar, layanan, dan karya galeri ke setelan default awal?',
                    () => {
                      resetToDefaultContent()
                      notify('info', 'Konten website telah direset ke default!')
                      setTimeout(() => window.location.reload(), 600)
                    }
                  )
                }
                className="px-3 py-1.5 text-xs text-outline hover:text-error hover:underline flex items-center gap-1 cursor-pointer"
                title="Reset seluruh konten ke default"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>Reset Default</span>
              </button>
            </div>

            {/* CMS SUBTAB: GALLERY (WITH FILE UPLOAD ONLY!) */}
            {cmsSubTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-3xl border-2 border-primary/15">
                  <div>
                    <h3 className="font-display-lg text-2xl font-bold text-primary">Kelola Galeri Karya (Portfolio)</h3>
                    <p className="text-xs text-on-surface-variant">Tambah artwork baru dengan upload gambar langsung dari komputer Anda.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setGalleryModal({
                        open: true,
                        isEdit: false,
                        data: {
                          title: '',
                          categoryTag: 'Book Illustration',
                          categoryKey: 'Books',
                          imgSrc: '', // Blank initially when creating new artwork
                          alt: '',
                        },
                      })
                    }
                    className="bg-primary text-on-primary px-5 py-2.5 rounded-2xl storybook-button font-bold text-sm flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
                    <span>Tambah Karya Baru</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {gallery?.items?.map((item) => (
                    <div
                      key={item.id}
                      className="sketchbook-frame bg-surface-container-lowest border-2 border-primary/15 rounded-3xl p-4 space-y-3 relative group hover:shadow-lg transition-all"
                    >
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container-high relative">
                        <img src={item.imgSrc} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 flex gap-1 bg-surface-container-lowest/90 backdrop-blur-sm p-1 rounded-xl shadow-md">
                          <button
                            type="button"
                            onClick={() => setGalleryModal({ open: true, isEdit: true, data: { ...item } })}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg cursor-pointer transition-colors"
                            title="Edit Karya"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              requestConfirm(
                                'Hapus Karya Galeri',
                                `Apakah Anda yakin ingin menghapus karya "${item.title}" dari galeri?`,
                                () => {
                                  deleteGalleryItem(item.id)
                                  notify('info', `Karya "${item.title}" telah dihapus.`)
                                }
                              )
                            }
                            className="p-1.5 text-outline hover:text-error hover:bg-error-container/30 rounded-lg cursor-pointer transition-colors"
                            title="Hapus Karya"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>

                      <div className="px-1">
                        <h4 className="font-display-lg text-base font-bold text-on-surface line-clamp-1">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant text-[10px] font-bold">
                            {item.categoryTag}
                          </span>
                          <span className="text-[11px] text-outline">({item.categoryKey})</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {gallery?.items?.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-surface-container-lowest rounded-3xl border border-primary/15">
                      <span className="material-symbols-outlined text-4xl text-outline mb-2">add_photo_alternate</span>
                      <p className="text-on-surface-variant font-body-md">Belum ada karya di galeri. Klik tombol "Tambah Karya Baru" di atas.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CMS SUBTAB: SERVICES */}
            {cmsSubTab === 'services' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-3xl border-2 border-primary/15">
                  <div>
                    <h3 className="font-display-lg text-2xl font-bold text-primary">Kelola Layanan Ilustrasi (Services)</h3>
                    <p className="text-xs text-on-surface-variant">Tambah, edit kartu layanan, ikon Material Symbols, dan harga project.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setServiceModal({
                        open: true,
                        isEdit: false,
                        data: {
                          icon: 'palette',
                          title: '',
                          description: '',
                          price: 'FROM $500+',
                          iconColor: 'text-primary',
                          bgColor: 'bg-primary-fixed/40',
                        },
                      })
                    }
                    className="bg-primary text-on-primary px-5 py-2.5 rounded-2xl storybook-button font-bold text-sm flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    <span>Tambah Layanan Baru</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {services?.items?.map((service) => (
                    <div
                      key={service.id}
                      className="sketchbook-frame bg-surface-container-lowest border-2 border-primary/15 rounded-3xl p-6 relative group hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${service.bgColor || 'bg-secondary-container/40'}`}>
                            <span className={`material-symbols-outlined text-3xl ${service.iconColor || 'text-primary'}`}>
                              {service.icon}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setServiceModal({ open: true, isEdit: true, data: { ...service } })}
                              className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                              title="Edit Layanan"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                requestConfirm(
                                  'Hapus Layanan',
                                  `Apakah Anda yakin ingin menghapus layanan "${service.title}"?`,
                                  () => {
                                    deleteService(service.id)
                                    notify('info', `Layanan "${service.title}" telah dihapus.`)
                                  }
                                )
                              }
                              className="p-1.5 text-outline hover:text-error hover:bg-error-container/30 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Layanan"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </div>

                        <h4 className="font-display-lg text-lg font-bold text-on-surface">{service.title}</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">{service.description}</p>
                      </div>
                      
                      <div className="pt-3 border-t border-dashed border-primary/15">
                        <span className="font-label-caps text-primary font-bold text-xs">{service.price}</span>
                      </div>
                    </div>
                  ))}

                  {services?.items?.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-surface-container-lowest rounded-3xl border border-primary/15">
                      <p className="text-on-surface-variant font-body-md">Belum ada layanan yang ditambahkan.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CMS SUBTAB: HERO */}
            {cmsSubTab === 'hero' && (
              <form onSubmit={handleSaveHero} className="sketchbook-frame bg-surface-container-lowest border-2 border-primary/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                  <div>
                    <h3 className="font-display-lg text-2xl font-bold text-primary">Edit Hero Section</h3>
                    <p className="text-xs text-on-surface-variant">Ubah judul utama, tagline, statistik, dan upload gambar hero utama.</p>
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm storybook-button shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">save</span>
                    <span>Simpan Hero</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Badge Ketersediaan</label>
                    <input
                      type="text"
                      value={heroForm.statusBadge}
                      onChange={(e) => setHeroForm({ ...heroForm, statusBadge: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Nama Seniman</label>
                    <input
                      type="text"
                      value={heroForm.titleName}
                      onChange={(e) => setHeroForm({ ...heroForm, titleName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Profesi / Keahlian</label>
                    <input
                      type="text"
                      value={heroForm.titleRole}
                      onChange={(e) => setHeroForm({ ...heroForm, titleRole: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Kota</label>
                      <input
                        type="text"
                        value={heroForm.titleCity}
                        onChange={(e) => setHeroForm({ ...heroForm, titleCity: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Negara</label>
                      <input
                        type="text"
                        value={heroForm.titleCountry}
                        onChange={(e) => setHeroForm({ ...heroForm, titleCountry: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Deskripsi Subtitle</label>
                  <textarea
                    rows={3}
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  ></textarea>
                </div>

                {/* Hero Image File Upload */}
                <div className="bg-surface-container-low p-5 rounded-2xl border border-primary/15 space-y-3">
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider">Gambar Hero Utama</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border border-primary/20 shrink-0 shadow-sm flex items-center justify-center">
                      {heroForm.imageUrl ? (
                        <img src={heroForm.imageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-outline text-3xl">image</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="file"
                        accept="image/*"
                        ref={heroFileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, (dataUrl) => setHeroForm((prev) => ({ ...prev, imageUrl: dataUrl })))
                        }}
                        className="hidden"
                      />
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => heroFileInputRef.current?.click()}
                          className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">upload</span>
                          <span>Upload File Gambar</span>
                        </button>
                        <input
                          type="text"
                          value={heroForm.imageUrl}
                          onChange={(e) => setHeroForm({ ...heroForm, imageUrl: e.target.value })}
                          placeholder="Atau masukkan URL gambar..."
                          className="flex-1 px-3 py-1.5 bg-white border border-outline/30 rounded-xl text-xs"
                        />
                      </div>
                      <p className="text-[11px] text-on-surface-variant">Pilih file gambar PNG, JPG, WebP dari komputer Anda.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container-low rounded-2xl border border-primary/10 space-y-2">
                    <span className="text-xs font-bold text-primary block uppercase">Statistik 1</span>
                    <input
                      type="text"
                      placeholder="Nilai (cth. 50+)"
                      value={heroForm.stat1Value}
                      onChange={(e) => setHeroForm({ ...heroForm, stat1Value: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-outline/30 rounded-xl text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Label (cth. Books Illustrated)"
                      value={heroForm.stat1Label}
                      onChange={(e) => setHeroForm({ ...heroForm, stat1Label: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-outline/30 rounded-xl text-sm"
                    />
                  </div>

                  <div className="p-4 bg-surface-container-low rounded-2xl border border-primary/10 space-y-2">
                    <span className="text-xs font-bold text-primary block uppercase">Statistik 2</span>
                    <input
                      type="text"
                      placeholder="Nilai (cth. 120+)"
                      value={heroForm.stat2Value}
                      onChange={(e) => setHeroForm({ ...heroForm, stat2Value: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-outline/30 rounded-xl text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Label (cth. Character Designs)"
                      value={heroForm.stat2Label}
                      onChange={(e) => setHeroForm({ ...heroForm, stat2Label: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-outline/30 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </form>
            )}

            {/* CMS SUBTAB: ABOUT */}
            {cmsSubTab === 'about' && (
              <form onSubmit={handleSaveAbout} className="sketchbook-frame bg-surface-container-lowest border-2 border-primary/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                  <div>
                    <h3 className="font-display-lg text-2xl font-bold text-primary">Edit About Section</h3>
                    <p className="text-xs text-on-surface-variant">Ubah biografi seniman, upload foto avatar, dan toolbox.</p>
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm storybook-button shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">save</span>
                    <span>Simpan About</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase mb-1">Judul Kata 1</label>
                    <input
                      type="text"
                      value={aboutForm.headlinePart1}
                      onChange={(e) => setAboutForm({ ...aboutForm, headlinePart1: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase mb-1">Judul Kata 2 (Italic)</label>
                    <input
                      type="text"
                      value={aboutForm.headlinePart2}
                      onChange={(e) => setAboutForm({ ...aboutForm, headlinePart2: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase mb-1">Judul Kata 3</label>
                    <input
                      type="text"
                      value={aboutForm.headlinePart3}
                      onChange={(e) => setAboutForm({ ...aboutForm, headlinePart3: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase mb-1">Judul Kata 4 (Italic)</label>
                    <input
                      type="text"
                      value={aboutForm.headlinePart4}
                      onChange={(e) => setAboutForm({ ...aboutForm, headlinePart4: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Paragraf Cerita 1</label>
                  <textarea
                    rows={3}
                    value={aboutForm.paragraph1}
                    onChange={(e) => setAboutForm({ ...aboutForm, paragraph1: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Paragraf Cerita 2</label>
                  <textarea
                    rows={3}
                    value={aboutForm.paragraph2}
                    onChange={(e) => setAboutForm({ ...aboutForm, paragraph2: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  ></textarea>
                </div>

                {/* About Avatar Upload */}
                <div className="bg-surface-container-low p-5 rounded-2xl border border-primary/15 space-y-3">
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider">Foto Avatar Seniman</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-primary/20 shrink-0 shadow-sm flex items-center justify-center">
                      {aboutForm.avatarUrl ? (
                        <img src={aboutForm.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-outline text-3xl">account_circle</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="file"
                        accept="image/*"
                        ref={aboutFileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, (dataUrl) => setAboutForm((prev) => ({ ...prev, avatarUrl: dataUrl })))
                        }}
                        className="hidden"
                      />
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => aboutFileInputRef.current?.click()}
                          className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">upload</span>
                          <span>Upload File Avatar</span>
                        </button>
                        <input
                          type="text"
                          value={aboutForm.avatarUrl}
                          onChange={(e) => setAboutForm({ ...aboutForm, avatarUrl: e.target.value })}
                          placeholder="Atau masukkan URL gambar..."
                          className="flex-1 px-3 py-1.5 bg-white border border-outline/30 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* CMS SUBTAB: TESTIMONIALS */}
            {cmsSubTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-3xl border-2 border-primary/15">
                  <div>
                    <h3 className="font-display-lg text-2xl font-bold text-primary">Kelola Testimoni Klien</h3>
                    <p className="text-xs text-on-surface-variant">Tambah dan sunting ulasan positif dari penerbit atau penulis.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setTestimonialModal({
                        open: true,
                        isEdit: false,
                        data: {
                          author: '',
                          role: 'Author',
                          quote: '',
                          bgColor: 'bg-secondary-fixed-dim',
                        },
                      })
                    }
                    className="bg-primary text-on-primary px-5 py-2.5 rounded-2xl storybook-button font-bold text-sm flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">add_comment</span>
                    <span>Tambah Testimoni</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials?.items?.map((item) => (
                    <div
                      key={item.id}
                      className="sketchbook-frame bg-surface-container-lowest border-2 border-primary/15 rounded-3xl p-6 space-y-4 relative flex flex-col justify-between hover:shadow-md transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="material-symbols-outlined text-3xl text-primary/30">format_quote</span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => setTestimonialModal({ open: true, isEdit: true, data: { ...item } })}
                              className="p-1 text-primary hover:bg-primary/10 rounded-lg cursor-pointer transition-colors"
                              title="Edit Testimoni"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                requestConfirm(
                                  'Hapus Testimoni',
                                  `Apakah Anda yakin ingin menghapus testimoni dari "${item.author}"?`,
                                  () => {
                                    deleteTestimonial(item.id)
                                    notify('info', `Testimoni dari "${item.author}" telah dihapus.`)
                                  }
                                )
                              }
                              className="p-1 text-outline hover:text-error hover:bg-error-container/30 rounded-lg cursor-pointer transition-colors"
                              title="Hapus Testimoni"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-on-surface-variant italic leading-relaxed">"{item.quote}"</p>
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-primary/10">
                        <div className={`w-9 h-9 rounded-xl ${item.bgColor || 'bg-secondary-fixed-dim'} flex items-center justify-center font-bold text-sm text-primary`}>
                          {item.author ? item.author.charAt(0) : '✨'}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-on-surface">{item.author}</p>
                          <p className="text-[10px] text-on-surface-variant font-bold uppercase">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CMS SUBTAB: CONTACT & FOOTER */}
            {cmsSubTab === 'contact' && (
              <form onSubmit={handleSaveContact} className="sketchbook-frame bg-surface-container-lowest border-2 border-primary/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                  <div>
                    <h3 className="font-display-lg text-2xl font-bold text-primary">Edit Kontak & Footer</h3>
                    <p className="text-xs text-on-surface-variant">Ubah email kontak studio, lokasi, dan teks footer.</p>
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm storybook-button shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">save</span>
                    <span>Simpan Kontak & Footer</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Alamat Email Publik</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Lokasi Studio</label>
                    <input
                      type="text"
                      value={contactForm.location}
                      onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Judul Bagian Kontak</label>
                  <input
                    type="text"
                    value={contactForm.sectionTitle}
                    onChange={(e) => setContactForm({ ...contactForm, sectionTitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Subjudul / Pengantar Kontak</label>
                  <textarea
                    rows={2}
                    value={contactForm.sectionSubtitle}
                    onChange={(e) => setContactForm({ ...contactForm, sectionSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-primary/10">
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Teks Hak Cipta Footer</label>
                    <input
                      type="text"
                      value={footerForm.copyright}
                      onChange={(e) => setFooterForm({ ...footerForm, copyright: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Tagline Footer</label>
                    <input
                      type="text"
                      value={footerForm.craftBadge}
                      onChange={(e) => setFooterForm({ ...footerForm, craftBadge: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </form>
            )}

          </div>
        )}

        {/* TAB 1: COMMISSIONS MANAGER */}
        {activeTab === 'commissions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filterStatus === 'all'
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  Semua ({commissions.length})
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filterStatus === 'active'
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  Aktif ({activeProjectsCount})
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filterStatus === 'completed'
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  Selesai ({completedProjectsCount})
                </button>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-on-primary px-5 py-2.5 rounded-2xl storybook-button font-bold text-sm flex items-center gap-2 shadow-md hover:bg-primary/95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span>Tambah Proyek Baru</span>
              </button>
            </div>

            {/* Commissions List */}
            <div className="grid grid-cols-1 gap-5">
              {filteredCommissions.map((project) => (
                <div
                  key={project.id}
                  className="sketchbook-frame bg-surface-container-lowest border-2 border-primary/15 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-outline uppercase tracking-wider font-label-caps">
                          {project.id}
                        </span>
                        <span className="px-3 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant text-xs font-bold">
                          {project.category}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          Diperbarui: {project.updatedAt}
                        </span>
                      </div>
                      <h3 className="font-display-lg text-xl sm:text-2xl font-bold text-on-surface mt-1">
                        {project.projectTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          project.status === 'Selesai'
                            ? 'bg-secondary-container/60 text-on-secondary-container border-secondary/30'
                            : 'bg-primary-fixed/50 text-on-primary-fixed-variant border-primary/30'
                        }`}
                      >
                        {project.status}
                      </span>
                      <button
                        onClick={() => handleStepStatus(project.id, project.status)}
                        className="px-3.5 py-1.5 rounded-xl bg-surface-container-high hover:bg-primary hover:text-on-primary text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Tingkatkan ke tahap berikutnya"
                      >
                        <span className="material-symbols-outlined text-sm">fast_forward</span>
                        <span>Update Tahap</span>
                      </button>
                      <button
                        onClick={() =>
                          requestConfirm(
                            'Hapus Project',
                            `Apakah Anda yakin ingin menghapus proyek "${project.projectTitle}"?`,
                            () => {
                              deleteCommission(project.id)
                              notify('info', `Proyek "${project.projectTitle}" telah dihapus.`)
                            }
                          )
                        }
                        className="p-1.5 rounded-xl text-outline hover:text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                        title="Hapus Proyek"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-on-surface-variant">Progres Pengerjaan</span>
                      <span className="text-primary">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-sm bg-surface-container-low/60 p-4 rounded-2xl border border-primary/10">
                    <div>
                      <span className="text-xs text-outline font-bold block">Klien / Penerbit</span>
                      <span className="font-bold text-on-surface">{project.clientName}</span>
                      <span className="text-xs text-on-surface-variant block">
                        {project.clientCompany}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-outline font-bold block">Nilai Kontrak</span>
                      <span className="font-bold text-primary">{project.budget}</span>
                    </div>
                    <div>
                      <span className="text-xs text-outline font-bold block">Target Deadline</span>
                      <span className="font-bold text-on-surface">{project.deadline}</span>
                    </div>
                    <div>
                      <span className="text-xs text-outline font-bold block">Deliverables</span>
                      <span className="text-xs text-on-surface-variant line-clamp-2">
                        {project.deliverables}
                      </span>
                    </div>
                  </div>

                  {project.notes && (
                    <div className="text-xs text-on-surface-variant italic bg-surface-container-lowest p-3 rounded-xl border border-dashed border-primary/20 flex items-start gap-2">
                      <span className="material-symbols-outlined text-sm text-tertiary">edit_note</span>
                      <span>{project.notes}</span>
                    </div>
                  )}
                </div>
              ))}

              {filteredCommissions.length === 0 && (
                <div className="text-center py-12 bg-surface-container-lowest rounded-3xl border border-primary/15">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">folder_off</span>
                  <p className="font-body-md text-on-surface-variant">Tidak ada proyek dalam kategori ini.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: INQUIRIES / INBOX */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-display-lg text-xl font-bold text-on-surface">
                Pesan Masuk dari Formulir Kontak Publik
              </h2>
              <span className="text-xs text-on-surface-variant font-bold">
                Total {inquiries.length} Pesan
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className={`sketchbook-frame bg-surface-container-lowest border-2 rounded-3xl p-6 transition-all ${
                    !inq.isRead ? 'border-primary shadow-md' : 'border-primary/15'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {inq.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface text-base">{inq.name}</h4>
                        <a
                          href={`mailto:${inq.email}`}
                          className="text-xs text-primary hover:underline"
                        >
                          {inq.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-on-surface-variant font-body-md">{inq.date}</span>
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                          inq.isRead
                            ? 'bg-surface-container-high text-on-surface-variant'
                            : 'bg-error-container text-on-error-container'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>
                  </div>

                  {(inq.service && inq.service !== 'General Commission & Story Inquiry') || (inq.budgetRange && inq.budgetRange !== 'To be discussed') ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-surface-container-low p-3 rounded-xl mb-3">
                      <div>
                        <span className="text-outline font-bold">Layanan yang Diminta:</span>{' '}
                        <span className="font-bold text-on-surface">{inq.service}</span>
                      </div>
                      <div>
                        <span className="text-outline font-bold">Estimasi Anggaran:</span>{' '}
                        <span className="font-bold text-primary">{inq.budgetRange}</span>
                      </div>
                    </div>
                  ) : null}

                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed bg-surface-container-lowest p-3 rounded-xl border border-primary/10 mb-4">
                    "{inq.message}"
                  </p>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => toggleInquiryStatus(inq.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-surface-container-high hover:bg-secondary-container hover:text-on-secondary-container transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {inq.isRead ? 'mark_email_unread' : 'mark_email_read'}
                      </span>
                      <span>{inq.isRead ? 'Tandai Belum Dibalas' : 'Tandai Sudah Dibalas'}</span>
                    </button>
                    <button
                      onClick={() =>
                        requestConfirm(
                          'Hapus Pesan Inbox',
                          `Apakah Anda yakin ingin menghapus pesan dari "${inq.name}"?`,
                          () => {
                            deleteInquiry(inq.id)
                            notify('info', 'Pesan telah dihapus.')
                          }
                        )
                      }
                      className="p-2 rounded-xl text-outline hover:text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STUDIO SETTINGS & PASSWORD */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Ubah Alamat Email Admin */}
            <div className="sketchbook-frame bg-surface-container-lowest border-2 border-primary/15 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-2">
                  <span className="material-symbols-outlined text-sm">mark_email_read</span>
                  <span>Akun Administrator</span>
                </div>
                <h3 className="font-display-lg text-2xl font-bold text-on-surface">
                  Ubah Alamat Email Admin
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant mt-1">
                  Perbarui alamat email resmi untuk login dan notifikasi administrasi studio.
                </p>
              </div>

              {/* Current Active Email Badge */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-primary/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider block">
                    Email Aktif Saat Ini
                  </span>
                  <span className="font-bold text-sm text-primary font-mono mt-0.5 block">
                    {user?.email || 'admin@sititasya.com'}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span>Terverifikasi</span>
                </span>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                    Alamat Email Baru
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                      mail
                    </span>
                    <input
                      type="email"
                      required
                      value={emailState.newEmail}
                      onChange={(e) => setEmailState((prev) => ({ ...prev, newEmail: e.target.value }))}
                      placeholder="contoh: nama.baru@sititasya.com"
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline/30 rounded-2xl text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                    Konfirmasi Kata Sandi Saat Ini
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                      lock
                    </span>
                    <input
                      type="password"
                      required
                      value={emailState.confirmPassword}
                      onChange={(e) => setEmailState((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Masukkan sandi saat ini untuk konfirmasi"
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline/30 rounded-2xl text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-outline">info</span>
                    <span>Kata sandi diperlukan demi keamanan otorisasi pergantian email.</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingEmail}
                  className="w-full bg-primary text-on-primary py-3.5 rounded-2xl font-bold storybook-button shadow-md flex items-center justify-center gap-2 hover:bg-primary/95 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isUpdatingEmail ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Menyimpan Email...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">save</span>
                      <span>Simpan Perubahan Email</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Change Admin Password */}
            <div className="sketchbook-frame bg-surface-container-lowest border-2 border-primary/15 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-2">
                  <span className="material-symbols-outlined text-sm">key</span>
                  <span>Keamanan Akun</span>
                </div>
                <h3 className="font-display-lg text-2xl font-bold text-on-surface">
                  Keamanan & Ubah Sandi Admin
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant mt-1">
                  Perbarui kata sandi untuk melindungi akses ke panel admin studio.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                    Kata Sandi Saat Ini
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                      lock
                    </span>
                    <input
                      type="password"
                      required
                      value={pwState.currentPassword}
                      onChange={(e) => setPwState((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Masukkan sandi saat ini"
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline/30 rounded-2xl text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                    Kata Sandi Baru (Min. 6 Karakter)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                      lock_reset
                    </span>
                    <input
                      type="password"
                      required
                      value={pwState.newPassword}
                      onChange={(e) => setPwState((prev) => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Masukkan sandi baru"
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline/30 rounded-2xl text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                      check
                    </span>
                    <input
                      type="password"
                      required
                      value={pwState.confirmPassword}
                      onChange={(e) => setPwState((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Ulangi sandi baru"
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline/30 rounded-2xl text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="w-full bg-primary text-on-primary py-3.5 rounded-2xl font-bold storybook-button shadow-md flex items-center justify-center gap-2 hover:bg-primary/95 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isUpdatingPassword ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Menyimpan Sandi...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">save</span>
                      <span>Perbarui Kata Sandi</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        )}

      </div>

      {/* GALLERY ADD / EDIT MODAL (CLEAN FILE UPLOADER ONLY, NO PRESET PICKER) */}
      {galleryModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest border-2 border-primary/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8">
            <button
              onClick={() => setGalleryModal({ open: false, isEdit: false, data: null })}
              className="absolute top-4 right-4 text-outline hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="font-display-lg text-2xl font-bold text-on-surface mb-1">
              {galleryModal.isEdit ? 'Edit Karya Galeri' : 'Tambah Karya ke Galeri'}
            </h3>
            <p className="text-xs text-on-surface-variant mb-5">
              Upload file gambar langsung dari komputer Anda.
            </p>

            <form onSubmit={handleGallerySubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1">Judul Artwork *</label>
                <input
                  type="text"
                  required
                  value={galleryModal.data.title}
                  onChange={(e) => setGalleryModal({ ...galleryModal, data: { ...galleryModal.data, title: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  placeholder="cth. Petualangan Hutan Ajaib"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase mb-1">Tag Kategori</label>
                  <input
                    type="text"
                    required
                    value={galleryModal.data.categoryTag}
                    onChange={(e) => setGalleryModal({ ...galleryModal, data: { ...galleryModal.data, categoryTag: e.target.value } })}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                    placeholder="cth. Book Illustration"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase mb-1">Filter Tab</label>
                  <select
                    value={galleryModal.data.categoryKey}
                    onChange={(e) => setGalleryModal({ ...galleryModal, data: { ...galleryModal.data, categoryKey: e.target.value } })}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  >
                    <option value="Books">Books</option>
                    <option value="Characters">Characters</option>
                    <option value="Printed Art/Painting">Printed Art/Painting</option>
                  </select>
                </div>
              </div>

              {/* FILE UPLOAD BOX */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                  Berkas Gambar Artwork (Upload File) *
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={galleryFileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFileUpload(file, (dataUrl) => {
                        setGalleryModal((prev) => ({
                          ...prev,
                          data: { ...prev.data, imgSrc: dataUrl },
                        }))
                      })
                    }
                  }}
                  className="hidden"
                />

                {/* Upload Trigger Area & Live Preview */}
                <div className="p-4 border-2 border-dashed border-primary/30 rounded-2xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors text-center">
                  {galleryModal.data.imgSrc ? (
                    <div className="space-y-3">
                      <div className="w-full h-48 rounded-xl overflow-hidden bg-black/5 flex items-center justify-center border border-primary/20 relative group">
                        <img
                          src={galleryModal.data.imgSrc}
                          alt="Preview Artwork"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => galleryFileInputRef.current?.click()}
                            className="bg-white text-primary px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">swap_horiz</span>
                            <span>Ganti Gambar</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs px-1">
                        <span className="text-secondary font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">check_circle</span> Gambar Terpilih
                        </span>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => galleryFileInputRef.current?.click()}
                            className="text-primary font-bold underline hover:text-primary/80 cursor-pointer"
                          >
                            Ganti File
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setGalleryModal((prev) => ({
                                ...prev,
                                data: { ...prev.data, imgSrc: '' },
                              }))
                            }
                            className="text-error font-bold underline hover:text-error/80 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="py-8 cursor-pointer space-y-2"
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
                        <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                      </div>
                      <p className="text-sm font-bold text-on-surface">Klik di sini untuk upload gambar dari komputer</p>
                      <p className="text-xs text-on-surface-variant">Mendukung file PNG, JPG, JPEG, SVG, WebP</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1">Deskripsi Alt Text (Aksesibilitas)</label>
                <input
                  type="text"
                  value={galleryModal.data.alt || ''}
                  onChange={(e) => setGalleryModal({ ...galleryModal, data: { ...galleryModal.data, alt: e.target.value } })}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  placeholder="cth. Ilustrasi seorang anak membaca di bawah pohon rindang..."
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setGalleryModal({ open: false, isEdit: false, data: null })}
                  className="flex-1 py-2.5 border border-outline/30 rounded-xl font-bold text-sm text-on-surface-variant cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm storybook-button shadow-md cursor-pointer"
                >
                  Simpan Karya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {serviceModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest border-2 border-primary/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative my-8">
            <button
              onClick={() => setServiceModal({ open: false, isEdit: false, data: null })}
              className="absolute top-4 right-4 text-outline hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="font-display-lg text-2xl font-bold text-on-surface mb-2">
              {serviceModal.isEdit ? 'Edit Layanan' : 'Tambah Layanan Baru'}
            </h3>

            <form onSubmit={handleServiceSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1">Judul Layanan *</label>
                <input
                  type="text"
                  required
                  value={serviceModal.data.title}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, title: e.target.value } })}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  placeholder="cth. Desain Buku Cerita"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1">Nama Ikon (Material Symbols) *</label>
                <input
                  type="text"
                  required
                  value={serviceModal.data.icon}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, icon: e.target.value } })}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  placeholder="cth. menu_book, face_6, palette, frame_person, brush"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1">Harga / Estimasi Biaya *</label>
                <input
                  type="text"
                  required
                  value={serviceModal.data.price}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, price: e.target.value } })}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  placeholder="cth. FROM $1,000+ atau Rp 10.000.000+"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={serviceModal.data.description}
                  onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, description: e.target.value } })}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  placeholder="Deskripsikan cakupan layanan..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setServiceModal({ open: false, isEdit: false, data: null })}
                  className="flex-1 py-2.5 border border-outline/30 rounded-xl font-bold text-sm text-on-surface-variant cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm storybook-button shadow-md cursor-pointer"
                >
                  Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Testimonial Modal */}
      {testimonialModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest border-2 border-primary/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative my-8">
            <button
              onClick={() => setTestimonialModal({ open: false, isEdit: false, data: null })}
              className="absolute top-4 right-4 text-outline hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="font-display-lg text-2xl font-bold text-on-surface mb-2">
              {testimonialModal.isEdit ? 'Edit Testimoni' : 'Tambah Testimoni'}
            </h3>

            <form onSubmit={handleTestimonialSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase mb-1">Nama Klien / Penulis *</label>
                  <input
                    type="text"
                    required
                    value={testimonialModal.data.author}
                    onChange={(e) => setTestimonialModal({ ...testimonialModal, data: { ...testimonialModal.data, author: e.target.value } })}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                    placeholder="cth. Elena R."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase mb-1">Peran / Organisasi *</label>
                  <input
                    type="text"
                    required
                    value={testimonialModal.data.role}
                    onChange={(e) => setTestimonialModal({ ...testimonialModal, data: { ...testimonialModal.data, role: e.target.value } })}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                    placeholder="cth. Author, UK"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1">Isi Kutipan Ulasan *</label>
                <textarea
                  rows={4}
                  required
                  value={testimonialModal.data.quote}
                  onChange={(e) => setTestimonialModal({ ...testimonialModal, data: { ...testimonialModal.data, quote: e.target.value } })}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  placeholder="Tulis ulasan klien di sini..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTestimonialModal({ open: false, isEdit: false, data: null })}
                  className="flex-1 py-2.5 border border-outline/30 rounded-xl font-bold text-sm text-on-surface-variant cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm storybook-button shadow-md cursor-pointer"
                >
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest border-2 border-primary/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-outline hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="mb-6">
              <h3 className="font-display-lg text-2xl font-bold text-on-surface">
                Tambah Project Baru
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant mt-1">
                Catat pesanan baru dari penerbit atau klien komersial.
              </p>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1">
                  Judul Proyek / Seri Ilustrasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="cth. Buku Cerita 'Kancil & Buaya Cerdas'"
                  value={newProject.projectTitle}
                  onChange={(e) => setNewProject({ ...newProject, projectTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase mb-1">
                    Nama Klien *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="cth. Sarah Jenkins"
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase mb-1">
                    Perusahaan / Penerbit
                  </label>
                  <input
                    type="text"
                    placeholder="cth. Bintang Books"
                    value={newProject.clientCompany}
                    onChange={(e) => setNewProject({ ...newProject, clientCompany: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase mb-1">
                    Kategori Proyek
                  </label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  >
                    <option value="Children Book">Children Book</option>
                    <option value="Character Design">Character Design</option>
                    <option value="Editorial & Cover">Editorial & Cover</option>
                    <option value="Merchandise Design">Merchandise Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase mb-1">
                    Nilai Kontrak / Budget
                  </label>
                  <input
                    type="text"
                    placeholder="cth. Rp 12.000.000"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="text"
                    placeholder="cth. 30 Okt 2026"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface uppercase mb-1">
                    Deliverables
                  </label>
                  <input
                    type="text"
                    placeholder="cth. 14 Halaman + Vektor Master"
                    value={newProject.deliverables}
                    onChange={(e) => setNewProject({ ...newProject, deliverables: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1">
                  Catatan Proyek / Moodboard
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan tambahan revisi atau preferensi warna..."
                  value={newProject.notes}
                  onChange={(e) => setNewProject({ ...newProject, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline/30 rounded-xl text-sm"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-outline/30 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-low cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm storybook-button shadow-md cursor-pointer"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM IN-APP CONFIRMATION MODAL */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest border-2 border-error/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative text-center space-y-4 animate-bounce-short">
            <div className="w-14 h-14 rounded-full bg-error-container text-error flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-3xl">delete_forever</span>
            </div>
            
            <h3 className="font-display-lg text-2xl font-bold text-on-surface">{confirmModal.title}</h3>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              {confirmModal.message}
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ open: false, title: '', message: '', onConfirm: null })}
                className="flex-1 py-3 border border-outline/30 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-low cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => confirmModal.onConfirm && confirmModal.onConfirm()}
                className="flex-1 py-3 bg-error text-white rounded-xl font-bold text-sm shadow-md hover:bg-error/90 transition-all cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
