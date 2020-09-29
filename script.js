
var questionArea = document.querySelector('#questionArea');
var answerRow = document.querySelector('#answerRow');
var answerResult = document.querySelector('#answerResult');


var createAnswersDiv = document.createElement('div');

var startQuizBtn = document.querySelector('#start');
var nextQuestionBtn = document.querySelector('#next');

var numberCorrect = 0;
var numberWrong = 0;
var scores = [];

// Timer setup
var quizTimerLength = 45;
var timerElement = document.querySelector('.timer');
timerElement.innerHTML = `<span>${quizTimerLength} </span>`;

function startTimer() {
  var countdownTimer = setInterval(function () {
    if (quizTimerLength <= 0) {
      clearInterval(countdownTimer);
    }
    timerElement.innerHTML = `<span>${quizTimerLength} </span>`;
    quizTimerLength -= 1;
  }, 1000);
}

function displayTimer(element, seconds) {
  // Reset Opacity on element
  element.style = 'opacity: 1;';

  var displayLength = seconds;
  var countdownTimer = setInterval(function () {
    if (displayLength <= 0) {
      element.style = 'opacity: 0;';
      clearInterval(countdownTimer);
    }
    displayLength -= 1;
  }, 1000);
}

function reload(){
  location.reload()
}

function leaderBoard() {
  // Grab container and clear
  var container = document.querySelector('.container');
  container.innerHTML = '';

  var highscores = document.querySelector('.viewLeaderboard');
  highscores.innerHTML = '';
  
  // If there are scores in localStorage read them into scores
  readFromLocalStorage();

  // Create leaderboard title
  var title = document.createElement('h1');
  title.classList.add('my-3');
  title.innerText = 'Leaderboard';
  container.appendChild(title);
  var list = document.createElement('ol');
  list.style = 'width: 10rem; margin: 0 auto; text-align: left;';


  var returnButton = document.createElement('a')
  returnButton.innerText = 'Return to Main';
  highscores.appendChild(returnButton);

  returnButton.addEventListener('click', reload);


  var score = {
    name: 'Patrick',
    score: 999,
  };

  scores.push(score);
  console.log(scores);
  var sortedScores = scores.sort(function (a, b) {
    console.log(a.score, b.score);
    return b.score - a.score;
  });
  sortedScores.forEach((scoreEntry) => (list.innerHTML += `<li>${scoreEntry.name} - ${scoreEntry.score}</li>`));

  container.appendChild(list);
  saveToLocalStorage(sortedScores);
}

function readFromLocalStorage() {
  console.info('Retrieveing from local storage');
  var localStoreScores = JSON.parse(localStorage.getItem('scores'));
  console.log(Array.isArray(localStoreScores));
  if (localStoreScores) {
    scores.push(...localStoreScores);
  }
}

function saveToLocalStorage(scoresArray) {
  console.info('Saving scores to local storage');
  localStorage.setItem('scores', JSON.stringify(scoresArray));
}

// Questions for Quiz
var questions = [
  {
    text: 'Inside which HTML element do we put the JavaScript? _______',
    answers: [
      { text: '1.  <javascript>', value: false },
      { text: '2.  <script>', value: true },
      { text: '3.  <js>', value: false },
      { text: '4.  <scripting>', value: false },
    ],
  },
  {
    text: 'Where is the correct place to insert a JavaScript? _______',
    answers: [
      { text: '1.  The <head> section', value: false },
      { text: '2.  The <body> section', value: true },
      { text: '3.  Bot the <head> and the <body> section', value: false },
    ],
  },
  {
    text: 'What is the correct syntax for referring to an external script called "xxx.js"? _______',
    answers: [
      { text: '1.  <script src="xxx.js">', value: true },
      { text: '2.  <script href="xxx.js">', value: false },
      { text: '3.  <script name="xxx.js">', value: false },
    ],
  },
  {
    text: 'How do you write "Hello World" in an alert box? _______',
    answers: [
      { text: '1.  alertBox("Hello World")', value: false },
      { text: '2.  msg("Hello World")', value: false },
      { text: '3.  alert("Hello World")', value: true },
      { text: '4.  msgBox("Hello World")', value: false },
    ],
  },
];

var questionNum = 0;
var quizLength = questions.length - 1;

function checkAnswers(e) {
  // Grab Response
  var selectedAnswerButton = e.target;

  if (selectedAnswerButton.value === 'true') {
    // Add/Remove Classes
    answerResult.classList.remove('hide');
    answerResult.classList.add('h4');

    nextQuestionBtn.classList.remove('hide');

    // Button Styles
    nextQuestionBtn.style.margin = '-40px';

    // Increment numberCorrect
    numberCorrect += 1;

    // Show selected answer result
    answerResult.innerText = 'Correct!';
    displayTimer(answerResult, 1);

    nextQuestion();
    getQuestion();
  } else {
    // Add/Remove Classes
    answerResult.classList.remove('hide');
    answerResult.classList.add('h4');

    // Increment numberWrong
    numberWrong += 1;
    console.log('numberWrong:', numberWrong)

    // subtract 10 seconds from quiz timer for wrong answer
    quizTimerLength -= 10;

    // Show selected answer result
    answerResult.innerText = 'Wrong! You Lose 10 seconds';
    displayTimer(answerResult, 1);
    nextQuestion();
    getQuestion();
  }
}

function getQuestion() {
  // check for Quiz Length
  if (questionNum <= quizLength) {
    // Set up Question Area w/ question
    questionArea.classList.add('h4', 'my-5');
    questionArea.innerText = questions[questionNum].text;

    // Add/Remove Classes
    nextQuestionBtn.classList.add('hide');

    // Set up Answers Area
    createAnswersDiv.setAttribute('id', 'answersArea');
    answerRow.appendChild(createAnswersDiv);
    var answerArea = document.getElementById('answersArea');

    // Populate Answer Area with Answers
    questions[questionNum].answers.forEach((answer) => {
      // Create button
      var answerButton = document.createElement('button');
      answerButton.innerText = answer.text;
      answerButton.value = answer.value;

      // Add Classes and Styles (pointer since Stephen likes it)
      answerButton.classList.add('btn-primary', 'px-5', 'py-1', 'my-2', 'btn-block');
      answerButton.style = 'cursor: pointer;';

      // Add button to the Answer Area
      answerArea.appendChild(answerButton);

      // Setup event listener for button
      answerButton.addEventListener('click', checkAnswers);
    });

    // Increment to next question
    questionNum += 1;
  }
}

function nextQuestion() {
  // Grab Answer Area
  var answerArea = document.getElementById('answersArea');

  // Remove previous answers
  answerArea.innerHTML = '';

  // Hide answer result
  // answerResult.classList.add('hide');

  // Get next question
  // getQuestion();
}

function startQuiz() {
  // Add/Remove classes
  startQuizBtn.classList.add('hide');
  questionArea.classList.remove('hide');
  var instructions = document.querySelector('.instructions');
  instructions.classList.add('hide');


  // Start Timer
  startTimer();

  // Get Question
  getQuestion();
}

// Event Listeners
startQuizBtn.addEventListener('click', startQuiz);

var viewLeaderBoardBtn = document.querySelector('.viewLeaderboard');
viewLeaderBoardBtn.addEventListener('click', leaderBoard);
