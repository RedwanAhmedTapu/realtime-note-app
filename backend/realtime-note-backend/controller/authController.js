const jwt = require("jsonwebtoken");

const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

// User Signup
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.json({ message: "Login successful", accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });
  
    try {
      const user = await User.findOne({ refreshToken });
      if (!user) return res.status(403).json({ message: "Invalid refresh token" });
  
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });
  
        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken }); 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Logout
const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  await User.findOneAndUpdate(
    { refreshToken: req.cookies.refreshToken },
    { refreshToken: null }
  );

  res.json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, refreshToken, logoutUser };
