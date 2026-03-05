/**
 * Central API base URL.
 * In development:  uses VITE_API_URL from .env.local  (falls back to localhost:5000)
 * In production:   uses VITE_API_URL set in Vercel project environment variables
 */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_BASE;
