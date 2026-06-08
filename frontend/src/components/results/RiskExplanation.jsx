const CATEGORY_META = {
  lifestyle:    { label: 'Lifestyle & Behavioral', color: 'bg-purple-500', icon: '🏃' },
  demographics: { label: 'Demographics',           color: 'bg-blue-500',   icon: '👤' },
  medical:      { label: 'Medical History',         color: 'bg-red-400',    icon: '🏥' },
  laboratory:   { label: 'Laboratory Results',      color: 'bg-teal-500',   icon: '🔬' },
  dietary:      { label: 'Dietary Factors',         color: 'bg-green-500',  icon: '🥦' },
  symptoms:     { label: 'Symptoms Reported',       color: 'bg-orange-400', icon: '⚕️' },
}

export default function RiskExplanation({ categoryContributions }) {
  if (!categoryContributions?.length) return null

  const sorted = [...categoryContributions].sort((a, b) => b.weight - a.weight)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
      {/* Header with SHAP badge */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">What Influenced Your Score?</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Estimated weight each data category contributes to the overall prediction.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          SHAP Integration Planned
        </span>
      </div>

      {/* Bar chart */}
      <div className="space-y-3">
        {sorted.map(({ category, weight, nhanes_tables }) => {
          const meta = CATEGORY_META[category] || { label: category, color: 'bg-gray-400', icon: '📊' }
          const pct  = Math.round(weight * 100)
          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{meta.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{meta.label}</span>
                  {nhanes_tables?.length > 0 && (
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      ({nhanes_tables.join(', ')})
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-gray-700">{pct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${meta.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Future SHAP placeholder */}
      <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 text-center space-y-2">
        <p className="text-sm font-semibold text-gray-600">Detailed Feature Importance — Coming Soon</p>
        <p className="text-xs text-gray-400 leading-relaxed max-w-lg mx-auto">
          In a future phase, SHAP (SHapley Additive exPlanations) values will replace these category-level
          weights to show exactly which individual health factors drove your prediction — complete with
          direction (risk-increasing vs. protective) and magnitude.
        </p>
        <div className="flex justify-center gap-3 pt-1">
          {['Feature Impact Chart', 'Force Plot', 'Waterfall Plot'].map(p => (
            <span key={p} className="text-xs bg-white border border-gray-200 text-gray-400 px-3 py-1 rounded-full">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
