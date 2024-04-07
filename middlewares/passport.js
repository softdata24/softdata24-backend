module.exports = function (passport) {
  require("./passport-google")(passport);
  require("./passport-local")(passport);
  require("./passport-github")(passport);
  require("./passport-jwt")(passport);
};
