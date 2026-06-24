const express = require("express");
const router = express.Router();
const { userSignUp, userLogin, getUser, getMyProfile, getUserProfile, updateProfile, toggleFavourite, toggleLike } = require("../controller/user");
const verifyToken = require("../middleware/auth");

router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.get("/user/:id", getUser);

// User Profile Routes
router.get("/profile/me", verifyToken, getMyProfile);
router.get("/profile/:id", getUserProfile);
router.put("/profile", verifyToken, updateProfile);

// Likes & Favourites Synced Routes
router.post("/user/favourite/:recipeId", verifyToken, toggleFavourite);
router.post("/user/like/:recipeId", verifyToken, toggleLike);

module.exports = router