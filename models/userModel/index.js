const { EmailSchema } = require("./emailSchema");
const { GoogleSchema } = require("./googleSchema");
const { GithubSchema } = require("./githubSchema");

const mongoose = require("mongoose");

const baseOptions = {
  timestamps: true,
  discriminatorKey: "provider",
  collection: "users",
};

const BaseUserSchema = new mongoose.Schema({}, baseOptions);
// BaseUserSchema.methods.generateAccessToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//       email: this.email,
//       username: this.username,
//       role: this.role,
//     },
//     process.env.JWT_SECRET_KEY,
//     { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
//   );
// };

const BaseUser = mongoose.model("BaseUser", BaseUserSchema);
const GoogleUser = BaseUser.discriminator("google", GoogleSchema);
const GithubUser = BaseUser.discriminator("github", GithubSchema);
const EmailUser = BaseUser.discriminator("direct", EmailSchema);

module.exports = { BaseUser, EmailUser, GoogleUser, GithubUser };
