import HabitCard from '../components/HabitCard';
import HabitList from '../components/HabitList';
import AddHabitModal from '../components/AddHabitModal';
import {useState, useEffect} from "react"; //creates memory for habits

function getTodayDate(){
    return new Date().toISOString().split("T")[0];
}

function Dashboard(){
    const [newHabit, setNewHabit] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const today = getTodayDate();
    const [habits, setHabits] = useState([
         {
        id: 1,
        title: "Drink Water",
        createdAt: today,
        completedDates: []
        },
        {
        id: 2,
        title: "Exercise",
        createdAt: today,
        completedDates: []
        },
        {
        id: 3,
        title: "Read Book",
        createdAt: today,
        completedDates: []
        }
    ]);
 //example habits- It is a  state variable
    

    useEffect(() =>{
    const storedHabits = localStorage.getItem("habits");
    if(storedHabits){
        setHabits(JSON.parse(storedHabits));
    }
    setIsLoaded(true); //tells that loading is done
    }, []) // runs once when component mounts


    useEffect(() =>{
        if(!isLoaded) return; // prevent overwriting on initial load

        localStorage.setItem("habits", JSON.stringify(habits));
    }, [habits, isLoaded]) // runs whenever habits change


function toggleHabit(id) {
    setHabits((prevHabits) =>
        prevHabits.map((habit) => {
            if (habit.id !== id) return habit;

            // ✅ Normalize completedDates ALWAYS
            const completedDates = Array.isArray(habit.completedDates)
                ? habit.completedDates
                : [];

            const isDoneToday = completedDates.includes(today);

            return {
                ...habit,
                completedDates: isDoneToday
                    ? completedDates.filter((date) => date !== today)
                    : [...completedDates, today]
            };
        })
    );


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
                today={today}
            />
            <button onClick={() => setShowModal(true)}>
                Add Habit
            </button>
            <AddHabitModal 
                showModal = {showModal}
                setShowModal={setShowModal}
                newHabit={newHabit}
                setNewHabit={setNewHabit}
                addHabit={addHabit}
            />
        </div>
    )
}
export default Dashboard;