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
        if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));

app.use(express.json());

app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

// Health check route
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Keep app.listen for local development
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT}`);
    });
}

// Export for Vercel serverless
module.exports = app;