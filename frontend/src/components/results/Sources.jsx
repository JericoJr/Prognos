export default function Sources({ sources }) {
  if (!sources?.length) return null

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Sources & References</h2>
      <ul className="space-y-3">
        {sources.map((source, i) => (
          <li key={i} className="text-sm flex items-start gap-2">
            <span className="text-gray-400 flex-shrink-0 font-mono text-xs mt-0.5">[{i + 1}]</span>
            <span>
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {source.title}
                </a>
              ) : (
                <span className="font-medium text-gray-900">{source.title}</span>
              )}
              {source.organization && (
                <span className="text-gray-500 ml-1">— {source.organization}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
