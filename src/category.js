function showCategorySelection() {
    toggleDisplay('main-menu', 'none');
    toggleDisplay('category-selection', 'block');
}

function loadCategories() {
    const categoriesList = document.getElementById('categories-list');
    db.collection('category').get().then(querySnapshot => {
        categoriesList.innerHTML = ''; // Clear existing categories
        const categoryIds = []; // To store category IDs for random selection

        querySnapshot.forEach(doc => {
            const categoryItem = document.createElement('div');
            categoryItem.classList.add('checkbox-wrapper');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = doc.id;
            checkbox.value = doc.id;
            const label = document.createElement('label');
            label.htmlFor = doc.id;
            label.textContent = doc.data().name;
            categoryItem.appendChild(checkbox);
            categoryItem.appendChild(label);
            categoriesList.appendChild(categoryItem);
            categoryItem.addEventListener('click', handleCheckboxChange);
            
            // Collect category IDs for random selection
            categoryIds.push(doc.id);
        });

        loadSelectedCategories(); // Load selected categories after categories are loaded

        // Select a random category if none are selected
        if (categoryIds.length > 0 && !JSON.parse(localStorage.getItem('selectedCategories'))?.length) {
            const randomId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
            const checkbox = document.getElementById(randomId);
            if (checkbox) {
                checkbox.checked = true;
                saveSelectedCategories(); // Save the random selection
            }
        }
    }).catch(console.error);
}

function handleCheckboxChange(event) {
    const checkboxes = document.querySelectorAll('#categories-list input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox !== event.target) {
            checkbox.checked = false;
        }
    });

    saveSelectedCategories(); // Save the selected category
}


function loadSelectedCategories() {
    const selectedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];
    selectedCategories.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    updateSelectedTopics(); // Update topics after loading selected categories
}

function saveSelectedCategories() {
    const selectedCategories = Array.from(document.querySelectorAll('#categories-list input[type="checkbox"]:checked')).map(cb => cb.value);
    localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
}

function toggleSelectAll(selectAll) {
    const checkboxes = document.querySelectorAll('#categories-list input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = selectAll);
    updateSelectedTopics();
}

function updateSelectedTopics() {
    const selectedCheckboxes = document.querySelectorAll('#categories-list input[type="checkbox"]:checked');
    const selectedValues = Array.from(selectedCheckboxes).map(cb => cb.nextSibling.textContent.trim());
    const selectedTopicsElement = document.getElementById('selected-topics-chips');
    const selectedTopicsTextElement = document.getElementById('selected-topics');
    const startQuizButton = document.getElementById('start-quiz-button');

    selectedTopicsElement.innerHTML = ''; 

    if (selectedValues.length > 0) {
        selectedTopicsTextElement.textContent = 'Selected Topic:';
        selectedValues.forEach(value => {
            const chip = document.createElement('div');
            chip.classList.add('chip');
            chip.textContent = value;
            selectedTopicsElement.appendChild(chip);
        });
    } else {
        selectedTopicsTextElement.textContent = 'You don\'t have any categories selected, the quiz will start with random topics.';
    }
    startQuizButton.disabled = false;
}
