function AddHabitModal({ showModal, setShowModal, newHabit, setNewHabit, addHabit }) {
    if (!showModal) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add New Habit</h2>
                <input
                    type="text"
                    placeholder="Enter new habit"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                />
                <button onClick={addHabit}>Add Habit</button>
                <div style={{ marginTop: '10px' }}>
                <button onClick={() => setShowModal(false)}>Cancel</button>
                <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => {
                        addHabit();
                        setShowModal(false);
                        setNewHabit("");
                    }}
                    disabled={newHabit.trim() === ""}
                >
                    Save
                </button>
                </div>
            </div>
        </div>
    );
}
export default AddHabitModal;


/*
How the Call Flow Works (Very Important)
User clicks Save in modal

⬇️
AddHabitModal calls:

addHabit()


⬇️
React executes addHabit inside Dashboard

⬇️
Dashboard updates:

setHabits(...)


⬇️
UI updates automatically
⬇️
localStorage effect runs
⬇️
Data is saved
*/