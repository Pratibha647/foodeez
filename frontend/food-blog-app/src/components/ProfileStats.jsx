import React from 'react';

export default function ProfileStats({ stats }) {
    return (
        <div className="profile-stats-container">
            <div className="profile-stat-card">
                <span className="profile-stat-value">{stats.createdRecipesCount || 0}</span>
                <span className="profile-stat-label">Recipes Shared 🍳</span>
            </div>
            <div className="profile-stat-card">
                <span className="profile-stat-value">{stats.favouritesCount || 0}</span>
                <span className="profile-stat-label">Favourites ❤️</span>
            </div>
            <div className="profile-stat-card">
                <span className="profile-stat-value">{stats.likedRecipesCount || 0}</span>
                <span className="profile-stat-label">Likes Given 👍</span>
            </div>
        </div>
    );
}
