export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

export function getMonthDates(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const yyyy = year;
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");

    dates.push(`${yyyy}-${mm}-${dd}`);
  }

  return dates;
}

export function getCurrentDate() {
  const now = new Date();
  return (
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0")
  );
}


export function getCurrentYearMonth(){
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth()
    };
}

export const getMonthLabel = (year, month) => {
    const date = new Date(year, month);
    return date.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });
};
