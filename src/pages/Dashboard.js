import HabitCard from '../components/HabitCard';
import HabitList from '../components/HabitList';
import AddHabitModal from '../components/AddHabitModal';
import {getCurrentDate, getCurrentYearMonth,getMonthDates, getMonthLabel} from '../utils/dateUtils';
import {buildcalendarWeeks} from '../utils/calendarUtils';
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
    const initialYearMonth = getCurrentYearMonth();
    const [currentYearMonth, setCurrentYearMonth] = useState(initialYearMonth.year);
    const [currentMonth, setCurrentMonth] = useState(initialYearMonth.month);
    const monthDates = getMonthDates(currentYearMonth, currentMonth);
    const monthLabel = getMonthLabel(currentYearMonth, currentMonth);
    const [selectedDate, setSelectedDate] = useState(null);

    const goToPreviousMonth = () => {
        if(currentMonth === 0){
            setCurrentYearMonth((prevYear) => prevYear - 1);
            setCurrentMonth(11);
        }else{
            setCurrentMonth((prevMonth) => prevMonth - 1);
        }
    }
    
    const goToNextMonth = () => {
        if(currentMonth === 11){
            setCurrentYearMonth((prevYear) => prevYear + 1);
            setCurrentMonth(0);
        }else{
            setCurrentMonth((prevMonth) => prevMonth + 1);
        }
    }

    const calendarWeeks = buildcalendarWeeks(currentYearMonth, currentMonth);
    console.log(calendarWeeks);

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
    const targetDate = selectedDate || today;

    setHabits((prevHabits) =>
        prevHabits.map((habit) => {
            if (habit.id !== id) return habit;

            const completedDates = Array.isArray(habit.completedDates)
                ? habit.completedDates
                : [];

            const isDoneForDate = completedDates.includes(targetDate);

            return {
                ...habit,
                completedDates: isDoneForDate
                    ? completedDates.filter((date) => date !== targetDate)
                    : [...completedDates, targetDate]
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



    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayDate = new Date().toISOString().split("T")[0];
    

    const isAnyHabitCompletedOnDate = (date) => {
    return habits.some(
        (habit) =>
            Array.isArray(habit.completedDates) &&
            habit.completedDates.includes(date)
    );
};


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
            habits={habits}
            toggleHabit={toggleHabit}
            deleteHabit={deleteHabit}
            today={today}
            selectedDate={selectedDate}
        />

        <button onClick={() => setShowModal(true)}>
            Add Habit
        </button>

        <AddHabitModal
            showModal={showModal}
            setShowModal={setShowModal}
            newHabit={newHabit}
            setNewHabit={setNewHabit}
            addHabit={addHabit}
        />

        {/* Weekday header */}
        <div
            className="weekday-row"
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                marginTop: "20px",
                fontWeight: "bold",
                textAlign: "center",
            }}
        >
            {weekDays.map((day) => (
                <div key={day} className="weekday">
                    {day}
                </div>
            ))}
        </div>

        {/* Calendar grid */}
        <div className="calendar-grid">
            {calendarWeeks.map((week, weekIndex) => (
                <div
                    key={weekIndex}
                    className="calendar-week"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                    }}
                >
                    {week.map((day, dayIndex) => (
                        <div
                            key={dayIndex}
                            className="calendar-day"
                            onClick={()=> {
                                if(!day) return;
                                setSelectedDate(day);
                            }}
                            style={{
                                    height: "40px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    backgroundColor:
                                        day === selectedDate
                                            ? "#28a745"          // green (selected)
                                            : day === todayDate
                                            ? "#cce5ff"          // blue (today)
                                            : "transparent",

                                    color: day === selectedDate ? "white" : "black",

                                    border:
                                        day === selectedDate
                                            ? "2px solid #1e7e34"
                                            : day === todayDate
                                            ? "2px solid #0d6efd"
                                            : "1px solid #ccc",

                                    fontWeight: day === todayDate ? "bold" : "normal",
                                    cursor: day ? "pointer" : "default",
                                }}

                        >
                            {day ? day.split("-")[2] : ""}
                            {day && isAnyHabitCompletedOnDate(day) && (
                            <div
                                style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "green",
                                    marginTop: "4px",
                                }}
                            />
                        )}

                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
    );
}
export default Dashboard;