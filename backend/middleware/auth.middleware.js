const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => { //auth middleware
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1]; //Header Format = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = authMiddleware;