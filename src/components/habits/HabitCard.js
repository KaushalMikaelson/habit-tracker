function HabitCard({ habit, toggleHabit, deleteHabit, today, selectedDate }) {

    const completedDates = Array.isArray(habit.completedDates)
        ? habit.completedDates
        : [];

    const targetDate = selectedDate || today;
    const isDoneToday = completedDates.includes(targetDate);

    return (
        <div>
            <input
                type="checkbox"
                checked={isDoneToday}
                onChange={() => toggleHabit(habit.id)}
            />

            {habit.title} - {isDoneToday ? "Done Today" : "Not Done Today"}

            <button onClick={() => deleteHabit(habit.id)}>
                Delete
            </button>
        </div>
    );
}

export default HabitCard;
