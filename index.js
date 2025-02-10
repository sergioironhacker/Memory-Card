const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let matchedPairs = 0;

document.querySelector(".score").textContent = score;

// Crear un mensaje de victoria estilizado
const winMessage = document.createElement("div");
winMessage.classList.add("win-message");
winMessage.textContent = "You Win!";
winMessage.style.display = "none";
winMessage.style.position = "fixed";
winMessage.style.top = "50%";
winMessage.style.left = "50%";
winMessage.style.transform = "translate(-50%, -50%)";
winMessage.style.fontSize = "4rem";
winMessage.style.fontWeight = "bold";
winMessage.style.color = "white";
winMessage.style.background = "rgba(0, 0, 0, 0.8)";
winMessage.style.padding = "20px 40px";
winMessage.style.borderRadius = "10px";
winMessage.style.textAlign = "center";
winMessage.style.boxShadow = "0 0 15px rgba(255, 255, 255, 0.8)";
document.body.appendChild(winMessage);

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    score++; // Solo aumenta si es un acierto
    matchedPairs++;
    document.querySelector(".score").textContent = score;
    disableCards();
    checkWin();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function checkWin() {
  if (matchedPairs === cards.length / 2) {
    setTimeout(() => {
      winMessage.style.display = "block";
      winMessage.classList.add("show-win");
    }, 500);
  }
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  matchedPairs = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  winMessage.style.display = "none";
  generateCards();
}
