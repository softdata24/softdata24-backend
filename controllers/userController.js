const bcrypt = require("bcrypt");
const { EmailUser } = require("../models/userModel");
const createJwtToken = require("../middlewares/create-jwt-token");

const sendBearerToken = (req, res, next) => {
  const token = createJwtToken(req.user._id);
  // res.cookie("Bearer", token, { httpOnly: true });
  res.send({ success: true, token, message: "Login Successful" });
  // next();
};

const register = async (req, res, next) => {
  try {
    const { username, email, phone, password, fname, lname } = req.body;

    if (!username || !email || !phone || !password || !fname || !lname) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const usernameCheck = await EmailUser.findOne({ username });
    if (usernameCheck)
      return res.json({ message: "Username already used", success: false });
    const phoneCheck = await EmailUser.findOne({ phone });
    if (phoneCheck)
      return res.json({ message: "Phone No. already used", success: false });
    const emailCheck = await EmailUser.findOne({ email });
    if (emailCheck)
      return res.json({ message: "Email already used", success: false });
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new EmailUser({ ...req.body, password: hashedPassword });

    user
      .save()
      .then((savedUser) => {
        delete savedUser.password;
        return res.status(201).json({ success: true, user: savedUser });
      })
      .catch((err) => {
        console.log("Error saving new user data");
        return res.json({ success: false, message: err.message });
      });
  } catch (err) {
    next(err);
  }
};

const userDetails = async (req, res, next) => {
  return res.status(200).json({ success: true, user: req.user });
};

const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await EmailUser.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendBearerToken,
  register,
  userDetails,
  setAvatar,
};
