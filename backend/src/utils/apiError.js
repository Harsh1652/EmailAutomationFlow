// File: src/utils/apiError.js
/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = { ApiError };