require("dotenv").config();

module.exports = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_TOKEN_EXPIRY: process.env.JWT_TOKEN_EXPIRY,
  JWT_ISSUER: process.env.JWT_ISSUER,
};
