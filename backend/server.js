const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/connectionDB");

// Enable CORS
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://foodeez-psi.vercel.app"
];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin (like mobile apps, curl, or Postman)
            if (!origin) return callback(null, true);
            
            const normalizedOrigin = origin.replace(/\/$/, "");
            const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin);
            if (isLocalhost || allowedOrigins.includes(normalizedOrigin)) {
                callback(null, true);
            } else {
                callback(null, false); // Block origin by returning false, do not throw error
            }
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

app.use(express.json());

// Health check route (registered early, doesn't require database connection)
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Middleware to verify database connection before handling application requests
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: "Database connection is not established yet. Please try again in a few seconds."
        });
    }
    next();
});

// App routes
app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

// Handle 404 routes
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "API Route Not Found" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(`[Error]: ${err.stack || err.message}`);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    });
});

// Start database and server
const startServer = async () => {
    try {
        await connectDB();
        if (!process.env.VERCEL) {
            app.listen(PORT, () => {
                console.log(`App is listening on port ${PORT}`);
            });
        }
    } catch (err) {
        console.error("Failed to start server due to database connection error:", err);
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    }
};

startServer();

// Export for Vercel serverless
module.exports = app;