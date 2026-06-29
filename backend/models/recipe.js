const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        ingridents: { type: Array, required: true },
        instructions: { type: String, required: true },
        time: { type: String, },
        coverImage: { type: String, },
        userID: { type: String, required: true },
        userId: { type: String },
        userEmail: { type: String, },
        favouritesCount: { type: Number, default: 0 },
        likesCount: { type: Number, default: 0 },
        category: { type: String, default: "Lunch" }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Recipes', recipeSchema);