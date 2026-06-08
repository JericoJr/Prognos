const { supabase } = require('../config/supabase')

const savePrediction = async ({ cancerType, inputData, prediction, userId }) => {
  if (!supabase) throw new Error('Supabase client is not configured.')

  const { data, error } = await supabase
    .from('predictions')
    .insert({
      user_id: userId || null,
      cancer_type: cancerType,
      input_data: inputData,
      likelihood: prediction.likelihood,
      risk_level: prediction.risk_level,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

const getUserPredictions = async (userId) => {
  if (!supabase) throw new Error('Supabase client is not configured.')

  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

module.exports = { savePrediction, getUserPredictions }
