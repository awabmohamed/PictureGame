// Array to store the pictures
var picturesArray = [
    'images/1.gif',
    'images/2.gif',
    'images/3.gif',
    'images/4.gif',
    'images/5.gif',
    'images/6.gif',
    'images/7.gif',
    'images/8.gif',
    'images/9.jpg',
    'images/10.png',
    'images/11.png',
    'images/12.jpg'
  ];
  
  var selectedLevel = 0; // Selected difficulty level
  var gameCards = []; // Array to store game cards
  var firstCard = null; // First card flipped
  var secondCard = null; // Second card flipped
  var numPairs = 0; // Number of pairs
  var matches = 0; // Number of matches
  var gameStarted = false; // Flag to indicate if the game has started
  var timerId = null; // Timer ID
  var timerSeconds = 0; // Timer seconds
  var memorizeDuration = 0; // Duration to memorize the pictures
  
  // Shuffle the pictures array
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  
  // Create game cards and assign pictures
  function createGameCards(numPairs) {
    gameCards = [];
    var shuffledPictures = shuffleArray(picturesArray.slice(0, numPairs));
    var cards = shuffledPictures.concat(shuffledPictures);
  
    // Create card elements
    for (var i = 0; i < cards.length; i++) {
      var card = document.createElement('div');
      card.classList.add('game-card');
      card.dataset.picture = cards[i];
      card.addEventListener('click', flipCard);
      gameCards.push(card);
    }
  
    // Shuffle the game cards
    shuffleArray(gameCards);
  
    // Display game cards
    var gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    for (var i = 0; i < gameCards.length; i++) {
      gameBoard.appendChild(gameCards[i]);
    }
  
    // Hide the pictures after the memorization duration
    setTimeout(hidePictures, memorizeDuration * 1000);
  }
  
  // Hide the pictures
function hidePictures() {
    for (var i = 0; i < gameCards.length; i++) {
      var card = gameCards[i];
      card.style.backgroundColor = '#ccc';
      card.style.backgroundImage = 'none';
      card.removeEventListener('click', flipCard);
    }
  
    setTimeout(function() {
      for (var i = 0; i < gameCards.length; i++) {
        var card = gameCards[i];
        card.style.backgroundColor = 'white';
        card.style.backgroundImage = 'url(' + card.dataset.picture + ')';
        card.addEventListener('click', flipCard);
      }
      startTimer();
      setTimeout(hidePicturesAfterDelay, memorizeDuration * 1000); // Hide the pictures after the memorize duration
    }, memorizeDuration * 10);
  }
  
  // Hide the pictures after the delay
  function hidePicturesAfterDelay() {
    for (var i = 0; i < gameCards.length; i++) {
      var card = gameCards[i];
      card.style.backgroundColor = '#ccc';
      card.style.backgroundImage = 'none';
      card.addEventListener('click', flipCard);
    }
  }
  
  
  // Flip the card
  function flipCard() {
    if (!gameStarted) return;
  
    var card = this;
    if (card === firstCard) return;
  
    card.style.backgroundColor = 'white';
    card.style.backgroundImage = 'url(' + card.dataset.picture + ')';
    card.removeEventListener('click', flipCard);
  
    if (firstCard === null) {
      firstCard = card;
    } else if (secondCard === null) {
      secondCard = card;
      checkForMatch();
    }
  }
  
  // Check if the flipped cards match
  function checkForMatch() {
    var picture1 = firstCard.dataset.picture;
    var picture2 = secondCard.dataset.picture;
  
    if (picture1 === picture2) {
      matches++;
      if (matches === numPairs) {
        gameFinished(true);
      }
      firstCard = null;
      secondCard = null;
    } else {
      setTimeout(function() {
        firstCard.style.backgroundColor = '#ccc';
        secondCard.style.backgroundColor = '#ccc';
        firstCard.style.backgroundImage = 'none';
        secondCard.style.backgroundImage = 'none';
        firstCard.addEventListener('click', flipCard);
        secondCard.addEventListener('click', flipCard);
        firstCard = null;
        secondCard = null;
      }, 1000);
    }
  }
  
  // Start the game
  function startGame() {
    var levelRadios = document.getElementsByName('level');
    for (var i = 0; i < levelRadios.length; i++) {
      if (levelRadios[i].checked) {
        selectedLevel = parseInt(levelRadios[i].value);
        break;
      }
    }
  
    if (selectedLevel === 0) {
      alert('Please select a difficulty level.');
      return;
    }
  
    numPairs = selectedLevel;
    matches = 0;
    gameStarted = true;
    clearInterval(timerId);
    memorizeDuration = (numPairs === 8 ? 3 : (numPairs === 10 ? 5 : 8));
    timerSeconds = (numPairs === 8 ? 120 : (numPairs === 10 ? 150 : 180));
    createGameCards(numPairs);
  }
  
  // Start the timer
function startTimer() {
    var timerValue = document.getElementById('timerValue');
    timerValue.textContent = timerSeconds;
  
    var timerLabel = document.getElementById('timerLabel');
    timerLabel.textContent = 'Time Remaining: ';
  
    timerId = setInterval(function() {
      timerSeconds--;
      timerValue.textContent = timerSeconds;
  
      if (timerSeconds === 0) {
        clearInterval(timerId);
        gameFinished(false);
      }
    }, 1000);
  }
  
  
  // Format time as seconds
  function formatTime(seconds) {
    return seconds.toString();
  }
  
  // Finish the game
  function gameFinished(won) {
    gameStarted = false;
    clearInterval(timerId);
  
    var gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
  
    var message = won ? 'Congratulations! You won the game.' : 'Time is up. You lost the game.';
    var resultElement = document.createElement('p');
    resultElement.textContent = message;
    gameBoard.appendChild(resultElement);
  
    var restartButton = document.createElement('button');
    restartButton.textContent = 'Play Again';
    restartButton.addEventListener('click', startGame);
    gameBoard.appendChild(restartButton);
  }
  
  // Attach event listener to the Start Game button
  document.getElementById('startBtn').addEventListener('click', startGame);
  