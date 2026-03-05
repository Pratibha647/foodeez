import React, { useState } from 'react'
import axios from "axios";

export default function InputForm({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const endpoint = isSignUp ? "signup" : "login";
        try {
            const res = await axios.post(`http://localhost:5000/${endpoint}`, { email, password });
            // Consistent keys for token storage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("userId", res.data.user._id);
            // Notify Navbar that auth state changed
            window.dispatchEvent(new Event("authChange"));
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h3 className="modal-title">{isSignUp ? "Create Account" : "Welcome Back 👋"}</h3>
            <form className="form" onSubmit={handleOnSubmit}>
                <div className='form-control'>
                    <label>Email</label>
                    <input
                        type="email"
                        className='input'
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                    />
                </div>
                <div className='form-control'>
                    <label>Password</label>
                    <input
                        type="password"
                        className='input'
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>
                {error && <p className='error'>{error}</p>}
                <button type='submit' className='submit-btn' disabled={loading}>
                    {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Login")}
                </button>
                <div className="form-footer">
                    <span style={{ color: "#888" }}>
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    </span>
                    <span className='toggle-link' onClick={() => { setIsSignUp(prev => !prev); setError(""); }}>
                        {isSignUp ? "Log in" : "Sign up"}
                    </span>
                </div>
            </form>
        </>
    );
}
