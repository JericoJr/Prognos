import { useState } from 'react'
import { predictCancer } from '../services/api'

export function usePrediction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const predict = async (cancerType, formData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await predictCancer(cancerType, formData)
      setResult(data)
      return data
    } catch (err) {
      const message = err.response?.data?.error || 'Prediction failed. Please try again.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
  }

  return { predict, loading, error, result, reset }
}
