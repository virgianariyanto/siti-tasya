import { useState, useEffect } from 'react'
import { AuthContext } from './auth-core'

const DEFAULT_ADMIN = {
  email: 'admin@sititasya.com',
  secondaryEmail: 'siti.tasya@studio.com',
  password: 'admin123',
  name: 'Siti Tasya',
  role: 'admin',
  title: 'Principal Illustrator & Studio Owner',
  avatar: '🎨',
  lastLogin: null,
}

const INITIAL_COMMISSIONS = [
  {
    id: 'COM-2024-001',
    clientName: 'Sarah Jenkins',
    clientCompany: 'Bintang Story Books',
    clientEmail: 'sarah.j@bintangbooks.id',
    projectTitle: 'Buku Cerita "Petualangan Kiki si Kancil Cilik"',
    category: 'Children Book',
    budget: 'Rp 14.500.000',
    deadline: '15 Sep 2026',
    status: 'In Progress (Pewarnaan)', // Briefing -> Sketsa -> Pewarnaan -> Finalisasi -> Selesai
    progress: 70,
    deliverables: '18 Ilustrasi Halaman Penuh + Sampul Hardcover',
    notes: 'Karakter utama butuh sedikit penyesuaian warna rompi agar lebih cerah.',
    updatedAt: '24 Agt 2026',
  },
  {
    id: 'COM-2024-002',
    clientName: 'Arif Wicaksono',
    clientCompany: 'Pustaka Ceria Nusantara',
    clientEmail: 'arif@pustakaceria.com',
    projectTitle: 'Kumpulan Fabel Nusantara: Satwa Hutan Mistis',
    category: 'Editorial & Cover',
    budget: 'Rp 9.200.000',
    deadline: '28 Sep 2026',
    status: 'Sketsa Kasar',
    progress: 35,
    deliverables: '8 Ilustrasi Double-Spread + Spot Art',
    notes: 'Menunggu persetujuan sketsa konsep burung kasuari ajaib.',
    updatedAt: '22 Agt 2026',
  },
  {
    id: 'COM-2024-003',
    clientName: 'Nadia Rahma',
    clientCompany: 'Studio Kelinci Kecil Merch',
    clientEmail: 'nadia@kelincikecil.store',
    projectTitle: 'Stiker Pack & Enamel Pin "Fauna Lucu Tropis"',
    category: 'Merchandise Design',
    budget: 'Rp 6.000.000',
    deadline: '05 Okt 2026',
    status: 'Briefing',
    progress: 15,
    deliverables: '12 Vektor Desain Karakter + Mockup Produk',
    notes: 'Klien mengirim moodboard palet warna pastel hangat.',
    updatedAt: '20 Agt 2026',
  },
  {
    id: 'COM-2024-004',
    clientName: 'David Haryanto',
    clientCompany: 'EduKids App',
    clientEmail: 'david@edukids.io',
    projectTitle: 'Ilustrasi Interaktif Edukasi Angka & Huruf',
    category: 'Digital Illustration',
    budget: 'Rp 18.000.000',
    deadline: '10 Agt 2026',
    status: 'Selesai',
    progress: 100,
    deliverables: '26 Ilustrasi Alfabet + File Master SVG/PNG',
    notes: 'Proyek selesai & pembayaran termin lunas.',
    updatedAt: '12 Agt 2026',
  },
]

const INITIAL_INQUIRIES = [
  {
    id: 'INQ-101',
    name: 'Maya Kusuma',
    email: 'maya.kusuma@literasipopuler.id',
    service: 'Children Book Series',
    budgetRange: 'Rp 10.000.000 - Rp 20.000.000',
    message:
      'Halo Siti Tasya! Kami berencana menerbitkan seri 3 buku cerita anak tentang emosi dan empati. Kami sangat menyukai gaya ilustrasi buku Anda yang bernuansa hangat dan penuh cerita. Bisakah kita berdiskusi jadwal untuk Q4?',
    date: '23 Agt 2026',
    isRead: false,
    status: 'Menunggu Balasan',
  },
  {
    id: 'INQ-102',
    name: 'Rian Pratama',
    email: 'rian@brandkopi.co.id',
    service: 'Packaging & Mascot',
    budgetRange: 'Rp 5.000.000 - Rp 10.000.000',
    message:
      'Kami membutuhkan ilustrasi maskot tupai kopi untuk packaging biji kopi edisi liburan akhir tahun. Gaya yang diinginkan whimsical line-art dengan aksen watercolor.',
    date: '21 Agt 2026',
    isRead: true,
    status: 'Sudah Dibalas',
  },
  {
    id: 'INQ-103',
    name: 'Jessica Tan',
    email: 'jessica.tan@singaporelit.org',
    service: 'Picture Book Illustration',
    budgetRange: '> Rp 20.000.000',
    message:
      'Inquiry for 32-page bilingual picture book international publishing. Looking forward to your availability for early 2027.',
    date: '18 Agt 2026',
    isRead: true,
    status: 'Sudah Dibalas',
  },
]

export function AuthProvider({ children }) {
  // Admin credentials state (allows password change)
  const [adminConfig, setAdminConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('siti_tasya_admin_config')
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN
    } catch {
      return DEFAULT_ADMIN
    }
  })

  // Logged in user session
  const [user, setUser] = useState(() => {
    try {
      const savedSession = localStorage.getItem('siti_tasya_admin_session')
      return savedSession ? JSON.parse(savedSession) : null
    } catch {
      return null
    }
  })

  // Studio Commissions state
  const [commissions, setCommissions] = useState(() => {
    try {
      const saved = localStorage.getItem('siti_tasya_commissions')
      return saved ? JSON.parse(saved) : INITIAL_COMMISSIONS
    } catch {
      return INITIAL_COMMISSIONS
    }
  })

  // Inquiries / Messages state
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('siti_tasya_inquiries')
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES
    } catch {
      return INITIAL_INQUIRIES
    }
  })

  // Studio Availability Settings
  const [studioSettings, setStudioSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('siti_tasya_studio_settings')
      return saved
        ? JSON.parse(saved)
        : {
            isOpenForCommissions: true,
            currentSlot: '2 Slot Tersedia untuk Q4 2026',
            statusNotice: 'Menerima pesanan ilustrasi buku anak dan desain karakter komersial.',
          }
    } catch {
      return {
        isOpenForCommissions: true,
        currentSlot: '2 Slot Tersedia untuk Q4 2026',
        statusNotice: 'Menerima pesanan ilustrasi buku anak dan desain karakter komersial.',
      }
    }
  })

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('siti_tasya_admin_config', JSON.stringify(adminConfig))
    } catch (e) {
      console.error(e)
    }
  }, [adminConfig])

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('siti_tasya_admin_session', JSON.stringify(user))
      } else {
        localStorage.removeItem('siti_tasya_admin_session')
      }
    } catch (e) {
      console.error(e)
    }
  }, [user])

  useEffect(() => {
    try {
      localStorage.setItem('siti_tasya_commissions', JSON.stringify(commissions))
    } catch (e) {
      console.error(e)
    }
  }, [commissions])

  useEffect(() => {
    try {
      localStorage.setItem('siti_tasya_inquiries', JSON.stringify(inquiries))
    } catch (e) {
      console.error(e)
    }
  }, [inquiries])

  useEffect(() => {
    try {
      localStorage.setItem('siti_tasya_studio_settings', JSON.stringify(studioSettings))
    } catch (e) {
      console.error(e)
    }
  }, [studioSettings])

  // Login function
  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase()
    const validEmails = [adminConfig.email.toLowerCase(), adminConfig.secondaryEmail?.toLowerCase()]

    if (validEmails.includes(cleanEmail) && password === adminConfig.password) {
      const loggedUser = {
        name: adminConfig.name,
        email: cleanEmail,
        role: 'admin',
        title: adminConfig.title,
        avatar: adminConfig.avatar,
        loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      }
      setUser(loggedUser)
      return { success: true, user: loggedUser }
    } else {
      return {
        success: false,
        message: 'Email atau kata sandi admin salah. Silakan periksa kembali kredensial Anda.',
      }
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
  }

  // Change Admin Password
  const changePassword = (currentPassword, newPassword) => {
    if (currentPassword !== adminConfig.password) {
      return { success: false, message: 'Kata sandi saat ini tidak cocok.' }
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Kata sandi baru minimal 6 karakter.' }
    }
    setAdminConfig((prev) => ({ ...prev, password: newPassword }))
    return { success: true, message: 'Kata sandi admin berhasil diperbarui!' }
  }

  // Commission Management
  const updateCommissionStatus = (id, newStatus, newProgress) => {
    setCommissions((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              status: newStatus,
              progress: newProgress !== undefined ? newProgress : item.progress,
              updatedAt: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
            }
          : item
      )
    )
  }

  const addCommission = (newProject) => {
    const newItem = {
      ...newProject,
      id: `COM-${new Date().getFullYear()}-${String(commissions.length + 1).padStart(3, '0')}`,
      updatedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    }
    setCommissions((prev) => [newItem, ...prev])
    return newItem
  }

  const deleteCommission = (id) => {
    setCommissions((prev) => prev.filter((item) => String(item.id) !== String(id)))
  }

  // Inquiries Management
  const addInquiry = (inquiry) => {
    const newInq = {
      ...inquiry,
      id: `INQ-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      isRead: false,
      status: 'Menunggu Balasan',
      service: inquiry.service || 'General Inquiry',
      budgetRange: inquiry.budgetRange || 'Menyesuaikan Diskusi',
    }
    setInquiries((prev) => [newInq, ...prev])
    return newInq
  }

  const toggleInquiryStatus = (id) => {
    setInquiries((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              isRead: !item.isRead,
              status: item.isRead ? 'Menunggu Balasan' : 'Sudah Dibalas',
            }
          : item
      )
    )
  }

  const deleteInquiry = (id) => {
    setInquiries((prev) => prev.filter((item) => String(item.id) !== String(id)))
  }

  // Studio Settings update
  const updateStudioSettings = (newSettings) => {
    setStudioSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        adminCredentials: {
          email: adminConfig.email,
          password: adminConfig.password,
        },
        login,
        logout,
        changePassword,
        commissions,
        updateCommissionStatus,
        addCommission,
        deleteCommission,
        inquiries,
        addInquiry,
        toggleInquiryStatus,
        deleteInquiry,
        studioSettings,
        updateStudioSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

