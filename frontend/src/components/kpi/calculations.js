import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

/**
 * Default KPI fallback
 */
function defaultKPIs() {
  return {
    daily: 0,
    weekly: 0,
    monthly: 0,
    momentum: 0,
  };
}

/**
 * Calculates KPIs
 *
 * DAILY    → % habits completed TODAY (only for current month)
 * WEEKLY   → % habits completed THIS WEEK so far (only for current month)
 * MONTHLY  → avg daily consistency in selected month
 * MOMENTUM → comparison vs previous month
 */
export function calculateKPIs(habits, selectedMonth) {
  if (!Array.isArray(habits) || !selectedMonth) {
    return defaultKPIs();
  }

  const realToday = dayjs();

  // ✅ Is the user viewing the current month?
  const isCurrentMonth = selectedMonth.isSame(realToday, "month");

  // 📅 Month boundaries
  const monthStart = selectedMonth.startOf("month");
  const monthEnd = selectedMonth.endOf("month");
  const daysInMonth = selectedMonth.daysInMonth();

  // 📅 Week boundaries (relative to TODAY)
  const weekStart = realToday.startOf("week");
  const weekEnd = realToday.endOf("week");

  // 📅 Days elapsed in this week (Sun = 1 … Sat = 7)
  const daysElapsedThisWeek =
    realToday.diff(weekStart, "day") + 1;

  // 📅 Previous month (momentum)
  const prevMonthStart = selectedMonth
    .subtract(1, "month")
    .startOf("month");
  const prevMonthEnd = selectedMonth
    .subtract(1, "month")
    .endOf("month");

  const totalHabits = habits.length;
  if (totalHabits === 0) return defaultKPIs();

  let todayCompleted = 0;
  let weeklyCompleted = 0;
  let monthlyCompleted = 0;
  let prevMonthCompleted = 0;

  habits.forEach((habit) => {
    const completedDates = Array.isArray(habit.completedDates)
      ? habit.completedDates
      : [];

    completedDates.forEach((date) => {
      const d = dayjs(date);

      // 🟢 DAILY → today only (current month only)
      if (isCurrentMonth && d.isSame(realToday, "day")) {
        todayCompleted++;
      }

      // 🟢 WEEKLY → current week so far (current month only)
      if (
        isCurrentMonth &&
        d.isBetween(weekStart, weekEnd, "day", "[]")
      ) {
        weeklyCompleted++;
      }

      // 🟢 MONTHLY → selected month
      if (d.isBetween(monthStart, monthEnd, "day", "[]")) {
        monthlyCompleted++;
      }

      // 🟢 PREVIOUS MONTH → momentum
      if (d.isBetween(prevMonthStart, prevMonthEnd, "day", "[]")) {
        prevMonthCompleted++;
      }
    });
  });

  return {
    // ✅ DAILY: only meaningful in current month
    daily: isCurrentMonth
      ? Math.round((todayCompleted / totalHabits) * 100)
      : 0,

    // ✅ WEEKLY: divide by days elapsed, not full 7
    weekly: isCurrentMonth
      ? Math.round(
          (weeklyCompleted /
            (totalHabits * daysElapsedThisWeek)) *
            100
        )
      : 0,

    // ✅ MONTHLY: average across entire month
    monthly: Math.round(
      (monthlyCompleted / (totalHabits * daysInMonth)) * 100
    ),

    // ✅ MOMENTUM: month-over-month trend
    momentum: Math.round(
      ((monthlyCompleted - prevMonthCompleted) /
        (totalHabits * daysInMonth)) *
        100
    ),
  };
}
