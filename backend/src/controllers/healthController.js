const getHealth = (req, res) => {
  res.json({
    status: 'ok',
    service: 'prognos-api',
    timestamp: new Date().toISOString(),
  })
}

module.exports = { getHealth }
