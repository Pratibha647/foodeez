import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api';
import SearchSuggestions from './SearchSuggestions';
import foodRecipe3 from '../assets/foodRecipe3.jpg';

export default function HeroSection({ onSearchSubmit, onClearSearch, currentQuery }) {
    const navigate = useNavigate();
    const [query, setQuery] = useState(currentQuery || "");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);

    const dropdownRef = useRef(null);

    useEffect(() => {
        setQuery(currentQuery || "");
    }, [currentQuery]);

    // Load recent searches from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("recentSearches");
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored));
            } catch (e) {
                setRecentSearches([]);
            }
        }
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced suggestion fetching
    useEffect(() => {
        if (query.trim() === "") {
            setSuggestions([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/recipe/?q=${encodeURIComponent(query)}`);
                setSuggestions(res.data.slice(0, 5)); // Limit to 5 suggestions
            } catch (err) {
                console.error("Error fetching search suggestions", err);
            } finally {
                setLoading(false);
            }
        }, 300); // 300ms debounce delay

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const addToRecentSearches = (term) => {
        const cleanedTerm = term.trim();
        if (!cleanedTerm) return;

        let updated = [cleanedTerm, ...recentSearches.filter(t => t !== cleanedTerm)];
        updated = updated.slice(0, 5); // Limit to 5 recent searches
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
    };

    const handleSearchClick = () => {
        if (query.trim() === "") return;
        addToRecentSearches(query);
        setShowDropdown(false);
        onSearchSubmit(query);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handleSelectSuggestion = (item, isRecentTerm = false) => {
        if (isRecentTerm) {
            setQuery(item);
            addToRecentSearches(item);
            onSearchSubmit(item);
        } else {
            // Navigate directly to the recipe
            setQuery(item.title);
            addToRecentSearches(item.title);
            navigate(`/recipe/${item._id}`);
        }
        setShowDropdown(false);
    };

    const handleClearRecents = () => {
        setRecentSearches([]);
        localStorage.removeItem("recentSearches");
    };

    const handleRemoveRecent = (term) => {
        const updated = recentSearches.filter(t => t !== term);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
    };

    return (
        <section className="home hero-section">
            <div className="left hero-left">
                <h1>
                    Discover & Share<br />
                    <span>Delicious Recipes</span>
                </h1>
                <h5>
                    Explore thousands of recipes from passionate cooks. Find your next favorite meal and share your own culinary creations!
                </h5>
                
                {/* Search Bar */}
                <div className="search-bar-container" ref={dropdownRef}>
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            placeholder="Search by title, ingredients, or category..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setShowDropdown(true)}
                            onKeyDown={handleKeyDown}
                        />
                        {query && (
                            <button 
                                className="search-clear-btn"
                                onClick={() => {
                                    setQuery("");
                                    onClearSearch();
                                }}
                            >
                                ✕
                            </button>
                        )}
                        <button className="search-submit-btn" onClick={handleSearchClick}>
                            Search
                        </button>
                    </div>

                    {showDropdown && (
                        <SearchSuggestions
                            suggestions={suggestions}
                            recentSearches={recentSearches}
                            query={query}
                            loading={loading}
                            onSelect={handleSelectSuggestion}
                            onClearRecents={handleClearRecents}
                            onRemoveRecent={handleRemoveRecent}
                        />
                    )}
                </div>

                <div className="hero-ctas" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <button className="btn-primary" onClick={() => navigate("/addRecipe")}>
                        Share Your Recipe 🍳
                    </button>
                    <button className="btn-secondary" onClick={() => {
                        const target = document.getElementById("trending-section");
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                    }}>
                        Explore Trending 👇
                    </button>
                </div>
            </div>
            <div className="right hero-right">
                <img src={foodRecipe3} alt="Delicious food variety" className="hero-img-main" />
            </div>
        </section>
    );
}
