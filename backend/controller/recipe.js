const Recipes = require("../models/recipe");
const { sendRecipeConfirmation } = require("../config/emailService");

const getRecipes = async (req, res) => {
    try {
        const { q, category } = req.query;
        let filter = {};

        if (category) {
            filter.category = { $regex: new RegExp(`^${category}$`, "i") };
        }

        if (q) {
            filter.$or = [
                { title: { $regex: q, $options: "i" } },
                { instructions: { $regex: q, $options: "i" } },
                { ingridents: { $regex: q, $options: "i" } }
            ];
        }

        const recipes = await Recipes.find(filter).sort({ createdAt: -1 });
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
        const { title, ingridents, instructions, time, coverImage, category } = req.body;

        if (!title || !ingridents || !instructions) {
            return res.status(400).json({ message: "Required fields can't be empty" });
        }

        const userID = req.user.id;
        const userEmail = req.user.email;

        const newRecipe = await Recipes.create({
            title, ingridents, instructions, time, coverImage, userID, userEmail,
            category: category || "Lunch"
        });

        // Send confirmation email
        let emailSent = false;
        if (userEmail) {
            emailSent = await sendRecipeConfirmation(userEmail, title, category || "Lunch");
        }

        return res.status(201).json({
            ...newRecipe.toObject(),
            emailSent
        });
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

const getTrendingRecipes = async (req, res) => {
    try {
        const limitVal = parseInt(req.query.limit) || 6;
        const recipes = await Recipes.aggregate([
            {
                $addFields: {
                    score: { $add: [ { $ifNull: ["$likesCount", 0] }, { $ifNull: ["$favouritesCount", 0] } ] }
                }
            },
            { $sort: { score: -1, createdAt: -1 } },
            { $limit: limitVal }
        ]);
        return res.json(recipes);
    } catch (err) {
        return res.status(500).json({ message: `Failed to fetch trending recipes: ${err.message}` });
    }
};

const getLatestRecipes = async (req, res) => {
    try {
        const limitVal = parseInt(req.query.limit) || 8;
        const recipes = await Recipes.find().sort({ createdAt: -1 }).limit(limitVal);
        return res.json(recipes);
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch latest recipes" });
    }
};

const getRecipesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const validCategories = ["Breakfast", "Lunch", "Dinner", "Desserts", "Vegan", "Drinks"];
        const matchedCategory = validCategories.find(c => c.toLowerCase() === category.toLowerCase());
        if (!matchedCategory) {
            return res.status(400).json({ message: "Invalid category" });
        }

        const recipes = await Recipes.find({
            category: { $regex: new RegExp(`^${matchedCategory}$`, "i") }
        }).sort({ createdAt: -1 });

        return res.json(recipes);
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch recipes by category" });
    }
};

const getRelatedRecipes = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipes.findById(id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        const limitVal = parseInt(req.query.limit) || 4;
        const related = await Recipes.find({
            category: recipe.category,
            _id: { $ne: recipe._id }
        }).limit(limitVal);

        return res.json(related);
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch related recipes" });
    }
};

module.exports = { 
    getRecipes, 
    getRecipe, 
    addRecipe, 
    editRecipe, 
    deleteRecipe,
    getTrendingRecipes,
    getLatestRecipes,
    getRecipesByCategory,
    getRelatedRecipes
}