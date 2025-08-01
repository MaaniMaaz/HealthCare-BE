const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorHandler = require("../utils/ErrorHandler");

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    
    if (!token) {
      return ErrorHandler("Access token is required", 401, req, res);
    }

    // Remove 'Bearer ' prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "healthcare_secret");
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return ErrorHandler("User not found or inactive", 404, req, res);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return ErrorHandler("Invalid access token", 401, req, res);
    }
    if (error.name === 'TokenExpiredError') {
      return ErrorHandler("Access token has expired", 401, req, res);
    }
    return ErrorHandler(error.message, 500, req, res);
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return ErrorHandler("Admin access required", 403, req, res);
  }
  next();
};

const isDoctor = (req, res, next) => {
  if (req.user.role !== "doctor" && req.user.role !== "admin") {
    return ErrorHandler("Doctor access required", 403, req, res);
  }
  next();
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    
    if (!token) {
      req.user = null;
      return next();
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "healthcare_secret");
    const user = await User.findById(decoded.id);
    
    req.user = user && user.isActive ? user : null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = { 
  isAuthenticated, 
  isAdmin, 
  isDoctor, 
  optionalAuth 
};
