const { randomUUID } = require('crypto')
const { callMLAssessmentService } = require('../services/mlService')
// const { saveAssessment } = require('../services/assessmentService')

const submitAssessment = async (req, res, next) => {
  try {
    const assessmentData = req.body

    const prediction = await callMLAssessmentService(assessmentData)

    // TODO: uncomment when Supabase is configured
    // const { assessmentId } = await saveAssessment(assessmentData, prediction)

    res.status(200).json({
      success: true,
      assessment_id: randomUUID(),
      ...prediction,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { submitAssessment }
