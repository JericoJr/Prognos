import { useState } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'

const INITIAL = {
  age: '',
  race: '',
  family_history: false,
  elevated_psa: false,
  psa_level: '',
  urinary_symptoms: false,
  weak_urine_flow: false,
  frequent_urination: false,
  blood_in_urine_or_semen: false,
  erectile_dysfunction: false,
  pelvic_discomfort: false,
}

export default function ProstateCancerForm({ onSubmit, loading }) {
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
      <h2 className="text-xl font-semibold text-gray-900">Prostate Cancer Risk Assessment</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input type="number" name="age" value={form.age} onChange={set} min="18" max="100" required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 55" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PSA Level (ng/mL, if known)</label>
          <input type="number" name="psa_level" value={form.psa_level} onChange={set} min="0" step="0.1"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 4.5" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Race / Ethnicity</label>
        <select name="race" value={form.race} onChange={set}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Prefer not to say</option>
          <option value="black">Black / African American</option>
          <option value="white">White</option>
          <option value="hispanic">Hispanic / Latino</option>
          <option value="asian">Asian / Pacific Islander</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Risk Factors</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'family_history', label: 'Family history of prostate cancer' },
            { name: 'elevated_psa', label: 'Elevated PSA on recent test' },
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
            { name: 'urinary_symptoms', label: 'Difficulty starting urination' },
            { name: 'weak_urine_flow', label: 'Weak or interrupted urine flow' },
            { name: 'frequent_urination', label: 'Frequent urination (especially at night)' },
            { name: 'blood_in_urine_or_semen', label: 'Blood in urine or semen' },
            { name: 'erectile_dysfunction', label: 'Erectile dysfunction' },
            { name: 'pelvic_discomfort', label: 'Pelvic discomfort or pain' },
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
