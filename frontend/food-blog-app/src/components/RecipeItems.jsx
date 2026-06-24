import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { BsStopwatch, BsCartPlus } from "react-icons/bs";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { CartContext } from '../context/CartContext';
import defaultFoodImg from "../assets/foodRecipe1.avif";
import API_BASE from '../api';

export default function RecipeItems({ recipes = [], showOwnerActions = false, onDelete }) {
    const navigate = useNavigate();
    const { addToCart } = React.useContext(CartContext);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const getFavourites = () => {
        try { return JSON.parse(localStorage.getItem("favourites") || "[]"); }
        catch { return []; }
    };

    const [favourites, setFavourites] = useState(getFavourites());

    useEffect(() => {
        if (token) {
            axios.get(`${API_BASE}/profile/me`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                if (res.data && res.data.success) {
                    const { favourites } = res.data.profile;
                    localStorage.setItem("favourites", JSON.stringify(favourites || []));
                    setFavourites(favourites || []);
                }
            }).catch(err => console.error("Error warming favourites cache", err));
        }
    }, [token]);

    const toggleFavourite = async (e, id) => {
        e.stopPropagation();
        if (!token) {
            alert("Please login to favourite recipes 🔑");
            return;
        }

        const current = getFavourites();
        const isFav = current.includes(id);
        const nextFav = !isFav;

        const updated = nextFav
            ? [...current, id]
            : current.filter(f => f !== id);
        localStorage.setItem("favourites", JSON.stringify(updated));
        setFavourites(updated);

        try {
            await axios.post(`${API_BASE}/user/favourite/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to sync favourite on database", err);
            localStorage.setItem("favourites", JSON.stringify(current));
            setFavourites(current);
        }
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
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <span
                                        className={`fav-icon ${isFav ? 'active' : 'inactive'}`}
                                        onClick={(e) => toggleFavourite(e, item._id)}
                                        title={isFav ? "Remove from favourites" : "Add to favourites"}
                                    >
                                        {isFav ? <IoMdHeart /> : <IoMdHeartEmpty />}
                                    </span>
                                    <span
                                        className="fav-icon"
                                        style={{ color: '#1a7a54' }}
                                        onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                                        title="Add to Cart"
                                    >
                                        <BsCartPlus />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
