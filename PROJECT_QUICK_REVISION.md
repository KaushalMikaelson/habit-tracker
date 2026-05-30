# Habit Tracker - Quick Revision Sheet
*(Review 15 minutes before your interview)*

## 1. Elevator Pitch
"I built a full-stack, React and Node.js-based habit tracking application that goes beyond simple checklists. It features a drag-and-drop dashboard, real-time client-side statistical analysis (like 365-day heatmaps and streaks), and an integrated AI coaching system powered by Groq. The architecture emphasizes optimistic UI updates for a zero-latency feel and uses Mongoose bulk writes for efficient, atomic state persistence."

## 2. Tech Stack at a Glance
*   **Frontend:** React, React Context, Axios, dnd-kit (drag & drop), Recharts (charts), Framer Motion (animations), Day.js.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB via Mongoose.
*   **Auth:** JWT (JSON Web Tokens), bcrypt (password hashing), Google OAuth (Redirect flow).
*   **AI:** Groq SDK (Llama 3 / Mixtral for fast inference).

## 3. Top 3 Architectural Wins

1.  **Optimistic UI & Custom Hooks:** The `useHabits` hook immediately mutates the React state upon user interaction (e.g., checking a habit, reordering). It gives the illusion of zero latency, silently syncing with the backend and only reverting if the API throws an error.
2.  **Client-Side KPI Processing:** Instead of complex MongoDB aggregation pipelines running on every request, the backend sends a lean array of `completedDates` (as strings). The browser (using V8 engine) processes streaks, weekly completion percentages, and 30-day consistency in milliseconds, vastly reducing server load.
3.  **Atomic Bulk Writes for DND:** When users finish dragging/dropping habits, the frontend sends the newly calculated `order` integers to the backend. Instead of looping and awaiting multiple DB saves, the backend uses `Habit.bulkWrite()` to update all affected documents atomically in a single network trip to the database.

## 4. Key Terminology to Use

*   **Tenant Isolation:** Mention that all queries include `{ userId: req.user.userId }` to ensure data security.
*   **Soft Deletes:** Deleting a habit updates `isDeleted: true` instead of wiping the document, preserving historical data for lifetime statistics.
*   **Idempotency:** Toggling a habit uses MongoDB's `$addToSet` (or `$pull`), meaning if the API is called twice by accident, it doesn't create duplicate entries.
*   **Timezone Agnostic:** Dates are stored as strict `YYYY-MM-DD` strings locally formatted by Day.js, bypassing the classic JavaScript `Date` timezone mutation bugs.

## 5. Security Checklist
*   Passwords are salted and hashed via `bcrypt` pre-save hooks in Mongoose.
*   Routes are protected by `authMiddleware` which verifies the JWT signature.
*   Axios interceptors catch `401 Unauthorized` errors globally to auto-redirect users to login upon token expiry.
*   CORS is configured to only accept requests from the deployed Vercel frontend.

## 6. How the AI Coaching Works
1.  Frontend aggregates user data (Total habits, Current Streaks, Weekly completion %).
2.  Data is sent to the Express `/api/ai/chat` endpoint.
3.  Express formats this data into a hidden System Prompt for "Aria" (the persona).
4.  The Groq SDK executes the prompt using an LLM.
5.  Markdown response is returned to the client and rendered.

## 7. Common Interview Triggers & Your Responses

*   **"How did you handle state?"** -> *React Context for global user auth, Custom hook (`useHabits`) for localized, complex habit state + optimistic updates.*
*   **"Why MongoDB?"** -> *The document model is perfect for appending data to arrays (`completedDates`). It allows rapid iteration without rigid schema migrations.*
*   **"What was the hardest bug?"** -> *Timezone differences causing habits completed at 11:30 PM to register as the next day. Fixed by enforcing strict local-time `YYYY-MM-DD` string generation via Day.js before data hits the server.*
*   **"How would you scale this?"** -> *Introduce Redis caching for the habit list, move AI processing to a background worker queue (like BullMQ) if response times degrade, and add indexing on `{ userId: 1, isDeleted: 1 }` in MongoDB.*
