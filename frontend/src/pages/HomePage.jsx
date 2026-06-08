import { Link } from 'react-router-dom'

const CANCER_TYPES = [
  { name: 'Lung Cancer', icon: '🫁', color: 'bg-blue-100 text-blue-800' },
  { name: 'Breast Cancer', icon: '🎗️', color: 'bg-pink-100 text-pink-800' },
  { name: 'Colon Cancer', icon: '🏥', color: 'bg-green-100 text-green-800' },
  { name: 'Prostate Cancer', icon: '💙', color: 'bg-indigo-100 text-indigo-800' },
  { name: 'Melanoma', icon: '☀️', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Cervical Cancer', icon: '🩺', color: 'bg-purple-100 text-purple-800' },
  { name: 'Bladder Cancer', icon: '💧', color: 'bg-cyan-100 text-cyan-800' },
  { name: 'Thyroid Cancer', icon: '🦋', color: 'bg-orange-100 text-orange-800' },
]

const FEATURES = [
  {
    title: 'Risk Assessment',
    desc: 'Get an AI-powered likelihood score for multiple cancer types based on your health data.',
    icon: '📊',
  },
  {
    title: 'Symptom Awareness',
    desc: 'Learn about common symptoms associated with your risk profile to stay informed.',
    icon: '🔍',
  },
  {
    title: 'Treatment Options',
    desc: 'Discover potential treatment pathways and next steps to discuss with your doctor.',
    icon: '💊',
  },
]

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Know Your <span className="text-blue-600">Risk</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Prognos uses advanced machine learning to assess your likelihood of cancer
          based on your personal health data. Early awareness saves lives.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/assess"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Assessment
          </Link>
          <a
            href="#about"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Learn More
          </a>
        </div>
      </section>

      <section id="about" className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Cancers We Screen For
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CANCER_TYPES.map((cancer) => (
            <div
              key={cancer.name}
              className={`p-4 rounded-xl text-center ${cancer.color} transition-transform hover:scale-105`}
            >
              <div className="text-3xl mb-2">{cancer.icon}</div>
              <p className="font-semibold text-sm">{cancer.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </div>
        ))}
      </section>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <p className="text-yellow-800 font-medium text-sm">
          Disclaimer: Prognos is an informational tool and does not replace professional medical advice.
          Always consult a qualified healthcare provider for diagnosis and treatment.
        </p>
      </div>
    </div>
  )
}
