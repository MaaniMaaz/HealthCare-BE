const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please provide a valid phone number"],
    },
    profileImage: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deviceToken: {
      type: String,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    // Email verification fields
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationTokenExpires: {
      type: Date,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    // Password reset fields (for future use)
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetTokenExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

// Generate JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    { 
      id: this._id,
      email: this.email,
      role: this.role 
    },
    process.env.JWT_SECRET || "healthcare_jwt_secret",
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );
};

// Generate Refresh Token
userSchema.methods.getRefreshToken = function () {
  return jwt.sign(
    { 
      id: this._id,
      email: this.email 
    },
    process.env.JWT_REFRESH_SECRET || "healthcare_refresh_secret",
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
    }
  );
};

// Hash password before saving (for future password-based auth)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Compare password method (for future use)
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function () {
  this.lastLoginAt = new Date();
  return this.save();
};

// Check if user is active
userSchema.methods.isUserActive = function () {
  return this.isActive;
};

// Virtual for full name (if needed in future)
userSchema.virtual("displayName").get(function () {
  return this.name || this.email.split("@")[0];
});

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetTokenExpires;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationTokenExpires;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model("User", userSchema);