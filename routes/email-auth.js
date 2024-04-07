const { sendBearerToken, register } = require("../controllers/userController");

const passport = require("passport");
const router = require("express").Router();

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login/failed",
    session: false,
  }),
  sendBearerToken
);
router.post("/register", register);

module.exports = router;
