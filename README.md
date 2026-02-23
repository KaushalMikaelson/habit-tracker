# 🎯 Habit Tracker (Premium Edition)

A full-stack, aesthetically driven habit tracking application designed to help users build and maintain positive habits through highly visual tracking, progressive rewards, and daily accountability.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)

## ✨ Premium Features

- **Dynamic Dark Mode UI**: A stunning, modern dark-themed interface built from scratch with glassmorphism effects, radial gradients, and fluid micro-animations.
- **Prestige Badge System**: Long-term performance indicator. Earn progressive visual badges (Bronze, Silver, Gold, Platinum, Diamond, Apex) based on lifetime habit completion percentage. Features dynamic lighting and particle effects.
- **Momentum Flame 2.0**: A physically accurate, multi-layered gas flame visualizer that grows and changes color based on your monthly consistency and momentum.
- **Advanced KPI Dashboard**: At-a-glance circular progress rings for Today, Weekly, and Monthly completion rates, plus historical momentum tracking.
- **Interactive Habit Grid**: A responsive, horizontally scrolling calendar grid to mark habits complete.
- **Drag-and-Drop Reordering**: Intuitively reorder your habits using `@dnd-kit`.
- **Soft Delete & Undo**: Accidentally deleted a habit? Instantly recover it with a custom animated toast notification.
- **Detailed Analytics**: Visual graphs and Top Habits tracking to analyze your long-term performance.
- **Mobile-First Responsive Layout**: flawless experience across desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - Core UI library
- **React Router** 7.11.0 - Client-side routing
- **Framer Motion** - Fluid animations and layout transitions
- **@dnd-kit core/sortable** - Drag and drop functionality
- **Day.js** - Lightweight date parsing and formatting
- **Axios** - HTTP client for API requests
- **JWT Decode** - Secure frontend token management

### Backend
- **Node.js** with **Express** 5.2.1 - Robust server framework
- **MongoDB** with **Mongoose** 9.1.1 - NoSQL Database and ODM
- **JSON Web Tokens (JWT)** - Secure, stateless authentication
- **Bcrypt** - Enterprise-grade password hashing
- **CORS** - Secure cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure your development environment meets the following requirements:
- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (v4.0 or higher) - Running locally or via MongoDB Atlas

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/KaushalMikaelson/habit-tracker.git
cd habit-tracker
```

### 2. Install Dependencies

Install dependencies for both the frontend and backend environments:

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

Edit the `.env` file with your specific configuration details:

```env
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGO_URI=mongodb://127.0.0.1:27017/habit-tracker

# JWT Configuration
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

Ensure your MongoDB instance is running:

```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

### 5. Run the Application

#### Development Mode

Launch the application by opening two separate terminal windows:

**Terminal 1 - Backend Server:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend Application:**
```bash
cd frontend
npm start
```

The application will now be accessible at:
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

## 📁 Project Architecture

```
habit-tracker/
├── backend/
│   ├── controllers/        # Business logic & request handlers
│   ├── middleware/         # Auth & validation middleware
│   ├── models/            # Mongoose schemas (User, Habit)
│   ├── routes/            # REST API route definitions
│   ├── utils/             # Helper functions & logger
│   └── server.js          # Express application entry point
│
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/          # Axios instance & API calls
│   │   ├── components/   # Modular React components
│   │   │   ├── habits/   # Grid, layout, and habit controls
│   │   │   ├── kpi/      # Analytical rings and stats
│   │   │   ├── MomentumFlame/ # Complex visual indicator
│   │   │   └── PrestigeBadge/ # Long-term progression system
│   │   ├── hooks/        # Custom React hooks (useHabits)
│   │   ├── pages/        # High-level route components (Dashboard, Auth)
│   │   ├── utils/        # Date formatting, calc logic
│   │   └── App.js        # Root component routing
│   └── package.json
└── README.md
```

## 🔌 Core API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user account
- `POST /api/auth/login` - Authenticate user and receive JWT

### Habits Management
- `GET /api/habits` - Retrieve all habits for the authenticated user
- `POST /api/habits` - Create a new habit entry
- `PATCH /api/habits/:id/toggle` - Toggle habit completion status for a specific date
- `DELETE /api/habits/:id` - Soft delete a habit (allows undo)
- `PATCH /api/habits/:id/undo` - Restore a previously soft-deleted habit
- `PATCH /api/habits/reorder` - Update habit display order

## 🔒 Security Posture

- **Password Cryptography**: Bcrypt hashing with secure salt rounds
- **Stateless Auth**: JWT-based authentication preventing session hijacking
- **Route Protection**: Custom Express middleware for strict endpoint access control
- **Input Sanitization**: Server-side validation to prevent injection attacks
- **CORS Policies**: Strictly controlled cross-origin resource sharing rules

## 🐛 Troubleshooting

### MongoDB Connection Timeout
- Verify MongoDB daemon is actively running: `mongod --version`
- Double-check the `MONGO_URI` connection string in your backend `.env` file

### Address Already in Use (EADDRINUSE)
If ports 5000 or 3000 are blocked by another process:
```bash
# Windows: Find and terminate process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Authentication Failures
- Verify `JWT_SECRET` is correctly populated in the backend `.env`
- Clear browser `localStorage` and attempt re-login to flush stale tokens

## 📝 License

This project is open-source and licensed under the MIT License.

## 👤 Author

**Kaushal Mikaelson**
- GitHub: [@KaushalMikaelson](https://github.com/KaushalMikaelson)

## 🤝 Contributing

Contributions, bug reports, and feature requests are highly encouraged. Please check the [issues page](https://github.com/KaushalMikaelson/habit-tracker/issues) to get involved.

---
**Crafted with focus and discipline.**
