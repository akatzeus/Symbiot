// Updated auth_routes.js with correct method for request-otp endpoint

import express from "express";
import {
  signup,
  login,
  loginWithPhone,
  logout,
  getCurrentUser,
  requestOtp,
  verifyOtp,
  forgotPassword,
  resetPassword
} from "../controllers/auth_controllers.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

// Authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/login-with-phone", loginWithPhone);
router.post("/logout", logout);
router.get("/me", protectRoute, getCurrentUser);

// OTP and verification routes - IMPORTANT: These must be POST endpoints!
router.post("/request-otp", requestOtp);  // Make sure this is POST, not GET
router.post("/verify-otp", verifyOtp);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;