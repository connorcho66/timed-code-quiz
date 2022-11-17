var timeLeft = 90;
var startButton = document.getElementById("starting-button");
var startingBlock = document.getElementById("starting-block");
var timeEl = document.getElementById("time-count");
var timeClock;
var nextButton = document.getElementById("next-button");
var qContainer = document.getElementById("question-block");
var randomQ, currentQ;
var questionEl = document.getElementById("question");
var answerEl = document.getElementById("answers");
var verifyEl = document.getElementById("verify");
var scoreBoard = document.getElementById("submit-form");
var scoreCont = document.getElementById("score-container");
var userScore = JSON.parse(localStorage.getItem("scores")) || [];
var count = 0;
var scoreLink = document.getElementById("hs-link");
var submitBtn = document.getElementById("submit-button");
var restartButton = document.getElementById("restart-button");
var resetScore = document.getElementById("clear-score");

var questions = [
    {
        question: "Inside which HTML element do we put the JavaScript?",
        answers: [
            {text: "1. <javascript>", result: false },
            {text: "2. <js>", result: false},
            {text: "3. <script>", result: true},
            {text: "4. <scripting>", result: false},
        ],
    },
    {
        question: 'What is the correct syntax for referring to an external script called "xxx.js"?',
        answers: [
            {text: '1. <script src="xxx.js">', result: true},
            {text: '2. <script name="xxx.js">', result: false},
            {text: '3. <script href="xxx.js">', result: false},
            {text: '4. <script value="xxx.js">', result: false},
        ],
    },
    {
        question: 'How do you write "Hello World" in an alert box?',
        answers: [
            {text: '1. alertBox("Hello World")', result: false},
            {text: '2. alertBox="Hello World"', result: false},
            {text: '3. msgBox("Hello World")', result: false},
            {text: '4. alert("Hello World")', result: true},
        ],
    },
    {
        question: 'How do you create a function?',
        answers: [
            {text: '1. function:myFunction()', result: false},
            {text: '2. function myFunction()', result: true},
            {text: '3. function=myFunction()', result: false},
            {text: '4. myFunction():function', result: false},
        ],
    },
    {
        question: 'How do you call a function named "myFunction"?',
        answers: [
            {text: '1. call myFunction()', result: false},
            {text: '2. myFunction()', result: true},
            {text: '3. call function myFunction', result: false},
            {text: '4. Call.myFunction()', result: false},
        ],
    },
    {
        question: 'How do you write a conditional statement for executing some statements only if "i" is equal to 5?',
        answers: [
            {text: '1. if (i==5)', result: true},
            {text: '2. if i==5 then', result: false},
            {text: '3. if i=5 then', result: false},
            {text: '4. if i=5', result: false},
        ],
    }
]



startButton.addEventListener("click", gameStart);
nextButton.addEventListener("click", () => {
    currentQ++;
    nextQuestion();
})
// Timer for game
function timer() {
    timeLeft--;
    timeEl.textContent = "Time: " + timeLeft;
    if (timeLeft === 1 ) {
        scoreSaved();
    }
}

// Start Game
function gameStart() {
    startingBlock.classList.add("hidden");
    timeClock = setInterval(timer, 1000);
    randomQ = questions.sort(() => Math.random() - 0.5);
    currentQ = 0
    qContainer.classList.remove("hidden");
    timer();
    nextQuestion();
}

// move to next question
function nextQuestion() {
    reset();
    displayQuestion(randomQ[currentQ]);
    verifyEl.classList.add("hidden");
}


// Displays question
function displayQuestion(question) {
    questionEl.innerHTML = question.question;
    question.answers.forEach(answer => {
        var button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        if (answer.result) {
            button.dataset.result = answer.result;
        }
        button.addEventListener("click", selectAnswer);
        answerEl.appendChild(button);
    });
}

// Reset State
function reset() {
    nextButton.classList.add("hidden");
    while (answerEl.firstChild) {
        answerEl.removeChild(answerEl.firstChild);
    }
}

// Select answer
function selectAnswer(e) {
    var selected = e.target;
    var result = selected.dataset.result;
    verifyEl.classList.remove("hidden");
    if (result) {
        verifyEl.innerHTML = "Correct!";
    } else {
        verifyEl.innerHTML = "Wrong!";
        if (timeLeft <= 10) {
            timeLeft = 0;
        } else {
            timeLeft -= 10;
        }
    }

    Array.from(answerEl.children).forEach(button => {
        answerStatus(button, button.dataset.result);
    });

    if (randomQ.length > currentQ + 1) {
        nextButton.classList.remove("hidden");
        verifyEl.classList.remove("hidden");
    } else {
        startButton.classList.remove("hidden");
        scoreSaved();
    }
}

// Shows result of answer
function answerStatus(e, result){
    clear(e);
    if(result) {
        e.classList.add("right");
    } else {
        e.classList.add("wrong");
    }
}


// Removes all class in answer
function clear(e) {
    e.classList.remove("right");
    e.classList.remove("wrong");
}

function scoreSaved() {
    clearInterval(timeClock);
    timeEl.textContent = "Time: " + timeLeft;
    questionEl.classList.add("hidden");
    qContainer.classList.add("hidden");
    scoreBoard.classList.remove("hidden");
    document.getElementById("user-score").textContent = "Your final score is " + timeLeft + ".";
}

function showScore(initial) {
    scoreCont.classList.remove("hidden");
    scoreBoard.classList.add("hidden");
    startingBlock.classList.add("hidden");
    qContainer.classList.add("hidden");

    if (typeof initial == "string") {
        var score = {
            initial,
            timeLeft,
        };
        userScore.push(score);
    }

    var scoreEl = document.getElementById("highscore");
    scoreEl.innerHTML = "";

    for (i = 0; i < userScore.length; i++ ) {
        var display = document.createElement("div");
        display.setAttribute("class", "initial");
        display.innerText = count + ". " + userScore[i].initial + " - " + userScore[i].timeLeft;
        scoreEl.appendChild(display);

        click();
    }

    localStorage.setItem("scores", JSON.stringify(userScore));

}


function click() {
    count += 1;
}
click();

scoreLink.addEventListener("click", showScore);

submitBtn.addEventListener("click", function(event) {
    event.preventDefault();
    var initial = document.getElementById("user-initial").value;
    showScore(initial);
    click();
});

restartButton.addEventListener("click", function() {
    window.location.reload();
})

resetScore.addEventListener("click", function() {
    localStorage.clear()
    document.getElementById("highscore").innerHTML = "";
})