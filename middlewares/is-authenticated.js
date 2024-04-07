const passport = require("passport");

// Middleware to check if user is authenticated
const isAuthenticated = passport.authenticate("jwt", { session: false });

module.exports = isAuthenticated;
