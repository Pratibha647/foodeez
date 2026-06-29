import React, { useEffect, useState } from 'react'
import axios from 'axios'
import RecipeItems from '../components/RecipeItems'
import API_BASE from '../api'

export default function MyRecipe() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchMyRecipes = async () => {
            if (!token) {
                setError("Please login to view your recipes.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError("");
                const res = await axios.get(`${API_BASE}/recipe/my`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecipes(res.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load your recipes.");
            } finally {
                setLoading(false);
            }
        };
        fetchMyRecipes();
    }, [userId, token]);

    if (loading) return (
        <div className="loading-container" style={{ marginTop: "5rem" }}>
            <div className="spinner"></div>
            <p>Loading your recipes...</p>
        </div>
    );

    if (error) return (
        <div className="page-header" style={{ marginTop: "5rem", textAlign: "center" }}>
            <p className="error" style={{ color: "#d9534f", fontSize: "1.2rem" }}>{error}</p>
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
                        <button className="btn-edit" style={{ marginTop: "1rem", display: 'inline-flex' }} onClick={() => window.location.href = "/addRecipe"}>
                            Share Recipe
                        </button>
                    </div>
                ) : (
                    <RecipeItems recipes={recipes} showOwnerActions />
                )}
            </div>
        </>
    );
}
