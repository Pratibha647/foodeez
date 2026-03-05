const express = require("express");
const router = express.Router();
const { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe } = require("../controller/recipe");
const verifyToken = require("../middleware/auth");

router.get("/", getRecipes);             // public — get all recipes
router.get("/:id", getRecipe);           // public — get recipe by id
router.post("/", verifyToken, addRecipe);        // protected — add recipe
router.put("/:id", verifyToken, editRecipe);     // protected — edit recipe
router.delete("/:id", verifyToken, deleteRecipe); // protected — delete recipe

module.exports = router;
