import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

export default function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [recipeData, setRecipeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!token) { navigate("/"); return; }
        const fetchRecipe = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/recipe/${id}`);
                setRecipeData({
                    ...res.data,
                    ingridents: Array.isArray(res.data.ingridents)
                        ? res.data.ingridents.join(", ")
                        : res.data.ingridents
                });
            } catch (err) {
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id, token, navigate]);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const onChangeHandler = (e) => {
        setRecipeData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const payload = {
            ...recipeData,
            ingridents: typeof recipeData.ingridents === "string"
                ? recipeData.ingridents.split(",").map(s => s.trim()).filter(Boolean)
                : recipeData.ingridents
        };
        try {
            await axios.put(`http://localhost:5000/recipe/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast("Recipe updated successfully! ✅");
            setTimeout(() => navigate(`/recipe/${id}`), 1200);
        } catch (err) {
            showToast(err.response?.data?.message || "Update failed", "error");
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="loading-container" style={{ marginTop: "5rem" }}>
            <div className="spinner"></div>
            <p>Loading recipe...</p>
        </div>
    );

    return (
        <>
            <div className='container'>
                <h2>Edit Recipe ✏️</h2>
                <form className="form" onSubmit={onHandleSubmit}>
                    <div className='form-control'>
                        <label>Recipe Title *</label>
                        <input
                            type="text"
                            className='input'
                            name="title"
                            value={recipeData.title || ""}
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
                            value={recipeData.time || ""}
                            onChange={onChangeHandler}
                        />
                    </div>
                    <div className='form-control'>
                        <label>Ingredients *</label>
                        <textarea
                            className='input-textarea'
                            name="ingridents"
                            rows="5"
                            value={recipeData.ingridents || ""}
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
                            value={recipeData.instructions || ""}
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
                            value={recipeData.coverImage || ""}
                            onChange={onChangeHandler}
                        />
                    </div>
                    <button type='submit' className='submit-btn' disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </>
    );
}
