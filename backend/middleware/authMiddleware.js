const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // --- FIX #1: Use the standardized 'JWT_SECRET' environment variable ---
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // --- NOTE: The payload property should be '_id' to match your User model ---
      req.user = await User.findById(decoded._id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
      // --- FIX #2: Return here to prevent the 'no token' error from firing ---
      return; 
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
      // --- FIX #2: Return here as well ---
      return; 
    }
  }

  // This part only runs if the 'if' block is skipped entirely.
  res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = authMiddleware;
