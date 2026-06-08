const CANCER_TYPES = [
  { id: 'lung', label: 'Lung', icon: '🫁' },
  { id: 'breast', label: 'Breast', icon: '🎗️' },
  { id: 'colon', label: 'Colon', icon: '🏥' },
  { id: 'prostate', label: 'Prostate', icon: '💙' },
  { id: 'melanoma', label: 'Melanoma', icon: '☀️' },
  { id: 'cervical', label: 'Cervical', icon: '🩺' },
  { id: 'bladder', label: 'Bladder', icon: '💧' },
  { id: 'thyroid', label: 'Thyroid', icon: '🦋' },
]

export default function CancerTypeSelector({ selected, onSelect }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Select Cancer Type</h2>
      <div className="grid grid-cols-4 gap-3">
        {CANCER_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onSelect(type.id)}
            className={`p-3 rounded-xl border-2 text-center transition-all ${
              selected === type.id
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="text-2xl mb-1">{type.icon}</div>
            <div className="text-xs font-medium">{type.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
