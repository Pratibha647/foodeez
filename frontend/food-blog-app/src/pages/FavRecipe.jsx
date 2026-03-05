import React, { useEffect, useState } from 'react'
import axios from 'axios'
import RecipeItems from '../components/RecipeItems'
import API_BASE from '../api'

export default function FavRecipe() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const getFavourites = () => {
        try { return JSON.parse(localStorage.getItem("favourites") || "[]"); }
        catch { return []; }
    };

    useEffect(() => {
        const fetchFavourites = async () => {
            const favIds = getFavourites();
            if (favIds.length === 0) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get(`${API_BASE}/recipe/`);
                const favRecipes = res.data.filter(r => favIds.includes(r._id));
                setRecipes(favRecipes);
            } catch (err) {
                console.error(err);
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
                    </div>
                ) : (
                    <RecipeItems recipes={recipes} />
                )}
            </div>
        </>
    );
}
