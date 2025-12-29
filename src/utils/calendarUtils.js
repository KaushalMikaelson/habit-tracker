export function buildcalendarWeeks(year, month){
    const weeks = [];
    let currentWeek = [];

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
    for(let i=0; i<firstDayOfMonth; i++){
        currentWeek.push(null); // empty days before the first day of the month
    }
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for(let day=1; day<=daysInMonth; day++){
        const date = new Date(year, month, day)
        .toISOString().split("T")[0]; // "YYYY-MM-DD"
        currentWeek.push(date);

        if(currentWeek.length === 7){ // week is complete
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }
    if(currentWeek.length > 0){
        while(currentWeek.length < 7){
            currentWeek.push(null); // empty days after the last day of the month
        }
        weeks.push(currentWeek);
    }
    return weeks;
}