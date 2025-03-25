import mongoose from 'mongoose';
import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: false // Optional for Google users
  },
  description: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  googleId: {
    type: String,
    default: null
  },
  googleProfilePicture: {
    type: String,
    default: null
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent overwriting the model if it exists
const UserModel = models.User || model('User', UserSchema);

export default UserModel; 