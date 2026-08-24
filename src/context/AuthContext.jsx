import { useState, useEffect } from 'react'
import { AuthContext } from './auth-core'
import { authApi, commissionsApi, inquiriesApi, studioApi } from '../services/api'

export function AuthProvider({ children }) {
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
  const [commissions, setCommissions] = useState([])

  // Inquiries / Messages state
  const [inquiries, setInquiries] = useState([])

  // Studio Availability Settings
  const [studioSettings, setStudioSettings] = useState({
    isOpenForCommissions: true,
    currentSlot: '2 Slot Tersedia untuk Q4 2026',
    statusNotice: 'Menerima pesanan ilustrasi buku anak dan desain karakter komersial.',
  })

  // Load initial data from PostgreSQL API
  useEffect(() => {
    async function loadData() {
      try {
        const [commsData, inqsData, settingsData] = await Promise.all([
          commissionsApi.getAll().catch(() => []),
          inquiriesApi.getAll().catch(() => []),
          studioApi.getSettings().catch(() => null),
        ])

        if (commsData) setCommissions(commsData)
        if (inqsData) setInquiries(inqsData)
        if (settingsData) setStudioSettings(settingsData)
      } catch (err) {
        console.error('Gagal mengambil data dari database PostgreSQL:', err)
      }
    }

    loadData()
  }, [])

  // Sync session to localStorage
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

  // Login function with PostgreSQL authentication
  const login = async (email, password) => {
    try {
      const res = await authApi.login(email, password)
      if (res.success && res.user) {
        setUser(res.user)
        return { success: true, user: res.user }
      }
      return { success: false, message: 'Autentikasi gagal.' }
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Email atau kata sandi admin salah.',
      }
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
  }

  // Change Admin Password in PostgreSQL
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await authApi.changePassword(currentPassword, newPassword)
      return { success: true, message: res.message }
    } catch (err) {
      return { success: false, message: err.message || 'Gagal mengubah kata sandi.' }
    }
  }

  // Commission Management with PostgreSQL
  const updateCommissionStatus = async (id, newStatus, newProgress) => {
    // Optimistic UI update
    setCommissions((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              status: newStatus,
              progress: newProgress !== undefined ? newProgress : item.progress,
            }
          : item
      )
    )

    try {
      await commissionsApi.update(id, { status: newStatus, progress: newProgress })
    } catch (err) {
      console.error('Gagal memperbarui komisi di database:', err)
    }
  }

  const addCommission = async (newProject) => {
    try {
      const created = await commissionsApi.create(newProject)
      setCommissions((prev) => [created, ...prev])
      return created
    } catch (err) {
      console.error('Gagal menambahkan komisi ke database:', err)
      const fallback = {
        ...newProject,
        id: `COM-${Date.now()}`,
        updatedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      }
      setCommissions((prev) => [fallback, ...prev])
      return fallback
    }
  }

  const deleteCommission = async (id) => {
    setCommissions((prev) => prev.filter((item) => String(item.id) !== String(id)))
    try {
      await commissionsApi.delete(id)
    } catch (err) {
      console.error('Gagal menghapus komisi dari database:', err)
    }
  }

  // Inquiries Management with PostgreSQL
  const addInquiry = async (inquiry) => {
    try {
      const created = await inquiriesApi.create(inquiry)
      setInquiries((prev) => [created, ...prev])
      return created
    } catch (err) {
      console.error('Gagal menyimpan pesan ke database:', err)
      const fallback = {
        ...inquiry,
        id: `INQ-${Date.now().toString().slice(-4)}`,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        isRead: false,
        status: 'Menunggu Balasan',
      }
      setInquiries((prev) => [fallback, ...prev])
      return fallback
    }
  }

  const toggleInquiryStatus = async (id) => {
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

    try {
      await inquiriesApi.toggleStatus(id)
    } catch (err) {
      console.error('Gagal toggle status pesan di database:', err)
    }
  }

  const deleteInquiry = async (id) => {
    setInquiries((prev) => prev.filter((item) => String(item.id) !== String(id)))
    try {
      await inquiriesApi.delete(id)
    } catch (err) {
      console.error('Gagal menghapus pesan dari database:', err)
    }
  }

  // Studio Settings update with PostgreSQL
  const updateStudioSettings = async (newSettings) => {
    setStudioSettings((prev) => ({ ...prev, ...newSettings }))
    try {
      await studioApi.updateSettings({ ...studioSettings, ...newSettings })
    } catch (err) {
      console.error('Gagal menyimpan pengaturan studio ke database:', err)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        adminCredentials: {
          email: 'admin@sititasya.com',
          password: 'admin123',
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
