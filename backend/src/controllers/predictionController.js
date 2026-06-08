const { callMLService } = require('../services/mlService')
// const { savePrediction } = require('../services/supabaseService')

const makePredictionHandler = (cancerType) => async (req, res, next) => {
  try {
    const prediction = await callMLService(cancerType, req.body)

    // Optionally persist to Supabase:
    // await savePrediction({ cancerType, inputData: req.body, prediction, userId: req.user?.id })

    res.json({ success: true, cancer_type: cancerType, ...prediction })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  predictLung:     makePredictionHandler('lung'),
  predictBreast:   makePredictionHandler('breast'),
  predictColon:    makePredictionHandler('colon'),
  predictProstate: makePredictionHandler('prostate'),
  predictMelanoma: makePredictionHandler('melanoma'),
  predictCervical: makePredictionHandler('cervical'),
  predictBladder:  makePredictionHandler('bladder'),
  predictThyroid:  makePredictionHandler('thyroid'),
}
