const passport = require("passport");
const express = require("express");
const { sendBearerToken } = require("../controllers/userController");
// const { CLIENT_URL } = require("../configs/client.config");
const router = express.Router();

router.get(
  "",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    // successRedirect: "/auth/login/success",
    failureRedirect: "/auth/login/failed",
    session: false,
  }),
  sendBearerToken
  // (req, res) => {
  //   res.status(200).redirect(CLIENT_URL);
  // }
);

router.get("/error", (req, res) => res.send("Error logging in via Google.."));

module.exports = router;
