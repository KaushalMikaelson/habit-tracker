const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, (req, res) => {
    return res.json({
        message: "Dashboard access granted",
        userId: req.user.id,
        file: __filename,
        timestamp: Date.now()
    });
});

module.exports = router;
