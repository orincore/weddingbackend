const isAdmin = (req, res, next) => {
  console.log('Auth middleware - Session:', req.session);
  console.log('Auth middleware - Cookies:', req.headers.cookie);
  console.log('Auth middleware - adminAuth status:', req.session?.adminAuth);
  console.log('Auth middleware - Query params:', req.query);

  // Check if the admin auth is in the session
  const sessionAuth = req.session?.adminAuth === true;
  
  // Check if the auth is in the query parameters (fallback method)
  const queryAuth = req.query.adminKey === process.env.ADMIN_PASSWORD;

  // If either method validates, allow access
  if (sessionAuth || queryAuth) {
    console.log('Auth successful: Authorization valid');
    
    // If using query auth, set the session auth for future requests
    if (queryAuth && !sessionAuth && req.session) {
      req.session.adminAuth = true;
      console.log('Setting session auth from query param');
    }
    
    next();
    return;
  }
  
  // If no valid auth method, deny access
  console.log('Auth failed: No valid authorization found');
  return res.status(401).json({ 
    message: 'Not authorized, no token',
    session: req.session ? 'exists' : 'missing',
    sessionAuth: sessionAuth ? 'true' : 'false',
    queryAuth: queryAuth ? 'true' : 'false'
  });
};

module.exports = { isAdmin }; 
