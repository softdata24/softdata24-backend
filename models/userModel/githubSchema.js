const mongoose = require("mongoose");

const GithubSchema = new mongoose.Schema({
  accountId: {
    type: String,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    min: 3,
    max: 20,
    unique: [true, "This username has already been used"],
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

module.exports = { GithubSchema };
