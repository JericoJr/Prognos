// NHANES variables: RIDAGEYR · RIAGENDR · RIDRETH3 · DMDEDUC2 · DMDMARTL · INDHHIN2

const ic = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const sc = `${ic} bg-white`
const lc = 'block text-sm font-medium text-gray-700 mb-1'

export default function StepDemographics({ data, onChange }) {
  const set = (field) => (e) => onChange({ [field]: e.target.value })

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Demographics</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          NHANES: RIDAGEYR · RIAGENDR · RIDRETH3 · DMDEDUC2 · DMDMARTL · INDHHIN2
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lc}>Age <span className="text-red-400">*</span></label>
          <input type="number" value={data.age} onChange={set('age')}
            min="18" max="100" required className={ic} placeholder="e.g. 45" />
        </div>
        <div>
          <label className={lc}>Sex <span className="text-red-400">*</span></label>
          <select value={data.sex} onChange={set('sex')} required className={sc}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div>
        <label className={lc}>Race / Ethnicity</label>
        <select value={data.race_ethnicity} onChange={set('race_ethnicity')} className={sc}>
          <option value="">Prefer not to say</option>
          <option value="mexican_american">Mexican American</option>
          <option value="other_hispanic">Other Hispanic / Latino</option>
          <option value="white">Non-Hispanic White</option>
          <option value="black">Non-Hispanic Black / African American</option>
          <option value="asian">Non-Hispanic Asian</option>
          <option value="other_multiracial">Other Race / Multiracial</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lc}>Education Level</label>
          <select value={data.education_level} onChange={set('education_level')} className={sc}>
            <option value="">Select</option>
            <option value="less_than_9th">Less than 9th grade</option>
            <option value="9th_to_11th">9th–11th grade (no diploma)</option>
            <option value="high_school">High school graduate / GED</option>
            <option value="some_college">Some college / AA degree</option>
            <option value="college_or_above">College graduate or above</option>
          </select>
        </div>
        <div>
          <label className={lc}>Marital Status</label>
          <select value={data.marital_status} onChange={set('marital_status')} className={sc}>
            <option value="">Select</option>
            <option value="married">Married / Living with partner</option>
            <option value="widowed">Widowed</option>
            <option value="divorced">Divorced</option>
            <option value="separated">Separated</option>
            <option value="never_married">Never married</option>
          </select>
        </div>
      </div>

      <div>
        <label className={lc}>Annual Household Income</label>
        <select value={data.household_income} onChange={set('household_income')} className={sc}>
          <option value="">Prefer not to say</option>
          <option value="0_14999">Under $15,000</option>
          <option value="15000_24999">$15,000 – $24,999</option>
          <option value="25000_34999">$25,000 – $34,999</option>
          <option value="35000_44999">$35,000 – $44,999</option>
          <option value="45000_54999">$45,000 – $54,999</option>
          <option value="55000_74999">$55,000 – $74,999</option>
          <option value="75000_99999">$75,000 – $99,999</option>
          <option value="100000_plus">$100,000 or more</option>
        </select>
      </div>
    </div>
  )
}
