import React from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../assets/react.svg'; // Or any general icon/placeholder

export default function ProfileHeader({ profile, isOwner }) {
    const navigate = useNavigate();

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
    };

    return (
        <div className="profile-header-card">
            <div className="profile-header-main">
                <div className="profile-avatar-container">
                    <img 
                        src={profile.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + (profile.username || "default")} 
                        alt={profile.username}
                        className="profile-avatar-large"
                        onError={(e) => {
                            e.target.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=fallback";
                        }}
                    />
                </div>
                <div className="profile-details">
                    <h2 className="profile-username">{profile.username}</h2>
                    <p className="profile-joined">🗓️ Member since {formatDate(profile.createdAt)}</p>
                    <p className="profile-bio">{profile.bio || "No bio added yet. 🍲"}</p>
                </div>
            </div>
            {isOwner && (
                <button className="btn-edit-profile" onClick={() => navigate("/editProfile")}>
                    ✏️ Edit Profile
                </button>
            )}
        </div>
    );
}
