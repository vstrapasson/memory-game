/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function showModal() {
  document.querySelector('.modal').classList.remove('hidden');
  document.querySelector('body').classList.add('showing-modal');

  document.querySelector('.button.reset').focus()
}

function hiddeModal() {
  document.querySelector('.modal').classList.add('hidden');
  document.querySelector('body').classList.remove('showing-modal');
}

const MemoryGame = function () {
  this.matchedCards = 0;
  this.moves = 0;
  this.score = 3;
  this.iconNames = [
    'fa-baseball-ball',
    'fa-beer',
    'fa-bomb',
    'fa-bug',
    'fa-coffee',
    'fa-fire',
    'fa-gamepad',
    'fa-rocket'
  ];
  this.lastOpenedCard = null;
  this.timer = 0;
  this.starsDOM = document.querySelectorAll('.fa-star');
}

MemoryGame.prototype.createCards = function () {
  const cardsNames = this.iconNames.concat(this.iconNames);
  const shuffledCards = shuffle(cardsNames);

  const cardsDOM = document.querySelectorAll('.card');
  cardsDOM.forEach(function (card, index) {
    const cardName = shuffledCards[index];
    const frontFaceIcon = card.querySelector('.front i');

    card.setAttribute('name', cardName);
    frontFaceIcon.classList.add(cardName);
  });
};

MemoryGame.prototype.startTimer = function () {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.timer++;
      const element = document.getElementById('timer');
      element.innerHTML = this.timer;
    }, 1000);
};

MemoryGame.prototype.stopTimer = function () {
    clearInterval(this.intervalId);
};

MemoryGame.prototype.start = function () {
  this.timer = 0;
  this.moves = 0;
  this.matchedCards = 0;
  this.score = 3;
  this.lastOpenedCard = null;

  this.createCards();
  this.startTimer();
}

MemoryGame.prototype.handleCardClick = function (event) {
  let card = event.target.parentNode;

  if(card.classList.contains('active')){
    return;
  }

  card.classList.toggle('active');
  this.handleCardMatch(card);
};

MemoryGame.prototype.increasesMoves = function () {
  this.moves++;
  document.getElementById('moves').innerHTML = this.moves;

  if (this.moves > 12 && this.moves < 24) {
    this.starsDOM[2].classList.remove('fas');
    this.starsDOM[2].classList.add('far');
    this.score = 2;
  }

  if (this.moves > 24) {
    this.starsDOM[1].classList.remove('fas');
    this.starsDOM[1].classList.add('far');
    this.score = 1;
  }
};

MemoryGame.prototype.handleCardMatch = function (cardDOM) {
  if(this.lastOpenedCard === null) {
    this.lastOpenedCard = cardDOM;
    return;
  }

  this.increasesMoves();

  if(this.lastOpenedCard.getAttribute('name') !== cardDOM.getAttribute('name')) {
    setTimeout(
      this.handleNoMatche.bind(this, this.lastOpenedCard, cardDOM)
    , 700);
    this.lastOpenedCard = null;
    return;
  }

  this.lastOpenedCard.classList.add('matched', 'tada');
  cardDOM.classList.add('matched', 'tada');

  this.matchedCards++;
  this.lastOpenedCard = null;

  if (this.matchedCards === 8) {
      this.gameWin();
  }
};

MemoryGame.prototype.handleNoMatche = function (firstCardDOM, secondCardDOM) {
  firstCardDOM.classList.toggle('active');
  secondCardDOM.classList.toggle('active');
};

MemoryGame.prototype.gameWin = function () {
    this.stopTimer();

    const winMessage = 'With ' + this.moves + ' moves, ' + this.score + ' stars and ' + this.timer + 'seconds!';
    document.querySelector('#win-message').innerHTML = winMessage;

    showModal();
};

MemoryGame.prototype.restart = function () {
  document.querySelector('#cards').querySelectorAll('[class^=fa]').forEach(function (element) {
      element.className = 'fas';
  });

  document.querySelector('.stars').querySelectorAll('.far').forEach(function (element) {
    element.classList.remove('far');
    element.classList.add('fas');
  })

  document.querySelectorAll('.active').forEach(function (element) {
      element.classList.remove('active');
      element.classList.remove('matched');
      element.classList.remove('tada');
  });

  this.start();

  document.getElementById('moves').innerHTML = this.moves;

  hiddeModal();
}

const Game = new MemoryGame();
Game.start();

const cards = document.querySelectorAll('.card');
cards.forEach(function (element, index) {
  element.addEventListener('click', function (e) {
      Game.handleCardClick(e);
  });
});

document.querySelectorAll('.reset').forEach(function (el) {
    el.addEventListener('click', function (e) {
       Game.restart();
    })
})
