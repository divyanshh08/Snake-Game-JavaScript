const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector(".high-score");
const scoreElement = document.querySelector(".score");
const timeElement = document.querySelector(".time");

const blockHeight = 50;
const blockWidth = 50;

// "||" means if the value of localStorage.getItem("highScore") is null or undefined, then it will assign 0 to highScore. This is a common way to provide a default value in JavaScript.
let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00-00`;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
let timeIntervalId = null;

// food random position
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

const blocks = [];

// snakes initial position
let snake = [
  {
    x: 1,
    y: 3,
  },
];
let direction = "right";

// Providing address to each block in the board
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

highScoreElement.innerText = highScore;

function render() {
  let head = null;

  // food rendering logic
  blocks[`${food.x}-${food.y}`].classList.add("food");

  // snake arrow movement logic
  switch (direction) {
    case "left":
      head = { x: snake[0].x, y: snake[0].y - 1 };
      break;

    case "right":
      head = { x: snake[0].x, y: snake[0].y + 1 };
      break;

    case "down":
      head = { x: snake[0].x + 1, y: snake[0].y };
      break;

    case "up":
      head = { x: snake[0].x - 1, y: snake[0].y };
      break;

    default:
      // Optional: handle invalid direction
      break;
  }

  //wall collision logic
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    gameOver();
    return;
  }

  // self collision logic
  checkSelfCollision(head);

  // food consume logic
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    generateFood();

    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head);

    score += 10;
    scoreElement.innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreElement.innerText = highScore;
    }
  }

  // draw snake logic ( remove classes from previous snake position -> move snake -> draw snake)
  drawSnake(head);
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
}

function checkSelfCollision(head) {
  for (let segment of snake) {
    if (segment.x === head.x && segment.y === head.y) {
      clearInterval(intervalId);
      clearInterval(timeIntervalId);

      modal.style.display = "flex";
      startGameModal.style.display = "none";
      gameOverModal.style.display = "flex";

      return;
    }
  }
}
function drawSnake(head) {
  // snake motion logic
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    blocks[`${segment.x}-${segment.y}`].classList.remove("snake_head");
  });

  // draw snake head and body
  snake.unshift(head); // add new head to the snake
  snake.pop(); // remove the tail segment of the snake
  snake.forEach((segment) => {
    if (segment.x === head.x && segment.y === head.y) {
      blocks[`${segment.x}-${segment.y}`].classList.add("snake_head");
    } else {
      blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    }
  });
}

function startGame() {
  // snake and food rendering begins.
  intervalId = setInterval(() => {
    render();
  }, 400);

  startTime();
}

function startTime() {
  timeIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);

    if (sec === 59) {
      min++;
      sec = 0;
    } else {
      sec++;
    }

    time = `${min}-${sec}`;
    timeElement.innerText = time;
  }, 1000);
}

startButton.addEventListener("click", () => {
  modal.style.display = "none";
  startGame();
});

restartButton.addEventListener("click", () => {
  restartGame();
});

function restartGame() {
  // intervalId is running the render function every 400 milliseconds.
  clearInterval(intervalId); // clearInterval is a built-in JavaScript function that stops the execution of a function that was set to run repeatedly using setInterval.
  // timeIntervalId is running the time update function every 1000 milliseconds (1 second).
  clearInterval(timeIntervalId);
  // Remove all classes from every block
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      blocks[`${row}-${col}`].classList.remove("fill");
      blocks[`${row}-${col}`].classList.remove("snake_head");
      blocks[`${row}-${col}`].classList.remove("food");
    }
  }
  score = 0;
  time = `00-00`;
  scoreElement.innerText = score;
  timeElement.innerText = time;
  highScoreElement.innerText = highScore;

  modal.style.display = "none";
  snake = [{ x: 1, y: 3 }];
  direction = "right";
  
  generateFood();

  startGame();
}

function gameOver() {
  clearInterval(intervalId);
  clearInterval(timeIntervalId);

  modal.style.display = "flex";
  startGameModal.style.display = "none";
  gameOverModal.style.display = "flex";
}

// arrow key movement logic
// Stopping snake from moving in the opposite direction to prevent it from colliding with itself.
addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") {
    if (direction !== "down") {
      direction = "up";
    }
  } else if (event.key == "ArrowRight") {
    if (direction !== "left") {
      direction = "right";
    }
  } else if (event.key == "ArrowLeft") {
    if (direction !== "right") {
      direction = "left";
    }
  } else if (event.key == "ArrowDown") {
    if (direction !== "up") {
      direction = "down";
    }
  }
});
