import { useState } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'

const INITIAL = {
  age: '',
  gender: '',
  smoking: false,
  occupational_chemical_exposure: false,
  arsenic_exposure: false,
  chronic_uti: false,
  bladder_stones: false,
  family_history: false,
  personal_bladder_cancer_history: false,
  blood_in_urine: false,
  frequent_urination: false,
  painful_urination: false,
  pelvic_pain: false,
  back_pain: false,
}

export default function BladderCancerForm({ onSubmit, loading }) {
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
      <h2 className="text-xl font-semibold text-gray-900">Bladder Cancer Risk Assessment</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input type="number" name="age" value={form.age} onChange={set} min="18" max="100" required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 60" />
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

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Risk Factors</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'smoking', label: 'Current or past smoker' },
            { name: 'occupational_chemical_exposure', label: 'Occupational chemical exposure (dyes, rubber, paint)' },
            { name: 'arsenic_exposure', label: 'Arsenic exposure in drinking water' },
            { name: 'chronic_uti', label: 'Chronic urinary tract infections' },
            { name: 'bladder_stones', label: 'History of bladder stones' },
            { name: 'family_history', label: 'Family history of bladder cancer' },
            { name: 'personal_bladder_cancer_history', label: 'Personal history of bladder cancer' },
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
            { name: 'blood_in_urine', label: 'Blood in urine (hematuria)' },
            { name: 'frequent_urination', label: 'Frequent urination' },
            { name: 'painful_urination', label: 'Painful or burning urination' },
            { name: 'pelvic_pain', label: 'Pelvic or lower abdominal pain' },
            { name: 'back_pain', label: 'Lower back pain' },
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
