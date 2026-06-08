import { useLocation, Link, useNavigate } from 'react-router-dom'
import OverallRisk          from '../components/results/OverallRisk'
import CancerRiskBreakdown  from '../components/results/CancerRiskBreakdown'
import RiskExplanation      from '../components/results/RiskExplanation'

export default function ResultsPage() {
  const { state }  = useLocation()
  const navigate   = useNavigate()

  if (!state?.result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-gray-600 text-lg">No results to display.</p>
        <button
          onClick={() => navigate('/assess')}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Assessment
        </button>
      </div>
    )
  }

  const { result } = state
  const isMock = result.mock === true

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Risk Assessment Results</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {result.assessment_id ? `ID: ${result.assessment_id.slice(0, 8)}…` : ''}{' '}
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => navigate('/assess')}
            className="text-sm text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            New Assessment
          </button>
        </div>

        {/* Mock data notice */}
        {isMock && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <span className="text-amber-500 text-lg flex-shrink-0">⚠</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Demonstration Results</p>
              <p className="text-xs text-amber-700 mt-0.5">
                The ML prediction service is not yet connected. These results are generated from a
                statistical mock model for UI demonstration purposes only.
              </p>
            </div>
          </div>
        )}

        {/* Overall risk gauge */}
        <OverallRisk
          overallRisk={result.overall_risk}
          riskCategory={result.risk_category}
        />

        {/* Per-cancer breakdown */}
        <CancerRiskBreakdown cancerBreakdown={result.cancer_breakdown} />

        {/* Category contributions / SHAP placeholder */}
        <RiskExplanation categoryContributions={result.category_contributions} />

        {/* Medical disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <p className="text-xs text-yellow-800 leading-relaxed">
            <strong>Medical Disclaimer:</strong> This assessment is for informational and educational purposes only.
            It is not a substitute for professional medical advice, diagnosis, or treatment.
            If you have concerns about your health or any symptoms, please consult a qualified healthcare professional immediately.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pb-6">
          <p className="text-sm text-gray-500 mb-3">Want to learn more about cancer prevention?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://www.cancer.gov" target="_blank" rel="noreferrer"
              className="text-xs text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              National Cancer Institute
            </a>
            <a href="https://www.cdc.gov/cancer" target="_blank" rel="noreferrer"
              className="text-xs text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              CDC Cancer Resources
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
