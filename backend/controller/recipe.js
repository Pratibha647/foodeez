const Recipes = require("../models/recipe");

const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipes.find();
        return res.json(recipes);
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch recipes" });
    }
}

const getRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });
        return res.json(recipe);
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch recipe" });
    }
}

const addRecipe = async (req, res) => {
    try {
        const { title, ingridents, instructions, time, coverImage } = req.body;

        if (!title || !ingridents || !instructions) {
            return res.status(400).json({ message: "Required fields can't be empty" });
        }

        const userID = req.user.id;
        const userEmail = req.user.email;

        const newRecipe = await Recipes.create({
            title, ingridents, instructions, time, coverImage, userID, userEmail
        });
        return res.status(201).json(newRecipe);
    } catch (err) {
        return res.status(500).json({ message: `Error: ${err.message}` });
    }
}

const editRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        if (recipe.userID !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to edit this recipe" });
        }

        const updatedRecipe = await Recipes.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        return res.json(updatedRecipe);
    } catch (err) {
        return res.status(500).json({ message: `Error: ${err.message}` });
    }
}

const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        if (recipe.userID !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this recipe" });
        }

        await Recipes.findByIdAndDelete(req.params.id);
        return res.json({ message: "Recipe deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: `Error: ${err.message}` });
    }
}

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe }