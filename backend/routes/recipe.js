const express = require("express");
const router = express.Router();
const { 
    getRecipes, 
    getRecipe, 
    getMyRecipes,
    addRecipe, 
    editRecipe, 
    deleteRecipe,
    getTrendingRecipes,
    getLatestRecipes,
    getRecipesByCategory,
    getRelatedRecipes
} = require("../controller/recipe");
const verifyToken = require("../middleware/auth");

router.get("/", getRecipes);
router.get("/trending", getTrendingRecipes);
router.get("/latest", getLatestRecipes);
router.get("/category/:category", getRecipesByCategory);
router.get("/related/:id", getRelatedRecipes);
router.get("/my", verifyToken, getMyRecipes);
router.get("/:id", getRecipe);
router.post("/", verifyToken, addRecipe);
router.put("/:id", verifyToken, editRecipe);
router.delete("/:id", verifyToken, deleteRecipe);

module.exports = router;
