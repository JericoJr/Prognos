import { useState } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'

const INITIAL = {
  age: '',
  hpv_positive: '',
  abnormal_pap_smear: false,
  smoking: false,
  multiple_sexual_partners: false,
  early_sexual_activity: false,
  long_term_oral_contraceptives: false,
  weakened_immune_system: false,
  chlamydia_history: false,
  abnormal_vaginal_bleeding: false,
  pelvic_pain: false,
  pain_during_intercourse: false,
}

export default function CervicalCancerForm({ onSubmit, loading }) {
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
      <h2 className="text-xl font-semibold text-gray-900">Cervical Cancer Risk Assessment</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input type="number" name="age" value={form.age} onChange={set} min="18" max="100" required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 35" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">HPV Status (if known)</label>
          <select name="hpv_positive" value={form.hpv_positive} onChange={set}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Unknown / Not tested</option>
            <option value="true">HPV Positive</option>
            <option value="false">HPV Negative</option>
          </select>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Risk Factors</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'abnormal_pap_smear', label: 'Abnormal Pap smear result' },
            { name: 'smoking', label: 'Current or past smoker' },
            { name: 'multiple_sexual_partners', label: 'Multiple sexual partners' },
            { name: 'early_sexual_activity', label: 'Early sexual activity (before 18)' },
            { name: 'long_term_oral_contraceptives', label: 'Long-term oral contraceptive use (5+ years)' },
            { name: 'weakened_immune_system', label: 'Weakened immune system (HIV/medications)' },
            { name: 'chlamydia_history', label: 'History of chlamydia infection' },
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
            { name: 'abnormal_vaginal_bleeding', label: 'Abnormal vaginal bleeding' },
            { name: 'pelvic_pain', label: 'Persistent pelvic pain' },
            { name: 'pain_during_intercourse', label: 'Pain during intercourse' },
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
