import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api';
import ProfileHeader from '../components/ProfileHeader';
import ProfileStats from '../components/ProfileStats';
import ProfileRecipeGrid from '../components/ProfileRecipeGrid';

export default function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const loggedInUserId = localStorage.getItem("userId");
    const isOwner = !id || id === loggedInUserId;

    useEffect(() => {
        // If trying to access my own profile but not logged in, redirect to home
        if (!id && !token) {
            navigate("/");
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");
                let res;
                if (!id) {
                    // Fetch my profile
                    res = await axios.get(`${API_BASE}/profile/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } else {
                    // Fetch public profile
                    res = await axios.get(`${API_BASE}/profile/${id}`);
                }

                if (res.data && res.data.success) {
                    setProfile(res.data.profile);
                } else {
                    setError("Failed to fetch profile data.");
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.response?.data?.message || "User profile not found.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id, token, navigate]);

    if (loading) {
        return (
            <div className="container" style={{ marginTop: "5rem", textAlign: "center" }}>
                <div className="spinner" style={{ margin: "2rem auto" }}></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ marginTop: "5rem", textAlign: "center" }}>
                <div className="empty-state">
                    <h3>Error</h3>
                    <p>{error}</p>
                    <button className="btn-edit" style={{ marginTop: "1rem" }} onClick={() => navigate("/")}>
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="container profile-page-container">
            <ProfileHeader profile={profile} isOwner={isOwner} />
            <ProfileStats stats={profile} />
            <hr className="profile-divider" />
            <ProfileRecipeGrid userId={profile._id} username={profile.username} />
        </div>
    );
}
