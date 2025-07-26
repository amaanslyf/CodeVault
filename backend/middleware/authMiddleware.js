const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Using the Mongoose User model

/**
 * Middleware to protect routes by verifying a user's JWT.
 * It expects a token in the 'Authorization' header in the format 'Bearer <token>'.
 */
const authMiddleware = async (req, res, next) => {
  let token;

  // 1. Check for the token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token from the header
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // 4. Find the user by the ID from the token payload
      // We use '-password' to exclude the password field from the result
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // 5. Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = authMiddleware;
