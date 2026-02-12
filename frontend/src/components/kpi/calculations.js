import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

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

  const isCurrentMonth = selectedMonth.isSame(today, "month");

  /* ================= WEEK CALCULATION ================= */

  const weekStart =
    today.day() === 0
      ? today.subtract(6, "day").startOf("day")
      : today.startOf("week").add(1, "day");

  const daysElapsedThisWeek =
    today.diff(weekStart, "day") + 1;

  const prevWeekStart = weekStart.subtract(7, "day");
  const prevWeekEnd = prevWeekStart
    .add(daysElapsedThisWeek - 1, "day")
    .endOf("day");

  /* ================= MONTH CALCULATION ================= */

  const monthStart = selectedMonth.startOf("month").startOf("day");
  const monthEnd = selectedMonth.endOf("month").endOf("day");
  const daysInMonth = selectedMonth.daysInMonth();

  const daysElapsedInMonth = isCurrentMonth
    ? today.date()
    : daysInMonth;

  const prevMonth = selectedMonth.subtract(1, "month");
  const prevMonthStart = prevMonth.startOf("month").startOf("day");
  const prevMonthEnd = prevMonth.endOf("month").endOf("day");

  const prevPrevMonth = selectedMonth.subtract(2, "month");
  const prevPrevMonthStart = prevPrevMonth.startOf("month").startOf("day");
  const prevPrevMonthEnd = prevPrevMonth.endOf("month").endOf("day");

  const totalHabits = habits.length;
  if (totalHabits === 0) return defaultKPIs();

  let todayCompleted = 0;
  let yesterdayCompleted = 0;
  let weeklyCompleted = 0;
  let prevWeekCompleted = 0;
  let monthlyCompleted = 0;
  let prevMonthCompleted = 0;
  let prevPrevMonthCompleted = 0;

  habits.forEach((habit) => {
    const completedDates = Array.isArray(habit.completedDates)
      ? habit.completedDates
      : [];

    /* ================= DAILY ================= */

    if (completedDates.includes(todayStr)) {
      todayCompleted++;
    }

    if (completedDates.includes(yesterdayStr)) {
      yesterdayCompleted++;
    }

    /* ================= OTHER KPIs ================= */

    completedDates.forEach((date) => {
      const d = dayjs(date).startOf("day");

      if (
        d.isBetween(weekStart, today.endOf("day"), "day", "[]")
      ) {
        weeklyCompleted++;
      }

      if (
        d.isBetween(prevWeekStart, prevWeekEnd, "day", "[]")
      ) {
        prevWeekCompleted++;
      }

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

      if (
        d.isBetween(
          prevMonthStart,
          prevMonthEnd,
          "day",
          "[]"
        )
      ) {
        prevMonthCompleted++;
      }

      if (
        d.isBetween(
          prevPrevMonthStart,
          prevPrevMonthEnd,
          "day",
          "[]"
        )
      ) {
        prevPrevMonthCompleted++;
      }
    });
  });

  /* ================= DAILY ================= */

  const daily = Math.round(
    (todayCompleted / totalHabits) * 100
  );

  const yesterdayDaily = Math.round(
    (yesterdayCompleted / totalHabits) * 100
  );

  const dailyDelta = daily - yesterdayDaily;

  /* ================= WEEKLY ================= */

  const weekly = Math.round(
    (weeklyCompleted /
      (totalHabits * daysElapsedThisWeek)) *
      100
  );

  const prevWeekly = Math.round(
    (prevWeekCompleted /
      (totalHabits * daysElapsedThisWeek)) *
      100
  );

  const weeklyDelta = weekly - prevWeekly;

  /* ================= MONTHLY ================= */

  const monthly = Math.round(
    (monthlyCompleted /
      (totalHabits * daysElapsedInMonth)) *
      100
  );

  const prevMonthly = Math.round(
    (prevMonthCompleted /
      (totalHabits * prevMonth.daysInMonth())) *
      100
  );

  const prevPrevMonthly = Math.round(
    (prevPrevMonthCompleted /
      (totalHabits * prevPrevMonth.daysInMonth())) *
      100
  );

  const monthlyDelta = monthly - prevMonthly;

  /* ================= MOMENTUM (TREND ACCELERATION) ================= */

  // Previous month’s improvement trend
  const prevMonthlyDelta =
    prevMonthly - prevPrevMonthly;

  // Current improvement strength
  const momentum = monthlyDelta;

  // Acceleration of improvement
  const momentumDelta =
    monthlyDelta - prevMonthlyDelta;

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
