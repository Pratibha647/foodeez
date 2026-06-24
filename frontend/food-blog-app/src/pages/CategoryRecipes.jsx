import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api';
import CategoryCard from '../components/CategoryCard';
import RecipeItems from '../components/RecipeItems';
import { BsArrowLeft } from 'react-icons/bs';

const CATEGORY_MAP = {
    breakfast: { name: "Breakfast", icon: "🍳" },
    lunch: { name: "Lunch", icon: "🥪" },
    dinner: { name: "Dinner", icon: "🍜" },
    desserts: { name: "Desserts", icon: "🍰" },
    vegan: { name: "Vegan", icon: "🥗" },
    drinks: { name: "Drinks", icon: "🍹" }
};

export default function CategoryRecipes() {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const catKey = categoryName?.toLowerCase() || "";
    const catInfo = CATEGORY_MAP[catKey] || { name: categoryName, icon: "🍽️" };

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await axios.get(`${API_BASE}/recipe/category/${catKey}`);
                setRecipes(res.data);
            } catch (err) {
                console.error("Failed to load recipes by category", err);
                setError(err.response?.data?.message || "Failed to load recipes.");
            } finally {
                setLoading(false);
            }
        };

        if (catKey) {
            fetchRecipes();
        }
    }, [catKey]);

    return (
        <div className="recipe" style={{ marginTop: "6.5rem" }}>
            <span className="detail-back" onClick={() => navigate(-1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 600, color: '#1a7a54' }}>
                <BsArrowLeft /> Back
            </span>

            <div className="container" style={{ margin: "0 auto 2.5rem", padding: "2rem" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1.5rem", color: "#111" }}>
                    Browse by Category 🍽️
                </h2>
                <CategoryCard activeCategory={catInfo.name} />
            </div>

            <div className="page-header" style={{ width: "100%", margin: "0 0 2rem 0" }}>
                <h2>{catInfo.name} {catInfo.icon}</h2>
                <p>Explore all recipe creations under the {catInfo.name} category</p>
            </div>

            {loading ? (
                <div className="loading-container" style={{ minHeight: "200px" }}>
                    <div className="spinner"></div>
                    <p>Loading {catInfo.name} recipes...</p>
                </div>
            ) : error ? (
                <div className="empty-state">
                    <h3>Error loading recipes</h3>
                    <p>{error}</p>
                </div>
            ) : recipes.length === 0 ? (
                <div className="empty-state" style={{ background: "rgba(255, 255, 255, 0.82)", padding: "4rem 2rem", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.5)", backdropFilter: "blur(4px)" }}>
                    <h3>No recipes found in this category.</h3>
                    <p>Be the first to share a {catInfo.name} culinary creation!</p>
                    <button className="btn-primary" style={{ marginTop: "1.5rem", background: "linear-gradient(135deg, #1a7a54, #2ecc71)", color: "white", padding: "0.75rem 2rem", border: "none", borderRadius: "50px", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 15px rgba(26, 122, 84, 0.3)" }} onClick={() => navigate("/addRecipe")}>
                        Share Recipe 🍳
                    </button>
                </div>
            ) : (
                <RecipeItems recipes={recipes} />
            )}
        </div>
    );
}
