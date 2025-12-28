import HabitCard from '../components/HabitCard';
import HabitList from '../components/HabitList';
import {useState} from "react"; //creates memory for habits

function Dashboard(){
    const [habits, setHabits] = useState([
        { id: 1, title: "Drink Water", done: false },
        { id: 2, title: "Exercise", done: false },
        { id: 3, title: "Read Book", done: false }
]);
 //example habits- It is a  state variable
    const [newHabit, setNewHabit] = useState("");

    function toggleHabit(id){
        setHabits((prevHabits) =>  //If the next state depends on the previous state, always use the function form of setState.
        prevHabits.map((habit) =>
            habit.id === id ? { ...habit, done: !habit.done } : habit
    )
)
    }
    
    function addHabit(){
        if(newHabit.trim() === "") return; // Prevent adding empty habits
        const newHabitObj = {
            id : Date.now(),
            title : newHabit,
            done : false
        };
        setHabits((prevHabits) => [...prevHabits, newHabitObj]); //add new habit to habits array
        setNewHabit("");
        }
    
    function deleteHabit(id){
        setHabits((prevHabits) =>
        prevHabits.filter((habit) => habit.id !== id)
    );
    }

    return (
        <div>
            <h2>Welcome to the Dashboard</h2>
            <input
                type="text"
                placeholder="Add New Habit"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
            />
            <HabitList
                habits= {habits}
                toggleHabit={toggleHabit}
                deleteHabit={deleteHabit}
            />
            <button onClick={addHabit}>Add Habit</button>
            
        </div>
    )
}
export default Dashboard;