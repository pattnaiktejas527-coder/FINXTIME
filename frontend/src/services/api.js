import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'Something went wrong'
    return Promise.reject(new Error(msg))
  }
)

export const checkHealth   = ()       => api.get('/')
export const analyzeFinances = (data) => api.post('/analyze', data)
export const getAIAdvice   = (data)   => api.post('/ai-advice', data)
export const getHistory    = ()       => api.get('/history')

export default api
