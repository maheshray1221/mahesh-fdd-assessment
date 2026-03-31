const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // BUG 3: JWT is signed with JWT_SECRET but verified with JWT_SECRET_KEY
      // (which is undefined), so ALL protected routes reject valid tokens.
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorised, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorised, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: admins only' });
  }
};

module.exports = { protect, adminOnly };
