import User from "../models/user.js";
import { generateTokenAndSetCookies } from "../utils/generateAndSetCookies.js";
import dotenv from "dotenv";
dotenv.config();
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import twilio from "twilio";

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN; // This should be stored in .env file
const client = twilio(accountSid, authToken);
const verifyServiceSid = process.env.TWILIO_VERIFY_SID || 'VA0b6fbceb6dd33fd2db96e7de381d7a52';

// OTP expiration time in minutes
const OTP_EXPIRY_MINUTES = 10;

// Request OTP for phone verification
export const requestOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    
    // Check if phone number is already registered
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'This phone number is already registered' });
    }
    
    // Send verification code via Twilio
    await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' })
      .then(verification => {
        console.log(`Verification sent to ${phoneNumber}, status: ${verification.status}`);
        return res.status(200).json({ 
          message: `Verification code sent to ${phoneNumber}`,
          expiresIn: `${OTP_EXPIRY_MINUTES} minutes`
        });
      })
      .catch(error => {
        console.error('Error sending verification:', error);
        return res.status(500).json({ message: 'Failed to send verification code', error: error.message });
      });
  } catch (error) {
    console.error('OTP request error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP and proceed with registration
export const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;
    
    if (!phoneNumber || !code) {
      return res.status(400).json({ message: 'Phone number and verification code are required' });
    }
    
    // Verify the code using Twilio
    await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({ to: phoneNumber, code })
      .then(verification_check => {
        if (verification_check.status === 'approved') {
          // Store the verified phone number in session or return a temporary token
          // This token can be used in the signup step to confirm the phone is verified
          const tempToken = jwt.sign(
            { phoneNumber, verified: true },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );
          
          return res.status(200).json({ 
            message: 'Phone number verified successfully',
            tempToken,
            status: verification_check.status
          });
        } else {
          return res.status(400).json({ 
            message: 'Invalid verification code or code expired',
            status: verification_check.status
          });
        }
      })
      .catch(error => {
        console.error('Verification check error:', error);
        return res.status(500).json({ message: 'Error verifying code', error: error.message });
      });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Complete signup after phone verification
export const signup = async (req, res) => {
  const { name, username, password, email, phoneNumber, verificationToken } = req.body;
  
  try {
    // Validate required fields (email is optional now)
    if (!name || !username || !password || !phoneNumber || !verificationToken) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }
    
    // Verify the temporary token to confirm phone verification
    try {
      const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);
      if (!decoded.verified || decoded.phoneNumber !== phoneNumber) {
        return res.status(400).json({ message: "Phone verification failed or expired" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired verification" });
    }
    
    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    
    // Check for existing user with username
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User with this username exists" });
    }
    
    // Check for existing user with phone number again (just to be safe)
    const phoneUser = await User.findOne({ phoneNumber });
    if (phoneUser) {
      return res.status(400).json({ message: "User with this phone number exists" });
    }
    
    // Check for existing user with email (if provided)
    if (email) {
      const emailUser = await User.findOne({ email });
      if (emailUser) {
        return res.status(400).json({ message: "User with this email exists" });
      }
    }
    
    // Hash password and create new user
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      phoneNumber,
      email: email || "" // Make email optional
    });
    
    await newUser.save();
    console.log(newUser._id);
    
    // Generate JWT token and set cookies
    generateTokenAndSetCookies(res, newUser._id);
    console.log("token generated");
    
    res.status(201).json({ 
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        phoneNumber: newUser.phoneNumber
      }
    });
  } catch (err) {
    console.error("Error in signup controller:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login with phone number and password
export const loginWithPhone = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "Phone number and password are required" });
    }
    
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    generateTokenAndSetCookies(res, user._id);
    console.log("token generated");
    
    res.json({ 
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error("Error in login with phone controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Standard login with username and password (keeping for backward compatibility)
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("login controller");
    console.log(username, password);
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    generateTokenAndSetCookies(res, user._id);
    console.log("token generated");
    
    res.json({ 
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Request OTP for password reset
export const forgotPassword = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    
    // Check if user exists with this phone number
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "No account found with this phone number" });
    }
    
    // Send verification code via Twilio
    await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' })
      .then(verification => {
        console.log(`Reset verification sent to ${phoneNumber}, status: ${verification.status}`);
        return res.status(200).json({ 
          message: `Password reset code sent to ${phoneNumber}`,
          expiresIn: `${OTP_EXPIRY_MINUTES} minutes`
        });
      })
      .catch(error => {
        console.error('Error sending reset verification:', error);
        return res.status(500).json({ message: 'Failed to send verification code', error: error.message });
      });
  } catch (error) {
    console.error('Password reset request error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Reset password after OTP verification
export const resetPassword = async (req, res) => {
  try {
    const { phoneNumber, code, newPassword } = req.body;
    
    if (!phoneNumber || !code || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Verify the code using Twilio
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({ to: phoneNumber, code });
    
    if (verification.status !== 'approved') {
      return res.status(400).json({ 
        message: 'Invalid verification code or code expired',
        status: verification.status
      });
    }
    
    // Find the user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);
    
    // Update user password
    user.password = hashedPassword;
    await user.save();
    
    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

export const getCurrentUser = (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};