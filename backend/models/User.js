const mongoose = require("mongoose"); //connects js to mongoDB

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // 🆕 THEME PREFERENCE (e.g., 'blue', 'emerald', 'rose', 'cyberpunk')
    themeAccent: {
        type: String,
        default: "blue",
    }
});
module.exports = mongoose.model("User", userSchema); 