const { supabase } = require('../config/supabase')

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required' })
  }

  if (!supabase) {
    // Supabase not configured — allow through in development
    console.warn('[Auth] Supabase not configured, skipping token verification')
    return next()
  }

  const token = authHeader.slice(7)
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' })
  }

  req.user = user
  next()
}

module.exports = { requireAuth }
