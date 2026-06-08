export default function Treatments({ treatments }) {
  if (!treatments?.length) return null

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Potential Treatment Options</h2>
      <ul className="space-y-2">
        {treatments.map((treatment, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
            <span className="text-green-500 flex-shrink-0 font-bold mt-0.5">✓</span>
            {treatment}
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-400 mt-4 border-t border-gray-100 pt-3">
        Treatment options depend on cancer stage, individual health, and specialist recommendations.
        Always consult an oncologist or qualified physician.
      </p>
    </div>
  )
}
