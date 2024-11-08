const categorySelect = document.getElementById('category-select');
const questionsContainer = document.getElementById('questions-container');
const questionTemplate = document.getElementById('question-template');

// Function to render question cards
function renderQuestions(questions) {
    questionsContainer.innerHTML = '';
    questions.forEach((question) => {
        const clone = questionTemplate.content.cloneNode(true);
        clone.querySelector('.question-name').textContent = question.name;
        clone.querySelector('.question-text').textContent = question.question;
        const answersList = clone.querySelector('.answers-list');
        question.answers.forEach((answer) => {
            const li = document.createElement('li');
            li.textContent = answer;
            answersList.appendChild(li);
        });
        clone.querySelector('.question-category').textContent = question.category;
        clone.querySelector('.question-difficulty').textContent = question.difficulty;
        clone.querySelector('.edit-button').addEventListener('click', () => {
            // Add edit functionality here
            console.log(`Editing question: ${question.id}`);
        });

        clone.querySelector(".edit-button").onclick = () => editQuestion(question);
        clone.querySelector(".delete-button").onclick = () => deleteQuestion(question);
        questionsContainer.appendChild(clone);
    });
}

// Function to fetch all questions
function getAllQuestions() {
    return db.collectionGroup("questions").get()
        .then((querySnapshot) => {
            let questions = [];
            querySnapshot.forEach((doc) => {
                questions.push({ id: doc.id, ...doc.data() });
            });
            return questions;
        })
        .catch((error) => {
            console.error("Error fetching questions: ", error);
            throw error;
        });
}

// Function to fetch questions by category
function getQuestionsByCategory(category) {
    return db.collection(`questions/${category}/questions`)
        .get()
        .then((querySnapshot) => {
            let questions = [];
            querySnapshot.forEach((doc) => {
                questions.push({ id: doc.id, ...doc.data() });
            });
            return questions;
        })
        .catch((error) => {
            console.error(`Error fetching questions for category ${category}: `, error);
            throw error;
        });
}

// Function to load questions based on selected category
async function loadQuestions() {
    const selectedCategory = categorySelect.value;

    let questions = [];

    if (selectedCategory === 'newCategory') {
        // Fetch all questions
        questions = await getAllQuestions();
    } else {
        // Fetch questions by category
        questions = await getQuestionsByCategory(selectedCategory);
    }

    // Render questions
    renderQuestions(questions);
}

// Event listener for category dropdown change
categorySelect.addEventListener('change', () => {
    // Clear questions container
    questionsContainer.innerHTML = '';

    // Load questions based on selected category
    loadQuestions();
});

// Initial load
loadQuestions();