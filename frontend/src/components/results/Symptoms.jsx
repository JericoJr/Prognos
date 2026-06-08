export default function Symptoms({ symptoms }) {
  if (!symptoms?.length) return null

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Common Symptoms to Watch For</h2>
      <ul className="space-y-2">
        {symptoms.map((symptom, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
            <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            {symptom}
          </li>
        ))}
      </ul>
    </div>
  )
}
