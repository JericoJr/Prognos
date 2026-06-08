export default function AssessmentStepper({ steps, currentStep }) {
  return (
    <div className="relative px-2">
      {/* Background line */}
      <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-200">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Step circles */}
      <div className="relative flex justify-between">
        {steps.map((label, i) => {
          const done    = i < currentStep
          const active  = i === currentStep
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold z-10 border-2 transition-all duration-300 ${
                  done  ? 'bg-blue-600 border-blue-600 text-white' :
                  active ? 'bg-white border-blue-600 text-blue-600 shadow-md' :
                           'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium text-center leading-tight max-w-[60px] hidden sm:block ${
                active ? 'text-blue-600' : done ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Mobile: current step label */}
      <p className="sm:hidden text-center text-sm font-semibold text-blue-600 mt-3">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
      </p>
    </div>
  )
}
