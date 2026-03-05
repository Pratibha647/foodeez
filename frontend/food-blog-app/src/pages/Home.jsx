import React, { useState, useEffect } from 'react'
import foodRecipe3 from '../assets/foodRecipe3.jpg';
import RecipeItems from '../components/RecipeItems';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api';

export default function Home() {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await axios.get(`${API_BASE}/recipe/`);
                setRecipes(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    return (
        <>
            <section className='home'>
                <div className='left'>
                    <h1>
                        Discover & Share<br />
                        <span>Delicious Recipes</span>
                    </h1>
                    <h5>
                        Explore thousands of recipes from passionate home cooks and
                        professional chefs. Find your next favourite meal and share
                        your own culinary creations!
                    </h5>
                    <button onClick={() => navigate("/addRecipe")}>
                        Share Your Recipe 🍳
                    </button>
                </div>
                <div className='right'>
                    <img src={foodRecipe3} alt="Food" />
                </div>
            </section>

            <div className="recipe">
                <h2>Latest Recipes</h2>
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Fetching recipes...</p>
                    </div>
                ) : (
                    <RecipeItems recipes={recipes} />
                )}
            </div>
        </>
    );
}
