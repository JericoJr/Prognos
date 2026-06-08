const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const routes = require('./src/routes/index')
const { errorHandler } = require('./src/middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Prognos API running on http://localhost:${PORT}`)
})

module.exports = app
