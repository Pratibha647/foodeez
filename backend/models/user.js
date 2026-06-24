const mongoose=require("mongoose");

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true, sparse: true, minlength: 3, maxlength: 30 },
    avatar: { type: String, default: "" },
    bio: { type: String, maxlength: 150, default: "" },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipes' }],
    likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipes' }]
}, { timestamps: true })

module.exports=mongoose.model("User", userSchema);