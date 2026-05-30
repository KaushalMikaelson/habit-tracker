# Habit Tracker - Most Important Interview Questions

*These are the most likely technical and architectural questions an interviewer will ask based on this specific codebase, paired with expert-level answers.*

---

## 1. Frontend & State Management

**Q1: How did you implement Drag and Drop, and how do you ensure the visual order persists in the database?**
**Answer:** I used `dnd-kit` on the frontend for drag-and-drop interactions. When a drag ends, I intercept the `onDragEnd` event to locally reorder the array of habits in React state, providing an immediate visual update. I then recalculate an integer `order` field for each item based on its new index. Finally, I fire a PUT request to `/api/habits/reorder` with an array of objects containing the ID and new `order` integer. The backend handles this efficiently using Mongoose's `bulkWrite` to execute atomic updates in a single database transaction.

**Q2: I see you do a lot of statistical calculations (streaks, percentages). Why do this on the frontend instead of using a database aggregation pipeline?**
**Answer:** It was a deliberate tradeoff for user experience. Because habit trackers are highly interactive, calculating KPIs locally allows the user to switch between the Dashboard, Stats View, and Weekly View with absolute zero latency. Since a single user typically tracks under 100 habits, processing small arrays of date strings using the browser’s V8 JavaScript engine takes fractions of a millisecond. If I used DB aggregations, every view change would require a network roundtrip, introducing loading states. If the data grows massive over years, I plan to paginate or archive older dates.

**Q3: Explain the concept of "Optimistic UI" and how you applied it in your custom `useHabits` hook.**
**Answer:** Optimistic UI is when the frontend assumes an API call will succeed and updates the interface immediately, before the server responds. In my `useHabits` hook, when a user clicks to complete a habit, I immediately update the React state array to show the checkmark. I then dispatch the Axios request in the background. If the request fails, I catch the error, revert the React state to its previous form, and show a toast notification. This makes the app feel native and incredibly fast.

---

## 2. Backend & Node.js Architecture

**Q4: How do you secure your API endpoints so users can't edit other people's habits?**
**Answer:** I enforce "Tenant Isolation" at two levels. First, all protected routes pass through an `authMiddleware` which verifies the incoming JWT and attaches the decoded `userId` to the Express `req` object. Second, in the controller logic (e.g., updating or deleting a habit), the MongoDB query strictly includes `{ _id: habitId, userId: req.user.userId }`. This ensures that even if an attacker guesses a valid habit ID, the query will fail unless they also own that habit.

**Q5: Walk me through your Authentication flow. How do you handle token expiry?**
**Answer:** On login, the backend verifies the `bcrypt` password hash and issues a JWT signed with a secret, set to expire in an appropriate timeframe (e.g., 7 days). This token is stored in the frontend's `localStorage`. I configured an Axios response interceptor that acts globally. If any API request returns a `401 Unauthorized` status (indicating token expiry or invalidity), the interceptor automatically clears the local storage and redirects the user to the Login page, preventing them from interacting with a broken state.

**Q6: What happens if I accidentally click the checkmark twice really fast? How does your backend handle duplicate requests?**
**Answer:** The habit toggling logic is designed to be idempotent. In MongoDB, instead of pushing to an array, I use the `$addToSet` operator. If the date string `2026-05-08` already exists in the `completedDates` array, MongoDB ignores the second request, preventing duplicates entirely at the database level.

---

## 3. Database & Mongoose

**Q7: Why did you choose storing dates as strings (`"YYYY-MM-DD"`) instead of using native JavaScript/MongoDB Date objects?**
**Answer:** Timezones. If a user completes a habit at 11:30 PM local time, converting that to an ISO UTC Date object might roll the timestamp over to the next calendar day on the server. By generating a strict local date string using `Day.js` on the client and storing it simply as a string in MongoDB, I bypassed timezone mutation issues completely. A string of `"2026-05-08"` represents the exact day the user perceived completing the task, regardless of where the server is located.

**Q8: I noticed you use a `deletedAt` and `isDeleted` flag instead of physically deleting habits. Why?**
**Answer:** I implemented a "Soft Delete" pattern. Deleting a habit updates `isDeleted: true` instead of calling `findByIdAndDelete`. This has three benefits: 
1. It allows me to implement an "Undo" button on the frontend easily.
2. It prevents breaking historical statistics (e.g., lifetime Prestige scores based on total completions).
3. It prevents orphaned data issues if other tables eventually reference that habit ID.

---

## 4. General Systems & Scalability

**Q9: If this app suddenly gets 100,000 active users, what is the first piece of the architecture that will break, and how would you fix it?**
**Answer:** The first bottleneck would likely be the database read queries for the Dashboard, specifically fetching the user's habits on every refresh. I would implement a caching layer using Redis. When a user logs in, their habit list would be cached in Redis. Any write operations (toggling, adding) would update the DB and invalidate/update the Redis cache. Secondly, the AI Coaching feature relies on an external API (Groq). Synchronous API calls would block Node.js threads under high load, so I would offload AI prompt generation to a background job queue like BullMQ.

**Q10: Why did you choose Groq for the AI integration instead of the standard OpenAI API?**
**Answer:** Groq utilizes specialized LPU (Language Processing Unit) hardware rather than standard GPUs, resulting in massively faster token generation speeds. For an interactive feature like an AI Coach, lowering the Time-To-First-Token (TTFT) was critical to maintain the fast, responsive feel of the rest of the application. Waiting 5-10 seconds for a standard LLM response ruins the flow of a productivity app.
