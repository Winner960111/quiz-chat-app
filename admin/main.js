loadCategories('category');
loadCategories('category-select');

document.getElementById('category').addEventListener('change', function () {
    const addCategorySection = document.getElementById('add-category');

    if (this.value === 'newCategory') {
        addCategorySection.style.display = 'flex';
    } else {
        addCategorySection.style.display = 'none';
    }
});

function createQuestionTab() {
    document.getElementById("create-question-form").style.display = "block";
    document.getElementById("csv-file-content").style.display = "none";
    document.getElementById('fileInput').value = null;


    const createButton = document.getElementById("create-question-tab-button");
    const editButton = document.getElementById("edit-question-tab-button");

    createButton.classList.add("selected-tab");
    editButton.classList.remove("selected-tab");

    const createPage = document.getElementById("create-question");
    const editPage = document.getElementById("edit-questions");

    createPage.style.display = "block";
    editPage.style.display = "none";

    document.getElementById("create-question-header").innerHTML = "Create Question";
    document.getElementById("create-question-button").innerHTML = "Add Question";

    // Reset options
    document.getElementById('question-id').value = ""
    document.getElementById('question').value = "";
    document.getElementById('answer1').value = "";
    document.getElementById('answer2').value = "";
    document.getElementById('answer3').value = "";
    document.getElementById('answer4').value = "";
}

function editQuestionsTab() {
    const createButton = document.getElementById("create-question-tab-button");
    const editButton = document.getElementById("edit-question-tab-button");

    createButton.classList.remove("selected-tab");
    editButton.classList.add("selected-tab");

    const createPage = document.getElementById("create-question");
    const editPage = document.getElementById("edit-questions");

    createPage.style.display = "none";
    editPage.style.display = "block";

    loadCategories('category-select', true);
    loadQuestions();
}




const maxQuestionCount = 10000; // Update if you need more question
let csvQuestions;

document.getElementById('fileInput').addEventListener('change', async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById("csv-file-content").style.display = "block";
    document.getElementById("create-question-form").style.display = "none";

    const reader = new FileReader();
    reader.onload = async function (e) {
        const csvData = e.target.result;
        const results = await new Promise((resolve) => {
            Papa.parse(csvData, {
                header: true,
                complete: (parsedResult) => resolve(parsedResult.data)
            });
        });

        if (document.getElementById("use-ai").checked) {
            for (let i = 0; i < Math.min(results.length, maxQuestionCount); i++) {
                document.getElementById("csv-file-content-container").innerHTML = `Loading...<br>AI generation (${i + 1}/${maxQuestionCount})`;
                try {
                    const response = await generateAiAnswer(results[i].question, results[i].answer1);
                    const responseJson = JSON.parse(response);
                    Object.assign(results[i], responseJson);
                } catch (error) {
                    console.error('Error:', error);
                    alert("Something went wrong with the generation! Please try again!");
                    document.getElementById("csv-file-content").style.display = "none";
                    document.getElementById("create-question-form").style.display = "block";
                    return;
                }
            }
        }

        csvQuestions = results.slice(0, maxQuestionCount).map(item => ({
            question: item.question,
            answers: [item.answer1, item.answer2, item.answer3, item.answer4],
            category: item.category,
            difficulty: item.difficulty
        }));

        const container = document.getElementById('csv-file-content-container');
        container.innerHTML = '';

        const template = document.getElementById('csv-question-template');

        csvQuestions.forEach((data, i) => {
            const clone = template.content.cloneNode(true);
            clone.querySelector('.question-text').textContent = data.question;

            const answersList = clone.querySelector('.answers-list');
            data.answers.forEach(answer => {
                const li = document.createElement('li');
                li.textContent = answer;
                answersList.appendChild(li);
            });

            clone.querySelector('.question-category').textContent = data.category;
            clone.querySelector('.question-difficulty').textContent = data.difficulty;
            container.appendChild(clone);
        });
    };
    reader.readAsText(file);
});

function addCsvQuestionsToFirebase() {
    function generateRandomId(length = 8) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    }

    function checkCategoryExists(category) {
        const formattedCategory = category.toLowerCase().replace(/\s+/g, '-');
        return db.collection("category").doc(formattedCategory).get().then(doc => doc.exists);
    }

    csvQuestions.forEach((data, index) => {
        const formattedCategory = data.category.toLowerCase().replace(/\s+/g, '-');
        const randomId = generateRandomId(30);

        checkCategoryExists(data.category).then(exists => {
            if (!exists) {
                db.collection("category").doc(formattedCategory).set({ name: data.category }).then(() => {
                    console.log(`New category "${data.category}" added to themes`);
                }).catch(console.error);
            }

            db.collection("questions").doc(`${formattedCategory}/questions/${randomId}`).set(data)
                .then(() => console.log(`Question ${index + 1} added successfully!`))
                .catch(console.error);
        }).catch(console.error);
    });

    alert('Questions added successfully!');
    createQuestionTab();
}