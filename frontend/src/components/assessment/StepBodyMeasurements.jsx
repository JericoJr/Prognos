// NHANES variables: BMXHT · BMXWT · BMXBMI · BMXWAIST

import { useState, useEffect } from 'react'

const ic = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const lc = 'block text-sm font-medium text-gray-700 mb-1'

const calcBMI = (h, w) => {
  const hm = parseFloat(h) / 100
  const wk = parseFloat(w)
  if (!hm || !wk || hm <= 0) return ''
  return (wk / (hm * hm)).toFixed(1)
}

const BMI_CATEGORY = (bmi) => {
  const v = parseFloat(bmi)
  if (!v) return null
  if (v < 18.5) return { label: 'Underweight', color: 'text-blue-600' }
  if (v < 25)   return { label: 'Normal weight', color: 'text-green-600' }
  if (v < 30)   return { label: 'Overweight', color: 'text-yellow-600' }
  return              { label: 'Obese', color: 'text-red-600' }
}

export default function StepBodyMeasurements({ data, onChange }) {
  const [imperial, setImperial] = useState(false)
  const [imp, setImp] = useState({ feet: '', inches: '', lbs: '' })

  useEffect(() => {
    const newBmi = calcBMI(data.height_cm, data.weight_kg)
    if (newBmi && newBmi !== data.bmi) onChange({ bmi: newBmi })
  }, [data.height_cm, data.weight_kg]) // eslint-disable-line

  const setMetric = (field) => (e) => onChange({ [field]: e.target.value })

  const handleImp = (field) => (e) => {
    const next = { ...imp, [field]: e.target.value }
    setImp(next)
    if (field === 'feet' || field === 'inches') {
      const cm = Math.round((parseInt(next.feet || 0) * 30.48) + (parseFloat(next.inches || 0) * 2.54))
      if (cm > 0) onChange({ height_cm: cm.toString() })
    }
    if (field === 'lbs') {
      const kg = (parseFloat(e.target.value || 0) * 0.453592).toFixed(1)
      if (parseFloat(kg) > 0) onChange({ weight_kg: kg })
    }
  }

  const bmiCat = BMI_CATEGORY(data.bmi)

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Body Measurements</h2>
          <p className="text-xs text-gray-400 mt-0.5">NHANES: BMXHT · BMXWT · BMXBMI · BMXWAIST</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input type="checkbox" checked={imperial} onChange={e => setImperial(e.target.checked)}
            className="rounded border-gray-300 text-blue-600" />
          Use ft / in / lbs
        </label>
      </div>

      {imperial ? (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={lc}>Height — Feet</label>
            <input type="number" value={imp.feet} onChange={handleImp('feet')}
              min="3" max="8" className={ic} placeholder="5" />
          </div>
          <div>
            <label className={lc}>Inches</label>
            <input type="number" value={imp.inches} onChange={handleImp('inches')}
              min="0" max="11" className={ic} placeholder="9" />
          </div>
          <div>
            <label className={lc}>Weight — lbs</label>
            <input type="number" value={imp.lbs} onChange={handleImp('lbs')}
              min="50" max="700" className={ic} placeholder="160" />
          </div>
          {(data.height_cm || data.weight_kg) && (
            <p className="col-span-3 text-xs text-gray-400">
              Converted: {data.height_cm ? `${data.height_cm} cm` : '—'} · {data.weight_kg ? `${data.weight_kg} kg` : '—'}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lc}>Height (cm) <span className="text-red-400">*</span></label>
            <input type="number" value={data.height_cm} onChange={setMetric('height_cm')}
              min="100" max="250" required className={ic} placeholder="e.g. 175" />
          </div>
          <div>
            <label className={lc}>Weight (kg) <span className="text-red-400">*</span></label>
            <input type="number" value={data.weight_kg} onChange={setMetric('weight_kg')}
              min="20" max="300" required className={ic} placeholder="e.g. 70" />
          </div>
        </div>
      )}

      {/* BMI display */}
      <div className={`p-4 rounded-lg border flex items-center justify-between ${data.bmi ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
        <div>
          <p className="text-sm font-medium text-gray-700">BMI (auto-calculated)</p>
          <p className="text-xs text-gray-400">NHANES: BMXBMI</p>
        </div>
        <div className="text-right">
          {data.bmi ? (
            <>
              <span className="text-3xl font-bold text-blue-700">{data.bmi}</span>
              {bmiCat && <p className={`text-xs font-semibold ${bmiCat.color}`}>{bmiCat.label}</p>}
            </>
          ) : (
            <span className="text-gray-400 text-sm">Enter height & weight</span>
          )}
        </div>
      </div>

      <div>
        <label className={lc}>Waist Circumference (cm) — optional</label>
        <input type="number" value={data.waist_circumference_cm} onChange={setMetric('waist_circumference_cm')}
          min="40" max="200" className={ic} placeholder="e.g. 85" />
        <p className="text-xs text-gray-400 mt-1">NHANES: BMXWAIST · Measure at navel level</p>
      </div>
    </div>
  )
}
