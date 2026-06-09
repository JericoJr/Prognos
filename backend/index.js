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
const corsOrigin = process.env.FRONTEND_URL ||
  (process.env.NODE_ENV === 'production' ? /\.vercel\.app$/ : 'http://localhost:3000')
app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

app.use(errorHandler)

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Prognos API running on http://localhost:${PORT}`)
  })
}

module.exports = app
