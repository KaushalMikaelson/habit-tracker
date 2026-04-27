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

  let threeDayCompleted = 0;
  let threeDayTotal = 0;

  let prev3DayCompleted = 0;
  let prev3DayTotal = 0;

  habits.forEach((habit) => {
    // Completely exclude inactive habits from the KPI percentages
    // so that the current active habits accurately dictate the score.
    // Their historical completions still appear on the Daily Progress graph.
    if (habit.isDeleted || habit.status === "archived" || habit.status === "paused") {
      return;
    }

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

    /* ================= 3-DAY ROLLING WINDOW ================= */
    for (let d = 0; d < 3; d++) {
      const dateStr = today.subtract(d, "day").format("YYYY-MM-DD");
      if (isDateAccessible(habit, dateStr)) {
        threeDayTotal++;
        if (completedDates.includes(dateStr)) threeDayCompleted++;
      }
    }

    /* ================= PREV 3-DAY ROLLING WINDOW (days 3–5 ago) ================= */
    for (let d = 3; d < 6; d++) {
      const dateStr = today.subtract(d, "day").format("YYYY-MM-DD");
      if (isDateAccessible(habit, dateStr)) {
        prev3DayTotal++;
        if (completedDates.includes(dateStr)) prev3DayCompleted++;
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

  const monthlyDelta = monthly - prevMonthly;

  /* ================= MOMENTUM ================= */

  // 3-day rolling completion rate (most recent habit discipline)
  const threeDayRate =
    threeDayTotal > 0 ? Math.round((threeDayCompleted / threeDayTotal) * 100) : 0;

  // Previous 3-day rate (days 3–5 ago) — shifted window for delta comparison
  const prev3DayRate =
    prev3DayTotal > 0 ? Math.round((prev3DayCompleted / prev3DayTotal) * 100) : 0;

  // Weighted blend: last 3 days × 0.5 + this week × 0.3 + today × 0.2
  const momentum = Math.round(threeDayRate * 0.5 + weekly * 0.3 + daily * 0.2);

  // prevMomentum: same formula, shifted back one period
  // prev3Day × 0.5 + prevWeek × 0.3 + yesterday × 0.2
  const prevMomentum = Math.round(prev3DayRate * 0.5 + prevWeekly * 0.3 + yesterdayDaily * 0.2);

  // Delta = how much the composite momentum score changed
  const momentumDelta = momentum - prevMomentum;

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
