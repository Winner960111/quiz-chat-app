// Helper function to generate a random ID
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function createQuestion(event) {
    event.preventDefault();

    // Gather form data
    const id = document.getElementById('question-id').value;
    const question = document.getElementById('question').value;
    const answer1 = document.getElementById('answer1').value;
    const answer2 = document.getElementById('answer2').value;
    const answer3 = document.getElementById('answer3').value;
    const answer4 = document.getElementById('answer4').value;
    const categorySelect = document.getElementById('category');
    const difficultySelect = document.getElementById('difficulty');
    let category = categorySelect.value;
    const difficulty = difficultySelect.value;

    // Check if any field is empty
    if (!question || !answer1 || !answer2 || !answer3 || !answer4 || !category || !difficulty) {
        alert('Please fill out all fields.');
        return;
    }

    // Check if new category is selected
    let isNewCategory = false;
    if (category === 'newCategory') {
        category = document.getElementById('new-category').value;
        isNewCategory = true;
    }

    // Replace spaces in category with dashes
    const formattedCategory = category.toLowerCase().replace(/\s+/g, '-');
    const randomId = generateRandomId(30);

    // Construct the document reference in the desired format
    const questionRef = db.collection("questions").doc(`${formattedCategory}/questions/${id.length > 0 ? id : randomId}`);

    // Add new question to Firestore
    questionRef.set({
        question: question,
        answers: [answer1, answer2, answer3, answer4],
        category: category,
        difficulty: difficulty
    }).then(() => {
        alert('Question added successfully!');
        document.getElementById('create-question-form').reset();
        document.getElementById('add-category').style.display = 'none';

        // If new category, add it to the "category" collection
        if (isNewCategory) {
            const themeRef = db.collection("category").doc(formattedCategory);
            themeRef.set({ name: category }) // Use category as the display name for the category
                .then(() => {
                    console.log('New category added to themes');
                })
                .catch((error) => {
                    console.error("Error adding new category: ", error);
                });
        }

        categorySelect.value = category;
        difficultySelect.value = difficulty;
    }).catch((error) => {
        console.error("Error adding question: ", error);
    });

    createQuestionTab();
}

// Function to load categories and populate the dropdown
function loadCategories(id, isEdit) {
    const categorySelect = document.getElementById(id);
    
    // Clear existing options in the dropdown
    categorySelect.innerHTML = '';

    // Add default and new category options
    const newCategoryOption = document.createElement('option');
    newCategoryOption.value = "newCategory";
    newCategoryOption.textContent = isEdit ? 'ALL Categories' : 'New Category';
    categorySelect.appendChild(newCategoryOption);

    // Fetch categories from Firestore
    db.collection('category').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doc.data().name;
            categorySelect.appendChild(option);
        });
    }).catch((error) => {
        console.error("Error loading categories: ", error);
    });
}