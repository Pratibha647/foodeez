const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        ingridents: { type: Array, required: true },
        instructions: { type: String, required: true },
        time: { type: String, },
        coverImage: { type: String, },
        userID: { type: String, required: true },
        userEmail: { type: String, }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Recipes', recipeSchema);