document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    updateSelectedTopics();
    loadSettings();
    loadSelectedCategories();
});

function toggleDisplay(elementId, displayStyle) {
    document.getElementById(elementId).style.display = displayStyle;
}

function backToMainMenuCategories() {
    saveSelectedCategories();
    backToMainMenuScreen();
}

function backToMainMenuSettings() {
    if (confirm('You have unsaved changes. Do you really want to leave?')) {
        backToMainMenuScreen();
    }
}

function backToMainMenuScreen() {
    toggleDisplay('category-selection', 'none');
    toggleDisplay('settings-screen', 'none');
    toggleDisplay('main-menu', 'block');
}


document.getElementById('categories-list').addEventListener('click', function (event) {
    const checkboxWrapper = event.target.closest('.checkbox-wrapper');
    if (checkboxWrapper) {
        const checkbox = checkboxWrapper.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            saveSelectedCategories(); // Save categories on change
            updateSelectedTopics();
        }
    }
});


function startQuiz() {
    let selectedCategories = Array.from(document.querySelectorAll('#categories-list input[type="checkbox"]:checked')).map(cb => cb.value);
    if (selectedCategories.length === 0) {
        const allCheckboxes = Array.from(document.querySelectorAll('#categories-list input[type="checkbox"]'));
        const randomNumberOfCategories = Math.floor(Math.random() * allCheckboxes.length) + 1;
        const shuffledCheckboxes = allCheckboxes.sort(() => 0.5 - Math.random());
        selectedCategories = shuffledCheckboxes.slice(0, randomNumberOfCategories).map(cb => cb.value);
        selectedCategories.forEach(id => document.getElementById(id).checked = true);
        alert('You don\'t have any categories selected, the quiz will start with random topics.');
    }

    localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
    window.location.href = 'quiz.html';
}