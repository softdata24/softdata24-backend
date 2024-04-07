const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./configs/db.config");

const passport = require("passport");
require("./middlewares/passport")(passport);
const isAuthenticated = require("./middlewares/is-authenticated");

// const authRoutes = require("./routes/auth-prev");
const { userDetails, setAvatar } = require("./controllers/userController");

const authRoutes = require("./routes/auth");
const { errorHandler } = require("./middlewares/error.middleware");

const { port } = require("./configs/general.config");
const { CLIENT_URL } = require("./configs/client.config");

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use(passport.initialize());

app.use("/auth", authRoutes);

app.use(isAuthenticated);
app.get("/api/users", userDetails);
app.post("/api/users/:id/avatar", setAvatar);
// Centralized error handling middleware
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
