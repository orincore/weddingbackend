const isAdmin = (req, res, next) => {
  const { adminAuth } = req.session || {};

  if (!adminAuth) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    if (adminAuth) {
      next();
    } else {
      res.status(401).json({ message: 'Not authorized' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { isAdmin }; 