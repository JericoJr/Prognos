import { useState } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'

const INITIAL = {
  age: '',
  family_history: false,
  personal_polyp_history: false,
  inflammatory_bowel_disease: false,
  smoking: false,
  heavy_alcohol_use: false,
  obesity: false,
  low_fiber_diet: false,
  red_processed_meat: false,
  physical_inactivity: false,
  blood_in_stool: false,
  bowel_habit_changes: false,
  abdominal_pain: false,
  unexplained_weight_loss: false,
}

export default function ColonCancerForm({ onSubmit, loading }) {
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
      <h2 className="text-xl font-semibold text-gray-900">Colon Cancer Risk Assessment</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
        <input type="number" name="age" value={form.age} onChange={set} min="18" max="100" required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 50" />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Risk Factors</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'family_history', label: 'Family history of colon cancer' },
            { name: 'personal_polyp_history', label: 'Personal history of polyps' },
            { name: 'inflammatory_bowel_disease', label: 'Inflammatory bowel disease (IBD)' },
            { name: 'smoking', label: 'Current or past smoker' },
            { name: 'heavy_alcohol_use', label: 'Heavy alcohol use' },
            { name: 'obesity', label: 'Obesity (BMI ≥ 30)' },
            { name: 'low_fiber_diet', label: 'Low fiber diet' },
            { name: 'red_processed_meat', label: 'High red/processed meat consumption' },
            { name: 'physical_inactivity', label: 'Physically inactive lifestyle' },
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
            { name: 'blood_in_stool', label: 'Blood in stool' },
            { name: 'bowel_habit_changes', label: 'Change in bowel habits' },
            { name: 'abdominal_pain', label: 'Persistent abdominal pain' },
            { name: 'unexplained_weight_loss', label: 'Unexplained weight loss' },
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
