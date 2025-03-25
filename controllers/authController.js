const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔹 Create JWT & send response
const createSendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    data: { id: user._id, username: user.username, email: user.email },
  });
};

// 🔹 Signup Controller
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 🔹 Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    // Find user by email & include password
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Check if password was changed after JWT was issued
    if (user.changedPasswordAfter(user.iat)) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Password was recently changed. Please login again.",
        });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
