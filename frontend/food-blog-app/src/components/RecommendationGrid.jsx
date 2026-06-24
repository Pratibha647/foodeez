import React, { useMemo } from 'react';
import RecipeItems from './RecipeItems';

export default function RecommendationGrid({ recipes = [], loading = false }) {
    const recommendedRecipes = useMemo(() => {
        if (!recipes || recipes.length === 0) return [];

        try {
            // Get user's liked and favourited IDs
            const likedIds = JSON.parse(localStorage.getItem("likedRecipes") || "[]");
            const favIds = JSON.parse(localStorage.getItem("favourites") || "[]");
            const viewedCategories = JSON.parse(localStorage.getItem("viewedCategories") || "[]");

            // Calculate category affinity weights
            const categoryWeights = {};

            // Helper to add weight to a category
            const addWeight = (cat, weight) => {
                if (!cat) return;
                const normalized = cat.toLowerCase();
                categoryWeights[normalized] = (categoryWeights[normalized] || 0) + weight;
            };

            // 1. Process all recipes to check likes & favourites category associations
            recipes.forEach(recipe => {
                if (likedIds.includes(recipe._id)) {
                    addWeight(recipe.category, 3); // Likes count for weight 3
                }
                if (favIds.includes(recipe._id)) {
                    addWeight(recipe.category, 3); // Favourites count for weight 3
                }
            });

            // 2. Process viewed categories from local history
            viewedCategories.forEach(catName => {
                addWeight(catName, 1); // Views count for weight 1
            });

            // Find top preferred categories
            const sortedCategories = Object.entries(categoryWeights)
                .sort((a, b) => b[1] - a[1])
                .map(entry => entry[0]);

            // Filter out recipes the user has already liked/favourited (to recommend new stuff)
            const unseenRecipes = recipes.filter(r => !likedIds.includes(r._id) && !favIds.includes(r._id));

            if (sortedCategories.length > 0) {
                // Return recipes that match the user's top preferred categories
                const filtered = unseenRecipes.filter(r => 
                    r.category && sortedCategories.includes(r.category.toLowerCase())
                );
                
                if (filtered.length > 0) {
                    return filtered.slice(0, 4); // Suggest top 4
                }
            }

            // Fallback: Suggest general top recipes the user hasn't interacted with yet, or just newest
            return unseenRecipes.slice(0, 4);
        } catch (e) {
            console.error("Error computing recommendations", e);
            return recipes.slice(0, 4);
        }
    }, [recipes]);

    if (loading) {
        return (
            <div className="recommendations-loading">
                <div className="spinner"></div>
                <p>Curating recommendations for you...</p>
            </div>
        );
    }

    if (recommendedRecipes.length === 0) {
        return null; // hide section if empty
    }

    return (
        <div className="recommendations-grid-wrapper">
            <RecipeItems recipes={recommendedRecipes} />
        </div>
    );
}
