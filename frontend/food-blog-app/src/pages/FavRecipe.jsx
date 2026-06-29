import React, { useEffect, useState } from 'react'
import axios from 'axios'
import RecipeItems from '../components/RecipeItems'
import API_BASE from '../api'

export default function FavRecipe() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFavourites = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please login to view your favourites.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");
                const res = await axios.get(`${API_BASE}/user/favourites`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecipes(res.data);
                // Sync local storage favourites list with recipe IDs
                const favIds = res.data.map(r => r._id);
                localStorage.setItem("favourites", JSON.stringify(favIds));
            } catch (err) {
                console.error("Error fetching favourites", err);
                setError(err.response?.data?.message || "Failed to load favourites.");
            } finally {
                setLoading(false);
            }
        };
        fetchFavourites();
    }, []);

    if (loading) return (
        <div className="loading-container" style={{ marginTop: "5rem" }}>
            <div className="spinner"></div>
            <p>Loading favourites...</p>
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
                <h2>Favourites ❤️</h2>
                <p>Recipes you've saved for later</p>
            </div>
            <div className="recipe" style={{ marginTop: 0 }}>
                {recipes.length === 0 ? (
                    <div className="empty-state">
                        <h3>No favourites yet</h3>
                        <p>Tap the ❤️ on any recipe to save it here</p>
                        <button className="btn-edit" style={{ marginTop: "1rem", display: 'inline-flex' }} onClick={() => window.location.href = "/"}>
                            Explore Menu
                        </button>
                    </div>
                ) : (
                    <RecipeItems recipes={recipes} />
                )}
            </div>
        </>
    );
}
