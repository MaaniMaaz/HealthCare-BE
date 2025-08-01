const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/auth");

// Test route to verify routing is working
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Auth routes are working!" });
});

// Authentication routes (temporarily without validation for debugging)
router.route("/request-login-code").post(auth.requestLoginCode);
router.route("/verify-login-code").post(auth.verifyLoginCode);
router.route("/refresh-token").post(auth.refreshToken);
router.route("/logout").post(isAuthenticated, auth.logout);
router.route("/profile").get(isAuthenticated, auth.getProfile);
router.route("/profile").put(isAuthenticated, auth.updateProfile);



module.exports = router;
