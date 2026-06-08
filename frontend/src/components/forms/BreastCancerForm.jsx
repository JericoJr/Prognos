import { useState } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'

const INITIAL = {
  age: '',
  gender: '',
  family_history: false,
  brca_mutation: false,
  previous_breast_biopsy: false,
  dense_breast_tissue: false,
  hormone_replacement_therapy: false,
  age_first_menstruation: '',
  age_first_birth: '',
  alcohol_use: false,
  obesity: false,
  breast_lump: false,
  nipple_discharge: false,
  skin_dimpling: false,
  breast_pain: false,
}

export default function BreastCancerForm({ onSubmit, loading }) {
  const [form, setForm] = useState(INITIAL)

  const set = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  if (loading) return <LoadingSpinner />

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}
      className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-900">Breast Cancer Risk Assessment</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input type="number" name="age" value={form.age} onChange={set} min="18" max="100" required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 45" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select name="gender" value={form.gender} onChange={set} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age at First Menstruation</label>
          <input type="number" name="age_first_menstruation" value={form.age_first_menstruation} onChange={set} min="8" max="20"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 12" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age at First Birth (if applicable)</label>
          <input type="number" name="age_first_birth" value={form.age_first_birth} onChange={set} min="12" max="60"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 28" />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Risk Factors</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'family_history', label: 'Family history of breast cancer' },
            { name: 'brca_mutation', label: 'Known BRCA1/BRCA2 mutation' },
            { name: 'previous_breast_biopsy', label: 'Previous abnormal breast biopsy' },
            { name: 'dense_breast_tissue', label: 'Dense breast tissue' },
            { name: 'hormone_replacement_therapy', label: 'Current/past hormone replacement therapy' },
            { name: 'alcohol_use', label: 'Regular alcohol consumption' },
            { name: 'obesity', label: 'Obesity (BMI ≥ 30)' },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" name={name} checked={form[name]} onChange={set}
                className="rounded border-gray-300 text-blue-600" />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Current Symptoms</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'breast_lump', label: 'Lump in breast or underarm' },
            { name: 'nipple_discharge', label: 'Nipple discharge' },
            { name: 'skin_dimpling', label: 'Skin dimpling or puckering' },
            { name: 'breast_pain', label: 'Persistent breast pain' },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" name={name} checked={form[name]} onChange={set}
                className="rounded border-gray-300 text-blue-600" />
              {label}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">
        Assess My Risk
      </button>
    </form>
  )
}
