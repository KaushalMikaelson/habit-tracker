# 🎯 Habit Tracker

A full-stack habit tracking application that helps users build and maintain positive habits through visual tracking and daily accountability.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)

## ✨ Features

- **User Authentication**: Secure signup and login with JWT-based authentication
- **Habit Management**: Create, track, and delete habits with ease
- **Visual Calendar**: Interactive calendar view to track habit completion
- **Daily Tracking**: Mark habits as complete for specific dates
- **Soft Delete**: Undo accidental deletions with built-in recovery
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Real-time Updates**: Instant feedback on all habit operations

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **React Router** 7.11.0 - Client-side routing
- **Axios** - HTTP client for API requests
- **JWT Decode** - Token management
- **React Testing Library** - Component testing

### Backend
- **Node.js** with **Express** 5.2.1 - Server framework
- **MongoDB** with **Mongoose** 9.1.1 - Database and ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (v4.0 or higher) - Running locally or accessible remotely

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/KaushalMikaelson/habit-tracker.git
cd habit-tracker
```

### 2. Install Dependencies

Install dependencies for both frontend and backend:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Backend Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGO_URI=mongodb://127.0.0.1:27017/habit-tracker

# JWT Secret (Change this to a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Logging Configuration
# Options: 'none', 'error', 'info', 'debug'
LOG_LEVEL=info
```

#### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Start MongoDB

Ensure MongoDB is running on your system:

```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

### 5. Run the Application

#### Development Mode

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
habit-tracker/
├── backend/
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Authentication middleware
│   ├── models/            # Mongoose schemas
│   │   ├── User.js
│   │   └── Habit.js
│   ├── routes/            # API routes
│   │   ├── auth.routes.js
│   │   ├── habits.routes.js
│   │   └── dashboard.routes.js
│   ├── utils/             # Utility functions
│   ├── server.js          # Entry point
│   ├── .env.example       # Environment template
│   └── package.json
│
├── frontend/
│   ├── public/            # Static files
│   ├── src/
│   │   ├── api/          # API client configuration
│   │   ├── auth/         # Authentication context
│   │   ├── components/   # Reusable components
│   │   │   ├── habits/
│   │   │   ├── AddHabitModal.jsx
│   │   │   └── AuthGate.js
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   │   ├── Dashboard/
│   │   │   ├── Login.js
│   │   │   └── Signup.js
│   │   ├── utils/        # Utility functions
│   │   ├── App.js        # Root component
│   │   └── index.js      # Entry point
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Habits
- `GET /api/habits` - Get all habits for authenticated user
- `POST /api/habits` - Create a new habit
- `PATCH /api/habits/:id/toggle` - Toggle habit completion for a date
- `DELETE /api/habits/:id` - Soft delete a habit
- `PATCH /api/habits/:id/undo` - Restore a deleted habit

### Dashboard
- `GET /api/dashboard` - Get dashboard data

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **JWT Authentication**: Stateless authentication with secure tokens
- **Protected Routes**: Middleware-based route protection
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Controlled cross-origin access

## 🎨 Key Features Explained

### Soft Delete with Undo
Habits are never permanently deleted immediately. Instead, they're marked as deleted and can be restored within the session, preventing accidental data loss.

### Date-Specific Tracking
Each habit maintains an array of completed dates, allowing users to track their progress over time and mark habits as complete for any specific date.

### Configurable Logging
The backend includes a flexible logging system with multiple levels (none, error, info, debug) to help with development and debugging. See `backend/LOGGING.md` for details.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod --version`
- Check the connection string in `.env`
- Verify MongoDB is accessible at the specified port

### Port Already in Use
If port 5000 or 3000 is already in use:
```bash
# Find and kill the process (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change the port in .env (backend) or package.json (frontend)
```

### JWT Authentication Errors
- Ensure `JWT_SECRET` is set in backend `.env`
- Clear browser localStorage and try logging in again
- Check that the token is being sent in request headers

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Kaushal Mikaelson**
- GitHub: [@KaushalMikaelson](https://github.com/KaushalMikaelson)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/KaushalMikaelson/habit-tracker/issues).

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using React and Node.js**
