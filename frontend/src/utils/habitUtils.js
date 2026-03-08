import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

/**
 * Gets the effective start date of a habit.
 * This ensures that if for some reason a completed date exists BEFORE
 * the stated createdAt date (e.g. legacy data), we don't invalidate it.
 * But primarily, it serves as the logical origin of the habit.
 */
export function getEffectiveStartDate(habit) {
    const dbCreatedAt = habit.createdAt ? dayjs(habit.createdAt).startOf("day") : dayjs().startOf("day");

    if (Array.isArray(habit.completedDates) && habit.completedDates.length > 0) {
        let earliestCompleted = dayjs(habit.completedDates[0]).startOf("day");
        habit.completedDates.forEach((dStr) => {
            const d = dayjs(dStr).startOf("day");
            if (d.isBefore(earliestCompleted)) {
                earliestCompleted = d;
            }
        });

        if (earliestCompleted.isBefore(dbCreatedAt)) {
            return earliestCompleted;
        }
    }

    return dbCreatedAt;
}

/**
 * Checks if a specific date is accessible for a habit.
 * A date is accessible if it is on or after the effective start date.
 */
export function isDateAccessible(habit, dateStr) {
    const d = dayjs(dateStr).startOf("day");
    const startDate = getEffectiveStartDate(habit);
    return d.isSame(startDate, "day") || d.isAfter(startDate, "day");
}

/**
 * Calculates weekly completion stats (percentage, completed, total) for a given habit.
 * @param {Object} habit - The habit object.
 * @param {dayjs|string} targetDate - The date inside the week to calculate for (usually today).
 * @param {dayjs|string} todayDate - Actual current day.
 * @returns {Object} { percent, completed, total }
 */
export function calculateWeeklyCompletion(habit, targetDate = dayjs(), todayDate = dayjs()) {
    const target = dayjs(targetDate).startOf("day");
    const weekStart = target.startOf("week"); // Sunday start
    const weekEnd = target.endOf("week"); // Saturday end

    const today = dayjs(todayDate).startOf("day");

    let activeEnd = target;
    if (target.isSame(today, "week")) {
        activeEnd = today;
    } else if (target.isBefore(today, "week")) {
        activeEnd = weekEnd.startOf("day");
    }

    const effectiveStart = getEffectiveStartDate(habit);

    const computeStart = effectiveStart.isAfter(weekStart) ? effectiveStart : weekStart;

    if (computeStart.isAfter(activeEnd)) {
        return { percent: 0, completed: 0, total: 0 };
    }

    const totalPossible = activeEnd.diff(computeStart, "day") + 1;
    const completedDates = Array.isArray(habit.completedDates) ? habit.completedDates : [];

    let completed = 0;
    for (let i = 0; i < totalPossible; i++) {
        const dStr = computeStart.add(i, "day").format("YYYY-MM-DD");
        if (completedDates.includes(dStr)) {
            completed++;
        }
    }

    const percent = totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;
    return { percent, completed, total: totalPossible };
}

/**
 * Calculates monthly completion stats based on the habit's creation date.
 * @param {Object} habit - The habit object.
 * @param {dayjs|string} targetMonth - Any date within the month to calculate for.
 * @param {dayjs|string} todayDate - Actual current day.
 * @returns {Object} { percent, completed, total }
 */
export function calculateMonthlyCompletion(habit, targetMonth = dayjs(), todayDate = dayjs()) {
    const target = dayjs(targetMonth);
    const monthStart = target.startOf("month").startOf("day");
    const monthEnd = target.endOf("month").startOf("day");

    const today = dayjs(todayDate).startOf("day");

    let activeEnd = monthEnd;
    if (target.isSame(today, "month")) {
        activeEnd = today;
    }

    const effectiveStart = getEffectiveStartDate(habit);

    const computeStart = effectiveStart.isAfter(monthStart) ? effectiveStart : monthStart;

    if (computeStart.isAfter(activeEnd)) {
        return { percent: 0, completed: 0, total: 0 };
    }

    const totalPossible = activeEnd.diff(computeStart, "day") + 1;
    const completedDates = Array.isArray(habit.completedDates) ? habit.completedDates : [];

    let completed = 0;
    for (let i = 0; i < totalPossible; i++) {
        const dStr = computeStart.add(i, "day").format("YYYY-MM-DD");
        if (completedDates.includes(dStr)) {
            completed++;
        }
    }

    const percent = totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;
    return { percent, completed, total: totalPossible };
}

/**
 * Calculates the valid streak for a habit (only considering accessible dates).
 */
export function calculateHabitStreak(habit, todayDateStr) {
    const completedSet = new Set(
        (habit.completedDates || []).map((d) =>
            dayjs(d).format("YYYY-MM-DD")
        )
    );

    let streak = 0;
    let cursor = todayDateStr ? dayjs(todayDateStr).startOf("day") : dayjs().startOf("day");

    while (isDateAccessible(habit, cursor.format("YYYY-MM-DD")) && completedSet.has(cursor.format("YYYY-MM-DD"))) {
        streak++;
        cursor = cursor.subtract(1, "day");
    }

    return streak;
}
