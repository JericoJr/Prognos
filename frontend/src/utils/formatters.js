export const formatCancerType = (type) => {
  const map = {
    lung: 'Lung Cancer',
    breast: 'Breast Cancer',
    colon: 'Colon Cancer',
    prostate: 'Prostate Cancer',
    melanoma: 'Melanoma',
    cervical: 'Cervical Cancer',
    bladder: 'Bladder Cancer',
    thyroid: 'Thyroid Cancer',
  }
  return map[type] ?? type
}

export const formatRiskLevel = (score) => {
  if (score < 20) return { level: 'low', label: 'Low Risk' }
  if (score < 50) return { level: 'moderate', label: 'Moderate Risk' }
  if (score < 75) return { level: 'high', label: 'High Risk' }
  return { level: 'very_high', label: 'Very High Risk' }
}
