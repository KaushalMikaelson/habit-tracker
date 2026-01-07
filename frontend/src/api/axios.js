import axios from "axios"; //used to make HTTP requests

const api = axios.create({
    baseURL: "http://localhost:5000", //base URL for API requests
});

api.interceptors.request.use((config) => { //An interceptor is a function that runs automatically before every request.
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default api;

/*
User clicks checkbox
   ↓
toggleHabit(id)
   ↓
api.patch("/habits/:id/toggle")
   ↓
Interceptor runs
   ↓
Authorization header added
   ↓
Request sent
   ↓
Backend verifies JWT
   ↓
Action allowed
*/