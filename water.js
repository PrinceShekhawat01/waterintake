document.addEventListener("DOMContentLoaded", () => {
    if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                console.log("🎉 Notification permission granted!");
            } else if (permission === "denied") {
                console.warn("❗️ Notification permission denied!");
            }
        });
    } else {
        console.warn("❗️ Notifications are not supported in this browser.");
    }
});

let i = 0; // Track total water intake
let intervalTime = 600000; // 10 minutes in milliseconds
let timerId; // Store interval ID
const skipBtn = document.getElementById("skip");
const justDrankBtn = document.getElementById("just");

// ✅ Timer Function - Runs Every 10 Minutes by Default
function timer() {
    // Get the current time and add 10 minutes
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 10);
    const nextTime = currentDate.toLocaleTimeString();
    const [currentHour, currentMinutes] = nextTime.split(":");

    // ⏱️ Update history if i > 0
    if (i > 0) {
        addToHistory(new Date());
    }

    // 🔔 Update next and status sections
    const next = document.getElementById("next");
    const status = document.getElementById("status01");
    const done = document.getElementById("done");
    next.innerHTML = `Reminder at: ${currentHour}:${currentMinutes}`;

    // 💧 Update water status
    if (i < 1200) {
        status.innerHTML = `${i}/1200 ml `;
        i += 100;
    } else {
        status.innerHTML = `1200/1200 ml`;
        done.innerHTML = `✅ Aaj ka ho gaya bhai!`;
        done.style.color = "red";

        clearInterval(timerId); // Stop the timer if goal is met
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

    // Format current time for history
    const historyTime = date.toLocaleTimeString();
    const [h, m] = historyTime.split(":");

    let history = document.createTextNode(`${h}:${m}`);
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

// ⏩ Skip Button - Add 20 Min and Reset Interval
function skip() {
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 20);
    const nextTime = currentDate.toLocaleTimeString();
    const [currentHour, currentMinutes] = nextTime.split(":");

    const next = document.getElementById("next");
    next.innerHTML = `Reminder at: ${currentHour}:${currentMinutes}`;

    // Clear interval and restart after 20 minutes
    clearInterval(timerId);
    timerId = setTimeout(() => {
        showAlertAndNotification();
        timer();
        resetInterval(600000); // Return to 10-minute interval after skip
    }, 1200000); // 20 minutes in milliseconds
}

// 🥤 Just Drank Button - Add Current Time and Reset Interval
function justDrank() {
    // Add the current time to history immediately
    const currentDate = new Date();
    addToHistory(currentDate);

    // Reset water status
    if (i < 1200) {
        i += 100;
        document.getElementById("status01").innerHTML = `${i}/1200 ml`;
    } else {
        document.getElementById("done").innerHTML = `✅ Aaj ka ho gaya bhai!`;
        document.getElementById("done").style.color = "red";
        clearInterval(timerId);
    }

    // Clear the previous interval and restart from the current time
    resetInterval(600000); // Start 10-minute interval again after clicking "Just Drank"
}

// ⏰ Reset Interval to Normal (10 minutes)
function resetInterval(time) {
    clearInterval(timerId);
    timerId = setInterval(() => {
        showAlertAndNotification();
        timer();
    }, time);
}

// ✅ Show Alert and Notification
function showAlertAndNotification() {
    // 🔔 Show alert
    alert("⏰ Time to drink water!");

    // 🔔 Send native notification if supported and granted
    if (Notification.permission === "granted") {
        new Notification("💧 Time to Drink Water!", {
            body: "Stay hydrated! It's time to take a sip of water now!",
            icon: "water.png", // Optional icon, add a relevant image to your directory
        });
    }
}

// ✅ Run Timer on Page Load
timer();

// ⏰ Start 10-minute interval by default
timerId = setInterval(() => {
    showAlertAndNotification();
    timer();
}, intervalTime);

// ⏩ Add Event Listeners for Buttons
skipBtn.addEventListener("click", skip);
justDrankBtn.addEventListener("click", justDrank);