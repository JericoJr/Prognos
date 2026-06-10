const { Router } = require('express')
const predictRoutes    = require('./predict')
const healthRoutes     = require('./health')
const assessmentRoutes = require('./assessment')
const chatRoutes       = require('./chat')
const { requireAuth }  = require('../middleware/authMiddleware')

const router = Router()

router.use('/predict',     predictRoutes)
router.use('/health',      healthRoutes)
router.use('/assessments', requireAuth, assessmentRoutes)
router.use('/chat',        chatRoutes)

module.exports = router
