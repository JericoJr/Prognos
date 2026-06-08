// NHANES variables: DIQ010 · BPQ020 · MCQ160E · MCQ220 · MCQ300A/B/C · RXQ510

import { useState } from 'react'

const sc = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
const lc = 'block text-sm font-medium text-gray-700 mb-1'

const CANCER_TYPES = [
  'Lung', 'Breast', 'Colon / Colorectal', 'Prostate', 'Melanoma (Skin)',
  'Cervical', 'Bladder', 'Thyroid', 'Leukemia / Lymphoma', 'Other',
]

function Toggle({ label, field, value, onChange, hint }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
      <input
        type="checkbox" id={field} checked={!!value}
        onChange={e => onChange({ [field]: e.target.checked })}
        className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor={field} className="flex-1 cursor-pointer">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </label>
    </div>
  )
}

export default function StepMedicalHistory({ data, onChange }) {
  const [showPriorTypes, setShowPriorTypes]   = useState(false)
  const [showFamilyTypes, setShowFamilyTypes] = useState(false)

  const set = (field) => (e) => onChange({ [field]: e.target.value })

  const toggleCancerType = (listField, type) => {
    const current = Array.isArray(data[listField]) ? data[listField] : []
    const next = current.includes(type) ? current.filter(t => t !== type) : [...current, type]
    onChange({ [listField]: next })
  }

  const handlePriorCancer = (e) => {
    onChange({ previous_cancer: e.target.checked })
    setShowPriorTypes(e.target.checked)
  }

  const handleFamilyHistory = (e) => {
    onChange({ family_history_cancer: e.target.checked })
    setShowFamilyTypes(e.target.checked)
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Medical History</h2>
        <p className="text-xs text-gray-400 mt-0.5">NHANES: DIQ010 · BPQ020 · MCQ160E · MCQ220 · MCQ300A/B/C</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-800">Chronic Conditions</p>
        <Toggle label="Diabetes / Pre-diabetes" field="diabetes" value={data.diabetes} onChange={onChange}
          hint="NHANES: DIQ010 · Includes Type 1, Type 2, or pre-diabetic" />
        <Toggle label="High Blood Pressure (Hypertension)" field="hypertension" value={data.hypertension} onChange={onChange}
          hint="NHANES: BPQ020 · Ever told by a doctor" />
        <Toggle label="Heart Disease (Coronary artery, heart attack)" field="heart_disease" value={data.heart_disease} onChange={onChange}
          hint="NHANES: MCQ160E" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-800">Cancer History</p>
        <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
          <input type="checkbox" id="prev_cancer" checked={!!data.previous_cancer}
            onChange={handlePriorCancer}
            className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <label htmlFor="prev_cancer" className="flex-1 cursor-pointer">
            <span className="text-sm font-medium text-gray-800">Personal history of cancer</span>
            <p className="text-xs text-gray-400 mt-0.5">NHANES: MCQ220 · Previously diagnosed with any cancer</p>
          </label>
        </div>
        {(data.previous_cancer || showPriorTypes) && (
          <div className="ml-6 space-y-1">
            <p className="text-xs text-gray-500 mb-2">Select all that apply:</p>
            {CANCER_TYPES.map(t => (
              <label key={t} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox"
                  checked={(data.previous_cancer_types || []).includes(t)}
                  onChange={() => toggleCancerType('previous_cancer_types', t)}
                  className="rounded border-gray-300 text-blue-600" />
                {t}
              </label>
            ))}
          </div>
        )}

        <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
          <input type="checkbox" id="fam_history" checked={!!data.family_history_cancer}
            onChange={handleFamilyHistory}
            className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <label htmlFor="fam_history" className="flex-1 cursor-pointer">
            <span className="text-sm font-medium text-gray-800">Family history of cancer</span>
            <p className="text-xs text-gray-400 mt-0.5">NHANES: MCQ300A/B/C · First-degree relatives (parents, siblings, children)</p>
          </label>
        </div>
        {(data.family_history_cancer || showFamilyTypes) && (
          <div className="ml-6 space-y-1">
            <p className="text-xs text-gray-500 mb-2">Select all that apply:</p>
            {CANCER_TYPES.map(t => (
              <label key={t} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox"
                  checked={(data.family_cancer_types || []).includes(t)}
                  onChange={() => toggleCancerType('family_cancer_types', t)}
                  className="rounded border-gray-300 text-blue-600" />
                {t}
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className={lc}>Medications (optional)</label>
        <textarea
          value={data.medications || ''}
          onChange={set('medications')}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="e.g. Metformin, Aspirin, Lisinopril (free text)"
        />
        <p className="text-xs text-gray-400 mt-1">NHANES: RXQ510 · List current prescription medications if comfortable sharing</p>
      </div>
    </div>
  )
}
