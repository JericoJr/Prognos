// NHANES variables: HUQ010 · HUQ090 + symptom self-report

const sc = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
const lc = 'block text-sm font-medium text-gray-700 mb-1'

const SYMPTOMS = [
  { key: 'unexplained_weight_loss',   label: 'Unexplained weight loss (≥10 lbs)' },
  { key: 'persistent_fatigue',        label: 'Persistent fatigue not improved by rest' },
  { key: 'chronic_cough',             label: 'Chronic cough or hoarseness (>3 weeks)' },
  { key: 'shortness_of_breath',       label: 'Shortness of breath (not due to exercise)' },
  { key: 'blood_in_stool_urine',      label: 'Blood in stool, urine, or unusual bleeding' },
  { key: 'lumps_swelling',            label: 'Lump or swelling (anywhere on body)' },
  { key: 'persistent_pain',           label: 'Persistent unexplained pain' },
  { key: 'changes_in_bowel_bladder',  label: 'Changes in bowel or bladder habits' },
  { key: 'skin_changes',              label: 'Changes in moles, skin sores, or color changes' },
]

export default function StepSymptoms({ data, onChange }) {
  const toggle = (key) => () => {
    const current = Array.isArray(data.current_symptoms) ? data.current_symptoms : []
    const next = current.includes(key) ? current.filter(k => k !== key) : [...current, key]
    onChange({ current_symptoms: next })
  }

  const selected = Array.isArray(data.current_symptoms) ? data.current_symptoms : []

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Symptoms &amp; Health Status</h2>
        <p className="text-xs text-gray-400 mt-0.5">NHANES: HUQ010 · HUQ090 · Symptom self-report</p>
      </div>

      <div>
        <label className={lc}>How would you rate your general health? <span className="text-red-400">*</span></label>
        <select value={data.general_health} onChange={(e) => onChange({ general_health: e.target.value })} required className={sc}>
          <option value="">Select</option>
          <option value="excellent">Excellent</option>
          <option value="very_good">Very Good</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
        <p className="text-xs text-gray-400 mt-1">NHANES: HUQ010</p>
      </div>

      <div>
        <label className={lc}>Are you currently experiencing any of the following? <span className="text-gray-400 font-normal">(select all that apply)</span></label>
        <p className="text-xs text-gray-400 mb-3">These are potential cancer warning signs. Selecting one does NOT mean you have cancer.</p>
        <div className="space-y-2">
          {SYMPTOMS.map(({ key, label }) => (
            <label key={key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              selected.includes(key) ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
            }`}>
              <input
                type="checkbox" checked={selected.includes(key)} onChange={toggle(key)}
                className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-800">{label}</span>
            </label>
          ))}
        </div>
        {selected.length > 0 && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-3">
            You've selected {selected.length} symptom{selected.length > 1 ? 's' : ''}.
            If you are concerned about any symptoms, please consult a healthcare professional.
          </p>
        )}
      </div>
    </div>
  )
}
