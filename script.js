// elements
var questionArea = document.querySelector('#questionArea');
var answerRow = document.querySelector('#answerRow');
var answerResult = document.querySelector('#answerResult');
var createAnswersDiv = document.createElement('div');
var startQuizBtn = document.querySelector('#start');
var timerElement = document.querySelector('.timer');
var viewLeaderBoardBtn = document.querySelector('.viewLeaderboard');

// variables
var numberCorrect = 0;
var scores = [];
var quizTimerLength = 45;
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
      { text: '3.  Both the <head> and the <body> section', value: false },
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
var quizLength = questions.length;

// Timer Section ---------------------------------------------------------
timerElement.innerHTML = `<span>${quizTimerLength} </span>`;

function startTimer() {
  var countdownTimer = setInterval(function () {
    if (quizTimerLength <= 0) {
      clearInterval(countdownTimer);
      enterNameIntoLeaderboard();
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
// End Timer Section -----------------------------------------------------

// Leaderboard Section ---------------------------------------------------
function leaderBoard() {
  // Grab container and clear
  var container = document.querySelector('.container');
  container.innerHTML = '';

  timerElement.style = 'display: none;';

  var highscores = document.querySelector('.viewLeaderboard');
  highscores.innerHTML = '';
  
  // Populate scores array from local storage
  readFromLocalStorage();

  // Create leaderboard title
  var title = document.createElement('h1');
  title.classList.add('my-3');
  title.innerText = 'Leaderboard';
  container.appendChild(title);

  // Create ordered list for highscores
  var list = document.createElement('ol');
  list.style = 'width: 10rem; margin: 0 auto; text-align: left;';

  // Sort scores
  if (scores) {
    var sortedScores = scores.sort(function (a, b) {
      return b.score - a.score;
    });
    sortedScores.forEach((scoreEntry) => (list.innerHTML += `<li>${scoreEntry.name} - ${scoreEntry.score}%</li>`));
  }

  // Add ordered list to page
  container.appendChild(list);

  // Add Return Button
  var returnButton = document.createElement('button');
  returnButton.innerText = 'Return to Main';
  returnButton.classList.add('mt-3', 'btn', 'btn-success');
  container.appendChild(returnButton);
  
  // Return To Main Page
  returnButton.addEventListener('click', function(){
    window.location.href ='index.html'
  })

  // Add Clear Scores Button
  var clearButton = document.createElement('button');
  clearButton.innerText = 'Clear Scores';
  clearButton.classList.add('mt-3', 'ml-3', 'btn', 'btn-danger');
  container.appendChild(clearButton);

  // Refresh Page
  clearButton.addEventListener('click', function(){
    localStorage.removeItem('scores');

    // Clear scores array
    scores.length = 0;
    
    // Call leaderboard function to refresh leaderboard
    leaderBoard();
  })
}
// End Leaderboard Section -----------------------------------------------

// Utility Functions Section ---------------------------------------------
function calcScore(correct, length) {
  return correct / length * 100; 
}

function buildScoreObj(name, score) {
  var obj = {}
  obj.name = name;
  obj.score = score;
  
  return obj;
}

function nextQuestion() {
  // Grab Answer Area
  var answerArea = document.getElementById('answersArea');

  // Remove previous answers
  answerArea.innerHTML = '';
}
// End Utility Functions Section -----------------------------------------

// Add Name To Leaderboard Section ---------------------------------------
function enterNameIntoLeaderboard() {
  // Grab container and clear
  var container = document.querySelector('.container');
  container.innerHTML = '';

  // Hide Timer Element
  timerElement.style = 'display: none;';
  
  var highscores = document.querySelector('.viewLeaderboard');
  highscores.innerHTML = '';
  
  // Populate scores array from local storage
  readFromLocalStorage();
  
  // Create leaderboard entry page
  var title = document.createElement('h1');
  title.classList.add('my-3');
  title.innerText = 'Enter Name for Leaderboard';
  container.appendChild(title);
  var scoreField = document.createElement('p');
  var score = calcScore(numberCorrect, quizLength).toFixed(2);
  scoreField.innerText = `Score : ${ score }%`;
  container.appendChild(scoreField);

  var nameInput = document.createElement('input');
  container.appendChild(nameInput);
  
  var submitNameBtn = document.createElement('button');
  submitNameBtn.classList.add('btn', 'btn-primary', 'ml-3', 'mb-1');
  submitNameBtn.innerText = 'Submit';
  container.appendChild(submitNameBtn);
  
  submitNameBtn.addEventListener('click', function() {

    var scoreTotal = buildScoreObj(nameInput.value, score);
    
    scores.push(scoreTotal);
    saveToLocalStorage(scores);
    leaderBoard();
  })
}
// End Add Name To Leaderboard Section -----------------------------------

// Local Storage Section -------------------------------------------------
function readFromLocalStorage() {
  // console.info('Retrieveing from local storage');
  var localStoreScores = JSON.parse(localStorage.getItem('scores'));
  
  if (localStoreScores) {
    scores.length = 0
    scores.push(...localStoreScores);
  }
}

function saveToLocalStorage(scoresArray) {
  // console.info('Saving scores to local storage');
  localStorage.setItem('scores', JSON.stringify(scoresArray));
}
// End Local Storage Section ---------------------------------------------

// Check Quiz Answers Section --------------------------------------------
function checkAnswers(e) {

  var selectedAnswerButton = e.target;

  if (selectedAnswerButton.value === 'true') {
    // Add/Remove Classes
    answerResult.classList.remove('hide');
    answerResult.classList.add('h4');

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

    // subtract 10 seconds from quiz timer for wrong answer
    quizTimerLength -= 10;

    // Show selected answer result
    answerResult.innerText = 'Wrong! You Lose 10 seconds';
    displayTimer(answerResult, 1);
    nextQuestion();
    getQuestion();
  }
}
// End Check Quiz Answers Section ----------------------------------------

// Populate Quiz Answers Section -----------------------------------------
function getQuestion() {
  // check for Quiz Length
  if (questionNum < quizLength) {
    // Set up Question Area w/ question
    questionArea.classList.add('h4', 'my-5');
    questionArea.innerText = questions[questionNum].text;

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

  } else {
    quizTimerLength = 0;
    enterNameIntoLeaderboard();
  }
}
// End Populate Quiz Answers Section -------------------------------------

// Start Quiz Answers Section --------------------------------------------
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
// End Quiz Answers Section ----------------------------------------------

// Event Listeners Section -----------------------------------------------
startQuizBtn.addEventListener('click', startQuiz);
viewLeaderBoardBtn.addEventListener('click', leaderBoard);
// End Event Listeners Section -------------------------------------------