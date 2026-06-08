// NHANES variables: SMQ020/SMQ040/SMD641/SMD650/SMQ050Q · ALQ111/ALQ130 · PAQ605 · PAD680 · SLD010H

const ic = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const sc = `${ic} bg-white`
const lc = 'block text-sm font-medium text-gray-700 mb-1'

export default function StepLifestyle({ data, onChange }) {
  const set = (field) => (e) => onChange({ [field]: e.target.value })

  const showSmoking = data.smoking_status === 'current' || data.smoking_status === 'former'
  const showQuit    = data.smoking_status === 'former'
  const showAlcohol = data.alcohol_frequency && data.alcohol_frequency !== 'never'

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Lifestyle &amp; Behavioral Factors</h2>
        <p className="text-xs text-gray-400 mt-0.5">NHANES: SMQ* · ALQ* · PAQ605 · PAD680 · SLD010H</p>
      </div>

      {/* Smoking */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-1">Smoking</p>
        <div>
          <label className={lc}>Smoking Status <span className="text-red-400">*</span></label>
          <select value={data.smoking_status} onChange={set('smoking_status')} required className={sc}>
            <option value="">Select</option>
            <option value="never">Never smoked</option>
            <option value="former">Former smoker (quit)</option>
            <option value="current">Current smoker</option>
          </select>
        </div>
        {showSmoking && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lc}>Cigarettes per day (on average)</label>
              <input type="number" value={data.cigarettes_per_day} onChange={set('cigarettes_per_day')}
                min="0" max="100" className={ic} placeholder="e.g. 10" />
            </div>
            <div>
              <label className={lc}>Total years smoked</label>
              <input type="number" value={data.years_smoked} onChange={set('years_smoked')}
                min="0" max="80" className={ic} placeholder="e.g. 15" />
            </div>
          </div>
        )}
        {showQuit && (
          <div>
            <label className={lc}>Years since you quit</label>
            <input type="number" value={data.years_since_quit} onChange={set('years_since_quit')}
              min="0" max="80" className={ic} placeholder="e.g. 5" />
          </div>
        )}
      </div>

      {/* Alcohol */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-1">Alcohol</p>
        <div>
          <label className={lc}>Alcohol Use Frequency</label>
          <select value={data.alcohol_frequency} onChange={set('alcohol_frequency')} className={sc}>
            <option value="">Select</option>
            <option value="never">Never</option>
            <option value="monthly">Monthly or less</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily or almost daily</option>
          </select>
        </div>
        {showAlcohol && (
          <div>
            <label className={lc}>Average drinks per week</label>
            <input type="number" value={data.alcohol_drinks_per_week} onChange={set('alcohol_drinks_per_week')}
              min="0" max="100" className={ic} placeholder="e.g. 7" />
            <p className="text-xs text-gray-400 mt-1">NHANES: ALQ130 — 1 drink = 12 oz beer / 5 oz wine / 1.5 oz spirits</p>
          </div>
        )}
      </div>

      {/* Physical Activity & Sleep */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-1">Physical Activity &amp; Sleep</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lc}>Moderate exercise (min/week)</label>
            <input type="number" value={data.physical_activity_minutes_per_week} onChange={set('physical_activity_minutes_per_week')}
              min="0" max="2000" className={ic} placeholder="e.g. 150" />
            <p className="text-xs text-gray-400 mt-1">NHANES: PAQ605 · Recommended: ≥150 min/week</p>
          </div>
          <div>
            <label className={lc}>Sedentary hours per day</label>
            <input type="number" value={data.sedentary_hours_per_day} onChange={set('sedentary_hours_per_day')}
              min="0" max="24" step="0.5" className={ic} placeholder="e.g. 8" />
            <p className="text-xs text-gray-400 mt-1">NHANES: PAD680 · Sitting, watching TV, etc.</p>
          </div>
          <div>
            <label className={lc}>Average sleep (hours/night)</label>
            <input type="number" value={data.sleep_hours_per_night} onChange={set('sleep_hours_per_night')}
              min="0" max="24" step="0.5" className={ic} placeholder="e.g. 7" />
            <p className="text-xs text-gray-400 mt-1">NHANES: SLD010H · Recommended: 7–9 hours</p>
          </div>
        </div>
      </div>
    </div>
  )
}
