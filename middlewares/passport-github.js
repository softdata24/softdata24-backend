const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} = require("../configs/passport.config");
const { CLIENT_URL, SERVER_URL } = require("../configs/client.config");

const { GithubUser } = require("../models/userModel");
const GitHubStrategy = require("passport-github").Strategy;

module.exports = function (passport) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `${CLIENT_URL}`,
        // callbackURL: `${SERVER_URL}/auth/github/callback`,
        passReqToCallback: true,
      },
      async function (req, accessToken, refreshToken, profile, done) {
        try {
          await GithubUser.findOne({
            accountId: profile.id,
          }).then((currentUser) => {
            if (currentUser) {
              console.log("user already exist");
              // req.user = currentUser;
              return done(null, currentUser);
            } else {
              let user = {
                accountId: profile.id,
                username: profile.username,
                isProfilePictureSet: true,
                profilePicture: profile.photos[0].value,
              };
              new GithubUser(user).save().then((newUser) => {
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
