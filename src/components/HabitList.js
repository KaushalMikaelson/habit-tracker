import HabitCard from "./HabitCard";
function habitList(habits, toggleHabit, deleteHabit){
    return (
        <div>
         {habits.map((habit) =>(  // take each habit from habits array
                <HabitCard  
                    key={habit.id} 
                    habit={habit} 
                    toggleHabit={toggleHabit}
                    deleteHabit={deleteHabit}
                    /> // passing habit as prop to HabitCard component
            ))}
            </div>
        )
}
export default habitList;