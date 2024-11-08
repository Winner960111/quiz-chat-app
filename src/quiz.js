let randomQuestion, questionCount = 0, maxQuestionCount = 5, correctQuestionCount = 0;
let selectedCategories = [];
let allQuestions = [];
let settings = {};
let answerSelected = false; // Flag to track if an answer has been selected
let displayedIndices = [];

document.addEventListener('DOMContentLoaded', async () => {
    settings = JSON.parse(localStorage.getItem('quizSettings')) || {
        difficulty: 'easy',
        timer: 60,
        numberOfQuestions: 10
    };

    maxQuestionCount = settings.numberOfQuestions || 5;
    selectedCategories = loadCategories();
    allQuestions = await loadAllQuestions();
    if (allQuestions.length < maxQuestionCount) { 
        alert(`Only ${allQuestions.length} questions available instead of ${maxQuestionCount} for the selected category and difficulty.`);
        maxQuestionCount = allQuestions.length;
    }

    if (selectedCategories.length > 0) {
        loadQuestions().catch(handleError);
    } else {
        redirectToMain();
    }

    const profilePic = document.getElementById('profile-pic');
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            profilePic.src = user.photoURL || './assets/profile-pic.png';
        } else {
            profilePic.src = './assets/profile-pic.png';
        }
    });
});

function loadCategories() {
    const storedCategories = localStorage.getItem('selectedCategories');
    if (storedCategories) {
        try {
            const categories = JSON.parse(storedCategories);
            return Array.isArray(categories) ? categories : [];
        } catch {
            console.error('Error parsing categories.');
            return [];
        }
    }
    console.warn('No categories found.');
    return [];
}

async function loadAllQuestions() {
    const questions = await getQuestionsBySelectedCategories(selectedCategories);
    console.log('Fetched Questions:', questions);

    const filteredQuestions = (Array.isArray(questions) && questions.length)
        ? questions.filter(q => {
            console.log('Question Difficulty:', q.difficulty);
            return q.difficulty === settings.difficulty;
        })
        : [];
    
    console.log('Filtered Questions:', filteredQuestions);

    if (filteredQuestions.length === 0) {
        alert('No questions available for the selected category and difficulty.');
        redirectToMain();
        throw new Error('No questions available');
    }

    return filteredQuestions;
}

async function loadQuestions() {
    if (questionCount >= maxQuestionCount) return finishedSummary();

    toggleDisplay('question-summary', 'block');
    enableQuestionButtons(true);
    resetAnswerClasses();

    if (allQuestions.length > 0) {
        updateQuestion(allQuestions);
        startTimer(settings.timer);
        answerSelected = false; // Reset the flag for the new question
        document.getElementById('question-summary').disabled = true; // Disable "Next Question" button initially
    } else {
        redirectToMain();
    }

    // hide loading screen
    const loadingScreen = document.getElementById('loading');
    loadingScreen.style.opacity = '0';
    loadingScreen.style.pointerEvents = 'none';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 1000);
}

function updateQuestion(questions) {
    if (displayedIndices.length === questions.length) {
        console.error('All questions have been displayed.');
        return;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * questions.length);
    } while (displayedIndices.includes(randomIndex));

    displayedIndices.push(randomIndex);
    const randomQuestion = questions[randomIndex];

    if (randomQuestion?.question && Array.isArray(randomQuestion.answers)) {
        document.getElementById('question').textContent = randomQuestion.question;
        randomQuestion.answers.forEach((answer, i) => document.getElementById('answer' + (i + 1)).textContent = answer);
        shuffleElements('question-container');
        document.getElementById('questions-count').textContent = `Quiz (${++questionCount}/${maxQuestionCount})`;
    } else {
        console.error('Invalid question format:', randomQuestion);
    }
}


function selectAnswer(index) {
    if (answerSelected) return; // Prevent selecting multiple answers

    pauseTimer();
    toggleDisplay('question-summary', 'block');
    enableQuestionButtons(false);

    answerSelected = true; // Set the flag when an answer is selected

    const isCorrect = index === 1; // Assuming answer 1 is correct
    if (isCorrect) correctQuestionCount++;
    document.getElementById('answer1').classList.add(isCorrect ? "correct-answer" : "correct-answer-highlight");
    if (!isCorrect) document.getElementById('answer' + index).classList.add("wrong-answer");

    document.getElementById('question-summary').disabled = false; // Enable "Next Question" button after an answer is selected
}

function nextQuestion() {
    if (!answerSelected) return;

    loadQuestions();
}

function skipQuestion() {
    answerSelected = false;
    loadQuestions();
}

function finishedSummary() {
    clearInterval(timerInterval);
    toggleDisplay("questions-quiz", 'none');
    toggleDisplay("finished-summary", 'block');
    const summary = document.getElementById("finished-summary");
    summary.querySelector("p").textContent = `You answered ${correctQuestionCount}/${maxQuestionCount} correctly!`;
    const percentage = (correctQuestionCount / maxQuestionCount * 100).toFixed(0);
    summary.querySelector(".percentage").textContent = `${percentage}%`;
}

function shuffleElements(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        Array.from(container.children)
            .sort(() => Math.random() - 0.5)
            .forEach(element => container.appendChild(element));
    } else {
        console.error(`Container with ID '${containerId}' not found.`);
    }
}

function toggleDisplay(elementId, displayStyle) {
    document.getElementById(elementId).style.display = displayStyle;
}

function enableQuestionButtons(enable) {
    document.getElementById('question-container').style.pointerEvents = enable ? "all" : "none";
}

function resetAnswerClasses() {
    for (let i = 1; i <= 4; i++) {
        const answerElement = document.getElementById('answer' + i);
        answerElement.classList.remove("correct-answer", "correct-answer-highlight", "wrong-answer");
    }
}

function getAllQuestions() {
    return db.collectionGroup("questions").get()
        .then(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        .catch(handleError);
}

function getQuestionsBySelectedCategories(categories) {
    const promises = categories.map(category => db.collection(`questions/${category}/questions`).get());
    return Promise.all(promises)
        .then(results => results.flatMap(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))))
        .catch(handleError);
}

function handleError(error) {
    console.error('Error:', error);
    redirectToMain();
}

function startTimer(duration) {
    const timerNumber = document.getElementById('timer-number');
    let time = duration;
    timerNumber.textContent = time;
    timerInterval = setInterval(() => {
        time--;
        timerNumber.textContent = time;
        if (time <= 0) {
            clearInterval(timerInterval);
            nextQuestion(); // Move to the next question when the timer ends
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function initialize() {
    questionCount = 0;
    correctQuestionCount = 0;
    toggleDisplay('questions-quiz', 'block');
    toggleDisplay('finished-summary', 'none');
    loadAllQuestions().then(loadQuestions).catch(handleError); // Reload questions for a new quiz
    displayedIndices = [];
}

function redirectToMain() {
    window.location.href = 'index.html';
}

function openAdminPage() {
    window.location.href = 'admin/index.html';
}

// Handle user logout
const handleUserLogout = () => {
    firebase.auth().signOut()
        .then(() => redirectToMain())
        .catch((error) => console.error('Error signing out:', error));
};