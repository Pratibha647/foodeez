const Recipes = require("../models/recipe");
const mongoose = require("mongoose");
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

        console.log(`[Query Logger] URL: ${req.originalUrl}`);
        console.log(`[Query Logger] mongoose.connection.name: ${mongoose.connection.name}`);
        console.log(`[Query Logger] mongoose.connection.readyState: ${mongoose.connection.readyState}`);
        console.log(`[Query Logger] Recipes.collection.name: ${Recipes.collection.name}`);
        console.log(`[Query Logger] Model name: ${Recipes.modelName}`);
        console.log(`[Query Logger] Query being executed: find(${JSON.stringify(filter)}).sort({ createdAt: -1 })`);

        const recipes = await Recipes.find(filter).sort({ createdAt: -1 });
        return res.json(recipes);
    } catch (err) {
        console.error("Recipes Error in getRecipes:", err);
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            errorName: err.name,
            message: err.message,
            stack: err.stack
        });
    }
}

const getRecipe = async (req, res) => {
    try {
        console.log(`[Query Logger] URL: ${req.originalUrl}`);
        console.log(`[Query Logger] mongoose.connection.name: ${mongoose.connection.name}`);
        console.log(`[Query Logger] mongoose.connection.readyState: ${mongoose.connection.readyState}`);
        console.log(`[Query Logger] Recipes.collection.name: ${Recipes.collection.name}`);
        console.log(`[Query Logger] Model name: ${Recipes.modelName}`);
        console.log(`[Query Logger] Query being executed: findById(${req.params.id})`);

        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }
        return res.json(recipe);
    } catch (err) {
        console.error("Recipe Error in getRecipe:", err);
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            errorName: err.name,
            message: err.message,
            stack: err.stack
        });
    }
}

const getMyRecipes = async (req, res) => {
    try {
        console.log(`[Query Logger] URL: ${req.originalUrl}`);
        console.log(`[Query Logger] mongoose.connection.name: ${mongoose.connection.name}`);
        console.log(`[Query Logger] mongoose.connection.readyState: ${mongoose.connection.readyState}`);
        console.log(`[Query Logger] Recipes.collection.name: ${Recipes.collection.name}`);
        console.log(`[Query Logger] Model name: ${Recipes.modelName}`);
        console.log(`[Query Logger] Query being executed: find({ userID: ${req.user.id} }).sort({ createdAt: -1 })`);

        const recipes = await Recipes.find({ userID: req.user.id }).sort({ createdAt: -1 });
        return res.json(recipes);
    } catch (err) {
        console.error("My Recipes Error in getMyRecipes:", err);
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            errorName: err.name,
            message: err.message,
            stack: err.stack
        });
    }
}

const addRecipe = async (req, res) => {
    try {
        const { title, ingridents, instructions, time, coverImage, category } = req.body;

        if (!title || !ingridents || !instructions) {
            return res.status(400).json({ success: false, message: "Required fields can't be empty" });
        }

        const userID = req.user.id;
        const userId = req.user.id;
        const userEmail = req.user.email;

        console.log(`[Query Logger] URL: ${req.originalUrl}`);
        console.log(`[Query Logger] mongoose.connection.name: ${mongoose.connection.name}`);
        console.log(`[Query Logger] mongoose.connection.readyState: ${mongoose.connection.readyState}`);
        console.log(`[Query Logger] Recipes.collection.name: ${Recipes.collection.name}`);
        console.log(`[Query Logger] Model name: ${Recipes.modelName}`);
        console.log(`[Query Logger] Query being executed: create() with title: ${title}`);

        const newRecipe = await Recipes.create({
            title, ingridents, instructions, time, coverImage, userID, userId, userEmail,
            category: category || "Lunch"
        });

        // Send confirmation email
        let emailSent = false;
        if (userEmail) {
            try {
                emailSent = await sendRecipeConfirmation(userEmail, title, category || "Lunch");
            } catch (emailErr) {
                console.error("Email verification failed to send:", emailErr);
            }
        }

        return res.status(201).json({
            success: true,
            ...newRecipe.toObject(),
            emailSent
        });
    } catch (err) {
        console.error("Add Recipe Error in addRecipe:", err);
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            errorName: err.name,
            message: err.message,
            stack: err.stack
        });
    }
}

const editRecipe = async (req, res) => {
    try {
        console.log(`[Query Logger] URL: ${req.originalUrl}`);
        console.log(`[Query Logger] mongoose.connection.name: ${mongoose.connection.name}`);
        console.log(`[Query Logger] mongoose.connection.readyState: ${mongoose.connection.readyState}`);
        console.log(`[Query Logger] Recipes.collection.name: ${Recipes.collection.name}`);
        console.log(`[Query Logger] Model name: ${Recipes.modelName}`);
        console.log(`[Query Logger] Query being executed: findById(${req.params.id})`);

        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }
        if (recipe.userID !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to edit this recipe" });
        }

        console.log(`[Query Logger] Query being executed: findByIdAndUpdate(${req.params.id})`);
        const updatedRecipe = await Recipes.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        return res.json(updatedRecipe);
    } catch (err) {
        console.error("Edit Recipe Error in editRecipe:", err);
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            errorName: err.name,
            message: err.message,
            stack: err.stack
        });
    }
}

const deleteRecipe = async (req, res) => {
    try {
        console.log(`[Query Logger] URL: ${req.originalUrl}`);
        console.log(`[Query Logger] mongoose.connection.name: ${mongoose.connection.name}`);
        console.log(`[Query Logger] mongoose.connection.readyState: ${mongoose.connection.readyState}`);
        console.log(`[Query Logger] Recipes.collection.name: ${Recipes.collection.name}`);
        console.log(`[Query Logger] Model name: ${Recipes.modelName}`);
        console.log(`[Query Logger] Query being executed: findById(${req.params.id})`);

        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }
        if (recipe.userID !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this recipe" });
        }

        console.log(`[Query Logger] Query being executed: findByIdAndDelete(${req.params.id})`);
        await Recipes.findByIdAndDelete(req.params.id);
        return res.json({ success: true, message: "Recipe deleted successfully" });
    } catch (err) {
        console.error("Delete Recipe Error in deleteRecipe:", err);
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            errorName: err.name,
            message: err.message,
            stack: err.stack
        });
    }
}

const getTrendingRecipes = async (req, res) => {
    try {
        const limitVal = parseInt(req.query.limit) || 6;
        console.log(`[Query Logger] URL: ${req.originalUrl}`);
        console.log(`[Query Logger] mongoose.connection.name: ${mongoose.connection.name}`);
        console.log(`[Query Logger] mongoose.connection.readyState: ${mongoose.connection.readyState}`);
        console.log(`[Query Logger] Recipes.collection.name: ${Recipes.collection.name}`);
        console.log(`[Query Logger] Model name: ${Recipes.modelName}`);
        console.log(`[Query Logger] Query being executed: aggregate(...)`);

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
        console.error("Trending Recipe Error in getTrendingRecipes:", err);
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            errorName: err.name,
            message: err.message,
            stack: err.stack
        });
    }
};

const getLatestRecipes = async (req, res) => {
    try {
        const limitVal = parseInt(req.query.limit) || 8;
        console.log(`[Query Logger] URL: ${req.originalUrl}`);
        console.log(`[Query Logger] mongoose.connection.name: ${mongoose.connection.name}`);
        console.log(`[Query Logger] mongoose.connection.readyState: ${mongoose.connection.readyState}`);
        console.log(`[Query Logger] Recipes.collection.name: ${Recipes.collection.name}`);
        console.log(`[Query Logger] Model name: ${Recipes.modelName}`);
        console.log(`[Query Logger] Query being executed: find().sort({ createdAt: -1 }).limit(${limitVal})`);

        const recipes = await Recipes.find().sort({ createdAt: -1 }).limit(limitVal);
        return res.json(recipes);
    } catch (err) {
        console.error("Latest Recipe Error in getLatestRecipes:", err);
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            errorName: err.name,
            message: err.message,
            stack: err.stack
        });
    }
};

const getRecipesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const validCategories = ["Breakfast", "Lunch", "Dinner", "Desserts", "Vegan", "Drinks"];
        const matchedCategory = validCategories.find(c => c.toLowerCase() === category.toLowerCase());
        if (!matchedCategory) {
            return res.status(400).json({ success: false, message: "Invalid category" });
        }

        console.log(`[Query Logger] URL: ${req.originalUrl}`);
        console.log(`[Query Logger] mongoose.connection.name: ${mongoose.connection.name}`);
        console.log(`[Query Logger] mongoose.connection.readyState: ${mongoose.connection.readyState}`);
        console.log(`[Query Logger] Recipes.collection.name: ${Recipes.collection.name}`);
        console.log(`[Query Logger] Model name: ${Recipes.modelName}`);
        console.log(`[Query Logger] Query being executed: find({ category: ${matchedCategory} }).sort({ createdAt: -1 })`);

        const recipes = await Recipes.find({
            category: { $regex: new RegExp(`^${matchedCategory}$`, "i") }
        }).sort({ createdAt: -1 });

        return res.json(recipes);
    } catch (err) {
        console.error("Category Recipe Error in getRecipesByCategory:", err);
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            errorName: err.name,
            message: err.message,
            stack: err.stack
        });
    }
};

const getRelatedRecipes = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[Query Logger] URL: ${req.originalUrl}`);
        console.log(`[Query Logger] mongoose.connection.name: ${mongoose.connection.name}`);
        console.log(`[Query Logger] mongoose.connection.readyState: ${mongoose.connection.readyState}`);
        console.log(`[Query Logger] Recipes.collection.name: ${Recipes.collection.name}`);
        console.log(`[Query Logger] Model name: ${Recipes.modelName}`);
        console.log(`[Query Logger] Query being executed: findById(${id})`);

        const recipe = await Recipes.findById(id);
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }

        const limitVal = parseInt(req.query.limit) || 4;
        console.log(`[Query Logger] Query being executed: find({ category: ${recipe.category}, _id: { $ne: ${recipe._id} } }).limit(${limitVal})`);
        const related = await Recipes.find({
            category: recipe.category,
            _id: { $ne: recipe._id }
        }).limit(limitVal);

        return res.json(related);
    } catch (err) {
        console.error("Related Recipe Error in getRelatedRecipes:", err);
        console.error(err.stack);
        return res.status(500).json({
            success: false,
            errorName: err.name,
            message: err.message,
            stack: err.stack
        });
    }
};

module.exports = { 
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
}