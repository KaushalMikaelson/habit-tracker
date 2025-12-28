function HabitCard({ habit , toggleHabit, deleteHabit}){ // it is a props
    return (
    <div>
        <input 
        type="checkbox" 
        checked={habit.done}
        onChange={() => toggleHabit(habit.id)}
        /> 

        {habit.title} - {habit.done ?"Done" : "Not Done"} 

        <button onClick={() => deleteHabit(habit.id)}>
            Delete
        </button>
        
    </div>
    );
}
export default HabitCard;