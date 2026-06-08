const isDev = process.env.NODE_ENV !== 'production'

const logger = {
  info:  (msg, meta) => isDev && console.log(`[INFO]  ${msg}`, meta ?? ''),
  warn:  (msg, meta) => console.warn(`[WARN]  ${msg}`, meta ?? ''),
  error: (msg, err)  => console.error(`[ERROR] ${msg}`, err ?? ''),
}

module.exports = { logger }
