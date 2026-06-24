const User =require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const userSignUp=async(req,res)=>{
    const {email, password}=req.body;
    if(!email || !password){
        return res.status(400).send({message:"Please provide valid credentials"});
    }

    let user=await User.findOne({email});
    if(user){
        return res.status(400).send({message:"User already exists"});
    }

    const hashPwd=await bcrypt.hash(password, 10);
    const newUser=await User.create({
        email, password:hashPwd
    })

    // generate the token
    let token=jwt.sign({email, id:newUser._id}, process.env.JWT_SECRET_KEY);
    return res.status(200).send({token, user:newUser});

}

const userLogin=async(req,res)=>{
    const {email, password}=req.body;
    if(!email || !password){
        return res.status(400).send({message:"Please provide valid credentials"});
    }
    let user=await User.findOne({email});
    if(user && await bcrypt.compare(password, user.password)){
        let token=jwt.sign({email, id:user._id}, process.env.JWT_SECRET_KEY);
        return res.status(200).send({token, user});
    }else{
        return res.status(400).send({message:"Invalid credentials"});
    }
}

const Recipes = require("../models/recipe");

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, email: user.email });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Error: ${err.message}` });
    }
}

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const createdRecipesCount = await Recipes.countDocuments({ userID: req.user.id });

        return res.status(200).json({
            success: true,
            profile: {
                _id: user._id,
                email: user.email,
                username: user.username || user.email.split("@")[0],
                avatar: user.avatar || "",
                bio: user.bio || "",
                createdRecipesCount,
                favouritesCount: user.favourites ? user.favourites.length : 0,
                likedRecipesCount: user.likedRecipes ? user.likedRecipes.length : 0,
                favourites: user.favourites || [],
                likedRecipes: user.likedRecipes || [],
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Error: ${err.message}` });
    }
}

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const createdRecipesCount = await Recipes.countDocuments({ userID: user._id.toString() });

        return res.status(200).json({
            success: true,
            profile: {
                _id: user._id,
                username: user.username || user.email.split("@")[0],
                avatar: user.avatar || "",
                bio: user.bio || "",
                createdRecipesCount,
                favouritesCount: user.favourites ? user.favourites.length : 0,
                likedRecipesCount: user.likedRecipes ? user.likedRecipes.length : 0,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Error: ${err.message}` });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { username, avatar, bio } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Validate username
        if (username !== undefined) {
            const trimmedUsername = username.trim();
            if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
                return res.status(400).json({
                    success: false,
                    message: "Username must be between 3 and 30 characters long"
                });
            }

            // Check uniqueness if username changed
            if (trimmedUsername !== user.username) {
                const existingUser = await User.findOne({ username: trimmedUsername });
                if (existingUser) {
                    return res.status(409).json({
                        success: false,
                        message: "Username is already taken"
                    });
                }
                user.username = trimmedUsername;
            }
        }

        // Validate bio
        if (bio !== undefined) {
            if (bio.length > 150) {
                return res.status(400).json({
                    success: false,
                    message: "Bio cannot exceed 150 characters"
                });
            }
            user.bio = bio;
        }

        // Update avatar if provided
        if (avatar !== undefined) {
            user.avatar = avatar;
        }

        await user.save();

        const createdRecipesCount = await Recipes.countDocuments({ userID: user._id.toString() });

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: {
                _id: user._id,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
                bio: user.bio,
                createdRecipesCount,
                favouritesCount: user.favourites ? user.favourites.length : 0,
                likedRecipesCount: user.likedRecipes ? user.likedRecipes.length : 0,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Error: ${err.message}` });
    }
}

const toggleFavourite = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const recipe = await Recipes.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }

        const favIndex = user.favourites.indexOf(recipeId);
        let favourited = false;

        if (favIndex > -1) {
            user.favourites.splice(favIndex, 1);
            recipe.favouritesCount = Math.max(0, (recipe.favouritesCount || 0) - 1);
            favourited = false;
        } else {
            user.favourites.push(recipeId);
            recipe.favouritesCount = (recipe.favouritesCount || 0) + 1;
            favourited = true;
        }

        await user.save();
        await Recipes.updateOne({ _id: recipeId }, { $set: { favouritesCount: recipe.favouritesCount } });

        return res.status(200).json({
            success: true,
            message: favourited ? "Added to favourites" : "Removed from favourites",
            favourited,
            favouritesCount: recipe.favouritesCount
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Error: ${err.message}` });
    }
}

const toggleLike = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const recipe = await Recipes.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }

        const likeIndex = user.likedRecipes.indexOf(recipeId);
        let liked = false;

        if (likeIndex > -1) {
            user.likedRecipes.splice(likeIndex, 1);
            recipe.likesCount = Math.max(0, (recipe.likesCount || 0) - 1);
            liked = false;
        } else {
            user.likedRecipes.push(recipeId);
            recipe.likesCount = (recipe.likesCount || 0) + 1;
            liked = true;
        }

        await user.save();
        await Recipes.updateOne({ _id: recipeId }, { $set: { likesCount: recipe.likesCount } });

        return res.status(200).json({
            success: true,
            message: liked ? "Recipe liked" : "Recipe unliked",
            liked,
            likesCount: recipe.likesCount
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Error: ${err.message}` });
    }
}

module.exports = { userSignUp, userLogin, getUser, getMyProfile, getUserProfile, updateProfile, toggleFavourite, toggleLike };