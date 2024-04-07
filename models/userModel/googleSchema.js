const mongoose = require("mongoose");

const GoogleSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    max: 50,
  },
  fname: {
    type: String,
    required: true,
    max: 50,
    trim: true,
  },
  lname: {
    type: String,
    required: true,
    max: 50,
    trim: true,
  },
  isProfilePictureSet: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

module.exports = { GoogleSchema };
