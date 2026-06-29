const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    
    if (!authHeader) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    let token = authHeader;
    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Access denied. Token is empty." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // { email, id }
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = verifyToken;
