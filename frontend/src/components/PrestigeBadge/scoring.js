import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

/**
 * Prestige Badge — Lifetime Scoring
 *
 * Computes a PERSISTENT lifetime completion percentage.
 * This score NEVER resets. It reflects all-time discipline.
 *
 * lifetimeScore = (totalCompletedTasks / totalPossibleTasks) * 100
 *
 * Where:
 *   totalCompletedTasks = sum of all completedDates across all habits
 *   totalPossibleTasks  = sum of (days since each habit was created) for each habit
 */

export function calculateLifetimeStats(habits) {
    if (!Array.isArray(habits) || habits.length === 0) {
        return {
            lifetimeScore: 0,
            totalCompleted: 0,
            totalPossible: 0,
            currentStreak: 0,
            monthlyScore: 0,
            monthlyCompleted: 0,
            monthlyPossible: 0,
        };
    }

    const today = dayjs().startOf("day");
    let totalCompleted = 0;
    let totalPossible = 0;

    // Monthly variables
    const monthStart = today.startOf("month");
    const daysElapsedInMonth = today.date(); // current day of month
    let monthlyCompleted = 0;
    const totalHabits = habits.length;

    habits.forEach((habit) => {
        const completedDates = Array.isArray(habit.completedDates)
            ? habit.completedDates
            : [];

        // Count all completed tasks for this habit
        totalCompleted += completedDates.length;

        // Calculate days since habit was created (inclusive of creation day)
        const createdAt = dayjs(habit.createdAt).startOf("day");
        const daysSinceCreation = today.diff(createdAt, "day") + 1;
        totalPossible += Math.max(daysSinceCreation, 1);

        // Calculate monthly completed tasks
        completedDates.forEach((date) => {
            const d = dayjs(date).startOf("day");
            if (d.isBetween(monthStart, today.endOf("day"), "day", "[]")) {
                monthlyCompleted++;
            }
        });
    });

    // Lifetime completion percentage
    const lifetimeScore =
        totalPossible > 0
            ? Math.round((totalCompleted / totalPossible) * 100)
            : 0;

    // Current streak: consecutive days (going backwards from today)
    // where ALL habits were completed
    const currentStreak = calculateStreak(habits, today);

    // Monthly score calculation
    const monthlyPossible = totalHabits * daysElapsedInMonth;
    const monthlyScore =
        monthlyPossible > 0
            ? Math.round((monthlyCompleted / monthlyPossible) * 100)
            : 0;

    return {
        lifetimeScore: Math.min(lifetimeScore, 100),
        totalCompleted,
        totalPossible,
        currentStreak,
        monthlyScore: Math.min(monthlyScore, 100),
        monthlyCompleted,
        monthlyPossible,
    };
}

/**
 * Calculates the current streak: consecutive days going backward
 * from today where the user completed at least one habit.
 */
function calculateStreak(habits, today) {
    let streak = 0;
    let checkDate = today;

    for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.format("YYYY-MM-DD");
        const completedAny = habits.some((habit) => {
            const dates = Array.isArray(habit.completedDates)
                ? habit.completedDates
                : [];
            return dates.includes(dateStr);
        });

        if (!completedAny) break;
        streak++;
        checkDate = checkDate.subtract(1, "day");
    }

    return streak;
}
