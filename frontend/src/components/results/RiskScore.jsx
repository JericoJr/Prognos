import { formatCancerType } from '../../utils/formatters'

const RISK_CONFIG = {
  low:       { label: 'Low Risk',       barColor: 'bg-green-500',  bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800' },
  moderate:  { label: 'Moderate Risk',  barColor: 'bg-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
  high:      { label: 'High Risk',      barColor: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800' },
  very_high: { label: 'Very High Risk', barColor: 'bg-red-500',    bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800' },
  unknown:   { label: 'Unknown',        barColor: 'bg-gray-400',   bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-700' },
}

export default function RiskScore({ score, cancerType, level }) {
  const cfg = RISK_CONFIG[level] ?? RISK_CONFIG.unknown
  const displayScore = typeof score === 'number' ? Math.round(score) : 0

  return (
    <div className={`p-6 rounded-xl border-2 ${cfg.bg} ${cfg.border}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className={`text-xl font-bold ${cfg.text}`}>Risk Assessment</h2>
          <p className={`text-sm opacity-75 ${cfg.text}`}>{formatCancerType(cancerType)}</p>
        </div>
        <div className="text-right">
          <div className={`text-5xl font-bold ${cfg.text}`}>{displayScore}%</div>
          <div className={`text-sm font-semibold ${cfg.text} mt-1`}>{cfg.label}</div>
        </div>
      </div>
      <div className="w-full bg-white/60 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all duration-700 ${cfg.barColor}`}
          style={{ width: `${Math.min(displayScore, 100)}%` }}
        />
      </div>
      <p className={`text-xs mt-3 opacity-60 ${cfg.text}`}>
        Score represents estimated likelihood based on provided information. Not a clinical diagnosis.
      </p>
    </div>
  )
}
