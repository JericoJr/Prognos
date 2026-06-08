import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentStepper    from '../components/assessment/AssessmentStepper'
import StepDemographics     from '../components/assessment/StepDemographics'
import StepBodyMeasurements from '../components/assessment/StepBodyMeasurements'
import StepLifestyle        from '../components/assessment/StepLifestyle'
import StepDietary          from '../components/assessment/StepDietary'
import StepMedicalHistory   from '../components/assessment/StepMedicalHistory'
import StepSymptoms         from '../components/assessment/StepSymptoms'
import StepLabResults       from '../components/assessment/StepLabResults'
import { submitAssessment } from '../services/api'

const STEPS = ['Demographics', 'Body', 'Lifestyle', 'Dietary', 'Medical', 'Symptoms', 'Lab Results']

const INITIAL = {
  demographics: {
    age: '', sex: '', race_ethnicity: '', education_level: '', marital_status: '', household_income: '',
  },
  body_measurements: {
    height_cm: '', weight_kg: '', bmi: '', waist_circumference_cm: '',
  },
  lifestyle_factors: {
    smoking_status: '', cigarettes_per_day: '', years_smoked: '', years_since_quit: '',
    alcohol_frequency: '', alcohol_drinks_per_week: '',
    physical_activity_minutes_per_week: '', sedentary_hours_per_day: '', sleep_hours_per_night: '',
  },
  dietary_data: {
    fruit_servings_per_week: '', vegetable_servings_per_week: '',
    sugary_drinks_per_week: '', fast_food_per_week: '',
    processed_food_frequency: '', water_intake_liters_per_day: '',
  },
  medical_history: {
    diabetes: false, hypertension: false, heart_disease: false,
    previous_cancer: false, previous_cancer_types: [],
    family_history_cancer: false, family_cancer_types: [],
    medications: '',
  },
  symptoms: {
    general_health: '', current_symptoms: [],
  },
  laboratory_results: {
    wbc: '', hemoglobin: '', platelets: '', cholesterol: '', hba1c: '', crp: '', psa: '',
  },
}

export default function AssessmentPage() {
  const navigate  = useNavigate()
  const [step, setStep]   = useState(0)
  const [data, setData]   = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const updateSection = (section) => (patch) =>
    setData(prev => ({ ...prev, [section]: { ...prev[section], ...patch } }))

  const sectionKeys = ['demographics', 'body_measurements', 'lifestyle_factors', 'dietary_data', 'medical_history', 'symptoms', 'laboratory_results']

  const STEP_COMPONENTS = [
    <StepDemographics     data={data.demographics}        onChange={updateSection('demographics')} />,
    <StepBodyMeasurements data={data.body_measurements}   onChange={updateSection('body_measurements')} />,
    <StepLifestyle        data={data.lifestyle_factors}   onChange={updateSection('lifestyle_factors')} />,
    <StepDietary          data={data.dietary_data}        onChange={updateSection('dietary_data')} />,
    <StepMedicalHistory   data={data.medical_history}     onChange={updateSection('medical_history')} />,
    <StepSymptoms         data={data.symptoms}            onChange={updateSection('symptoms')} />,
    <StepLabResults       data={data.laboratory_results}  onChange={updateSection('laboratory_results')} />,
  ]

  const validateStep = () => {
    if (step === 0) {
      const d = data.demographics
      if (!d.age || !d.sex) return 'Age and Sex are required.'
    }
    if (step === 1) {
      const b = data.body_measurements
      if (!b.height_cm || !b.weight_kg) return 'Height and Weight are required.'
    }
    if (step === 2) {
      if (!data.lifestyle_factors.smoking_status) return 'Please select a smoking status.'
    }
    if (step === 5) {
      if (!data.symptoms.general_health) return 'Please rate your general health.'
    }
    return ''
  }

  const handleNext = () => {
    const err = validateStep()
    if (err) { setError(err); return }
    setError('')
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setError('')
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await submitAssessment(data)
      navigate('/results', { state: { result, assessmentData: data } })
    } catch (e) {
      setError(e?.response?.data?.error || 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Cancer Risk Assessment</h1>
          <p className="text-sm text-gray-500 mt-1">NHANES-Compatible · 7 sections · Takes 5–10 minutes</p>
        </div>

        {/* Stepper */}
        <AssessmentStepper steps={STEPS} currentStep={step} />

        {/* Current step form */}
        {STEP_COMPONENTS[step]}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pb-6">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>

          <span className="text-xs text-gray-400">{step + 1} / {STEPS.length}</span>

          {step < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed min-w-[140px]"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Analyzing…
                </span>
              ) : 'Get My Results →'}
            </button>
          )}
        </div>

        {/* Privacy note */}
        <p className="text-xs text-center text-gray-400 pb-4">
          Your data is used only to generate a statistical risk estimate. This is not a medical diagnosis.
          No data is shared with third parties.
        </p>
      </div>
    </div>
  )
}
