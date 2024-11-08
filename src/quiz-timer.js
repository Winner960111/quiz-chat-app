let timerInterval;
const timerElement = document.getElementById('timer-number');
const timerCircle = document.getElementById('timer-circle');

function startTimer(duration) {
    clearInterval(timerInterval); // Clear any existing timer

    let timeRemaining = duration;
    timerElement.textContent = timeRemaining;

    // Ensure the background gradient starts correctly
    timerCircle.style.background = `conic-gradient(var(--theme-color) 100%, var(--background-color) 0%)`;

    timerInterval = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = timeRemaining;

        const percentage = (timeRemaining / duration) * 100;
        timerCircle.style.background = `conic-gradient(var(--theme-color) ${percentage}%, var(--background-color) ${percentage}%)`;

        console.log(`Time Remaining: ${timeRemaining}, Percentage: ${percentage}`);

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            finishedSummary();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function finishedSummary() {
    clearInterval(timerInterval); // Ensure timer is stopped
    toggleDisplay("questions-quiz", 'none');
    toggleDisplay("finished-summary", 'block');
    const summaryPage = document.getElementById("finished-summary");
    summaryPage.querySelector("p").innerHTML = `You answered ${correctQuestionCount}/${maxQuestionCount} answers correctly!`;
    summaryPage.querySelector(".percentage").innerHTML = `${(correctQuestionCount / maxQuestionCount * 100).toFixed(2)}%`;
}

