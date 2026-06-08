import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CancerTypeSelector from '../components/forms/CancerTypeSelector'
import LungCancerForm from '../components/forms/LungCancerForm'
import BreastCancerForm from '../components/forms/BreastCancerForm'
import ColonCancerForm from '../components/forms/ColonCancerForm'
import ProstateCancerForm from '../components/forms/ProstateCancerForm'
import MelanomaForm from '../components/forms/MelanomaForm'
import CervicalCancerForm from '../components/forms/CervicalCancerForm'
import BladderCancerForm from '../components/forms/BladderCancerForm'
import ThyroidCancerForm from '../components/forms/ThyroidCancerForm'
import { predictCancer } from '../services/api'

const FORM_MAP = {
  lung: LungCancerForm,
  breast: BreastCancerForm,
  colon: ColonCancerForm,
  prostate: ProstateCancerForm,
  melanoma: MelanomaForm,
  cervical: CervicalCancerForm,
  bladder: BladderCancerForm,
  thyroid: ThyroidCancerForm,
}

export default function PredictPage() {
  const [selectedType, setSelectedType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const result = await predictCancer(selectedType, formData)
      navigate('/results', { state: { result, cancerType: selectedType } })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process your assessment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    setError(null)
  }

  const ActiveForm = selectedType ? FORM_MAP[selectedType] : null

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Cancer Risk Assessment</h1>
      <p className="text-gray-600 mb-8">
        Select a cancer type and fill in your health information to receive a personalized risk assessment.
      </p>

      <CancerTypeSelector selected={selectedType} onSelect={handleTypeSelect} />

      {ActiveForm && (
        <div className="mt-8">
          <ActiveForm onSubmit={handleSubmit} loading={loading} />
        </div>
      )}

      {!selectedType && (
        <p className="mt-6 text-center text-gray-500 text-sm">
          Select a cancer type above to begin.
        </p>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
