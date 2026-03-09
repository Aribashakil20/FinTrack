import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  register: (d) => api.post('/auth/register', d),
  login:    (d) => api.post('/auth/login', d),
}

export const transactionApi = {
  getAll:  ()        => api.get('/transactions'),
  create:  (d)       => api.post('/transactions', d),
  update:  (id, d)   => api.put(`/transactions/${id}`, d),
  remove:  (id)      => api.delete(`/transactions/${id}`),
}

export const dashboardApi = {
  summary: () => api.get('/dashboard/summary'),
}

export const budgetApi = {
  get:    (month, year) => api.get(`/budgets?month=${month}&year=${year}`),
  save:   (d)           => api.post('/budgets', d),
  remove: (id)          => api.delete(`/budgets/${id}`),
}

export default api
