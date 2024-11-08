function saveSettings() {
    const difficulty = document.getElementById('difficulty').value;
    const timer = document.getElementById('timer').value;
    const numberOfQuestions = document.getElementById('number-of-questions').value;

    const settings = {
        difficulty,
        timer: parseInt(timer, 10),
        numberOfQuestions: parseInt(numberOfQuestions, 10)
    };

    localStorage.setItem('quizSettings', JSON.stringify(settings));

    alert('Settings saved successfully!');
    backToMainMenuScreen();
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('quizSettings')) || {
        difficulty: 'easy',
        timer: 60,
        numberOfQuestions: 10
    };

    const difficultySelect = document.getElementById('difficulty');
    if (difficultySelect) {
        difficultySelect.value = settings.difficulty;
    }

    const timerInput = document.getElementById('timer');
    if (timerInput) {
        timerInput.value = settings.timer;
    }

    const numberOfQuestionsInput = document.getElementById('number-of-questions');
    if (numberOfQuestionsInput) {
        numberOfQuestionsInput.value = settings.numberOfQuestions;
    }
}

function showSettings() {
    toggleDisplay('main-menu', 'none');
    toggleDisplay('settings-screen', 'block');
    loadSettings();
}

function backToMainMenu() {
    toggleDisplay('settings-screen', 'none');
    toggleDisplay('main-menu', 'block');
}

// Setup save button functionality
function setupSaveButton() {
    const saveButton = document.getElementById('save-settings-button');
    if (saveButton) {
        saveButton.addEventListener('click', saveSettings);
    }
}

// Initialize save button
setupSaveButton();

// Existing admin page navigation
function openAdminPage() {
    window.location.href = 'admin/index.html';
}
