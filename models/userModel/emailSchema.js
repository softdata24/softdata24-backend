const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    min: 3,
    max: 20,
    unique: [true, "This username has already been used"],
  },
  phone: {
    type: String,
    required: [true, "Phone number required"],
    validate: {
      validator: function (v) {
        return /^([+]91[- ]?)?[6-9]\d{9}$/.test(v);
        // return /^([+]\d{2}[- ]?)?\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!!`,
    },
    unique: [true, "This phone number is already registered"],
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
  password: {
    type: String,
    required: [true, "Password required when signin without any provider"],
    min: 8,
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

module.exports = { EmailSchema };
