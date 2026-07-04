// API Service Layer for Foodbank Voucher Management System
// Connected directly to Railway Backend via Next.js rewrites (/api/v1)

const API_BASE_URL = '/api/v1'

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }
}

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user_info')
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

export const setUser = (user) => {
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem('user_info', JSON.stringify(user))
    } else {
      localStorage.removeItem('user_info')
    }
  }
}

async function fetcher(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(url, config)
    if (response.status === 401) {
      console.warn(`Unauthorized access on ${endpoint}. User may need to log in.`)
    }
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.message || data.error?.message || data.error || `API request failed with status ${response.status}`)
    }
    return data
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    throw error
  }
}

export const apiService = {
  // 🔐 Authentication (auth.routes.js)
  login: async (email, password) => {
    const response = await fetcher('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const token = response.session?.access_token || response.token || response.data?.token
    if (token) setAuthToken(token)
    if (response.user) setUser(response.user)
    return response
  },

  logout: async () => {
    try {
      await fetcher('/auth/logout', { method: 'POST' })
    } catch (e) {
      console.error('Logout failed on backend:', e)
    } finally {
      setAuthToken(null)
      setUser(null)
    }
  },

  refreshToken: async () => {
    return await fetcher('/auth/refresh', { method: 'POST' })
  },

  getProfile: async () => {
    return await fetcher('/auth/me')
  },

  // 👥 Clients (client.routes.js)
  getClients: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return await fetcher(`/clients${query ? `?${query}` : ''}`)
  },

  getClient: async (id) => {
    return await fetcher(`/clients/${id}`)
  },

  getClientHistory: async (id) => {
    return await fetcher(`/clients/${id}/history`)
  },

  createClient: async (clientData) => {
    return await fetcher('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    })
  },

  updateClient: async (id, clientData) => {
    return await fetcher(`/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(clientData),
    })
  },

  deleteClient: async (id) => {
    return await fetcher(`/clients/${id}`, { method: 'DELETE' })
  },

  // 🎟️ Vouchers (voucher.routes.js)
  getVouchers: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return await fetcher(`/vouchers${query ? `?${query}` : ''}`)
  },

  getVoucherByCode: async (code) => {
    return await fetcher(`/vouchers/code/${code}`)
  },

  getVoucher: async (id) => {
    return await fetcher(`/vouchers/${id}`)
  },

  printVoucher: async (id) => {
    return await fetcher(`/vouchers/${id}/print`)
  },

  issueVoucher: async (voucherData) => {
    return await fetcher('/vouchers', {
      method: 'POST',
      body: JSON.stringify(voucherData),
    })
  },

  checkRepeat: async (clientId) => {
    return await fetcher('/vouchers/check-repeat', {
      method: 'POST',
      body: JSON.stringify({ clientId }),
    })
  },

  updateVoucher: async (id, voucherData) => {
    return await fetcher(`/vouchers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(voucherData),
    })
  },

  fulfillVoucher: async (id) => {
    return await fetcher(`/vouchers/${id}/fulfill`, { method: 'PATCH' })
  },

  cancelVoucher: async (id, reason) => {
    return await fetcher(`/vouchers/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    })
  },

  // 🏢 Centres (centre.routes.js)
  getCentres: async () => {
    return await fetcher('/centres')
  },

  getCentre: async (id) => {
    return await fetcher(`/centres/${id}`)
  },

  createCentre: async (centreData) => {
    return await fetcher('/centres', {
      method: 'POST',
      body: JSON.stringify(centreData),
    })
  },

  updateCentre: async (id, centreData) => {
    return await fetcher(`/centres/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(centreData),
    })
  },

  deleteCentre: async (id) => {
    return await fetcher(`/centres/${id}`, { method: 'DELETE' })
  },

  // 👤 Users (user.routes.js)
  getUsers: async () => {
    return await fetcher('/users')
  },

  getUser: async (id) => {
    return await fetcher(`/users/${id}`)
  },

  createUser: async (userData) => {
    return await fetcher('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  updateUser: async (id, userData) => {
    return await fetcher(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    })
  },

  deleteUser: async (id) => {
    return await fetcher(`/users/${id}`, { method: 'DELETE' })
  },

  assignCentres: async (id, centreIds) => {
    return await fetcher(`/users/${id}/assign-centres`, {
      method: 'POST',
      body: JSON.stringify({ centreIds }),
    })
  },

  // 📊 Reports (report.routes.js)
  getDashboardReports: async () => {
    return await fetcher('/reports/dashboard')
  },

  getVoucherReports: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return await fetcher(`/reports/vouchers${query ? `?${query}` : ''}`)
  },

  getClientReports: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return await fetcher(`/reports/clients${query ? `?${query}` : ''}`)
  },

  exportReports: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return await fetcher(`/reports/export${query ? `?${query}` : ''}`)
  },

  // 📋 Audit Logs (audit.routes.js)
  getAuditLogs: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return await fetcher(`/audit${query ? `?${query}` : ''}`)
  },

  getAuditLog: async (id) => {
    return await fetcher(`/audit/${id}`)
  },

  // 📚 Reference Data (reference.routes.js)
  getReferenceData: async () => {
    return await fetcher('/reference')
  },

  getIncomeSources: async () => {
    return await fetcher('/reference/income-sources')
  },

  getReferralReasons: async () => {
    return await fetcher('/reference/referral-reasons')
  },

  getRepeatVoucherReasons: async () => {
    return await fetcher('/reference/repeat-voucher-reasons')
  },
}
