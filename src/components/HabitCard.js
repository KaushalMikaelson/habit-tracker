function HabitCard({ habit, toggleHabit, deleteHabit, today }) {

    const completedDates = Array.isArray(habit.completedDates)
        ? habit.completedDates
        : [];

    const isDoneToday = completedDates.includes(today);

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
