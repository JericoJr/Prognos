import { useState } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'

const INITIAL = {
  age: '',
  gender: '',
  smoking_status: '',
  pack_years: '',
  years_since_quit: '',
  family_history: false,
  asbestos_exposure: false,
  radon_exposure: false,
  chronic_cough: false,
  shortness_of_breath: false,
  chest_pain: false,
  unexplained_weight_loss: false,
  hemoptysis: false,
}

export default function LungCancerForm({ onSubmit, loading }) {
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
      <h2 className="text-xl font-semibold text-gray-900">Lung Cancer Risk Assessment</h2>

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
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Smoking Status</label>
          <select name="smoking_status" value={form.smoking_status} onChange={set} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select</option>
            <option value="never">Never Smoked</option>
            <option value="former">Former Smoker</option>
            <option value="current">Current Smoker</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pack-Years (if applicable)</label>
          <input type="number" name="pack_years" value={form.pack_years} onChange={set} min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 20" />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Risk Factors</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'family_history', label: 'Family history of lung cancer' },
            { name: 'asbestos_exposure', label: 'Asbestos exposure' },
            { name: 'radon_exposure', label: 'Radon exposure at home/work' },
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
            { name: 'chronic_cough', label: 'Persistent cough (3+ weeks)' },
            { name: 'shortness_of_breath', label: 'Shortness of breath' },
            { name: 'chest_pain', label: 'Chest pain' },
            { name: 'unexplained_weight_loss', label: 'Unexplained weight loss' },
            { name: 'hemoptysis', label: 'Coughing up blood' },
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
