import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../api';
import HeroSection from '../components/HeroSection';
import RecipeCarousel from '../components/RecipeCarousel';
import CategoryCard from '../components/CategoryCard';
import RecommendationGrid from '../components/RecommendationGrid';
import RecipeSkeleton from '../components/RecipeSkeleton';
import RecipeItems from '../components/RecipeItems';

export default function Home() {
    const [trendingRecipes, setTrendingRecipes] = useState([]);
    const [latestRecipes, setLatestRecipes] = useState([]);
    const [allRecipes, setAllRecipes] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const [activeCategory, setActiveCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [loadingTrending, setLoadingTrending] = useState(true);
    const [loadingLatest, setLoadingLatest] = useState(true);
    const [loadingAll, setLoadingAll] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(false);

    // Initial load: trending, latest, and all recipes
    useEffect(() => {
        const fetchHomeData = async () => {
            // Trending
            try {
                const trendRes = await axios.get(`${API_BASE}/recipe/trending`);
                setTrendingRecipes(trendRes.data);
            } catch (err) {
                console.error("Error loading trending recipes", err);
            } finally {
                setLoadingTrending(false);
            }

            // Latest
            try {
                const latestRes = await axios.get(`${API_BASE}/recipe/latest`);
                setLatestRecipes(latestRes.data);
            } catch (err) {
                console.error("Error loading latest recipes", err);
            } finally {
                setLoadingLatest(false);
            }

            // All Recipes (used for local-first recommendations)
            try {
                const allRes = await axios.get(`${API_BASE}/recipe/`);
                setAllRecipes(allRes.data);
            } catch (err) {
                console.error("Error loading all recipes", err);
            } finally {
                setLoadingAll(false);
            }
        };

        fetchHomeData();
    }, []);

    // Fetch filtered search results when query or category changes
    useEffect(() => {
        if (!searchQuery && !activeCategory) {
            setSearchResults([]);
            return;
        }

        const fetchFiltered = async () => {
            setLoadingSearch(true);
            try {
                const params = new URLSearchParams();
                if (searchQuery) params.append("q", searchQuery);
                if (activeCategory) params.append("category", activeCategory);

                const res = await axios.get(`${API_BASE}/recipe/?${params.toString()}`);
                setSearchResults(res.data);
            } catch (err) {
                console.error("Error loading search results", err);
            } finally {
                setLoadingSearch(false);
            }
        };

        fetchFiltered();
    }, [searchQuery, activeCategory]);

    const handleSearchSubmit = (query) => {
        setSearchQuery(query);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    const handleSelectCategory = (category) => {
        setActiveCategory(category);
    };

    const handleClearAllFilters = () => {
        setSearchQuery("");
        setActiveCategory(null);
    };

    const isSearching = !!searchQuery || !!activeCategory;

    return (
        <div className="home-page-wrapper">
            <HeroSection
                onSearchSubmit={handleSearchSubmit}
                onClearSearch={handleClearSearch}
                currentQuery={searchQuery}
            />

            <div className="container discovery-section" style={{ marginTop: 0 }}>
                <h3 className="section-title">Browse by Category 🍽️</h3>
                <CategoryCard
                    activeCategory={activeCategory}
                    onSelectCategory={handleSelectCategory}
                />
            </div>

            {isSearching ? (
                <div className="container discovery-section" id="results-section" style={{ marginTop: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
                        <h3 className="section-title" style={{ margin: 0 }}>
                            {searchQuery && activeCategory ? (
                                <>Search Results for "{searchQuery}" in {activeCategory}</>
                            ) : searchQuery ? (
                                <>Search Results for "{searchQuery}"</>
                            ) : (
                                <>{activeCategory} Recipes</>
                            )}
                            <span style={{ fontSize: '1rem', color: '#777' }}> ({searchResults.length})</span>
                        </h3>
                        <button className="btn-edit-profile" onClick={handleClearAllFilters} style={{ padding: '0.4rem 1rem' }}>
                            Clear Filters ✕
                        </button>
                    </div>

                    {loadingSearch ? (
                        <RecipeSkeleton count={4} />
                    ) : searchResults.length === 0 ? (
                        <div className="empty-state">
                            <h3>No matching recipes found</h3>
                            <p>Try searching for different keywords or browse another category.</p>
                            <button className="btn-edit" onClick={handleClearAllFilters} style={{ marginTop: '1rem' }}>
                                Reset Search
                            </button>
                        </div>
                    ) : (
                        <RecipeItems recipes={searchResults} />
                    )}
                </div>
            ) : (
                <>
                    <div className="container discovery-section" id="trending-section" style={{ marginTop: 0 }}>
                        <h3 className="section-title">Trending This Week 🔥</h3>
                        <RecipeCarousel recipes={trendingRecipes} loading={loadingTrending} />
                    </div>

                    {allRecipes.length > 0 && (
                        <div className="container discovery-section" style={{ marginTop: 0 }}>
                            <h3 className="section-title">Recommended For You ✨</h3>
                            <RecommendationGrid recipes={allRecipes} loading={loadingAll} />
                        </div>
                    )}

                    <div className="container discovery-section" style={{ marginTop: 0 }}>
                        <h3 className="section-title">Latest Creations 🍳</h3>
                        {loadingLatest ? (
                            <RecipeSkeleton count={4} />
                        ) : (
                            <RecipeItems recipes={latestRecipes} />
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
