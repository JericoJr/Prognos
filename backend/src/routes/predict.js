const { Router } = require('express')
const {
  predictLung,
  predictBreast,
  predictColon,
  predictProstate,
  predictMelanoma,
  predictCervical,
  predictBladder,
  predictThyroid,
} = require('../controllers/predictionController')

const router = Router()

router.post('/lung',     predictLung)
router.post('/breast',   predictBreast)
router.post('/colon',    predictColon)
router.post('/prostate', predictProstate)
router.post('/melanoma', predictMelanoma)
router.post('/cervical', predictCervical)
router.post('/bladder',  predictBladder)
router.post('/thyroid',  predictThyroid)

module.exports = router
