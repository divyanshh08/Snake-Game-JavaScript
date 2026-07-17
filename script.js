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
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }

  //wall collision logic
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId); // random food generation, motion, of snake stopped
    clearInterval(timeIntervalId); // time update stopped
    modal.style.display = "flex";

    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }

  // food consume logic
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
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

  // snake motion logic
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
  snake.unshift(head); // add new head to the snake
  snake.pop(); // remove the tail segment of the snake
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}

startButton.addEventListener("click", () => {
  modal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 300);

  // setInterval is a built-in JavaScript function that allows you to execute a function repeatedly at specified intervals (in milliseconds).
  timeIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);
    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    time = `${min}-${sec}`;
    timeElement.innerText = time;
  }, 1000); // 1000 here means 1 second, so the time will be updated every second and this function will start after 1 second.
});

restartButton.addEventListener("click", () => {
  restartGame();
});

function restartGame() {
  // intervalId is running the render function every 300 milliseconds.
  clearInterval(intervalId);  // clearInterval is a built-in JavaScript function that stops the execution of a function that was set to run repeatedly using setInterval.
  // timeIntervalId is running the time update function every 1000 milliseconds (1 second).
  clearInterval(timeIntervalId);
  blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
  score = 0;
  time = `00-00`;
  scoreElement.innerText = score;
  timeElement.innerText = time;
  highScoreElement.innerText = highScore;

  modal.style.display = "none";
  snake = [{ x: 1, y: 3 }];
  direction = "right";
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };

  // snake and food rendering begins.
  intervalId = setInterval(() => {
    render();
  }, 300);

  // timer begins.
  timeIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);
    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    time = `${min}-${sec}`;
    timeElement.innerText = time;
  }, 1000);
}
// arrow key movement logic
addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") {
    direction = "up";
  } else if (event.key == "ArrowRight") {
    direction = "right";
  } else if (event.key == "ArrowLeft") {
    direction = "left";
  } else if (event.key == "ArrowDown") {
    direction = "down";
  }
});
