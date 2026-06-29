const express = require("express");
const router = express.Router();
const { userSignUp, userLogin, getUser, getMyProfile, getUserProfile, updateProfile, toggleFavourite, toggleLike, getFavourites, deleteFavourite } = require("../controller/user");
const verifyToken = require("../middleware/auth");

router.post("/signup", userSignUp);
router.post("/login", userLogin);

// Likes & Favourites Synced Routes
router.get("/user/favourites", verifyToken, getFavourites);
router.get("/favourites", verifyToken, getFavourites); // Keep as fallback
router.post("/user/favourite/:recipeId", verifyToken, toggleFavourite);
router.delete("/user/favourite/:recipeId", verifyToken, deleteFavourite);
router.post("/user/like/:recipeId", verifyToken, toggleLike);

router.get("/user/:id", getUser);

// User Profile Routes
router.get("/profile/me", verifyToken, getMyProfile);
router.get("/profile/:id", getUserProfile);
router.put("/profile", verifyToken, updateProfile);

module.exports = router