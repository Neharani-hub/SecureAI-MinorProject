// ==========================
// BLOCKED PAGE TIMER (FINAL)
// ==========================

let seconds = 3;

const timerElement = document.getElementById("timer");

// Safety check (wait for DOM if needed)
document.addEventListener("DOMContentLoaded", () => {

    const interval = setInterval(() => {

        seconds--;

        if (timerElement) {
            timerElement.innerText = seconds;
        }

        if (seconds <= 0) {
            clearInterval(interval);

            // Close tab via background (RECOMMENDED)
            chrome.runtime.sendMessage("close_tab");
        }

    }, 1000);

});