import { useState } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'

const INITIAL = {
  age: '',
  skin_type: '',
  sun_exposure_hours: '',
  history_of_sunburns: false,
  tanning_bed_use: false,
  family_history: false,
  personal_melanoma_history: false,
  number_of_moles: '',
  changing_mole: false,
  atypical_moles: false,
  immunosuppression: false,
}

export default function MelanomaForm({ onSubmit, loading }) {
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
      <h2 className="text-xl font-semibold text-gray-900">Melanoma Risk Assessment</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input type="number" name="age" value={form.age} onChange={set} min="18" max="100" required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 35" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skin Type (Fitzpatrick)</label>
          <select name="skin_type" value={form.skin_type} onChange={set}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select</option>
            <option value="1">Type I — Always burns, never tans</option>
            <option value="2">Type II — Usually burns, sometimes tans</option>
            <option value="3">Type III — Sometimes burns, always tans</option>
            <option value="4">Type IV — Rarely burns, always tans</option>
            <option value="5">Type V — Very rarely burns</option>
            <option value="6">Type VI — Never burns</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Daily Sun Exposure (hours)</label>
          <input type="number" name="sun_exposure_hours" value={form.sun_exposure_hours} onChange={set} min="0" max="24" step="0.5"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Approximate Number of Moles</label>
          <input type="number" name="number_of_moles" value={form.number_of_moles} onChange={set} min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 15" />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Risk Factors & Symptoms</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'history_of_sunburns', label: 'History of severe sunburns' },
            { name: 'tanning_bed_use', label: 'Tanning bed use' },
            { name: 'family_history', label: 'Family history of melanoma' },
            { name: 'personal_melanoma_history', label: 'Personal history of melanoma' },
            { name: 'changing_mole', label: 'Mole changing in size/color/shape' },
            { name: 'atypical_moles', label: 'Atypical (irregular) moles' },
            { name: 'immunosuppression', label: 'Immunosuppressed (transplant/HIV/medications)' },
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
