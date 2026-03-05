import React, { useEffect, useState } from 'react'
import axios from 'axios'
import RecipeItems from '../components/RecipeItems'
import API_BASE from '../api'

export default function MyRecipe() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchMyRecipes = async () => {
            try {
                const res = await axios.get(`${API_BASE}/recipe/`);
                const myRecipes = res.data.filter(r => r.userID === userId);
                setRecipes(myRecipes);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyRecipes();
    }, [userId]);

    if (loading) return (
        <div className="loading-container" style={{ marginTop: "5rem" }}>
            <div className="spinner"></div>
            <p>Loading your recipes...</p>
        </div>
    );

    return (
        <>
            <div className="page-header">
                <h2>My Recipes 📝</h2>
                <p>All recipes you've shared with the community</p>
            </div>
            <div className="recipe" style={{ marginTop: 0 }}>
                {recipes.length === 0 ? (
                    <div className="empty-state">
                        <h3>You haven't posted any recipes yet</h3>
                        <p>Share your first recipe with the community!</p>
                    </div>
                ) : (
                    <RecipeItems recipes={recipes} showOwnerActions />
                )}
            </div>
        </>
    );
}
