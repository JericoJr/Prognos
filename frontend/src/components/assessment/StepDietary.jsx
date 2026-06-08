// NHANES variables: DBD900 · DBD910 · DBQ700 · DR1TKCAL (general dietary quality)

const sc = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
const lc = 'block text-sm font-medium text-gray-700 mb-1'

const FREQ = [
  { value: '',          label: 'Select' },
  { value: 'never',     label: 'Never' },
  { value: '1_3_month', label: '1–3 times/month' },
  { value: '1_2_week',  label: '1–2 times/week' },
  { value: '3_4_week',  label: '3–4 times/week' },
  { value: 'daily',     label: 'Daily' },
]

function FreqSelect({ label, field, value, onChange, hint }) {
  return (
    <div>
      <label className={lc}>{label}</label>
      <select value={value} onChange={(e) => onChange({ [field]: e.target.value })} className={sc}>
        {FREQ.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

export default function StepDietary({ data, onChange }) {
  const set = (field) => (e) => onChange({ [field]: e.target.value })

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Dietary Information</h2>
        <p className="text-xs text-gray-400 mt-0.5">NHANES: DBD900 · DBD910 · DBQ700 · Dietary intake data</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FreqSelect
          label="Fruits (servings/week)"
          field="fruit_servings_per_week"
          value={data.fruit_servings_per_week}
          onChange={onChange}
          hint="NHANES: DBQ700 · 1 serving ≈ 1 medium fruit or ½ cup"
        />
        <FreqSelect
          label="Vegetables (servings/week)"
          field="vegetable_servings_per_week"
          value={data.vegetable_servings_per_week}
          onChange={onChange}
          hint="NHANES: DBQ700 · 1 serving ≈ 1 cup raw or ½ cup cooked"
        />
        <FreqSelect
          label="Sugary drinks (times/week)"
          field="sugary_drinks_per_week"
          value={data.sugary_drinks_per_week}
          onChange={onChange}
          hint="Soda, juice, energy drinks, sweetened coffee"
        />
        <FreqSelect
          label="Fast food meals (times/week)"
          field="fast_food_per_week"
          value={data.fast_food_per_week}
          onChange={onChange}
          hint="NHANES: DBD900 · Restaurant fast food / pizza / drive-through"
        />
        <FreqSelect
          label="Processed/packaged foods"
          field="processed_food_frequency"
          value={data.processed_food_frequency}
          onChange={onChange}
          hint="Chips, frozen meals, deli meats, packaged snacks"
        />
      </div>

      <div>
        <label className={lc}>Daily water intake</label>
        <select value={data.water_intake_liters_per_day} onChange={set('water_intake_liters_per_day')} className={sc}>
          <option value="">Select</option>
          <option value="less_1">Less than 1 liter (about 4 cups)</option>
          <option value="1_1.5">1 – 1.5 liters</option>
          <option value="1.5_2">1.5 – 2 liters</option>
          <option value="2_plus">More than 2 liters (8+ cups)</option>
        </select>
        <p className="text-xs text-gray-400 mt-1">Plain water, not including other beverages</p>
      </div>
    </div>
  )
}
