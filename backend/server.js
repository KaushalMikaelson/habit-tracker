const cors = require("cors");

require("dotenv").config();
const express = require('express'); //loads express library
const mongoose = require("mongoose");
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const habitsRoutes = require('./routes/habits.routes');

const app = express();
const PORT = 5000;

//Parse incomg json
app.use(express.json()); // It is a middleware to allow frontend to send json data

//Connect to mongoDb
mongoose.connect("mongodb://127.0.0.1:27017/habit-tracker")
   .then(() => {
      console.log("MongoDB connected");
   })
   .catch((err) => {
      console.error("MongoDB connection error:", err);
   })

//Middleware
app.use(cors({
   origin: "http://localhost:3000",
   credentials: true,
}));

//Routes
app.use("/auth", authRoutes); //localhost:5000/auth
app.use("/dashboard", dashboardRoutes); //localhost:5000/dashboard
app.use("/habits", habitsRoutes); //localhost:5000/habits


app.get('/', (req, res) => {
   res.send("Backend is running 🚀");
});

//Start Server
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
})


/*
Request (JSON)
   ↓
express.json()
   ↓
Route (/auth/register)
   ↓
Controller (register)
   ↓
bcrypt.hash()
   ↓
User model
   ↓
MongoDB

*/