const { callMLAssessmentService } = require('../services/mlService')
const { saveAssessment }          = require('../services/assessmentService')

const submitAssessment = async (req, res, next) => {
  try {
    const assessmentData = req.body
    const userId         = req.user?.id

    const prediction = await callMLAssessmentService(assessmentData)

    let assessmentId
    try {
      const saved = await saveAssessment(assessmentData, prediction, userId)
      assessmentId = saved.assessmentId
    } catch (dbErr) {
      // DB save failure should not block the user from seeing results
      console.error('[Assessment] DB save failed:', dbErr.message)
      assessmentId = require('crypto').randomUUID()
    }

    res.status(200).json({ success: true, assessment_id: assessmentId, ...prediction })
  } catch (error) {
    next(error)
  }
}

module.exports = { submitAssessment }
