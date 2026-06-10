import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { downloadLabResultsPDF, downloadFullReportPDF } from '../utils/pdfExport'

// ─── Risk config ──────────────────────────────────────────────────────────────

const RISK_CFG = {
  low:       { label: 'Low Risk',       color: '#22c55e', bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  badge: 'bg-green-100 text-green-800' },
  moderate:  { label: 'Moderate Risk',  color: '#f59e0b', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' },
  high:      { label: 'High Risk',      color: '#f97316', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800' },
  very_high: { label: 'Very High Risk', color: '#ef4444', bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    badge: 'bg-red-100 text-red-800' },
}

const riskKey = (pct) => pct < 15 ? 'low' : pct < 30 ? 'moderate' : pct < 50 ? 'high' : 'very_high'

// ─── SVG Gauge ────────────────────────────────────────────────────────────────

function RiskGauge({ pct, cfg }) {
  const R = 80, CX = 100, CY = 105, GAP = 35, TOTAL = 360 - GAP * 2
  const startAngle = 90 + GAP
  const arcPct     = Math.min(pct, 100) / 100
  const endAngle   = startAngle + TOTAL * arcPct
  const toRad = (d) => (d - 90) * (Math.PI / 180)
  const px = (a) => CX + R * Math.cos(toRad(a))
  const py = (a) => CY + R * Math.sin(toRad(a))
  const bgPath = `M ${px(startAngle)} ${py(startAngle)} A ${R} ${R} 0 ${TOTAL > 180 ? 1 : 0} 1 ${px(startAngle + TOTAL)} ${py(startAngle + TOTAL)}`
  const fgPath = arcPct > 0
    ? `M ${px(startAngle)} ${py(startAngle)} A ${R} ${R} 0 ${TOTAL * arcPct > 180 ? 1 : 0} 1 ${px(endAngle)} ${py(endAngle)}`
    : ''
  return (
    <svg width="200" height="175" viewBox="0 0 200 200">
      <path d={bgPath} fill="none" stroke="#e5e7eb" strokeWidth="18" strokeLinecap="round" />
      {fgPath && <path d={fgPath} fill="none" stroke={cfg.color} strokeWidth="18" strokeLinecap="round" />}
      <text x="100" y="100" textAnchor="middle" fontSize="38" fontWeight="800" fill={cfg.color}>{pct}%</text>
      <text x="100" y="122" textAnchor="middle" fontSize="11" fill="#9ca3af">overall risk</text>
    </svg>
  )
}

// ─── Download dropdown ────────────────────────────────────────────────────────

function DownloadDropdown({ result, assessmentData, assessmentId }) {
  const [open, setOpen]         = useState(false)
  const [downloading, setDownloading] = useState(null)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const labData = assessmentData?.laboratory_results || {}
  const hasLabs = Object.values(labData).some(v => v !== '' && v != null)

  const handle = async (type) => {
    setDownloading(type)
    setOpen(false)
    // Small delay so the button state renders before the (synchronous) PDF build blocks the thread
    await new Promise(r => setTimeout(r, 80))
    try {
      if (type === 'labs')   downloadLabResultsPDF(labData, assessmentId)
      if (type === 'report') downloadFullReportPDF(result, assessmentId)
    } finally {
      setDownloading(null)
    }
  }

  const busy = downloading !== null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        disabled={busy}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {busy ? (
          <>
            <svg className="animate-spin w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Generating…
          </>
        ) : (
          <>
            {/* Download icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
            <svg className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-30">
          {/* Full report */}
          <button
            onClick={() => handle('report')}
            className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Full Risk Report</p>
              <p className="text-xs text-gray-400 mt-0.5">Overall score, all 8 cancer types & top recommendations</p>
            </div>
          </button>

          <div className="mx-4 border-t border-gray-100" />

          {/* Lab results */}
          <button
            onClick={() => handle('labs')}
            className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Lab Results Summary</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {hasLabs
                  ? 'Your blood test values with reference ranges & status'
                  : 'No lab values were entered — PDF will show empty table'}
              </p>
            </div>
          </button>

          <p className="text-xs text-gray-400 text-center px-4 pb-2 pt-1">
            PDF saves to your Downloads folder
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Cancer accordion card ────────────────────────────────────────────────────

const CANCER_ICONS = {
  lung: '🫁', breast: '🎗️', colon: '🏥', prostate: '💙',
  melanoma: '☀️', cervical: '🩺', bladder: '💧', thyroid: '🦋',
}

const BAR_COLOR = { low: 'bg-green-400', moderate: 'bg-yellow-400', high: 'bg-orange-400', very_high: 'bg-red-500' }

function CancerCard({ type, data }) {
  const [open, setOpen] = useState(false)
  const [tab,  setTab]  = useState('recommendations')
  const key  = data.risk_level || riskKey(data.risk_score || 0)
  const cfg  = RISK_CFG[key] || RISK_CFG.low
  const pct  = Math.round(data.risk_score || 0)
  const icon = CANCER_ICONS[type] || '🔬'

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
      >
        <span className="text-xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-semibold text-gray-800">{data.label || type}</span>
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              <span className="text-sm font-bold text-gray-700">{pct}%</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${BAR_COLOR[key]}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
        <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-100">
          {/* Risk factor chips */}
          {data.top_factors?.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-gray-500 self-center mr-1">Your risk factors:</span>
              {data.top_factors.map((f, i) => (
                <span key={i} className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full shadow-sm">{f}</span>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {[
              { key: 'recommendations', label: 'Recommendations' },
              { key: 'symptoms',        label: 'Warning Signs'   },
              { key: 'sources',         label: 'Sources'         },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 text-xs font-semibold py-2.5 transition-colors ${
                  tab === t.key
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4">
            {tab === 'recommendations' && (
              <ul className="space-y-2">
                {(data.recommendations || []).map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>{r}
                  </li>
                ))}
              </ul>
            )}
            {tab === 'symptoms' && (
              <ul className="space-y-2">
                {(data.symptoms || []).map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>{s}
                  </li>
                ))}
              </ul>
            )}
            {tab === 'sources' && (
              <div className="space-y-2">
                {(data.sources || []).map((s, i) =>
                  s.url
                    ? <a key={i} href={s.url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 group">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="group-hover:underline">{s.name}</span>
                      </a>
                    : <span key={i} className="text-sm text-gray-600">{s.name}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const { state }  = useLocation()
  const navigate   = useNavigate()

  if (!state?.result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-gray-600 text-lg">No results to display.</p>
        <button onClick={() => navigate('/assess')}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          Start Assessment
        </button>
      </div>
    )
  }

  const { result, assessmentData } = state
  const pct  = Math.round(result.overall_risk ?? 0)
  const key  = result.risk_category || riskKey(pct)
  const cfg  = RISK_CFG[key] || RISK_CFG.low

  const sorted = result.cancer_breakdown
    ? Object.entries(result.cancer_breakdown).sort((a, b) => (b[1].risk_score || 0) - (a[1].risk_score || 0))
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Cat GIF hero — ML models coming soon */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex flex-col items-center px-6 pt-6 pb-4 text-center">
            <img
              src="https://media1.tenor.com/m/Rd0jrWH5JjgAAAAd/cat-scuba.gif"
              alt="Cat scuba diving"
              className="w-48 h-48 object-cover rounded-xl mb-4"
              onError={e => { e.target.style.display = 'none' }}
            />
            <h1 className="text-2xl font-bold text-gray-900">Assessment Complete!</h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="mx-6 mb-5 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800 text-center leading-relaxed">
              <strong>AI models are currently in training.</strong> Your answers have been recorded.
              Scores below show <strong>0%</strong> as a placeholder — expand each cancer type to explore
              risk factors, warning signs, and trusted resources.
            </p>
          </div>
        </div>

        {/* Header actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Your Risk Overview</h2>
          <div className="flex items-center gap-2">
            <DownloadDropdown
              result={result}
              assessmentData={assessmentData}
              assessmentId={result.assessment_id}
            />
            <button
              onClick={() => navigate('/assess')}
              className="text-sm text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              New Assessment
            </button>
          </div>
        </div>

        {/* Overall risk card */}
        <div className={`rounded-2xl border-2 p-6 ${cfg.bg} ${cfg.border}`}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <RiskGauge pct={pct} cfg={cfg} />
            </div>
            <div className="space-y-3 text-center sm:text-left">
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${cfg.badge}`}>
                {cfg.label}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">
                Your estimated overall cancer risk score is{' '}
                <strong className={cfg.text}>{pct}%</strong> — a composite across all eight
                cancer types below. Real predictions will be available once models are trained.
              </p>
              <p className="text-xs text-gray-400">
                Tap any cancer row to expand recommendations, warning signs, and sources.
              </p>
            </div>
          </div>
        </div>

        {/* Per-cancer breakdown */}
        {sorted.length > 0 && (
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Breakdown by Cancer Type</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                All scores show 0% (placeholder) — expand each row for detailed information.
              </p>
            </div>
            <div className="space-y-2">
              {sorted.map(([type, data]) => (
                <CancerCard key={type} type={type} data={data} />
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <h2 className="text-base font-semibold text-gray-800">Trusted Cancer Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'National Cancer Institute', desc: 'Research, treatment info & clinical trials', url: 'https://www.cancer.gov' },
              { name: 'American Cancer Society', desc: 'Patient guides, support & statistics', url: 'https://www.cancer.org' },
              { name: 'CDC Cancer Resources', desc: 'Prevention, screening & public health data', url: 'https://www.cdc.gov/cancer' },
              { name: 'Cancer.Net (ASCO)', desc: 'Oncologist-approved patient information', url: 'https://www.cancer.net' },
              { name: 'CancerCare', desc: 'Free counseling, support groups & financial help', url: 'https://www.cancercare.org' },
              { name: 'Find a Clinical Trial', desc: 'NCI database of active cancer trials', url: 'https://www.cancer.gov/about-cancer/treatment/clinical-trials/search' },
            ].map(r => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">{r.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* General recommendations */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-semibold text-green-800">General Cancer Prevention</h2>
          <ul className="space-y-2">
            {[
              'Do not smoke — tobacco causes at least 12 types of cancer.',
              'Maintain a healthy weight through balanced diet and regular exercise.',
              'Limit alcohol — no more than 1 drink/day for women, 2 for men.',
              'Protect your skin from UV radiation with sunscreen and protective clothing.',
              'Stay up to date on recommended cancer screenings for your age and sex.',
              'Get vaccinated against HPV (cervical, throat cancers) and Hepatitis B (liver cancer).',
              'Eat a plant-rich diet high in fiber and low in processed foods.',
            ].map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-green-800">
                <span className="text-green-500 mt-0.5 flex-shrink-0 font-bold">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-xs text-yellow-800 leading-relaxed">
            <strong>Medical Disclaimer:</strong> This assessment is for informational and educational
            purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
            Always consult a qualified healthcare professional with any questions regarding your health.
          </p>
        </div>

        <div className="text-center pb-6">
          <button
            onClick={() => navigate('/assess')}
            className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retake Assessment
          </button>
        </div>

      </div>
    </div>
  )
}
