const axios = require('axios')

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000'

// ─── Legacy: per-cancer-type (used by /predict/* routes) ─────────────────────

const callMLService = async (cancerType, data) => {
  try {
    const response = await axios.post(`${ML_API_URL}/predict/${cancerType}`, data, { timeout: 30000 })
    return response.data
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED' || error.response?.status === 501) {
      return { likelihood: 0, risk_level: 'unknown', symptoms: [], treatments: [], sources: [], _note: 'ML service unavailable.' }
    }
    throw error
  }
}

// ─── Full NHANES assessment prediction ───────────────────────────────────────

const callMLAssessmentService = async (assessmentData) => {
  try {
    const response = await axios.post(`${ML_API_URL}/predict/assess`, assessmentData, { timeout: 30000 })
    return response.data
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED' || error.response?.status === 501) {
      return generateMockAssessmentPrediction(assessmentData)
    }
    throw error
  }
}

// ─── Static cancer info ───────────────────────────────────────────────────────

const CANCER_STATIC = {
  lung: {
    label: 'Lung Cancer',
    symptoms: [
      'Persistent cough lasting 2–3 weeks or longer',
      'Coughing up blood or rust-colored sputum',
      'Chest pain that worsens with deep breathing or coughing',
      'Shortness of breath with minimal exertion',
      'Hoarseness or unexplained voice changes',
      'Recurring respiratory infections (bronchitis or pneumonia)',
      'Unexplained weight loss and persistent fatigue',
    ],
    recommendations: [
      'Quit smoking — the single most impactful risk reducer',
      'Annual low-dose CT scan if age 50–80 with ≥20 pack-year smoking history (USPSTF)',
      'Test your home for radon — EPA recommends levels below 4 pCi/L',
      'Avoid secondhand smoke and occupational exposure (asbestos, arsenic, chromium)',
      'Eat an antioxidant-rich diet (fruits, vegetables, whole grains)',
      'Inform your doctor about any persistent cough or respiratory changes',
    ],
    sources: [
      { name: 'NCI — Lung Cancer', url: 'https://www.cancer.gov/types/lung' },
      { name: 'American Lung Association', url: 'https://www.lung.org/lung-health-diseases/lung-disease-lookup/lung-cancer' },
      { name: 'CDC — Lung Cancer', url: 'https://www.cdc.gov/cancer/lung' },
    ],
  },
  breast: {
    label: 'Breast Cancer',
    symptoms: [
      'Lump or thickening in breast or underarm that persists',
      'Change in breast size, shape, or appearance',
      'Nipple discharge other than breast milk',
      'Skin dimpling, puckering, redness, or scaliness',
      'Nipple retraction (turning inward)',
      'Persistent breast pain or tenderness',
    ],
    recommendations: [
      'Annual mammogram starting at age 40–45 (discuss timing with your doctor)',
      'Monthly self-breast exam; report any new lumps or changes immediately',
      'Limit alcohol to no more than 1 drink per day',
      'Maintain a healthy weight — obesity after menopause increases risk significantly',
      'Exercise regularly (150+ minutes of moderate activity per week)',
      'Consider genetic counseling if first-degree relatives had breast or ovarian cancer (BRCA1/BRCA2)',
    ],
    sources: [
      { name: 'NCI — Breast Cancer', url: 'https://www.cancer.gov/types/breast' },
      { name: 'American Cancer Society', url: 'https://www.cancer.org/cancer/types/breast-cancer.html' },
      { name: 'Susan G. Komen', url: 'https://www.komen.org/breast-cancer/' },
    ],
  },
  colon: {
    label: 'Colorectal Cancer',
    symptoms: [
      'Persistent change in bowel habits (diarrhea, constipation, or narrowing)',
      'Rectal bleeding or blood in stool (bright red or dark)',
      'Persistent abdominal cramps, gas, or pain',
      'Feeling that bowel does not empty completely',
      'Unexplained weight loss and fatigue',
      'Weakness or iron-deficiency anemia',
    ],
    recommendations: [
      'Colonoscopy starting at age 45 for average-risk adults (earlier with family history)',
      'Eat a high-fiber diet — vegetables, fruits, legumes, and whole grains',
      'Limit red meat and avoid processed meats (hot dogs, bacon, deli meats)',
      'Exercise regularly and maintain a healthy weight',
      'Do not smoke; limit alcohol consumption',
      'Manage diabetes — uncontrolled blood sugar increases colorectal cancer risk',
    ],
    sources: [
      { name: 'NCI — Colorectal Cancer', url: 'https://www.cancer.gov/types/colorectal' },
      { name: 'American Cancer Society', url: 'https://www.cancer.org/cancer/types/colon-rectal-cancer.html' },
      { name: 'CDC — Colorectal Cancer', url: 'https://www.cdc.gov/cancer/colorectal' },
    ],
  },
  prostate: {
    label: 'Prostate Cancer',
    symptoms: [
      'Frequent urination, especially at night (nocturia)',
      'Difficulty starting or stopping urination',
      'Weak, dribbling, or interrupted urine flow',
      'Blood in urine (hematuria) or semen',
      'Painful or burning urination',
      'Discomfort in pelvic area or lower back',
    ],
    recommendations: [
      'Discuss PSA screening with your doctor starting at age 50 (or 45 if high-risk)',
      'High-risk groups: African American men and those with first-degree relative diagnosed before 65',
      'Maintain a healthy weight and exercise regularly',
      'Eat a diet rich in fruits and vegetables; limit dairy and processed foods',
      'Some evidence suggests lycopene (tomatoes) and green tea may lower risk',
      'Report any urinary changes or pelvic discomfort to your doctor promptly',
    ],
    sources: [
      { name: 'NCI — Prostate Cancer', url: 'https://www.cancer.gov/types/prostate' },
      { name: 'American Cancer Society', url: 'https://www.cancer.org/cancer/types/prostate-cancer.html' },
      { name: 'Prostate Cancer Foundation', url: 'https://www.pcf.org' },
    ],
  },
  melanoma: {
    label: 'Melanoma (Skin)',
    symptoms: [
      'New mole or change in existing mole (apply ABCDE criteria)',
      'Asymmetry: one half does not match the other',
      'Border irregularity: ragged, notched, or blurred edges',
      'Color variation: multiple shades of brown, black, red, or white',
      'Diameter greater than 6 mm (larger than a pencil eraser)',
      'Evolving mole: any change in size, shape, color, or that bleeds',
    ],
    recommendations: [
      'Apply broad-spectrum SPF 30+ sunscreen daily; reapply every 2 hours outdoors',
      'Wear protective clothing, wide-brim hats, and UV-blocking sunglasses',
      'Avoid tanning beds entirely — they significantly increase melanoma risk',
      'Perform monthly self-skin exams using a full-length and hand mirror',
      'Get an annual full-body skin exam from a dermatologist',
      'Know the ABCDE rule and report any suspicious moles immediately',
    ],
    sources: [
      { name: 'NCI — Melanoma', url: 'https://www.cancer.gov/types/skin/melanoma' },
      { name: 'American Academy of Dermatology', url: 'https://www.aad.org/public/diseases/skin-cancer/types/melanoma' },
      { name: 'Skin Cancer Foundation', url: 'https://www.skincancer.org/skin-cancer-information/melanoma/' },
    ],
  },
  cervical: {
    label: 'Cervical Cancer',
    symptoms: [
      'Abnormal vaginal bleeding (between periods, after sex, or postmenopausal)',
      'Unusual vaginal discharge (watery, pink, or bloody)',
      'Pelvic pain not related to menstrual cycle',
      'Pain during sexual intercourse (dyspareunia)',
      'Urinary or bowel problems (advanced stage)',
      'Leg swelling (advanced — lymph node involvement)',
    ],
    recommendations: [
      'Pap smear every 3 years (ages 21–29) or Pap + HPV co-test every 5 years (ages 30–65)',
      'HPV vaccination (Gardasil 9): recommended through age 26; discuss with doctor up to age 45',
      'Do not smoke — smoking is a significant independent risk factor for cervical cancer',
      'Use barrier contraception to reduce HPV transmission risk',
      'Report any abnormal bleeding, discharge, or pelvic pain to your doctor',
      'Do not skip routine gynecological screenings even if feeling well',
    ],
    sources: [
      { name: 'NCI — Cervical Cancer', url: 'https://www.cancer.gov/types/cervical' },
      { name: 'American Cancer Society', url: 'https://www.cancer.org/cancer/types/cervical-cancer.html' },
      { name: 'CDC — Cervical Cancer', url: 'https://www.cdc.gov/cancer/cervical' },
    ],
  },
  bladder: {
    label: 'Bladder Cancer',
    symptoms: [
      'Blood in urine (hematuria) — often painless, may be intermittent',
      'Frequent or urgent need to urinate',
      'Painful or burning urination (dysuria)',
      'Pelvic pain or lower back pain on one side',
      'Inability to urinate (urinary retention)',
      'Swelling in lower legs (advanced stage)',
    ],
    recommendations: [
      'Stop smoking — it is the #1 modifiable risk factor for bladder cancer',
      'Drink 6–8 glasses of water per day to flush potential carcinogens from the bladder',
      'Avoid occupational exposure to aromatic amines (dye, rubber, printing, leather industries)',
      'Eat a diet rich in fruits and vegetables; antioxidants may lower risk',
      'Report any blood in urine to a doctor immediately — do not wait',
      'Limit or avoid exposure to arsenic in drinking water; test well water if applicable',
    ],
    sources: [
      { name: 'NCI — Bladder Cancer', url: 'https://www.cancer.gov/types/bladder' },
      { name: 'American Cancer Society', url: 'https://www.cancer.org/cancer/types/bladder-cancer.html' },
      { name: 'Bladder Cancer Advocacy Network', url: 'https://www.bcan.org' },
    ],
  },
  thyroid: {
    label: 'Thyroid Cancer',
    symptoms: [
      'Painless lump or swelling in the front of the neck (most common sign)',
      'Hoarseness or persistent voice changes not due to a cold',
      'Difficulty swallowing (dysphagia)',
      'Feeling of tightness or pressure in the throat',
      'Difficulty breathing (suggests tracheal involvement)',
      'Swollen lymph nodes in the neck',
    ],
    recommendations: [
      'Monthly self-neck exam: tilt head back, swallow water, and look for lumps near Adam\'s apple',
      'Report any persistent neck lump or voice change to your doctor immediately',
      'Avoid unnecessary radiation exposure to the head and neck area',
      'Eat adequate iodine (iodized salt, seafood) and selenium (Brazil nuts, tuna) for thyroid health',
      'If you had childhood radiation therapy to the head or neck, get regular thyroid checkups',
      'Consider genetic counseling if family history of thyroid cancer or MEN2 syndrome',
    ],
    sources: [
      { name: 'NCI — Thyroid Cancer', url: 'https://www.cancer.gov/types/thyroid' },
      { name: 'American Cancer Society', url: 'https://www.cancer.org/cancer/types/thyroid-cancer.html' },
      { name: 'Thyroid Cancer Survivors Association', url: 'https://www.thyca.org' },
    ],
  },
}

// ─── Risk scoring (semi-dynamic mock; replace with real ML inference) ─────────

function getRiskLevel(score) {
  if (score < 15) return 'low'
  if (score < 30) return 'moderate'
  if (score < 50) return 'high'
  return 'very_high'
}

function calculateRiskScores(ad) {
  const demo = ad.demographics || {}
  const body = ad.body_measurements || {}
  const life = ad.lifestyle_factors || ad.lifestyle || {}
  const diet = ad.dietary_data || ad.dietary || {}
  const med  = ad.medical_history || {}
  const symp = ad.symptoms || {}

  const age         = parseInt(demo.age) || 40
  const sex         = demo.sex || 'other'
  const bmi         = parseFloat(body.bmi) || 25
  const obese       = bmi >= 30
  const smoker      = life.smoking_status === 'current'
  const fmrSmoker   = life.smoking_status === 'former'
  const drinks      = parseInt(life.alcohol_drinks_per_week) || 0
  const heavyAlc    = life.alcohol_frequency === 'daily' || drinks > 14
  const lowActivity = (parseInt(life.physical_activity_minutes_per_week) || 0) < 75
  const lowFiber    = (parseFloat(diet.fruit_servings_per_week) || 0) < 3
                   && (parseFloat(diet.vegetable_servings_per_week) || 0) < 3
  const fastFood    = parseInt(diet.fast_food_per_week) >= 3 || diet.fast_food_per_week === 'daily'
  const famHx       = med.family_history_cancer === true || med.family_cancer_history === true
  const prevCx      = med.previous_cancer === true || med.previous_cancer_diagnosed === true
  const diabetes    = med.diabetes === true || med.diabetes_diagnosed === true

  const symptoms    = Array.isArray(symp.current_symptoms) ? symp.current_symptoms : []
  const hasSx       = (key) => symptoms.includes(key)

  const ageBonus = age > 65 ? 12 : age > 55 ? 7 : age > 45 ? 3 : 0

  let lung     = 7  + ageBonus + (smoker ? 22 : fmrSmoker ? 9 : 0) + (famHx ? 5 : 0) + (prevCx ? 7 : 0) + (hasSx('chronic_cough') ? 5 : 0) + (hasSx('shortness_of_breath') ? 3 : 0)
  let breast   = (sex === 'female' ? 11 : 2) + (sex === 'female' ? ageBonus : 0) + (famHx ? 12 : 0) + (prevCx ? 8 : 0) + (obese && sex === 'female' ? 5 : 0) + (heavyAlc ? 3 : 0) + (hasSx('lumps_swelling') ? 7 : 0) + (hasSx('blood_in_stool_urine') ? 4 : 0)
  let colon    = 7  + ageBonus + (famHx ? 10 : 0) + (prevCx ? 7 : 0) + (obese ? 4 : 0) + (smoker ? 4 : 0) + (heavyAlc ? 4 : 0) + (lowFiber ? 4 : 0) + (fastFood ? 3 : 0) + (lowActivity ? 3 : 0) + (diabetes ? 3 : 0) + (hasSx('blood_in_stool_urine') ? 12 : 0)
  let prostate = sex === 'male' ? 9 + ageBonus + (famHx ? 10 : 0) + (prevCx ? 7 : 0) + (obese ? 3 : 0) + (demo.race_ethnicity === 'black' ? 6 : 0) : 0
  let melanoma = 5  + Math.floor(ageBonus / 2) + (famHx ? 6 : 0) + (prevCx ? 7 : 0) + (hasSx('skin_changes') ? 12 : 0)
  let cervical = sex === 'female' ? 5 + (age >= 25 && age <= 65 ? 3 : 0) + (smoker ? 8 : 0) + (famHx ? 4 : 0) + (prevCx ? 6 : 0) + (hasSx('blood_in_stool_urine') ? 9 : 0) : 0
  let bladder  = (sex === 'male' ? 7 : 4) + Math.floor(ageBonus / 1.5) + (smoker ? 14 : fmrSmoker ? 6 : 0) + (famHx ? 4 : 0) + (prevCx ? 6 : 0)
  let thyroid  = (sex === 'female' ? 6 : 3) + (age >= 25 && age <= 65 ? 3 : 0) + (famHx ? 5 : 0) + (prevCx ? 5 : 0) + (hasSx('lumps_swelling') ? 7 : 0)

  const cap = (n) => Math.min(Math.round(n), 90)
  return { lung: cap(lung), breast: cap(breast), colon: cap(colon), prostate: cap(prostate), melanoma: cap(melanoma), cervical: cap(cervical), bladder: cap(bladder), thyroid: cap(thyroid) }
}

function getTopFactors(type, ad) {
  const demo = ad.demographics || {}
  const body = ad.body_measurements || {}
  const life = ad.lifestyle_factors || ad.lifestyle || {}
  const med  = ad.medical_history || {}
  const symp = ad.symptoms || {}
  const age  = parseInt(demo.age) || 40
  const bmi  = parseFloat(body.bmi) || 25
  const symptoms = Array.isArray(symp.current_symptoms) ? symp.current_symptoms : []
  const f = []

  if (age > 65)  f.push('Age 65+')
  else if (age > 55) f.push('Age 55–65')
  else if (age > 45) f.push('Age 45–55')
  if (life.smoking_status === 'current')  f.push('Current smoker')
  else if (life.smoking_status === 'former') f.push('Former smoker')
  if (med.family_history_cancer || med.family_cancer_history) f.push('Family history of cancer')
  if (med.previous_cancer || med.previous_cancer_diagnosed)   f.push('Previous cancer diagnosis')
  if (bmi >= 30)                                               f.push('Obesity (BMI ≥ 30)')
  if (life.alcohol_frequency === 'daily' || parseInt(life.alcohol_drinks_per_week) > 14) f.push('Heavy alcohol use')

  if (type === 'lung'     && symptoms.includes('chronic_cough'))      f.push('Chronic cough reported')
  if (type === 'colon'    && symptoms.includes('blood_in_stool_urine')) f.push('Blood in stool reported')
  if (type === 'melanoma' && symptoms.includes('skin_changes'))        f.push('Skin changes reported')
  if (['breast', 'cervical', 'bladder'].includes(type) && symptoms.includes('blood_in_stool_urine')) f.push('Unusual bleeding reported')
  if (['breast', 'thyroid'].includes(type) && symptoms.includes('lumps_swelling')) f.push('Lump or swelling reported')

  return f.length ? f.slice(0, 4) : ['Age', 'Baseline population risk']
}

function getCategoryContributions(ad) {
  const hasLab = Object.values(ad.laboratory_results || ad.lab_results || {}).some(v => v !== '' && v !== null && v !== undefined)
  return [
    { category: 'lifestyle',    weight: 0.28, nhanes_tables: ['lifestyle_factors'] },
    { category: 'laboratory',   weight: hasLab ? 0.22 : 0.05, nhanes_tables: ['laboratory_results'] },
    { category: 'demographics', weight: 0.15, nhanes_tables: ['demographics'] },
    { category: 'medical',      weight: 0.15, nhanes_tables: ['medical_history'] },
    { category: 'dietary',      weight: 0.10, nhanes_tables: ['dietary_data'] },
    { category: 'symptoms',     weight: 0.10, nhanes_tables: ['symptoms'] },
  ]
}

function generateMockAssessmentPrediction(assessmentData) {
  const scores = calculateRiskScores(assessmentData)

  // Return as object keyed by cancer type (consistent with DB JSONB structure)
  const cancerBreakdown = {}
  for (const [type, s] of Object.entries(CANCER_STATIC)) {
    cancerBreakdown[type] = {
      label: s.label,
      risk_score: scores[type],
      risk_level: getRiskLevel(scores[type]),
      top_factors: getTopFactors(type, assessmentData),
      symptoms: s.symptoms,
      recommendations: s.recommendations,
      sources: s.sources,
    }
  }

  const vals   = Object.values(scores)
  const avg    = vals.reduce((a, b) => a + b, 0) / vals.length
  const max    = Math.max(...vals)
  const overall = Math.round(avg * 0.6 + max * 0.4)

  return {
    overall_risk: overall,
    risk_category: getRiskLevel(overall),
    cancer_breakdown: cancerBreakdown,
    category_contributions: getCategoryContributions(assessmentData),
    mock: true,
  }
}

module.exports = { callMLService, callMLAssessmentService }
