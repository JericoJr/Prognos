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
      'Recurring respiratory infections (bronchitis/pneumonia)',
      'Unexplained weight loss and persistent fatigue',
    ],
    treatments: [
      'Surgery: lobectomy, segmentectomy, or VATS (early stage)',
      'Chemotherapy: cisplatin/carboplatin-based regimens',
      'Radiation therapy: SBRT (early stage) or EBRT (advanced)',
      'Targeted therapy: EGFR, ALK, ROS1, BRAF, MET inhibitors',
      'Immunotherapy: PD-1/PD-L1 checkpoint inhibitors (pembrolizumab, nivolumab)',
      'Palliative care and symptom management',
    ],
    sources: [
      { title: 'Lung Cancer Overview', organization: 'National Cancer Institute', url: 'https://www.cancer.gov/types/lung' },
      { title: 'NHANES Smoking Questionnaire (SMQ_J)', organization: 'CDC/NCHS', url: null },
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
    treatments: [
      'Surgery: lumpectomy (breast-conserving) or mastectomy',
      'Radiation therapy: post-surgical to reduce recurrence',
      'Chemotherapy: AC-T, CMF, or dose-dense regimens',
      'Hormone therapy: tamoxifen or aromatase inhibitors (ER/PR+)',
      'Targeted therapy: trastuzumab/pertuzumab (HER2+)',
      'Immunotherapy: pembrolizumab for triple-negative breast cancer',
    ],
    sources: [
      { title: 'Breast Cancer Overview', organization: 'National Cancer Institute', url: 'https://www.cancer.gov/types/breast' },
    ],
  },
  colon: {
    label: 'Colon Cancer',
    symptoms: [
      'Persistent change in bowel habits (diarrhea, constipation, or narrowing)',
      'Rectal bleeding or blood in stool (bright red or dark)',
      'Persistent abdominal cramps, gas, or pain',
      'Feeling that bowel does not empty completely',
      'Unexplained weight loss and fatigue',
      'Weakness or anemia (iron-deficiency)',
    ],
    treatments: [
      'Surgery: colectomy, polypectomy, or laparoscopic resection',
      'Chemotherapy: FOLFOX, FOLFIRI, CAPOX regimens',
      'Targeted therapy: bevacizumab (VEGF); cetuximab/panitumumab (RAS wild-type)',
      'Immunotherapy: pembrolizumab or nivolumab (MSI-H / dMMR)',
      'Radiation therapy: primarily for rectal cancer',
      'Surveillance colonoscopy (preventive and post-treatment)',
    ],
    sources: [
      { title: 'Colorectal Cancer Overview', organization: 'National Cancer Institute', url: 'https://www.cancer.gov/types/colorectal' },
    ],
  },
  prostate: {
    label: 'Prostate Cancer',
    symptoms: [
      'Frequent urination, especially at night (nocturia)',
      'Difficulty starting or stopping urination',
      'Weak, dribbling, or interrupted urine flow',
      'Blood in urine (hematuria) or semen (hematospermia)',
      'Painful or burning urination',
      'Discomfort in pelvic area or lower back',
    ],
    treatments: [
      'Active surveillance (watchful waiting for low-risk)',
      'Surgery: radical prostatectomy (open, laparoscopic, or robotic-assisted)',
      'Radiation: EBRT or brachytherapy',
      'Hormone therapy: androgen deprivation therapy (ADT)',
      'Chemotherapy: docetaxel or cabazitaxel (castration-resistant)',
      'Immunotherapy: sipuleucel-T (Provenge)',
    ],
    sources: [
      { title: 'Prostate Cancer Overview', organization: 'National Cancer Institute', url: 'https://www.cancer.gov/types/prostate' },
    ],
  },
  melanoma: {
    label: 'Melanoma',
    symptoms: [
      'New mole or change in existing mole (ABCDE criteria)',
      'Asymmetry: one half does not match the other',
      'Border irregularity: ragged, notched, or blurred edges',
      'Color variation: multiple shades within one mole',
      'Diameter > 6 mm (larger than a pencil eraser)',
      'Evolving mole: any change in size, shape, color, or bleeding',
    ],
    treatments: [
      'Surgery: wide local excision (primary treatment)',
      'Sentinel lymph node biopsy and lymph node dissection',
      'Immunotherapy: anti-PD-1 (pembrolizumab, nivolumab) or ipilimumab (CTLA-4)',
      'Targeted therapy: BRAF + MEK inhibitors (for BRAF V600 mutations)',
      'Radiation therapy: for brain or bone metastases',
      'Adjuvant therapy to reduce recurrence risk after surgery',
    ],
    sources: [
      { title: 'Melanoma Overview', organization: 'National Cancer Institute', url: 'https://www.cancer.gov/types/skin/melanoma' },
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
    treatments: [
      'Surgery: LEEP, cone biopsy, simple or radical hysterectomy',
      'Radiation: external beam combined with brachytherapy',
      'Chemotherapy: concurrent cisplatin (standard of care with radiation)',
      'Targeted therapy: bevacizumab (recurrent/metastatic)',
      'Immunotherapy: pembrolizumab (PD-L1+ or MSI-H)',
      'HPV vaccination (Gardasil 9): primary prevention',
    ],
    sources: [
      { title: 'Cervical Cancer Overview', organization: 'National Cancer Institute', url: 'https://www.cancer.gov/types/cervical' },
    ],
  },
  bladder: {
    label: 'Bladder Cancer',
    symptoms: [
      'Blood in urine (hematuria) — often painless',
      'Frequent or urgent need to urinate',
      'Painful or burning urination (dysuria)',
      'Pelvic pain or lower back pain on one side',
      'Inability to urinate (urinary retention)',
      'Swelling in lower legs (advanced stage)',
    ],
    treatments: [
      'Transurethral resection of bladder tumor (TURBT)',
      'Intravesical BCG (immunotherapy) or mitomycin C (non-muscle-invasive)',
      'Radical cystectomy (bladder removal) with urinary diversion',
      'Chemotherapy: gemcitabine + cisplatin',
      'Immunotherapy: atezolizumab, pembrolizumab, or avelumab (maintenance)',
      'Targeted therapy: erdafitinib (FGFR3 alterations)',
    ],
    sources: [
      { title: 'Bladder Cancer Overview', organization: 'National Cancer Institute', url: 'https://www.cancer.gov/types/bladder' },
    ],
  },
  thyroid: {
    label: 'Thyroid Cancer',
    symptoms: [
      'Painless lump or swelling in the front of the neck (most common)',
      'Hoarseness or other persistent voice changes',
      'Difficulty swallowing (dysphagia)',
      'Feeling of tightness or pressure in the throat',
      'Difficulty breathing (rare; suggests tracheal involvement)',
      'Swollen lymph nodes in the neck',
    ],
    treatments: [
      'Surgery: thyroidectomy (total or near-total) or lobectomy',
      'Radioactive iodine (I-131) ablation: post-surgical for differentiated types',
      'Thyroid hormone suppression: levothyroxine to suppress TSH',
      'External beam radiation: for locally advanced or aggressive types',
      'Targeted therapy: lenvatinib, sorafenib (RAI-refractory differentiated)',
      'Chemotherapy: primarily for anaplastic thyroid cancer',
    ],
    sources: [
      { title: 'Thyroid Cancer Overview', organization: 'National Cancer Institute', url: 'https://www.cancer.gov/types/thyroid' },
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
  const life = ad.lifestyle || {}
  const diet = ad.dietary || {}
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
  const lowFiber    = (parseFloat(diet.fruit_servings_per_day) || 0) < 2
                   && (parseFloat(diet.vegetable_servings_per_day) || 0) < 2
  const fastFood    = parseInt(diet.fast_food_meals_per_week) >= 3
  const famHx       = med.family_cancer_history === true
  const prevCx      = med.previous_cancer_diagnosed === true
  const diabetes    = med.diabetes_diagnosed === true

  const ageBonus = age > 65 ? 12 : age > 55 ? 7 : age > 45 ? 3 : 0

  let lung     = 7  + ageBonus + (smoker ? 22 : fmrSmoker ? 9 : 0) + (famHx ? 5 : 0) + (prevCx ? 7 : 0) + (symp.chronic_cough ? 5 : 0) + (symp.shortness_of_breath ? 3 : 0)
  let breast   = (sex === 'female' ? 11 : 2) + (sex === 'female' ? ageBonus : 0) + (famHx ? 12 : 0) + (prevCx ? 8 : 0) + (obese && sex === 'female' ? 5 : 0) + (heavyAlc ? 3 : 0) + (symp.lumps_or_swelling ? 7 : 0) + (symp.unusual_bleeding ? 4 : 0)
  let colon    = 7  + ageBonus + (famHx ? 10 : 0) + (prevCx ? 7 : 0) + (obese ? 4 : 0) + (smoker ? 4 : 0) + (heavyAlc ? 4 : 0) + (lowFiber ? 4 : 0) + (fastFood ? 3 : 0) + (lowActivity ? 3 : 0) + (diabetes ? 3 : 0) + (symp.blood_in_stool ? 12 : 0)
  let prostate = sex === 'male' ? 9 + ageBonus + (famHx ? 10 : 0) + (prevCx ? 7 : 0) + (obese ? 3 : 0) + (demo.race_ethnicity === 'black' ? 6 : 0) : 0
  let melanoma = 5  + Math.floor(ageBonus / 2) + (famHx ? 6 : 0) + (prevCx ? 7 : 0) + (symp.skin_changes ? 12 : 0)
  let cervical = sex === 'female' ? 5 + (age >= 25 && age <= 65 ? 3 : 0) + (smoker ? 8 : 0) + (famHx ? 4 : 0) + (prevCx ? 6 : 0) + (symp.unusual_bleeding ? 9 : 0) : 0
  let bladder  = (sex === 'male' ? 7 : 4) + Math.floor(ageBonus / 1.5) + (smoker ? 14 : fmrSmoker ? 6 : 0) + (famHx ? 4 : 0) + (prevCx ? 6 : 0)
  let thyroid  = (sex === 'female' ? 6 : 3) + (age >= 25 && age <= 65 ? 3 : 0) + (famHx ? 5 : 0) + (prevCx ? 5 : 0) + (symp.lumps_or_swelling ? 7 : 0)

  const cap = (n) => Math.min(Math.round(n), 90)
  return { lung: cap(lung), breast: cap(breast), colon: cap(colon), prostate: cap(prostate), melanoma: cap(melanoma), cervical: cap(cervical), bladder: cap(bladder), thyroid: cap(thyroid) }
}

function getTopFactors(type, ad) {
  const demo = ad.demographics || {}
  const body = ad.body_measurements || {}
  const life = ad.lifestyle || {}
  const med  = ad.medical_history || {}
  const symp = ad.symptoms || {}
  const age  = parseInt(demo.age) || 40
  const bmi  = parseFloat(body.bmi) || 25
  const f    = []

  if (age > 65)  f.push('Age 65+')
  else if (age > 55) f.push('Age 55–65')
  else if (age > 45) f.push('Age 45–55')
  if (life.smoking_status === 'current')  f.push('Current smoker')
  else if (life.smoking_status === 'former') f.push('Former smoker')
  if (med.family_cancer_history)           f.push('Family history of cancer')
  if (med.previous_cancer_diagnosed)       f.push('Previous cancer diagnosis')
  if (bmi >= 30)                           f.push('Obesity (BMI ≥ 30)')
  if (life.alcohol_frequency === 'daily' || parseInt(life.alcohol_drinks_per_week) > 14) f.push('Heavy alcohol use')

  if (type === 'lung'     && symp.chronic_cough)      f.push('Chronic cough reported')
  if (type === 'colon'    && symp.blood_in_stool)      f.push('Blood in stool reported')
  if (type === 'melanoma' && symp.skin_changes)        f.push('Skin changes reported')
  if (['breast', 'cervical'].includes(type) && symp.unusual_bleeding) f.push('Unusual bleeding reported')
  if (['breast', 'thyroid'].includes(type) && symp.lumps_or_swelling) f.push('Lump or swelling reported')

  return f.length ? f.slice(0, 4) : ['Age', 'Baseline population risk']
}

function getCategoryContributions(ad) {
  const hasLab = Object.values(ad.lab_results || {}).some(v => v !== '' && v !== null && v !== undefined)
  return [
    { category: 'Demographics & Genetics', weight: 0.15, nhanes_tables: ['demographics'] },
    { category: 'Lifestyle Factors',       weight: 0.28, nhanes_tables: ['lifestyle_factors'] },
    { category: 'Dietary Habits',          weight: 0.10, nhanes_tables: ['dietary_data'] },
    { category: 'Laboratory Results',      weight: hasLab ? 0.22 : 0.05, nhanes_tables: ['laboratory_results'] },
    { category: 'Medical History',         weight: 0.15, nhanes_tables: ['medical_history'] },
    { category: 'Current Symptoms',        weight: 0.10, nhanes_tables: ['symptoms'] },
  ]
}

function generateMockAssessmentPrediction(assessmentData) {
  const scores = calculateRiskScores(assessmentData)

  const cancerBreakdown = Object.entries(CANCER_STATIC).map(([type, s]) => ({
    type,
    label: s.label,
    risk_percentage: scores[type],
    risk_level: getRiskLevel(scores[type]),
    top_factors: getTopFactors(type, assessmentData),
    symptoms: s.symptoms,
    treatments: s.treatments,
    sources: s.sources,
  })).sort((a, b) => b.risk_percentage - a.risk_percentage)

  const vals = Object.values(scores)
  const avg  = vals.reduce((a, b) => a + b, 0) / vals.length
  const max  = Math.max(...vals)
  const overall = Math.round(avg * 0.6 + max * 0.4)

  return {
    overall_risk_percentage: overall,
    risk_category: getRiskLevel(overall),
    cancer_breakdown: cancerBreakdown,
    category_contributions: getCategoryContributions(assessmentData),
    _note: 'Mock predictions — ML models not yet trained. For UI development only.',
  }
}

module.exports = { callMLService, callMLAssessmentService }
