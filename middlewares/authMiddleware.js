const isAdmin = (req, res, next) => {
  console.log('Auth middleware - Session:', req.session);
  console.log('Auth middleware - Cookies:', req.headers.cookie);
  console.log('Auth middleware - adminAuth status:', req.session?.adminAuth);

  const { adminAuth } = req.session || {};

  if (!adminAuth) {
    console.log('Auth failed: No adminAuth in session');
    return res.status(401).json({ 
      message: 'Not authorized, no token',
      session: req.session ? 'exists' : 'missing', 
      adminAuth: adminAuth ? 'true' : 'false'
    });
  }

  try {
    if (adminAuth) {
      console.log('Auth successful: adminAuth is valid');
      next();
    } else {
      console.log('Auth failed: adminAuth is invalid');
      res.status(401).json({ message: 'Not authorized' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { isAdmin }; 
