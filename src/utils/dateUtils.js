export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

export function getMonthDates(year, month) {
    const daysInMonth = getDaysInMonth(year, month);
    const dates = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        dates.push(date.toISOString().split("T")[0]);  // "YYYY-MM-DD"
    }
    return dates;
}
export function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split("T")[0]; // "YYYY-MM-DD"
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
