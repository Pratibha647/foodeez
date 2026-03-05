import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsStopwatch } from "react-icons/bs";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import defaultFoodImg from "../assets/foodRecipe1.avif";

export default function RecipeItems({ recipes = [], showOwnerActions = false, onDelete }) {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const getFavourites = () => {
        try { return JSON.parse(localStorage.getItem("favourites") || "[]"); }
        catch { return []; }
    };

    const [favourites, setFavourites] = useState(getFavourites());

    const toggleFavourite = (e, id) => {
        e.stopPropagation();
        const current = getFavourites();
        let updated;
        if (current.includes(id)) {
            updated = current.filter(f => f !== id);
        } else {
            updated = [...current, id];
        }
        localStorage.setItem("favourites", JSON.stringify(updated));
        setFavourites(updated);
    };

    if (!recipes || recipes.length === 0) {
        return (
            <div className="empty-state">
                <h3>No recipes found</h3>
                <p>Be the first to share a recipe!</p>
            </div>
        );
    }

    return (
        <div className='card-container'>
            {recipes.map((item) => {
                const isFav = favourites.includes(item._id);
                const isOwner = userId && item.userID === userId;
                return (
                    <div
                        key={item._id}
                        className='card'
                        onClick={() => navigate(`/recipe/${item._id}`)}
                    >
                        <img
                            src={item.coverImage || defaultFoodImg}
                            alt={item.title}
                            onError={(e) => { e.target.src = defaultFoodImg; }}
                        />
                        <div className='card-body'>
                            <div className='title'>{item.title}</div>
                            {item.userEmail && (
                                <div className='author'>by {item.userEmail.split('@')[0]}</div>
                            )}
                            <div className='icons'>
                                <div className='timer'>
                                    <BsStopwatch />
                                    {item.time || "N/A"}
                                </div>
                                <span
                                    className={`fav-icon ${isFav ? 'active' : 'inactive'}`}
                                    onClick={(e) => toggleFavourite(e, item._id)}
                                    title={isFav ? "Remove from favourites" : "Add to favourites"}
                                >
                                    {isFav ? <IoMdHeart /> : <IoMdHeartEmpty />}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
