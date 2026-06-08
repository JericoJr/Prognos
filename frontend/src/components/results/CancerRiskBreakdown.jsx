import { useState } from 'react'

const RISK_COLOR = {
  low:       'bg-green-100 text-green-800 border-green-200',
  moderate:  'bg-yellow-100 text-yellow-800 border-yellow-200',
  high:      'bg-orange-100 text-orange-800 border-orange-200',
  very_high: 'bg-red-100 text-red-800 border-red-200',
}

const BAR_COLOR = {
  low:       'bg-green-400',
  moderate:  'bg-yellow-400',
  high:      'bg-orange-400',
  very_high: 'bg-red-500',
}

const FORMAT_NAME = {
  lung:      'Lung Cancer',
  breast:    'Breast Cancer',
  colon:     'Colorectal Cancer',
  prostate:  'Prostate Cancer',
  melanoma:  'Melanoma (Skin)',
  cervical:  'Cervical Cancer',
  bladder:   'Bladder Cancer',
  thyroid:   'Thyroid Cancer',
}

function RiskBar({ pct, riskLevel }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${BAR_COLOR[riskLevel] || 'bg-gray-400'}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  )
}

function CancerCard({ type, data }) {
  const [open, setOpen] = useState(false)
  const riskKey   = data.risk_level || 'low'
  const chipCls   = RISK_COLOR[riskKey] || RISK_COLOR.low
  const name      = FORMAT_NAME[type] || type

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Header row */}
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
      >
        {/* Progress bar + name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-semibold text-gray-800 truncate">{name}</span>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <span className="text-sm font-bold text-gray-700">{Math.round(data.risk_score || 0)}%</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${chipCls}`}>
                {riskKey.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </span>
            </div>
          </div>
          <RiskBar pct={data.risk_score || 0} riskLevel={riskKey} />
        </div>
        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable body */}
      {open && (
        <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50">
          {/* Top contributing factors */}
          {data.top_factors?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Key Risk Factors</p>
              <div className="flex flex-wrap gap-2">
                {data.top_factors.map((f, i) => (
                  <span key={i} className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full shadow-sm">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Symptoms */}
          {data.symptoms?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Common Symptoms</p>
              <ul className="grid sm:grid-cols-2 gap-1">
                {data.symptoms.map((s, i) => (
                  <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                    <span className="text-blue-400 mt-0.5">•</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Treatments */}
          {data.treatments?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Treatment Options</p>
              <ul className="space-y-1">
                {data.treatments.map((t, i) => (
                  <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                    <span className="text-green-500 mt-0.5">✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources */}
          {data.sources?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Learn More</p>
              <div className="flex flex-wrap gap-2">
                {data.sources.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 underline">
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CancerRiskBreakdown({ cancerBreakdown }) {
  if (!cancerBreakdown || Object.keys(cancerBreakdown).length === 0) return null

  // Sort by risk_score descending
  const sorted = Object.entries(cancerBreakdown).sort((a, b) => (b[1].risk_score || 0) - (a[1].risk_score || 0))

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-800">Breakdown by Cancer Type</h2>
      <p className="text-xs text-gray-400">Sorted by estimated risk — click any row to expand details.</p>
      <div className="space-y-2">
        {sorted.map(([type, data]) => (
          <CancerCard key={type} type={type} data={data} />
        ))}
      </div>
    </div>
  )
}
