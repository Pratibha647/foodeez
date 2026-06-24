import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE from '../api';
import RecipeItems from './RecipeItems';

export default function ProfileRecipeGrid({ userId, username }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId) return;

        const fetchUserRecipes = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE}/recipe/`);
                const userRecipes = res.data.filter(r => r.userID === userId);
                setRecipes(userRecipes);
            } catch (err) {
                console.error("Failed to load user recipes", err);
                setError("Could not load user recipes.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserRecipes();
    }, [userId]);

    if (loading) {
        return (
            <div className="profile-recipes-section">
                <h3>Shared Recipes 🍽️</h3>
                <div className="loading-container" style={{ margin: "2rem 0" }}>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-recipes-section">
                <h3>Shared Recipes 🍽️</h3>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="profile-recipes-section">
            <h3 style={{ marginBottom: "1.5rem" }}>Shared Recipes 🍽️ ({recipes.length})</h3>
            {recipes.length === 0 ? (
                <div className="empty-state" style={{ padding: "3rem 1rem", border: "1px dashed #ddd", borderRadius: "8px" }}>
                    <h4>No recipes shared yet</h4>
                    <p>{username || "This user"} hasn't published any recipes to Foodeez.</p>
                </div>
            ) : (
                <RecipeItems recipes={recipes} />
            )}
        </div>
    );
}
