import dayjs from "dayjs";

/**
 * Temporary test helper
 */
export function testDayjs() {
  return dayjs().format("YYYY-MM-DD");
}

/**
 * STEP 6
 * Calculates Daily + Weekly + Monthly + Momentum KPIs
 */
export function calculateKPIs(habits) {
  const today = dayjs();
  const thirtyDaysAgo = today.subtract(30, "day");

  let dailyCompleted = 0;
  let weeklyCompleted = 0;
  let monthlyCompleted = 0;
  let momentumCompleted = 0;

  const totalHabits = habits.length;
  const daysInMonth = today.daysInMonth();

  habits.forEach((habit) => {
    const completedDates = habit.completedDates || [];

    completedDates.forEach((date) => {
      const d = dayjs(date);

      // DAILY
      if (d.isSame(today, "day")) {
        dailyCompleted++;
      }

      // WEEKLY
      if (d.isSame(today, "week")) {
        weeklyCompleted++;
      }

      // MONTHLY
      if (d.isSame(today, "month")) {
        monthlyCompleted++;
      }

      // MOMENTUM (last 30 days)
      if (d.isAfter(thirtyDaysAgo) || d.isSame(thirtyDaysAgo, "day")) {
        momentumCompleted++;
      }
    });
  });

  return {
    daily: totalHabits
      ? Math.round((dailyCompleted / totalHabits) * 100)
      : 0,

    weekly: totalHabits
      ? Math.round((weeklyCompleted / (totalHabits * 7)) * 100)
      : 0,

    monthly: totalHabits
      ? Math.round(
          (monthlyCompleted / (totalHabits * daysInMonth)) * 100
        )
      : 0,

    momentum: totalHabits
      ? Math.round((momentumCompleted / (totalHabits * 30)) * 100)
      : 0,
  };
}
