function editQuestion(question) {
    createQuestionTab();
    document.getElementById("create-question-header").innerHTML = "Edit Question";
    document.getElementById("create-question-button").innerHTML = "Modify Question";
    
    // Load options
    document.getElementById('question-id').value = question.id;
    document.getElementById('question').value = question.question;
    document.getElementById('answer1').value = question.answers[0];
    document.getElementById('answer2').value = question.answers[1];
    document.getElementById('answer3').value = question.answers[2];
    document.getElementById('answer4').value = question.answers[3];
    document.getElementById('category').value = question.category;
    document.getElementById('difficulty').value = question.difficulty;
}

// Function to delete a question
function deleteQuestion(question) {
    // Show confirmation popup
    const isConfirmed = confirm(`Are you sure you want to delete the question: ${question.name}?`);

    if (isConfirmed) {
        // Delete from Firestore
        const category = question.category;
        const questionId = question.id;
        db.collection(`questions/${category}/questions`).doc(questionId).delete()
            .then(() => {
                console.log(`Question ${questionId} successfully deleted!`);
                // Reload questions after deletion
                loadQuestions();
            })
            .catch((error) => {
                console.error("Error removing question: ", error);
            });
    }
}

function deleteCategory() {
    // Confirmation dialog to notify the user about the deletion process
    if (!confirm('Deleting category and associated questions. This action cannot be undone. Are you sure you want to proceed?')) {
        return;
    }

    // Get the selected category from the dropdown
    const selectElement = document.getElementById('category-select');
    const selectedCategory = selectElement.value;

    if (selectedCategory === 'newCategory') {
        alert('Please select a category to delete.');
        return;
    }

    // Delete documents in 'questions/{category}' collection
    const questionsRef = db.collection(`questions/${selectedCategory}/questions`);
    questionsRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            doc.ref.delete().then(() => {
                console.log(`Document ${doc.id} successfully deleted from questions/${selectedCategory}`);
            }).catch((error) => {
                console.error(`Error removing document: `, error);
            });
        });

        // Delete the category from 'category' collection
        const categoryRef = db.collection('category').doc(selectedCategory);
        categoryRef.delete().then(() => {
            console.log(`Category "${selectedCategory}" successfully deleted from category collection.`);
            alert(`Category "${selectedCategory}" deleted successfully.`);
        }).catch((error) => {
            console.error(`Error deleting category: `, error);
            alert(`Error deleting category "${selectedCategory}": ${error.message}`);
        });
    }).catch((error) => {
        console.error(`Error retrieving documents: `, error);
        alert(`Error retrieving documents for deletion: ${error.message}`);
    });

    loadCategories('category-select');
    loadQuestions();
}