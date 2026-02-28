import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { calculateWeeklyCompletion, calculateMonthlyCompletion, isDateAccessible } from "../../utils/habitUtils";

dayjs.extend(isBetween);

function defaultKPIs() {
  return {
    daily: 0,
    dailyDelta: 0,
    weekly: 0,
    weeklyDelta: 0,
    monthly: 0,
    monthlyDelta: 0,
    momentum: 0,
    momentumDelta: 0,

    dailyDirection: "neutral",
    weeklyDirection: "neutral",
    monthlyDirection: "neutral",
    momentumDirection: "neutral",
  };
}

function getDirection(delta) {
  if (delta > 0) return "up";
  if (delta < 0) return "down";
  return "neutral";
}

export function calculateKPIs(habits, selectedMonth) {
  if (!Array.isArray(habits) || !selectedMonth) {
    return defaultKPIs();
  }

  const today = dayjs().startOf("day");
  const todayStr = today.format("YYYY-MM-DD");
  const yesterdayStr = today.subtract(1, "day").format("YYYY-MM-DD");

  const totalHabits = habits.length;
  if (totalHabits === 0) return defaultKPIs();

  let todayCompleted = 0;
  let dailyTotalHabits = 0;

  let yesterdayCompleted = 0;
  let yesterdayTotalHabits = 0;

  let weeklyCompleted = 0;
  let weeklyTotal = 0;

  let prevWeekCompleted = 0;
  let prevWeeklyTotal = 0;

  let monthlyCompleted = 0;
  let monthlyTotal = 0;

  let prevMonthCompleted = 0;
  let prevMonthlyTotal = 0;

  let prevPrevMonthCompleted = 0;
  let prevPrevMonthlyTotal = 0;

  habits.forEach((habit) => {
    const completedDates = Array.isArray(habit.completedDates)
      ? habit.completedDates
      : [];

    /* ================= DAILY ================= */
    if (isDateAccessible(habit, todayStr)) {
      dailyTotalHabits++;
      if (completedDates.includes(todayStr)) {
        todayCompleted++;
      }
    }

    if (isDateAccessible(habit, yesterdayStr)) {
      yesterdayTotalHabits++;
      if (completedDates.includes(yesterdayStr)) {
        yesterdayCompleted++;
      }
    }

    /* ================= WEEKLY ================= */
    const w = calculateWeeklyCompletion(habit, today, today);
    weeklyCompleted += w.completed;
    weeklyTotal += w.total;

    const prevW = calculateWeeklyCompletion(
      habit,
      today.subtract(1, "week").startOf("week"),
      today
    );
    prevWeekCompleted += prevW.completed;
    prevWeeklyTotal += prevW.total;

    /* ================= MONTHLY ================= */
    const m = calculateMonthlyCompletion(habit, selectedMonth, today);
    monthlyCompleted += m.completed;
    monthlyTotal += m.total;

    const prevM = calculateMonthlyCompletion(
      habit,
      selectedMonth.subtract(1, "month"),
      today
    );
    prevMonthCompleted += prevM.completed;
    prevMonthlyTotal += prevM.total;

    const prevPrevM = calculateMonthlyCompletion(
      habit,
      selectedMonth.subtract(2, "month"),
      today
    );
    prevPrevMonthCompleted += prevPrevM.completed;
    prevPrevMonthlyTotal += prevPrevM.total;
  });

  /* ================= DAILY ================= */

  const daily =
    dailyTotalHabits > 0
      ? Math.round((todayCompleted / dailyTotalHabits) * 100)
      : 0;

  const yesterdayDaily =
    yesterdayTotalHabits > 0
      ? Math.round((yesterdayCompleted / yesterdayTotalHabits) * 100)
      : 0;

  const dailyDelta = daily - yesterdayDaily;

  /* ================= WEEKLY ================= */

  const weekly =
    weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;

  const prevWeekly =
    prevWeeklyTotal > 0
      ? Math.round((prevWeekCompleted / prevWeeklyTotal) * 100)
      : 0;

  const weeklyDelta = weekly - prevWeekly;

  /* ================= MONTHLY ================= */

  const monthly =
    monthlyTotal > 0 ? Math.round((monthlyCompleted / monthlyTotal) * 100) : 0;

  const prevMonthly =
    prevMonthlyTotal > 0
      ? Math.round((prevMonthCompleted / prevMonthlyTotal) * 100)
      : 0;

  const prevPrevMonthly =
    prevPrevMonthlyTotal > 0
      ? Math.round((prevPrevMonthCompleted / prevPrevMonthlyTotal) * 100)
      : 0;

  const monthlyDelta = monthly - prevMonthly;

  /* ================= MOMENTUM (TREND ACCELERATION) ================= */

  // Previous month’s improvement trend
  const prevMonthlyDelta = prevMonthly - prevPrevMonthly;

  // Current improvement strength
  const momentum = monthlyDelta;

  // Acceleration of improvement
  const momentumDelta = monthlyDelta - prevMonthlyDelta;

  return {
    daily,
    dailyDelta,
    weekly,
    weeklyDelta,
    monthly,
    monthlyDelta,
    momentum,
    momentumDelta,

    dailyDirection: getDirection(dailyDelta),
    weeklyDirection: getDirection(weeklyDelta),
    monthlyDirection: getDirection(monthlyDelta),
    momentumDirection: getDirection(momentumDelta),
  };
}
