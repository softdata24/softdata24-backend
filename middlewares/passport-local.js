const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { EmailUser } = require("../models/userModel");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "value", passReqToCallback: true },
      function (req, value, password, done) {
        var query = {};
        const name = req.body.name;
        query[name] = value;

        EmailUser.findOne(query)
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "User not found" });
            }
            // Compare passwords
            bcrypt.compare(password, user.password, function (err, result) {
              if (err) {
                return done(err, null, { message: "Error comparing password" });
              }
              if (!result) {
                return done(null, false, { message: "Password not correct" });
              }
              // req.user = user;
              return done(null, user, {
                success: true,
                message: "Authenticated successfully",
              });
            });
          })
          .catch((err) => {
            return done(err, null, {
              message: "Error occurred when trying to access the user details",
            });
          });
      }
    )
  );
};
