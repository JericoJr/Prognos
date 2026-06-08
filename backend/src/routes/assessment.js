const { Router } = require('express')
const { submitAssessment } = require('../controllers/assessmentController')

const router = Router()

router.post('/', submitAssessment)

module.exports = router
