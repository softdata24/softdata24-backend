const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const { JWT_SECRET_KEY, JWT_ISSUER } = require("../configs/jwt.config");
const { BaseUser } = require("../models/userModel");

module.exports = function (passport) {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // jwtFromRequest: ExtractJwt.fromExtractors([
    //   ExtractJwt.fromAuthHeaderAsBearerToken(),
    //   (req) => {
    //     if (req && req.cookies && req.cookies.Bearer) {
    //       return req.cookies.Bearer;
    //     }
    //     return null;
    //   },
    // ]),
    secretOrKey: JWT_SECRET_KEY,
    issuer: JWT_ISSUER,
  };

  passport.use(
    new JwtStrategy(jwtOptions, function (jwt_payload, done) {
      console.log("jwt_payload: ", jwt_payload);
      const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
      if (jwt_payload.exp && currentTimestamp > jwt_payload.exp) {
        // Token is expired
        return done(null, false, { message: "Token expired" });
      }
      BaseUser.findById(jwt_payload.userId)
        .then((user) => {
          if (user) return done(null, user);
          else return done(null, false);
        })
        .catch((err) => {
          return done(err, false);
        });
    })
  );
};
