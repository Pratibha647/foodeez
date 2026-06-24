import React from 'react';

export default function SearchSuggestions({
    suggestions = [],
    recentSearches = [],
    query = "",
    loading = false,
    onSelect,
    onClearRecents,
    onRemoveRecent
}) {
    return (
        <div className="search-suggestions-dropdown">
            {loading ? (
                <div className="suggestions-loading">
                    <div className="spinner-small"></div>
                    <span>Searching for recipes...</span>
                </div>
            ) : query.trim() === "" ? (
                <div className="recent-searches-section">
                    <div className="section-header">
                        <h4>Recent Searches</h4>
                        {recentSearches.length > 0 && (
                            <button onClick={onClearRecents} className="btn-clear-all">
                                Clear All
                            </button>
                        )}
                    </div>
                    {recentSearches.length === 0 ? (
                        <p className="empty-suggestions">No recent searches</p>
                    ) : (
                        <ul className="suggestions-list">
                            {recentSearches.map((term, index) => (
                                <li key={index} className="suggestion-item recent-item">
                                    <span className="suggestion-text" onClick={() => onSelect(term, true)}>
                                        🔍 {term}
                                    </span>
                                    <button 
                                        className="btn-remove-recent"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveRecent(term);
                                        }}
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <div className="suggestions-results-section">
                    <h4>Recipes Found</h4>
                    {suggestions.length === 0 ? (
                        <p className="empty-suggestions">No matching recipes found</p>
                    ) : (
                        <ul className="suggestions-list">
                            {suggestions.map((recipe) => (
                                <li 
                                    key={recipe._id} 
                                    className="suggestion-item result-item"
                                    onClick={() => onSelect(recipe, false)}
                                >
                                    <div className="result-info">
                                        <span className="recipe-title">{recipe.title}</span>
                                        {recipe.category && (
                                            <span className="recipe-cat-badge">{recipe.category}</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
