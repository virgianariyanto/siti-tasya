const API_BASE = '/api'

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Terjadi kesalahan pada server')
    }
    return data
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err)
    throw err
  }
}

// ==================== AUTH API ====================
export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
}

// ==================== CONTENT API ====================
export const contentApi = {
  getAll: () => request('/content'),

  updateSection: (section, data) =>
    request(`/content/${section}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}

// ==================== SERVICES API ====================
export const servicesApi = {
  getAll: () => request('/services'),

  create: (service) =>
    request('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    }),

  update: (id, service) =>
    request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    }),

  delete: (id) =>
    request(`/services/${id}`, {
      method: 'DELETE',
    }),
}

// ==================== GALLERY API ====================
export const galleryApi = {
  getAll: () => request('/gallery'),

  create: (item) =>
    request('/gallery', {
      method: 'POST',
      body: JSON.stringify(item),
    }),

  update: (id, item) =>
    request(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    }),

  delete: (id) =>
    request(`/gallery/${id}`, {
      method: 'DELETE',
    }),
}

// ==================== TESTIMONIALS API ====================
export const testimonialsApi = {
  getAll: () => request('/testimonials'),

  create: (item) =>
    request('/testimonials', {
      method: 'POST',
      body: JSON.stringify(item),
    }),

  update: (id, item) =>
    request(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    }),

  delete: (id) =>
    request(`/testimonials/${id}`, {
      method: 'DELETE',
    }),
}

// ==================== COMMISSIONS API ====================
export const commissionsApi = {
  getAll: () => request('/commissions'),

  create: (commission) =>
    request('/commissions', {
      method: 'POST',
      body: JSON.stringify(commission),
    }),

  update: (id, data) =>
    request(`/commissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    request(`/commissions/${id}`, {
      method: 'DELETE',
    }),
}

// ==================== INQUIRIES API ====================
export const inquiriesApi = {
  getAll: () => request('/inquiries'),

  create: (inquiry) =>
    request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiry),
    }),

  toggleStatus: (id) =>
    request(`/inquiries/${id}/toggle`, {
      method: 'PUT',
    }),

  delete: (id) =>
    request(`/inquiries/${id}`, {
      method: 'DELETE',
    }),
}

// ==================== STUDIO SETTINGS API ====================
export const studioApi = {
  getSettings: () => request('/studio/settings'),

  updateSettings: (settings) =>
    request('/studio/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
}
