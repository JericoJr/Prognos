export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-semibold text-gray-300 mb-1">Prognos</p>
        <p className="text-xs">© {new Date().getFullYear()} Prognos. For informational purposes only.</p>
        <p className="text-xs mt-1 text-gray-500">
          Not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </div>
    </footer>
  )
}
