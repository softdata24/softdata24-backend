const isAuthenticated = require("../middlewares/is-authenticated");
const { StatusCodes } = require("http-status-codes");

const router = require("express").Router();

router.use("/google", require("./google-auth"));
router.use("/mail", require("./email-auth"));
router.use("/github", require("./github-auth"));
// router.use("/facebook", require("./facebook-auth"));
// router.use("/linkedin", require("./linkedin-auth"));

// Route for handling authentication errors
router.get("/login/failed", (req, res) =>
  res
    .status(StatusCodes.UNAUTHORIZED)
    .json({ success: false, message: "Authentication failed" })
);

router.post("/logout", isAuthenticated, async (req, res) => {
  console.log("Logging out user: ", req.user);
  try {
    res.clearCookie("Bearer", { httpOnly: true });
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "User logged in successfully" });
  } catch (err) {
    console.error("Failed to sign out user:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Failed to sign out user" });
  }
});

module.exports = router;
