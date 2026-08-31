const supabase = require('../supabaseClient');

/**
 * Express middleware that verifies Bearer JWT token using Supabase Auth.
 * Attaches verified user to req.user on success.
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: "Access token required"
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token || token.trim() === '') {
    return res.status(401).json({
      error: "Access token required"
    });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: "Invalid or expired token"
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }
}

module.exports = {
  requireAuth
};
