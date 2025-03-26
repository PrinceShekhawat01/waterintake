let i = 0; // Track total water intake
let skippedCount=0;
let drankCount=0;
const urlParams = new URLSearchParams(window.location.search);
let reminderTime = parseInt(urlParams.get("time")) || 10; // Default to 10 min if not provided
let intervalTime = reminderTime * 60000; // Convert minutes to milliseconds
let timerId; // Store interval ID

const skipBtn = document.getElementById("skip");
const justDrankBtn = document.getElementById("just");


// ✅ Timer Function - Runs Every X Minutes (default: 10)
function timer() {
    // Get current time and set the next reminder
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + reminderTime);
    const nextTime = currentDate.toLocaleTimeString();
    
    // ⏱️ Update next reminder display
    document.getElementById("next").innerHTML = `Reminder at: ${nextTime}`;

    // 💧 Update water status
    if (i < 1200) {
        i += 100; // Increase intake
        document.getElementById("status01").innerHTML = `${i}/1200 ml completed`;
    }

    // ✅ Check if goal reached
    if (i >= 1200) {
        document.getElementById("done").innerHTML = `✅ Aaj ka ho gaya bhai!`;
        document.getElementById("done").style.color = "red";
        clearInterval(timerId); // Stop reminders
    }
}

// ✅ Add Current Time to History
function addToHistory(date) {
    let d = document.getElementById("history");
    let innerd = document.createElement("div");
    innerd.className = "status";

    let h1 = document.createElement("span");
    let h2 = document.createElement("span");
    h1.style.width = "fit-content";
    h2.style.width = "fit-content";

    // Format time for history
    const historyTime = date.toLocaleTimeString();
    let history = document.createTextNode(`${historyTime}`);
    let img = document.createElement("img");
    img.src = "done.png";
    img.width = 20;
    img.height = 20;

    // Append elements to history
    h1.append(history);
    h2.append(img);
    innerd.append(h1);
    innerd.append(h2);
    d.append(innerd);
}

// 🥤 Just Drank Button - Add Time and Reset Interval
function justDrank() {
    if (i < 1200) {
        i += 100;
        document.getElementById("status01").innerHTML = `${i}/1200 ml completed`;
    }

    addToHistory(new Date()); // Add entry to history

    // ✅ Check if goal reached
    if (i >= 1200) {
        document.getElementById("done").innerHTML = `✅ Aaj ka ho gaya bhai!`;
        document.getElementById("done").style.color = "red";
        clearInterval(timerId);
    }
    drankCount++;

    resetInterval(intervalTime); // Restart reminder timer
}

// ⏩ Skip Button - Add 20 Minutes & Reset Timer
function skip() {
    skippedCount++;
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + reminderTime*2);
    const nextTime = currentDate.toLocaleTimeString();

    document.getElementById("next").innerHTML = `Next Reminder: ${nextTime}`;

    clearInterval(timerId);
    timerId = setTimeout(() => {
        alert("⏰ Time to drink water!");
        timer();
        resetInterval(intervalTime); // Return to normal interval
    }, 1200000); // 20 minutes
}

// ⏰ Reset Reminder Interval
function resetInterval(time) {
    clearInterval(timerId);
    timerId = setInterval(() => {
        alert("⏰ Time to drink water!");
        timer();
    }, time);
}

// ✅ Run Timer on Page Load
timer();
timerId = setInterval(() => {
    alert("⏰ Time to drink water!");
    timer();
}, intervalTime);

// ⏩ Add Event Listeners for Buttons
skipBtn.addEventListener("click", skip);
justDrankBtn.addEventListener("click", justDrank);
