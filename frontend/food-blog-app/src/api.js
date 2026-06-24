/**
 * Central API base URL.
 * In development:  uses localhost:5000
 * In production:   uses VITE_API_URL set in Vercel project environment variables
 */
const API_BASE = import.meta.env.DEV
    ? "http://127.0.0.1:5000"
    : (import.meta.env.VITE_API_URL || "http://127.0.0.1:5000");

export default API_BASE;
