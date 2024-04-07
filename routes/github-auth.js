const passport = require("passport");
const express = require("express");
const { sendBearerToken } = require("../controllers/userController");
const { CLIENT_URL } = require("../configs/client.config");
const router = express.Router();

router.get(
  "/",
  passport.authenticate("github", {
    scope: ["profile", "user:email"],
    session: false,
  })
);

router.get(
  "/callback",
  passport.authenticate("github", {
    // successRedirect: "/auth/login/success",
    failureRedirect: "/auth/login/failed",
    session: false,
  }),
  sendBearerToken
);

router.get("/error", (req, res) => res.send("Error logging in via Github.."));

module.exports = router;
