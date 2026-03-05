import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { BsStopwatch, BsPencil, BsTrash, BsArrowLeft } from "react-icons/bs";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import defaultFoodImg from '../assets/foodRecipe1.avif';

export default function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState(null);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const getFavourites = () => {
        try { return JSON.parse(localStorage.getItem("favourites") || "[]"); }
        catch { return []; }
    };
    const [isFav, setIsFav] = useState(getFavourites().includes(id));

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/recipe/${id}`);
                setRecipe(res.data);
            } catch (err) {
                setError("Recipe not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;
        setDeleting(true);
        try {
            await axios.delete(`http://localhost:5000/recipe/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast("Recipe deleted!");
            setTimeout(() => navigate("/"), 1200);
        } catch (err) {
            showToast(err.response?.data?.message || "Delete failed", "error");
            setDeleting(false);
        }
    };

    const toggleFavourite = () => {
        const current = getFavourites();
        let updated;
        if (isFav) {
            updated = current.filter(f => f !== id);
        } else {
            updated = [...current, id];
        }
        localStorage.setItem("favourites", JSON.stringify(updated));
        setIsFav(!isFav);
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
                            <span
                                className={`fav-icon ${isFav ? "active" : "inactive"}`}
                                style={{ fontSize: "1.6rem" }}
                                onClick={toggleFavourite}
                                title={isFav ? "Remove from favourites" : "Add to favourites"}
                            >
                                {isFav ? <IoMdHeart /> : <IoMdHeartEmpty />}
                            </span>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="detail-actions">
                            <button
                                className="btn-edit"
                                onClick={() => navigate(`/editRecipe/${id}`)}
                            >
                                <BsPencil /> Edit
                            </button>
                            <button
                                className="btn-delete"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                <BsTrash /> {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    )}
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

            {toast && (
                <div className={`toast ${toast.type}`}>{toast.msg}</div>
            )}
        </>
    );
}
