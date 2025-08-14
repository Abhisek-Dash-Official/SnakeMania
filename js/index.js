// Constants and Variables
let direction = { x: 0, y: 0 };
const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
const music = new Audio("music/music.mp3");
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 12, y: 12 }];
let playing = false;

let food = { x: 6, y: 7 };

startPlayBtn.onclick = () => {
  playing = true;
  startPlayBtn.classList.add("btnActive");
  stopPlayBtn.classList.remove("btnActive");
  music.play();
};
stopPlayBtn.onclick = () => {
  playing = false;
  startPlayBtn.classList.remove("btnActive");
  stopPlayBtn.classList.add("btnActive");
  music.pause();
};

/* === FUNCTIONS === */

// Score Board
const changeScore = () => {
  score += 1;
  currentScore.textContent = `Current Score: ${score}`;
  const currentPlayer = JSON.parse(
    localStorage.getItem("currentPlayer") ||
      JSON.stringify({ name: "Player", highscore: 0 })
  );
  if (score > currentPlayer.highscore) {
    currentPlayer.highscore = score;
    const players = JSON.parse(localStorage.getItem("players")) || [
      { name: "Player", highscore: 0 },
    ];
    const idx = players.findIndex((p) => p.name === currentPlayer.name);
    if (idx !== -1) {
      players[idx].highscore = score;
    }
    console.log("if score> highscore of changescore is running");
    console.log("here is ur output ", { currentPlayer, players, idx });
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("currentPlayer", JSON.stringify(currentPlayer));
    highscoreDiv.textContent = `High Score ${score} done by ${currentPlayer.name}`;
  }
};

// Snake Collide Function
const isCollide = (snakeArr) => {
  for (let i = 1; i < snakeArr.length; i++) {
    if (snakeArr[0].x === snakeArr[i].x && snakeArr[0].y === snakeArr[i].y) {
      return true;
    }
  }
  if (
    snakeArr[0].x < 0 ||
    snakeArr[0].x > 20 ||
    snakeArr[0].y < 0 ||
    snakeArr[0].y > 20
  ) {
    return true;
  }
  return false;
};
// Update snake array
const updateSnake = () => {
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    music.pause();
    alert("GameOver!");
    music.play();

    direction = { x: 0, y: 0 };
    snakeArr = [{ x: 12, y: 12 }];

    score = 0;
    currentScore.textContent = "Current Score: 0";
  }
  if (snakeArr[0].x == food.x && snakeArr[0].y == food.y) {
    foodSound.play();
    changeScore();
    snakeArr.unshift({
      x: snakeArr[0].x + direction.x,
      y: snakeArr[0].y + direction.y,
    });
    food = {
      x: Math.round(1 + 19 * Math.random()),
      y: Math.round(1 + 19 * Math.random()),
    };
  }
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += direction.x;
  snakeArr[0].y += direction.y;
};

// Render snake and food
const render = () => {
  grid.innerHTML = "";

  // Render snake
  snakeArr.forEach((e, idx) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (idx === 0) {
      snakeElement.classList.add("snakeHead");
      const tongue = document.createElement("div");
      tongue.classList.add("tongue");
      snakeElement.appendChild(tongue);
    } else {
      snakeElement.classList.add("snakeBody");
    }
    grid.appendChild(snakeElement);
  });

  // Render Food
  const foodElement = document.createElement("div");
  foodElement.classList.add("food");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  grid.appendChild(foodElement);
};

// gameEngiine
function gameEngine() {
  updateSnake();
  render();
}

// Main function
function main(currenttime) {
  window.requestAnimationFrame(main);
  if ((currenttime - lastPaintTime) / 1000 > 1 / speed && playing) {
    lastPaintTime = currenttime;
    gameEngine();
  }
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    // UP
    case "ArrowUp":
    case "w":
    case "W":
      moveSound.play();
      direction.x = 0;
      direction.y = -1;
      break;

    // DOWN
    case "ArrowDown":
    case "s":
    case "S":
      moveSound.play();
      direction.x = 0;
      direction.y = 1;
      break;

    // LEFT
    case "ArrowLeft":
    case "a":
    case "A":
      moveSound.play();
      direction.x = -1;
      direction.y = 0;
      break;

    // RIGHT
    case "ArrowRight":
    case "d":
    case "D":
      moveSound.play();
      direction.x = 1;
      direction.y = 0;
      break;
  }
});

window.addEventListener("load", () => {
  const minWidth = 1300; // minimum desktop width
  const minHeight = 800; // minimum desktop height

  if (window.innerWidth < minWidth || window.innerHeight < minHeight) {
    alert("Please open this game on a desktop for the best experience!");
    document.body.innerHTML = "";
  } else {
    main();
  }
});
