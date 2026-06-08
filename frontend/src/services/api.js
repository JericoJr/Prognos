import axios from 'axios'
import { supabase } from '../lib/supabase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Attach Supabase JWT to every request when a session exists
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

export const predictCancer = async (cancerType, data) => {
  const response = await api.post(`/predict/${cancerType}`, data)
  return response.data
}

export const getHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

export const submitAssessment = async (data) => {
  const response = await api.post('/assessments', data)
  return response.data
}
