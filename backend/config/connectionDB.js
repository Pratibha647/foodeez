const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.CONNECTION_STRING) {
            throw new Error("CONNECTION_STRING environment variable is missing.");
        }
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("MongoDB Connected successfully.");
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        throw err;
    }
}

module.exports = connectDB;