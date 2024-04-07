const jwt = require("jsonwebtoken");
const {
  JWT_SECRET_KEY,
  JWT_TOKEN_EXPIRY,
  JWT_ISSUER,
} = require("../configs/jwt.config");

const createJwtToken = (userId) => {
  const options = {
    expiresIn: JWT_TOKEN_EXPIRY, // Expiry time of the token
    issuer: JWT_ISSUER,
  };
  const payload = Object.assign({}, { userId });
  const token = jwt.sign(payload, JWT_SECRET_KEY, options);
  return token;
};

module.exports = createJwtToken;
