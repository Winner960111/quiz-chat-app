const defaultAiPrompt = "You are part of a quiz app. Rewrite the question and the correct answer, make the answer shorter if its too long! Generate 3 not valid answers for the question! Answer1 MUST BE the correct answer! Use simple and easy language!";

window.onload = function() {
    document.getElementById('ai-prompt').value = defaultAiPrompt;
}

async function generateResponse(userPrompt) {
    if (!apiKey) {
        alert("No api key!");
        return;
    }

    //const userPrompt = 'Say "Im here"!';
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
    };

    // Directly include the current user message in the request body
    const requestBody = {
        messages: [{ role: "user", content: userPrompt }],
        model: "gpt-3.5-turbo",
        temperature: 1.2,
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
    };

    try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();

        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            let message = data.choices[0].message.content;
            return message;
        }
    } catch (error) {
        console.error('Error:', error);

        alert('There was an error during generation. Please try again!');
    }
}



async function generateAiAnswer(question, answer)
{
    const userPromptTextfield = document.querySelector('textarea');
    
    const userPrompt = `${userPromptTextfield} Question: "${question}", Correct answer: "${answer}". Your answer MUST BE a json: {question: "...", answer1: "...", answer2: "...", answer3: "...", answer4: "..."}`;
    const response = await generateResponse(userPrompt);
    console.log(response);
    return response;
}

async function generateAiAnswerForm()
{
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer1').value;
    const response = await generateAiAnswer(question, answer);
    const responseJson = JSON.parse(response);
    try {
        document.getElementById('question').value = responseJson.question;
        document.getElementById('answer1').value = responseJson.answer1;
        document.getElementById('answer2').value = responseJson.answer2;
        document.getElementById('answer3').value = responseJson.answer3;
        document.getElementById('answer4').value = responseJson.answer4;
    } catch (error) {
        console.error('Error:', error);
    }
}