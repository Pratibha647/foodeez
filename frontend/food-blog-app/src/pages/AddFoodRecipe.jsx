import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function AddFoodRecipe() {
    const navigate = useNavigate();
    const [recipeData, setRecipeData] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const token = localStorage.getItem("token");

    // Redirect if not logged in
    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const onChangeHandler = (e) => {
        let val = (e.target.name === "ingridents")
            ? e.target.value.split(",").map(s => s.trim()).filter(Boolean)
            : e.target.value;
        setRecipeData(prev => ({ ...prev, [e.target.name]: val }));
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("http://localhost:5000/recipe", recipeData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast("Recipe added successfully! 🎉");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to add recipe", "error");
            setLoading(false);
        }
    };

    return (
        <>
            <div className='container'>
                <h2>Share a Recipe 🍳</h2>
                <form className="form" onSubmit={onHandleSubmit}>
                    <div className='form-control'>
                        <label>Recipe Title *</label>
                        <input
                            type="text"
                            className='input'
                            name="title"
                            placeholder="e.g. Creamy Pasta Carbonara"
                            onChange={onChangeHandler}
                            required
                        />
                    </div>
                    <div className='form-control'>
                        <label>Cooking Time</label>
                        <input
                            type="text"
                            className='input'
                            name="time"
                            placeholder="e.g. 30 mins"
                            onChange={onChangeHandler}
                        />
                    </div>
                    <div className='form-control'>
                        <label>Ingredients *</label>
                        <textarea
                            className='input-textarea'
                            name="ingridents"
                            rows="5"
                            placeholder="Enter ingredients separated by commas&#10;e.g. 2 eggs, 100g pasta, 50g parmesan"
                            onChange={onChangeHandler}
                            required
                        ></textarea>
                        <span className="hint">Separate each ingredient with a comma</span>
                    </div>
                    <div className='form-control'>
                        <label>Instructions *</label>
                        <textarea
                            className='input-textarea'
                            name="instructions"
                            rows="6"
                            placeholder="Describe the cooking steps..."
                            onChange={onChangeHandler}
                            required
                        ></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Cover Image URL</label>
                        <input
                            type="url"
                            className='input'
                            name="coverImage"
                            placeholder="https://example.com/image.jpg (optional)"
                            onChange={onChangeHandler}
                        />
                        <span className="hint">Paste a direct image link, or leave blank for default</span>
                    </div>
                    <button type='submit' className='submit-btn' disabled={loading}>
                        {loading ? "Adding Recipe..." : "Add Recipe 🚀"}
                    </button>
                </form>
            </div>
            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </>
    );
}
