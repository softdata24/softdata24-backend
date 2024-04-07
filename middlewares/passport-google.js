const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = require("../configs/passport.config");
const { CLIENT_URL } = require("../configs/client.config");

const { GoogleUser } = require("../models/userModel");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        // callbackURL: `${SERVER_URL}/auth/google/callback`,
        callbackURL: `${CLIENT_URL}`,
        passReqToCallback: true,
        scope: ["profile", "email"],
      },
      async function (req, accessToken, refreshToken, profile, done) {
        try {
          await GoogleUser.findOne({
            accountId: profile.id,
            provider: profile.provider,
          }).then((currentUser) => {
            if (currentUser) {
              console.log("user already exist");
              // req.user = currentUser;
              return done(null, currentUser);
            } else {
              let user = {
                // accessToken: accessToken,
                accountId: profile.id,
                username: profile.displayName,
                fname: profile.name.givenName,
                lname: profile.name.familyName,
                email: profile.email,
                isProfilePictureSet: true,
                profilePicture: profile.photos[0].value,
              };
              new GoogleUser(user).save().then((newUser) => {
                // req.user = newUser;
                console.log("new user created");
                return done(null, newUser);
              });
            }
          });
        } catch (error) {
          console.log("Error creating user");
          return done(error, null, null);
        }
      }
    )
  );
};
