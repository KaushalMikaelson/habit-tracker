# Habit Tracker - Comprehensive Project Interview Guide

## 1. Project Overview & Problem Statement
**Problem Statement:** In a fast-paced world, individuals struggle to build and maintain positive habits consistently. Traditional habit trackers are often rigid, lacking personalized insights, advanced statistical tracking, and contextual motivation. When users break a streak, they often lose momentum completely.

**Target Users:** Professionals, students, and self-improvement enthusiasts looking to gamify their daily routines, track long-term behavioral changes, and receive AI-driven coaching for personal growth.

**Unique Selling Proposition (USP):** 
Unlike basic CRUD habit trackers, this project integrates an **AI-driven coaching system (Aria)** using Groq's LLMs. It calculates dynamic KPIs (Prestige scores, Momentum Flames, 30-day consistency) entirely on the client side for a snappy UI, features persistent drag-and-drop reordering, and incorporates an interactive 365-day heatmap and weekly planner integrations.

## 2. Complete Tech Stack & Tradeoffs

### Frontend (Client)
*   **React (CRA):** Chosen for its robust component ecosystem and virtual DOM, making complex UI state updates (like drag-and-drop and optimistic UI rendering) highly performant.
*   **Context API + Custom Hooks (`useHabits`):** Used over Redux to reduce boilerplate. It perfectly handles the global auth state and localized habit data fetching without over-engineering.
*   **Axios:** Handles API communication. Interceptors are configured for automatic JWT token injection and centralized 401 (Unauthorized) error handling.
*   **dnd-kit:** A lightweight, modular drag-and-drop library. Chosen over `react-beautiful-dnd` for better modern React compatibility and performance.
*   **Recharts:** Used for building the Weekly Trend area charts and habit statistics. Selected for its declarative API and React native support.
*   **Framer Motion:** Adds subtle micro-interactions, page transitions, and the dynamic "Momentum Flame" animations to enhance the premium feel.
*   **Day.js:** A minimalist alternative to Moment.js, used extensively for calculating streaks, weekly boundaries, and parsing ISO dates for the 365-day heatmap.

### Backend (Server)
*   **Node.js & Express:** Provides a lightweight, non-blocking, event-driven backend perfectly suited for I/O heavy operations like database querying and REST API serving.
*   **MongoDB & Mongoose:** A NoSQL database is ideal here. The flexibility of documents allows for storing habit completion dates as arrays and dynamically growing structures without rigid schema migrations.
*   **JSON Web Tokens (JWT) & bcrypt:** Standard, stateless authentication. Passwords are salted and hashed before DB insertion.
*   **Groq SDK (AI Integration):** Chosen for its blazingly fast inference speeds compared to standard OpenAI APIs, crucial for providing real-time AI coaching responses.

## 3. Architecture & Execution Flow

**Folder Structure Overview:**
```text
habit-tracker/
├── backend/
│   ├── controllers/      # Business logic (auth, habits, ai)
│   ├── models/           # Mongoose schemas (User, Habit)
│   ├── routes/           # Express route definitions
│   ├── middleware/       # JWT verification, Error handling
│   ├── utils/            # Logger, helpers
│   └── server.js         # Entry point, Express config, MongoDB connect
└── frontend/
    ├── src/
    │   ├── api/          # Axios instance & interceptors
    │   ├── auth/         # AuthContext provider
    │   ├── components/   # Reusable UI (Sidebar, ConfirmModal, etc.)
    │   ├── hooks/        # Custom hooks (useHabits)
    │   ├── pages/        # Route pages (Dashboard, Login, Settings, Planner)
    │   ├── utils/        # Date logic, streak calculations
    │   └── App.js        # React router setup
```

**Data Flow (Example: Toggling a Habit):**
1. **User Action:** Clicks a habit checkmark on the Dashboard.
2. **Optimistic UI:** The `useHabits` hook immediately updates the React state to show it as checked (perceived zero latency).
3. **API Call:** Axios sends a PUT request to `/api/habits/:id/toggle` with the specific date.
4. **Backend Processing:** `authMiddleware` verifies the JWT. The controller finds the habit and uses MongoDB's `$addToSet` or `$pull` to update the `completedDates` array.
5. **Response Handling:** If the API fails, the frontend catches the error and reverts the optimistic UI state, notifying the user.

## 4. Core Features & Implementation Details

### A. Advanced State Management & Optimistic Updates
*   **File:** `frontend/src/hooks/useHabits.js`
*   **Logic:** Rather than waiting for the backend response to re-render, the app modifies the local state array immediately. It maintains an `undo` timeout for soft-deletes (showing a toast), only sending the actual DELETE request if the user doesn't hit "Undo" within a few seconds.

### B. KPI and Streak Calculation Engine
*   **Files:** `frontend/src/utils/habitUtils.js`, `StatsView.jsx`
*   **Logic:** Calculations for Current Streak, Best Streak, 30-Day Consistency, and Momentum are calculated on the *client-side*.
*   *Design Decision:* Calculating on the frontend reduces backend CPU load and DB aggregation queries. Given a user typically has < 100 habits, modern browser JS engines process these arrays in sub-milliseconds.

### C. Drag and Drop Persistence
*   **Implementation:** Using `dnd-kit`. When a drag ends, the frontend recalculates the `order` integer for all affected habits.
*   **Persistence:** It fires a bulk update to `/api/habits/reorder`. The backend uses Mongoose `bulkWrite` with `updateOne` operations to update the order fields of multiple documents in a single, atomic database transaction.

### D. AI Coaching (Aria)
*   **Implementation:** The frontend gathers a summarized "snapshot" of the user's habits (total habits, completion rates, streaks).
*   **Backend Role:** This snapshot is sent to `/api/ai/chat`. The backend constructs a highly detailed system prompt combining the user's data and the persona of "Aria". It calls the Groq API and streams/returns the markdown-formatted response back to the client.

## 5. Database Schema & Relationships

**User Schema:**
*   `email`, `password` (hashed).
*   `googleId` (optional, for OAuth).
*   `settings`: Embedded document for preferences.

**Habit Schema:**
*   `userId`: ObjectId ref to User (1-to-many relationship).
*   `title` (String), `color` (String), `status` (Enum: active, paused, archived).
*   `completedDates`: Array of Strings (Format: "YYYY-MM-DD"). *Tradeoff:* Storing dates as strings allows for exact matching regardless of timezone complexities that occur with ISO Date objects.
*   `order`: Number (for DND sorting).
*   `isDeleted`: Boolean (Soft delete pattern).

## 6. Security Implementation
1. **JWT Authentication:** Tokens are issued on login. The `authMiddleware` extracts the token from the `Authorization: Bearer <token>` header, verifies it via `jsonwebtoken`, and attaches `req.user` for downstream controllers.
2. **Password Hashing:** `bcrypt` is used in the `User` model pre-save hook.
3. **CORS:** Configured in `server.js` to strictly allow requests only from specific origins (localhost, Vercel production URL).
4. **Data Isolation:** Every habit query (`Habit.find()`, `Habit.updateOne()`) implicitly includes `{ userId: req.user.userId }` to ensure users can never access or modify each other's data (Tenant Isolation).

## 7. Important Algorithms & Complexity

**1. Streak Calculation (`calculateHabitStreak`):**
*   *Logic:* Converts `completedDates` to a Set for O(1) lookups. Iterates backward from today (or yesterday, if today isn't done yet).
*   *Time Complexity:* O(N) where N is the length of the current streak.
*   *Space Complexity:* O(D) where D is the total number of completed dates (for the Set).

**2. 365-Day Heatmap Generation:**
*   *Logic:* Generates an array of the last 365 days. Maps over all habits and their completed dates, incrementing a counter in a hash map (`activityMap`) for each date.
*   *Time Complexity:* O(H * C) where H is the number of habits and C is the average number of completions per habit. Fast enough for client-side rendering.

## 8. Major Design Decisions & Tradeoffs

*   **Client-Side Analytics vs. Server-Side Aggregations:** I chose to ship raw completion dates to the frontend and calculate stats (streaks, percentages) in the browser. 
    *   *Pros:* Extremely fast UI navigation between views (Dashboard -> Stats -> Planner) without loading spinners or network requests. Lower server cost.
    *   *Cons:* Larger initial JSON payload. If a user uses the app for 10 years, the `completedDates` array might hit a few kilobytes. *Mitigation:* We can implement data pagination or archiving in the future.
*   **Soft Deletes (`isDeleted` flag):** Instead of `Habit.findByIdAndDelete()`, I use `findByIdAndUpdate({ isDeleted: true })`.
    *   *Pros:* Allows for easy data recovery, prevents cascade deletion issues, and maintains historical data for lifetime analytics (Prestige scoring).
*   **No Redux:** Used React Context + Custom Hooks.
    *   *Pros:* Reduces boilerplate. The state is localized precisely where it's needed (`AuthContext` for auth, `useHabits` for dashboard).

## 9. Realistic Challenges & Solutions

**Challenge 1: Drag-and-Drop Race Conditions**
*   *Issue:* Rapidly dragging items before the backend responded caused the UI to jump back and forth due to state desync.
*   *Solution:* Implemented optimistic UI updates. The local state is updated instantly, and the `bulkWrite` request is fired silently in the background. If it fails, a rollback state is applied.

**Challenge 2: Timezone Date Mismatches**
*   *Issue:* Using standard `new Date()` caused habits checked late at night to sometimes register as the next day depending on the server's UTC configuration.
*   *Solution:* Standardized all dates to strict `YYYY-MM-DD` strings locally via `Day.js` *before* sending to the server. The backend simply stores the string, remaining entirely timezone agnostic.

**Challenge 3: Google OAuth Popup Blocking in Production**
*   *Issue:* Browsers blocked the Google OAuth popup on the Vercel deployment due to strict Cross-Origin-Opener policies.
*   *Solution:* Migrated the `@react-oauth/google` implementation from a popup flow (`useGoogleLogin`) to a strict redirect flow (`ux_mode: 'redirect'`), capturing the token hash from the URL on redirect back to the app.
