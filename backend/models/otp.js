import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const OtpStorageSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiryTime: {
    type: Date,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['signup', 'password_reset', 'login'],
    default: 'signup',
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
    expires: '15m',
  },
});

const OtpStorage = model('OtpStorage', OtpStorageSchema);

export default OtpStorage;
