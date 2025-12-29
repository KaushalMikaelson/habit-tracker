import HabitCard from "./HabitCard";
function HabitList({habits, toggleHabit, deleteHabit, selectedDate,today}){
    return (
        <div>
         {habits.map((habit) =>(  // take each habit from habits array
                <HabitCard  
                    key={habit.id} 
                    habit={habit} 
                    toggleHabit={toggleHabit}
                    deleteHabit={deleteHabit}
                    selectedDate ={selectedDate}
                    today={today}
                    /> // passing habit as prop to HabitCard component
            ))}
            </div>
        )
}
export default HabitList;