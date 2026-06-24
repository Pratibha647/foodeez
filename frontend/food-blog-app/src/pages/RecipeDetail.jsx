import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { BsStopwatch, BsPencil, BsTrash, BsArrowLeft, BsCartPlus, BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { CartContext } from '../context/CartContext';
import defaultFoodImg from '../assets/foodRecipe1.avif';
import API_BASE from '../api';

export default function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState(null);
    const { addToCart } = React.useContext(CartContext);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const getFavourites = () => {
        try { return JSON.parse(localStorage.getItem("favourites") || "[]"); }
        catch { return []; }
    };

    const getLikes = () => {
        try { return JSON.parse(localStorage.getItem("likedRecipes") || "[]"); }
        catch { return []; }
    };

    const [isFav, setIsFav] = useState(getFavourites().includes(id));
    const [isLiked, setIsLiked] = useState(getLikes().includes(id));
    const [favLoading, setFavLoading] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await axios.get(`${API_BASE}/recipe/${id}`);
                setRecipe(res.data);
                if (res.data && res.data.category) {
                    try {
                        const views = JSON.parse(localStorage.getItem("viewedCategories") || "[]");
                        const updatedViews = [res.data.category, ...views.filter(c => c !== res.data.category)].slice(0, 10);
                        localStorage.setItem("viewedCategories", JSON.stringify(updatedViews));
                    } catch (e) {}
                }
            } catch (err) {
                setError("Recipe not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    useEffect(() => {
        if (token) {
            axios.get(`${API_BASE}/profile/me`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                if (res.data && res.data.success) {
                    const { favourites, likedRecipes } = res.data.profile;
                    localStorage.setItem("favourites", JSON.stringify(favourites || []));
                    localStorage.setItem("likedRecipes", JSON.stringify(likedRecipes || []));
                    setIsFav((favourites || []).includes(id));
                    setIsLiked((likedRecipes || []).includes(id));
                }
            }).catch(err => console.error("Error fetching user profile arrays", err));
        }
    }, [id, token]);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;
        setDeleting(true);
        try {
            await axios.delete(`${API_BASE}/recipe/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast("Recipe deleted!");
            setTimeout(() => navigate("/"), 1200);
        } catch (err) {
            showToast(err.response?.data?.message || "Delete failed", "error");
            setDeleting(false);
        }
    };

    const toggleFavourite = async () => {
        if (!token) {
            showToast("Please login to favourite recipes 🔑", "error");
            return;
        }
        if (favLoading) return;
        setFavLoading(true);

        const nextFav = !isFav;
        setIsFav(nextFav);
        const currentFavs = getFavourites();
        const updatedFavs = nextFav
            ? [...currentFavs, id]
            : currentFavs.filter(f => f !== id);
        localStorage.setItem("favourites", JSON.stringify(updatedFavs));

        try {
            const res = await axios.post(`${API_BASE}/user/favourite/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.success) {
                setRecipe(prev => ({
                    ...prev,
                    favouritesCount: res.data.favouritesCount
                }));
            }
        } catch (err) {
            setIsFav(!nextFav);
            localStorage.setItem("favourites", JSON.stringify(currentFavs));
            showToast(err.response?.data?.message || "Failed to update favourite.", "error");
        } finally {
            setFavLoading(false);
        }
    };

    const toggleLike = async () => {
        if (!token) {
            showToast("Please login to like recipes 🔑", "error");
            return;
        }
        if (likeLoading) return;
        setLikeLoading(true);

        const nextLiked = !isLiked;
        setIsLiked(nextLiked);
        const currentLikes = getLikes();
        const updatedLikes = nextLiked
            ? [...currentLikes, id]
            : currentLikes.filter(l => l !== id);
        localStorage.setItem("likedRecipes", JSON.stringify(updatedLikes));

        try {
            const res = await axios.post(`${API_BASE}/user/like/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.success) {
                setRecipe(prev => ({
                    ...prev,
                    likesCount: res.data.likesCount
                }));
            }
        } catch (err) {
            setIsLiked(!nextLiked);
            localStorage.setItem("likedRecipes", JSON.stringify(currentLikes));
            showToast(err.response?.data?.message || "Failed to update like.", "error");
        } finally {
            setLikeLoading(false);
        }
    };

    if (loading) return (
        <div className="loading-container" style={{ marginTop: "5rem" }}>
            <div className="spinner"></div>
            <p>Loading recipe...</p>
        </div>
    );

    if (error) return (
        <div className="detail-container">
            <div className="empty-state">
                <h3>{error}</h3>
                <button className="btn-edit" style={{ marginTop: "1rem" }} onClick={() => navigate("/")}>
                    Go Home
                </button>
            </div>
        </div>
    );

    if (!recipe) return null;

    const isOwner = userId && recipe?.userID === userId;
    const ingredients = Array.isArray(recipe.ingridents)
        ? recipe.ingridents
        : recipe.ingridents?.split(",").map(i => i.trim()) || [];

    return (
        <>
            <div className="detail-container">
                <span className="detail-back" onClick={() => navigate(-1)}>
                    <BsArrowLeft /> Back
                </span>

                <div className="detail-header">
                    <div>
                        <h1 className="detail-title">{recipe.title}</h1>
                        <div className="detail-meta">
                            {recipe.time && (
                                <span className="detail-badge">
                                    <BsStopwatch /> {recipe.time}
                                </span>
                            )}
                            {recipe.userEmail && (
                                <span className="detail-badge">
                                    👤 {recipe.userEmail.split("@")[0]}
                                </span>
                            )}
                            <div className="recipe-stats-interactive" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginTop: '0.5rem' }}>
                                <div className="interactive-stat-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span
                                        className={`fav-icon ${isLiked ? "active" : "inactive"}`}
                                        style={{ fontSize: "1.4rem", display: 'flex', alignItems: 'center' }}
                                        onClick={toggleLike}
                                        title={isLiked ? "Unlike recipe" : "Like recipe"}
                                    >
                                        {isLiked ? <BsHandThumbsUpFill /> : <BsHandThumbsUp />}
                                    </span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>
                                        {recipe.likesCount || 0}
                                    </span>
                                </div>
                                <div className="interactive-stat-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span
                                        className={`fav-icon ${isFav ? "active" : "inactive"}`}
                                        style={{ fontSize: "1.5rem", display: 'flex', alignItems: 'center' }}
                                        onClick={toggleFavourite}
                                        title={isFav ? "Remove from favourites" : "Add to favourites"}
                                    >
                                        {isFav ? <IoMdHeart /> : <IoMdHeartEmpty />}
                                    </span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>
                                        {recipe.favouritesCount || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="detail-actions">
                        <button className="btn-cart" onClick={() => { addToCart(recipe); showToast("Added to Cart! 🛒"); }}>
                            <BsCartPlus /> Add to Cart
                        </button>
                        {isOwner && (
                            <>
                                <button className="btn-edit" onClick={() => navigate(`/editRecipe/${id}`)}>
                                    <BsPencil /> Edit
                                </button>
                                <button className="btn-delete" onClick={handleDelete} disabled={deleting}>
                                    <BsTrash /> {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {recipe.coverImage ? (
                    <img
                        src={recipe.coverImage}
                        alt={recipe.title}
                        className="detail-img"
                        onError={(e) => { e.target.src = defaultFoodImg; }}
                    />
                ) : (
                    <div className="detail-img-placeholder">🍽️</div>
                )}

                <div className="detail-body">
                    <div className="detail-section">
                        <h3>Ingredients</h3>
                        <ul className="ingredients-list">
                            {ingredients.map((ing, i) => (
                                <li key={i}>{ing.trim()}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="detail-section">
                        <h3>Instructions</h3>
                        <p className="instructions-text">{recipe.instructions}</p>
                    </div>
                </div>
            </div>

            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </>
    );
}
