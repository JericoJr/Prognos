const { supabase } = require('../config/supabase')

const saveAssessment = async (assessmentData, prediction, userId) => {
  if (!supabase) throw new Error('Supabase not configured — set SUPABASE_URL and SUPABASE_ANON_KEY in .env')

  const { data: assessment, error: assessmentErr } = await supabase
    .from('assessments')
    .insert({ user_id: userId || null, status: 'completed' })
    .select()
    .single()
  if (assessmentErr) throw assessmentErr

  const aid = assessment.id

  const inserts = [
    supabase.from('demographics').insert({ assessment_id: aid, ...assessmentData.demographics }),
    supabase.from('body_measurements').insert({ assessment_id: aid, ...assessmentData.body_measurements }),
    supabase.from('lifestyle_factors').insert({ assessment_id: aid, ...assessmentData.lifestyle }),
    supabase.from('dietary_data').insert({ assessment_id: aid, ...assessmentData.dietary }),
    supabase.from('medical_history').insert({ assessment_id: aid, ...assessmentData.medical_history }),
    supabase.from('symptoms').insert({ assessment_id: aid, ...assessmentData.symptoms }),
    supabase.from('laboratory_results').insert({ assessment_id: aid, ...assessmentData.lab_results }),
    supabase.from('prediction_results').insert({
      assessment_id: aid,
      overall_risk_percentage: prediction.overall_risk,
      risk_category: prediction.risk_category,
      cancer_breakdown: prediction.cancer_breakdown,
      category_contributions: prediction.category_contributions,
      raw_output: prediction,
    }),
  ]

  const results = await Promise.all(inserts)
  const firstError = results.find(r => r.error)?.error
  if (firstError) throw firstError

  return { assessmentId: aid }
}

const getAssessment = async (assessmentId) => {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('assessments')
    .select(`
      *,
      demographics(*),
      body_measurements(*),
      lifestyle_factors(*),
      dietary_data(*),
      medical_history(*),
      symptoms(*),
      laboratory_results(*),
      prediction_results(*)
    `)
    .eq('id', assessmentId)
    .single()

  if (error) throw error
  return data
}

module.exports = { saveAssessment, getAssessment }
