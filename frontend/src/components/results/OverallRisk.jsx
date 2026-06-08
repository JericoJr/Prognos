const RISK_CONFIG = {
  low:       { label: 'Low Risk',       color: '#22c55e', bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700' },
  moderate:  { label: 'Moderate Risk',  color: '#f59e0b', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  high:      { label: 'High Risk',      color: '#f97316', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  very_high: { label: 'Very High Risk', color: '#ef4444', bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700' },
}

const getRiskKey = (pct) => {
  if (pct < 15) return 'low'
  if (pct < 30) return 'moderate'
  if (pct < 50) return 'high'
  return 'very_high'
}

export default function OverallRisk({ overallRisk, riskCategory }) {
  const pct    = Math.round(overallRisk ?? 0)
  const key    = riskCategory || getRiskKey(pct)
  const cfg    = RISK_CONFIG[key] || RISK_CONFIG.low

  // SVG arc gauge
  const R   = 80
  const CX  = 100
  const CY  = 100
  const GAP = 30   // degrees cut off at bottom
  const TOTAL = 360 - GAP * 2
  const startAngle = 90 + GAP
  const arcPct  = Math.min(pct, 100) / 100
  const endAngle = startAngle + TOTAL * arcPct

  const toRad   = (deg) => (deg - 90) * (Math.PI / 180)
  const arcX    = (a) => CX + R * Math.cos(toRad(a))
  const arcY    = (a) => CY + R * Math.sin(toRad(a))

  const bgStart = { x: arcX(startAngle), y: arcY(startAngle) }
  const bgEnd   = { x: arcX(startAngle + TOTAL), y: arcY(startAngle + TOTAL) }
  const fgEnd   = { x: arcX(endAngle), y: arcY(endAngle) }
  const lgBg    = TOTAL > 180 ? 1 : 0
  const lgFg    = TOTAL * arcPct > 180 ? 1 : 0

  const bgPath = `M ${bgStart.x} ${bgStart.y} A ${R} ${R} 0 ${lgBg} 1 ${bgEnd.x} ${bgEnd.y}`
  const fgPath = arcPct > 0
    ? `M ${arcX(startAngle)} ${arcY(startAngle)} A ${R} ${R} 0 ${lgFg} 1 ${fgEnd.x} ${fgEnd.y}`
    : ''

  return (
    <div className={`rounded-2xl border-2 p-6 ${cfg.bg} ${cfg.border}`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Overall Cancer Risk</h2>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Gauge */}
        <div className="flex-shrink-0">
          <svg width="200" height="180" viewBox="0 0 200 200">
            {/* Background arc */}
            <path d={bgPath} fill="none" stroke="#e5e7eb" strokeWidth="16" strokeLinecap="round" />
            {/* Foreground arc */}
            {fgPath && (
              <path d={fgPath} fill="none" stroke={cfg.color} strokeWidth="16" strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease' }} />
            )}
            {/* Center text */}
            <text x="100" y="95" textAnchor="middle" className="font-bold" fontSize="36" fontWeight="700" fill={cfg.color}>
              {pct}%
            </text>
            <text x="100" y="118" textAnchor="middle" fontSize="12" fill="#6b7280">
              overall risk
            </text>
          </svg>
        </div>

        {/* Text summary */}
        <div className="space-y-3 flex-1">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${cfg.text} ${cfg.bg} border ${cfg.border}`}>
            {cfg.label}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Based on the health information provided, your estimated overall cancer risk score
            is <strong>{pct}%</strong>. This is a composite score across all cancer types analyzed.
          </p>
          <p className="text-xs text-gray-400">
            This is a statistical estimate for educational purposes only and is not a medical diagnosis.
            Consult a licensed healthcare professional for personal health assessments.
          </p>
        </div>
      </div>
    </div>
  )
}
