const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/connectionDB");
connectDB();

// Allow requests from any Vercel frontend URL + localhost in dev
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL,   // set this in Vercel dashboard once frontend is deployed
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (e.g. curl, Postman, mobile apps)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app") || origin.endsWith(".onrender.com")) {
            return callback(null, true);
        }
        return callback(new Error("Blocked by CORS policy. Origin not allowed."));
    },
    credentials: true,
}));

app.use(express.json());

app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

// Health check route
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Handle 404 routes
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "API Route Not Found" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(`[Error]: ${err.message}`);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    });
});

// Keep app.listen for local development and standard PAAS (like Render)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT}`);
    });
}

// Export for Vercel serverless
module.exports = app;