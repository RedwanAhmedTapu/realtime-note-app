const express = require("express");
const { registerUser, loginUser, refreshToken, logoutUser } = require("../controller/authController");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

module.exports = router;
