const initialFrogs = [
  { color: "red", direction: "right", position: 0 },
  { color: "red", direction: "right", position: 1 },
  { color: "red", direction: "right", position: 2 },
  { color: "blue", direction: "left", position: 4 },
  { color: "blue", direction: "left", position: 5 },
  { color: "blue", direction: "left", position: 6 },
];

let frogs = JSON.parse(JSON.stringify(initialFrogs));
let moves = 0;
let time = 0;
let timerInterval = null;
let isGameWon = false;
let isGameStarted = false;
let isAnimating = false;
let animatingFrogIndex = null;
let animatingFromPosition = null;
let animatingToPosition = null;
let highScores = [];
let isInitialized = false;

const startScreen = document.getElementById("start-screen");
const winScreen = document.getElementById("win-screen");
const gameContainer = document.getElementById("game-container");
const stonesContainer = document.getElementById("stones-container");
const movesCounter = document.getElementById("moves-counter");
const timerElement = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const menuBtn = document.getElementById("menu-btn");
const winRestartBtn = document.getElementById("win-restart-btn");
const winMenuBtn = document.getElementById("win-menu-btn");
const winMovesEl = document.getElementById("win-moves");
const winTimeEl = document.getElementById("win-time");
const scoresListEl = document.getElementById("scores-list");
const croakSound = document.getElementById("croak-sound");

function checkScreenSize() {
  initializeGame();

  if (isGameWon && winScreen) {
    winScreen.classList.remove("hidden");
    if (startScreen) startScreen.classList.add("hidden");
    if (gameContainer) gameContainer.classList.add("hidden");
  } else if (isGameStarted && gameContainer) {
    gameContainer.classList.remove("hidden");
    if (startScreen) startScreen.classList.add("hidden");
    if (winScreen && !isGameWon) winScreen.classList.add("hidden");
    renderBoard();
    // Прокрутка к игровому полю на маленьких экранах
    setTimeout(() => {
      const gameBoard = document.querySelector('.game-board');
      if (gameBoard) {
        gameBoard.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }, 100);
  } else if (startScreen) {
    startScreen.classList.remove("hidden");
    if (gameContainer) gameContainer.classList.add("hidden");
    if (winScreen) winScreen.classList.add("hidden");
  }
}

function initializeGame() {
  if (isInitialized) return;

  loadHighScores();
  renderHighScores();
  setupEventListeners();
  isInitialized = true;
}

function init() {
  window.addEventListener("resize", checkScreenSize);
  checkScreenSize();
}

function setupEventListeners() {
  startBtn.addEventListener("click", handleStart);
  restartBtn.addEventListener("click", handleRestart);
  menuBtn.addEventListener("click", handleBackToMenu);
  winRestartBtn.addEventListener("click", handleRestart);
  winMenuBtn.addEventListener("click", handleBackToMenu);
}

function handleStart() {
  isGameStarted = true;
  startScreen.classList.add("hidden");
  if (gameContainer) {
    gameContainer.classList.remove("hidden");
  }
  if (winScreen) {
    winScreen.classList.add("hidden");
  }
  startTimer();
  renderBoard();
  // Прокрутка к игровому полю на маленьких экранах
  setTimeout(() => {
    const gameBoard = document.querySelector('.game-board');
    if (gameBoard) {
      gameBoard.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, 100);
}

function handleRestart() {
  frogs = JSON.parse(JSON.stringify(initialFrogs));
  moves = 0;
  time = 0;
  isGameWon = false;
  isAnimating = false;
  animatingFrogIndex = null;
  animatingFromPosition = null;
  animatingToPosition = null;

  winScreen.classList.add("hidden");
  updateStats();
  renderBoard();

  if (isGameStarted) {
    clearInterval(timerInterval);
    startTimer();
  }
}

function handleBackToMenu() {
  frogs = JSON.parse(JSON.stringify(initialFrogs));
  moves = 0;
  time = 0;
  isGameWon = false;
  isGameStarted = false;
  isAnimating = false;
  animatingFrogIndex = null;
  animatingFromPosition = null;
  animatingToPosition = null;

  clearInterval(timerInterval);
  winScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  updateStats();
  renderBoard();
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!isGameWon) {
      time++;
      updateStats();
    }
  }, 1000);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function updateStats() {
  movesCounter.textContent = moves;
  timerElement.textContent = formatTime(time);
}

function handleFrogClick(index) {
  if (isAnimating || isGameWon || !isGameStarted) return;

  const frog = frogs[index];
  let newPosition = null;

  if (frog.direction === "right") {
    // Check if can move 1 step right
    if (!frogs.some((f) => f.position === frog.position + 1)) {
      newPosition = frog.position + 1;
    }
    // Check if can jump 2 steps right
    else if (
      !frogs.some((f) => f.position === frog.position + 2) &&
      frog.position + 2 <= 6
    ) {
      newPosition = frog.position + 2;
    }
  } else {
    // Check if can move 1 step left
    if (!frogs.some((f) => f.position === frog.position - 1)) {
      newPosition = frog.position - 1;
    }
    // Check if can jump 2 steps left
    else if (
      !frogs.some((f) => f.position === frog.position - 2) &&
      frog.position - 2 >= 0
    ) {
      newPosition = frog.position - 2;
    }
  }

  if (newPosition !== null) {
    // Play sound
    if (croakSound) {
      croakSound.currentTime = 0;
      croakSound.play().catch(() => {});
    }

    // Start animation
    isAnimating = true;
    animatingFrogIndex = index;
    animatingFromPosition = frog.position;
    animatingToPosition = newPosition;

    // Calculate animation distance based on screen size
    const animationDistance = getAnimationDistance();
    const direction = newPosition > frog.position ? 1 : -1;
    const distance = Math.abs(newPosition - frog.position);

    // Animate the frog
    const frogElement = document.querySelector(`[data-frog-index="${index}"]`);
    if (frogElement) {
      frogElement.classList.add("animating");
      frogElement.style.transform = `translateX(${
        direction * distance * animationDistance
      }px) scale(1.1)`;
      frogElement.style.zIndex = "20";
    }

    renderBoard(); // Render to show target highlight

    // Complete animation after delay
    setTimeout(() => {
      frogs[index].position = newPosition;
      moves++;
      isAnimating = false;
      animatingFrogIndex = null;
      animatingFromPosition = null;
      animatingToPosition = null;

      updateStats();
      renderBoard();
      checkWinCondition();
    }, 300);
  }
}

function getAnimationDistance() {
  const width = window.innerWidth;
  if (width <= 300) return 8;
  if (width <= 320) return 10;
  if (width <= 360) return 12;
  if (width < 375) return 15;
  if (width < 480) return 20;
  if (width < 640) return 35;
  if (width < 768) return 50;
  if (width < 1024) return 70;
  return 115;
}

function checkWinCondition() {
  const redFrogs = frogs.filter((f) => f.color === "red");
  const blueFrogs = frogs.filter((f) => f.color === "blue");
  const noFrogInMiddle = !frogs.some((f) => f.position === 3);

  const isWon =
    redFrogs.every((f) => f.position > 3) &&
    blueFrogs.every((f) => f.position < 3) &&
    noFrogInMiddle;

  if (isWon && !isGameWon) {
    isGameWon = true;
    clearInterval(timerInterval);
    saveHighScore();
    showWinScreen();
  }
}

function showWinScreen() {
  winMovesEl.textContent = moves;
  winTimeEl.textContent = formatTime(time);
  winScreen.classList.remove("hidden");
}

function loadHighScores() {
  const saved = localStorage.getItem("highScores");
  highScores = saved ? JSON.parse(saved) : [];
}

function saveHighScore() {
  const newScore = {
    moves: moves,
    time: time,
    date: new Date().toLocaleString(),
  };

  highScores.push(newScore);
  highScores.sort((a, b) => a.moves - b.moves || a.time - b.time);
  highScores = highScores.slice(0, 10);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  renderHighScores();
}

function renderHighScores() {
  if (highScores.length === 0) {
    scoresListEl.innerHTML = '<p class="no-scores">Пока нет рекордов</p>';
    return;
  }

  scoresListEl.innerHTML = highScores
    .map((score, index) => {
      let rankClass = "";
      let rankEmoji = `${index + 1}.`;

      if (index === 0) {
        rankClass = "gold";
        rankEmoji = "🥇";
      } else if (index === 1) {
        rankClass = "silver";
        rankEmoji = "🥈";
      } else if (index === 2) {
        rankClass = "bronze";
        rankEmoji = "🥉";
      }

      return `
            <div class="score-item ${rankClass}">
                <div class="score-left">
                    <span class="score-rank">${rankEmoji}</span>
                    <div class="score-info">
                        <span class="score-moves">${score.moves} ходов</span>
                        <span class="score-time">${formatTime(
                          score.time
                        )}</span>
                    </div>
                </div>
                <span class="score-date">${score.date}</span>
            </div>
        `;
    })
    .join("");
}

function renderBoard() {
  stonesContainer.innerHTML = "";

  // Прокрутка к центру после рендера на маленьких экранах
  const isSmallScreen = window.innerWidth <= 360 || window.innerHeight <= 50;
  
  for (let i = 0; i < 7; i++) {
    const stone = document.createElement("div");
    stone.className = "stone";
    stone.dataset.position = i;

    stone.innerHTML = `
            <div class="stone-visual">
                <div class="stone-highlight"></div>
                <div class="stone-highlight-2"></div>
                <div class="stone-highlight-3"></div>
                <div class="stone-reflection"></div>
            </div>
        `;

    // Find frog at this position
    const frogIndex = frogs.findIndex((f) => f.position === i);
    const frog = frogIndex !== -1 ? frogs[frogIndex] : null;

    const isAnimatingFromHere =
      animatingFromPosition === i && animatingFrogIndex !== null;

    const isAnimatingToHere = animatingToPosition === i && !frog;

    const frogContainer = document.createElement("div");
    frogContainer.className = "frog-container";

    if (frog) {
      const frogEl = document.createElement("div");
      frogEl.className = `frog ${frog.color}`;
      frogEl.dataset.frogIndex = frogIndex;

      // If this frog is animating, apply animation styles
      if (
        isAnimatingFromHere &&
        animatingFromPosition !== null &&
        animatingToPosition !== null
      ) {
        const direction = animatingToPosition > animatingFromPosition ? 1 : -1;
        const distance = Math.abs(animatingToPosition - animatingFromPosition);
        const animationDistance = getAnimationDistance();

        frogEl.classList.add("animating");
        frogEl.style.transform = `translateX(${
          direction * distance * animationDistance
        }px) scale(1.1)`;
        frogEl.style.zIndex = "20";
      }

      frogEl.innerHTML = `
                <span class="frog-emoji">🐸</span>
                <span class="frog-direction ${frog.direction}">${
        frog.direction === "right" ? "→" : "←"
      }</span>
            `;

      frogEl.addEventListener("click", (e) => {
        e.stopPropagation();
        handleFrogClick(frogIndex);
      });

      frogEl.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFrogClick(frogIndex);
        },
        { passive: false }
      );

      frogContainer.appendChild(frogEl);
    }

    if (isAnimatingToHere) {
      const highlight = document.createElement("div");
      highlight.className = "target-highlight";
      frogContainer.appendChild(highlight);
    }

    stone.appendChild(frogContainer);
    stonesContainer.appendChild(stone);
  }
  
  // Прокрутка к центру игрового поля на маленьких экранах
  if (isSmallScreen && isGameStarted) {
    setTimeout(() => {
      const gameBoard = document.querySelector('.game-board');
      if (gameBoard) {
        gameBoard.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
      }
    }, 50);
  }
}

document.addEventListener("DOMContentLoaded", init);
