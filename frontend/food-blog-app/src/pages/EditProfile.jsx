import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api';

export default function EditProfile() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        const fetchProfileData = async () => {
            try {
                const res = await axios.get(`${API_BASE}/profile/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.success) {
                    const { profile } = res.data;
                    setUsername(profile.username || "");
                    setBio(profile.bio || "");
                    setAvatar(profile.avatar || "");
                }
            } catch (err) {
                console.error("Failed to load profile", err);
                setError("Could not load your profile details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [token, navigate]);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        if (username.trim().length < 3 || username.trim().length > 30) {
            setError("Username must be between 3 and 30 characters.");
            setSaving(false);
            return;
        }

        if (bio.length > 150) {
            setError("Bio cannot exceed 150 characters.");
            setSaving(false);
            return;
        }

        try {
            const res = await axios.put(
                `${API_BASE}/profile`,
                { username: username.trim(), avatar, bio },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data && res.data.success) {
                // Update local storage user information if cached
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        parsedUser.username = res.data.profile.username;
                        parsedUser.avatar = res.data.profile.avatar;
                        parsedUser.bio = res.data.profile.bio;
                        localStorage.setItem("user", JSON.stringify(parsedUser));
                    } catch (e) {
                        console.error(e);
                    }
                }
                
                showToast("Profile updated successfully! 🎉");
                setTimeout(() => navigate("/profile"), 1200);
            }
        } catch (err) {
            console.error("Failed to update profile", err);
            setError(err.response?.data?.message || "Failed to update profile. Please try again.");
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ marginTop: "5rem", textAlign: "center" }}>
                <div className="spinner" style={{ margin: "2rem auto" }}></div>
                <p>Loading profile details...</p>
            </div>
        );
    }

    return (
        <>
            <div className="container edit-profile-container">
                <h2>Edit Profile ✏️</h2>
                <form className="form" onSubmit={handleOnSubmit}>
                    
                    <div className="edit-avatar-preview-section">
                        <img 
                            src={avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + (username || "default")}
                            alt="Avatar Preview" 
                            className="profile-avatar-large preview-image"
                            onError={(e) => {
                                e.target.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=fallback";
                            }}
                        />
                        <span className="hint">Live Avatar Preview</span>
                    </div>

                    <div className="form-control">
                        <label>Username *</label>
                        <input 
                            type="text" 
                            className="input" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username"
                            required
                        />
                        <span className="hint">Must be 3-30 characters, alphanumeric or special characters allowed.</span>
                    </div>

                    <div className="form-control">
                        <label>Avatar Image URL</label>
                        <input 
                            type="url" 
                            className="input" 
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                        />
                        <span className="hint">Enter a direct link to an image, or leave blank to auto-generate a character.</span>
                    </div>

                    <div className="form-control">
                        <label>Bio</label>
                        <textarea 
                            className="input-textarea" 
                            rows="4" 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Write a brief bio about yourself and your culinary preferences..."
                            maxLength={150}
                        ></textarea>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                            <span className="hint">Describe yourself in 150 characters or less.</span>
                            <span className="hint" style={{ color: bio.length === 150 ? "red" : "inherit" }}>
                                {bio.length}/150
                            </span>
                        </div>
                    </div>

                    {error && <p className="error" style={{ margin: "1rem 0" }}>{error}</p>}

                    <div className="edit-profile-actions">
                        <button 
                            type="button" 
                            className="btn-edit" 
                            style={{ backgroundColor: "#999", color: "#fff" }} 
                            onClick={() => navigate("/profile")}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" style={{ margin: 0 }} disabled={saving}>
                            {saving ? "Saving Changes..." : "Save Changes 💾"}
                        </button>
                    </div>
                </form>
            </div>
            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </>
    );
}
