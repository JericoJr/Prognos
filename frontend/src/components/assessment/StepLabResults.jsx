// NHANES variables: LBXWBCSI · LBXTC · LBXGH · LBXCRP · LBXPLTSI · LBXHGB

const ic = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const lc = 'block text-sm font-medium text-gray-700 mb-1'

const LABS = [
  { field: 'wbc',           label: 'White Blood Cell Count',  unit: '10³ cells/µL', ref: '4.5–11.0',  nhanes: 'LBXWBCSI',  hint: 'From CBC panel' },
  { field: 'hemoglobin',    label: 'Hemoglobin',              unit: 'g/dL',         ref: 'M: 13.5–17.5 · F: 12–16', nhanes: 'LBXHGB', hint: 'From CBC panel' },
  { field: 'platelets',     label: 'Platelet Count',          unit: '10³/µL',       ref: '150–400',    nhanes: 'LBXPLTSI', hint: 'From CBC panel' },
  { field: 'cholesterol',   label: 'Total Cholesterol',       unit: 'mg/dL',        ref: '<200',       nhanes: 'LBXTC',    hint: 'From lipid panel' },
  { field: 'hba1c',         label: 'HbA1c (Glycated Hgb)',   unit: '%',            ref: '<5.7',       nhanes: 'LBXGH',    hint: 'Diabetes marker' },
  { field: 'crp',           label: 'C-Reactive Protein (CRP)',unit: 'mg/L',        ref: '<1.0 (optimal)', nhanes: 'LBXCRP', hint: 'Inflammation marker' },
  { field: 'psa',           label: 'PSA (Prostate)',          unit: 'ng/mL',        ref: '<4.0',       nhanes: 'LBXP1',    hint: 'Males only; prostate cancer marker' },
]

export default function StepLabResults({ data, onChange }) {
  const hasAny = LABS.some(l => data[l.field])

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Laboratory / Blood Test Data</h2>
        <p className="text-xs text-gray-400 mt-0.5">NHANES: LBXWBCSI · LBXTC · LBXGH · LBXCRP · LBXPLTSI · LBXHGB</p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <p className="font-semibold">This section is optional.</p>
        <p className="text-xs mt-1 text-blue-700">
          If you have recent lab results, entering them will make the risk estimate more accurate.
          Skip any values you don't have — the model handles missing data.
        </p>
      </div>

      <div className="space-y-4">
        {LABS.map(({ field, label, unit, ref, nhanes, hint }) => (
          <div key={field}>
            <div className="flex items-baseline justify-between mb-1">
              <label className={lc}>{label} <span className="text-gray-400 font-normal">({unit})</span></label>
              <span className="text-xs text-gray-400 hidden sm:block">NHANES: {nhanes}</span>
            </div>
            <input
              type="number" value={data[field] || ''} step="any" min="0"
              onChange={(e) => onChange({ [field]: e.target.value })}
              className={ic}
              placeholder={`Reference: ${ref}`}
            />
            <p className="text-xs text-gray-400 mt-1">{hint} · Normal: {ref} {unit}</p>
          </div>
        ))}
      </div>

      {!hasAny && (
        <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
          No lab values entered. The model will use demographic and lifestyle data only.
          Laboratory data accounts for up to 22% of the prediction weight when available.
        </p>
      )}
    </div>
  )
}
