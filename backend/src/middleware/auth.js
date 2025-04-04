// File: src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { ApiError } = require('../utils/apiError');

/**
 * Middleware to authenticate user from JWT token
 */
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError('Authentication required', 401));
    }
    
    // Get the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next(new ApiError('Authentication required', 401));
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new ApiError('User not found', 401));
      }
      
      // Add user to request
      req.user = user;
      next();
    } catch (error) {
      return next(new ApiError('Invalid token', 401));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticateUser };