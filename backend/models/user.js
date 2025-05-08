import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Accept either:
        // 1. +91 followed by 10 digits (international format)
        // 2. 10 digits only (national format)
        return /^(\+91\d{10}|\d{10})$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Please use a 10-digit Indian phone number with or without the +91 prefix.`
    }
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: true // Since we verify via OTP, users are verified by default
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('User', UserSchema);