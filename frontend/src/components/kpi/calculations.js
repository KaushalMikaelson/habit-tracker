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

    dailyDirection: "neutral",
    weeklyDirection: "neutral",
    monthlyDirection: "neutral",
    momentumDirection: "neutral",
  };
}

/**
 * Helper: direction from delta
 */
function getDirection(delta) {
  if (delta > 0) return "up";
  if (delta < 0) return "down";
  return "neutral";
}

/**
 * Calculates KPIs
 *
 * DAILY    → % habits completed TODAY
 * WEEKLY   → % habits completed THIS WEEK so far
 * MONTHLY  → avg daily consistency UP TO TODAY
 * MOMENTUM → fair comparison vs previous month (same day range)
 */
export function calculateKPIs(habits, selectedMonth) {
  if (!Array.isArray(habits) || !selectedMonth) {
    return defaultKPIs();
  }

  const today = dayjs().startOf("day");
  const yesterday = today.subtract(1, "day");
  const isCurrentMonth = selectedMonth.isSame(today, "month");

  // 📅 Week boundaries (current)
  const weekStart = today.startOf("week");
  const weekEnd = today.endOf("week");
  const daysElapsedThisWeek =
    today.diff(weekStart, "day") + 1;

  // 📅 Last week boundaries (same day range)
  const prevWeekStart = weekStart.subtract(1, "week");
  const prevWeekEnd = prevWeekStart
    .add(daysElapsedThisWeek - 1, "day")
    .endOf("day");

  // 📅 Month boundaries
  const monthStart = selectedMonth.startOf("month").startOf("day");
  const monthEnd = selectedMonth.endOf("month").endOf("day");
  const daysInMonth = selectedMonth.daysInMonth();

  const daysElapsedInMonth = isCurrentMonth
    ? today.date()
    : daysInMonth;

  // 📅 Previous month comparison
  const prevMonthStart = selectedMonth
    .subtract(1, "month")
    .startOf("month")
    .startOf("day");

  const prevComparisonEnd = prevMonthStart
    .add(daysElapsedInMonth - 1, "day")
    .endOf("day");

  const totalHabits = habits.length;
  if (totalHabits === 0) return defaultKPIs();

  let todayCompleted = 0;
  let yesterdayCompleted = 0;

  let weeklyCompleted = 0;
  let prevWeekCompleted = 0;

  let monthlyCompleted = 0;
  let prevMonthCompleted = 0;

  habits.forEach((habit) => {
    const completedDates = Array.isArray(habit.completedDates)
      ? habit.completedDates
      : [];

    completedDates.forEach((date) => {
      const d = dayjs(date).startOf("day");

      // 🟢 DAILY
      if (isCurrentMonth && d.isSame(today, "day")) {
        todayCompleted++;
      }

      // 🟡 YESTERDAY
      if (isCurrentMonth && d.isSame(yesterday, "day")) {
        yesterdayCompleted++;
      }

      // 🟢 THIS WEEK (so far)
      if (
        isCurrentMonth &&
        d.isBetween(weekStart, weekEnd, "day", "[]")
      ) {
        weeklyCompleted++;
      }

      // 🟡 LAST WEEK (same day range)
      if (
        d.isBetween(prevWeekStart, prevWeekEnd, "day", "[]")
      ) {
        prevWeekCompleted++;
      }

      // 🟢 THIS MONTH (up to today)
      if (
        d.isBetween(
          monthStart,
          isCurrentMonth ? today.endOf("day") : monthEnd,
          "day",
          "[]"
        )
      ) {
        monthlyCompleted++;
      }

      // 🟡 PREVIOUS MONTH (same range)
      if (
        d.isBetween(
          prevMonthStart,
          prevComparisonEnd,
          "day",
          "[]"
        )
      ) {
        prevMonthCompleted++;
      }
    });
  });

  /* ================= KPI VALUES ================= */

  const daily = isCurrentMonth
    ? Math.round((todayCompleted / totalHabits) * 100)
    : 0;

  const yesterdayDaily = isCurrentMonth
    ? Math.round((yesterdayCompleted / totalHabits) * 100)
    : 0;

  const weekly = isCurrentMonth
    ? Math.round(
        (weeklyCompleted /
          (totalHabits * daysElapsedThisWeek)) *
          100
      )
    : 0;

  const prevWeekly = isCurrentMonth
    ? Math.round(
        (prevWeekCompleted /
          (totalHabits * daysElapsedThisWeek)) *
          100
      )
    : 0;

  const currentMonthRate =
    monthlyCompleted / (totalHabits * daysElapsedInMonth);

  const prevMonthRate =
    prevMonthCompleted / (totalHabits * daysElapsedInMonth);

  const monthly = Math.round(currentMonthRate * 100);

  const momentum = Math.round(
    (currentMonthRate - prevMonthRate) * 100
  );

  /* ================= DIRECTIONS ================= */

  return {
    daily,
    weekly,
    monthly,
    momentum,

    // ✅ Correct comparisons
    dailyDirection: getDirection(daily - yesterdayDaily),
    weeklyDirection: getDirection(weekly - prevWeekly),

    // unchanged semantics
    monthlyDirection: getDirection(monthly),
    momentumDirection: getDirection(momentum),
  };
}
