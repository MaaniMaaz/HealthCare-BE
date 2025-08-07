const User = require("../models/User");
const Tour = require("../models/tour");
const VerificationCode = require("../models/VerificationCode");
const sendMail = require("../utils/sendMail");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const { checkRateLimit } = require("../utils/rateLimiter");
const cloud = require("../functions/cloudinary");
const path = require("path");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const Booking = require("../models/booking");

// Request login verification code
const requestLoginCode = async (req, res) => {
  // #swagger.tags = ['auth']
  try {
    const { email } = req.body;

    if (!email) {
      return ErrorHandler("Email is required", 400, req, res);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ErrorHandler("Please provide a valid email address", 400, req, res);
    }

     const tours = await Booking.aggregate([
    //    {
    //   $addFields: {
    //     bookingObjectId: {
    //       $convert: {
    //         input: "$booking",
    //         to: "objectId",
    //         onError: null,       
    //         onNull: null
    //       }
    //     }
    //   }
    // },
    // {
    //   $lookup: {
    //     from: "bookings",
    //     localField: "bookingObjectId",
    //     foreignField: "_id",
    //     as: "booking"
    //   }
    // },
    //       {
    //         $unwind: "$booking"
    //       },
          {
            $lookup: {
              from: "facilities",
              localField: "facility",
              foreignField: "_id",
              as: "facility"
            }
          },
          {
            $unwind: "$facility"
          },
          {
            $lookup: {
              from: "assessments",
              localField: "facility.assessment",
              foreignField: "_id",
              as: "assessment"
            }
          },
          {
            $unwind: "$assessment"
          },
          {
              $match: email ? { "assessment.email": email } : {}
          },
         
        ]);

if (!tours?.length || tours[0]?.data?.length === 0) {
  return ErrorHandler({message:"Create your my care tour first",redirect:true}, 401, req, res);
}

    // Check rate limiting
    const rateLimit = checkRateLimit(email);
    if (!rateLimit.allowed) {
      return ErrorHandler(
        `Too many requests. Please try again in ${Math.ceil(rateLimit.retryAfter / 60)} minutes`,
        429,
        req,
        res
      );
    }

    // Delete any existing codes for this email
    await VerificationCode.deleteMany({ email, type: "login" });

    // Generate new verification code
    const code = VerificationCode.generateCode();
    
    // Save verification code
    await VerificationCode.create({
      email,
      code,
      type: "login",
    });

    // Send email with verification code
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, "../ejs/loginCode.ejs"),
      { code }
    );

    await sendMail(email, "Your HealthCare Login Code", emailTemplate);

    return SuccessHandler(
      {
        message: "Verification code sent to your email",
        email,
        expiresIn: "5 minutes",
      },
      200,
      res
    );
  } catch (error) {
    console.error("Request login code error:", error);
    return ErrorHandler(error.message, 500, req, res);
  }
};

// Verify login code and authenticate user
const verifyLoginCode = async (req, res) => {
  // #swagger.tags = ['auth']
  try {
    const { email, code, deviceToken, name } = req.body;

    if (!email || !code) {
      return ErrorHandler("Email and verification code are required", 400, req, res);
    }

    // Find verification code
    const verificationRecord = await VerificationCode.findOne({
      email,
      code,
      type: "login",
    });

    if (!verificationRecord) {
      return ErrorHandler("Invalid verification code", 400, req, res);
    }

    // Check if code is valid
    if (!verificationRecord.isValid()) {
      await VerificationCode.deleteOne({ _id: verificationRecord._id });
      return ErrorHandler("Verification code has expired or exceeded maximum attempts", 400, req, res);
    }

    // Increment attempts
    verificationRecord.attempts += 1;
    await verificationRecord.save();

    // Mark code as used
    verificationRecord.isUsed = true;
    await verificationRecord.save();

    // Find or create user
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      // Create new user
      user = await User.create({
        email,
        name: name || email.split('@')[0],
        deviceToken: deviceToken || null,
      });
      isNewUser = true;

      // Send welcome email for new users
      try {
        const welcomeTemplate = await ejs.renderFile(
          path.join(__dirname, "../ejs/welcome.ejs"),
          { name: user.name }
        );
        await sendMail(email, "Welcome to HealthCare!", welcomeTemplate);
      } catch (emailError) {
        console.error("Welcome email error:", emailError);
        // Don't fail the registration if welcome email fails
      }
    } else {
      // Update existing user
      if (deviceToken) {
        user.deviceToken = deviceToken;
      }
      user.lastLoginAt = new Date();
      await user.save();
    }

    // Generate tokens
    const token = user.getJWTToken();
    const refreshToken = user.getRefreshToken();

    // Clean up used verification code
    await VerificationCode.deleteOne({ _id: verificationRecord._id });

    return SuccessHandler(
      {
        message: isNewUser ? "Account created and logged in successfully" : "Logged in successfully",
        token,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
          role: user.role,
          lastLoginAt: user.lastLoginAt,
        },
        isNewUser,
      },
      200,
      res
    );
  } catch (error) {
    console.error("Verify login code error:", error);
    return ErrorHandler(error.message, 500, req, res);
  }
};

//login without code
const verifyLoginWithoutCode = async (req, res) => {
  try {
    const { email } = req.body;

    // const booking = await Booking.aggregate([
    //   {
    //     $lookup: {
    //       from: "facilities",
    //       localField: "booking.facility",
    //       foreignField: "_id",
    //       as: "facility"
    //     }
    //   },
    //   { $unwind: "$facility" },
    //   {
    //     $lookup: {
    //       from: "assessments",
    //       localField: "facility.assessment",
    //       foreignField: "_id",
    //       as: "assessment"
    //     }
    //   },
    //   { $unwind: "$assessment" },
    //   {
    //     $match: email ? { "assessment.email": email } : {}
    //   }
    // ]);

    // // Check if any bookings were found
    // if (!booking || booking.length === 0) {
    //   return ErrorHandler(`Booked tour not found`, 404, req, res);
    // }

    // Access the first matched booking
    // const selectedBooking = booking[0];

    // Now get the user using the email from the booking
    const user = await User.findOne({ email: email });

    if (!user) {
      return ErrorHandler(`User not found`, 404, req, res);
    }

    const token = user.getJWTToken();
    const refreshToken = user.getRefreshToken();

    return SuccessHandler(
      {
        message: "Verification successful",
        token,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
          role: user.role,
          lastLoginAt: user.lastLoginAt,
        },
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};


// Refresh JWT token
const refreshToken = async (req, res) => {
  // #swagger.tags = ['auth']
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return ErrorHandler("Refresh token is required", 400, req, res);
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "healthcare_refresh_secret");
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return ErrorHandler("Invalid refresh token", 401, req, res);
    }

    // Generate new tokens
    const newToken = user.getJWTToken();
    const newRefreshToken = user.getRefreshToken();

    return SuccessHandler(
      {
        token: newToken,
        refreshToken: newRefreshToken,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler("Invalid refresh token", 401, req, res);
  }
};

// Logout user
const logout = async (req, res) => {
  // #swagger.tags = ['auth']
  try {
    // Clear device token if provided
    if (req.user && req.body.clearDeviceToken) {
      await User.findByIdAndUpdate(req.user._id, { deviceToken: null });
    }

    return SuccessHandler("Logged out successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// Get user profile
const getProfile = async (req, res) => {
  // #swagger.tags = ['auth']
  try {
    const user = await User.findById(req.user._id).select('-__v');
    
    if (!user || !user.isActive) {
      return ErrorHandler("User not found", 404, req, res);
    }

    return SuccessHandler(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
      },
      200,
      res
    );
  } catch (error) {
    console.error("Get profile error:", error);
    return ErrorHandler(error.message, 500, req, res);
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  // #swagger.tags = ['auth']
  try {
    const { name, phone } = req.body;
    const userId = req.user._id;

     let fileUrls = [];
    
        if (req.files?.files?.length > 0) {
          // Upload all files concurrently
          fileUrls = await Promise.all(
            req.files.files.map(async (file) => {
              const filePath = `${Date.now()}-${path.parse(file.originalname).name}`;
              const uploaded = await cloud.uploadStreamImage(file.buffer, filePath);
              return uploaded.secure_url;
            })
          );
        }
    // Validate input
    // if (!name && !phone) {
    //   return ErrorHandler("At least one field (name or phone) is required", 400, req, res);
    // }

    // Prepare update data
    const updateData = {};
    if (name) {
      if (name.trim().length < 2) {
        return ErrorHandler("Name must be at least 2 characters long", 400, req, res);
      }
      updateData.name = name.trim();
    }
    
    if (phone) {
      // Basic phone validation
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        return ErrorHandler("Please provide a valid phone number", 400, req, res);
      }
      updateData.phone = phone.trim();
    }

    if (fileUrls.length > 0) {
  updateData.profileImage = fileUrls[0]; 
}

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!user) {
      return ErrorHandler("User not found", 404, req, res);
    }

    return SuccessHandler(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
      },
      200,
      res
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return ErrorHandler(error.message, 500, req, res);
  }
};





module.exports = {
  requestLoginCode,
  verifyLoginCode,
  verifyLoginWithoutCode,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
};
