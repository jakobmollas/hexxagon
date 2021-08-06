'use strict'

// TODO: Calculate scaling factor based on screen size
// Todo: Adjust speeds 
// Todo: Refactor
// Todo: Cleanup

// Maybe:
// Todo: Implement random mode with randomly shaped obstacles, for example 3-8 sides
// Todo: Implement some kind of indicator (like pulsating colors) in obstacles that increases when getting closer to player


class Settings {
  constructor() {
    this.animate = true;
    this.showDiagnostics = true;
    this.size = 15;
    this.speed = 0.01;
    this.checkCollisions = true;
  }
}

let settings = new Settings();
let sclx, scly;
let score = 0;
let isGameOver = false;
let obstacles = [];
let player = new Player();

// Constants
let obstacleSpacing = 300;
let obstacleCount = 3;

// Called by P5.js
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');

  textFont('monospace');
  initializeGameObjects();
}

function windowResized() {
  setup();
}

function keyTyped() {
  switch (key) {
    case "a":
      settings.animate = !settings.animate;
      break;

    case "d":
      settings.showDiagnostics = !settings.showDiagnostics;
      break;

    case "c":
      settings.checkCollisions = !settings.checkCollisions;
      break;

    case " ":
      handleRestart();
      break;

    default:
      // Prevent default behavior
      return false;
  }
}

// Private code
function initializeGameObjects() {
  score = 0;
  isGameOver = false;

  obstacles = [];

  var baseRadius = windowHeight > windowWidth ? windowHeight : windowWidth;
  baseRadius /= 1.1;

  for (let i = 0; i < obstacleCount; i++) {
    obstacles.push(new Obstacle(baseRadius + i * obstacleSpacing));
  }
}

// Main update loop
function draw() {
  background(255, 0, 0);

  if (settings.showDiagnostics)
    drawDiagnostics();

  if (!isGameOver && settings.animate) {
    handleBallInput();
    updateObstacles();
    updatePlayer();
    checkClearedObstacles();
  }

  drawObstacles();
  if (!isGameOver && settings.checkCollisions) {
    checkCollisions();
  }
  drawPlayer();
  drawScore();

  if (isGameOver) {
    drawGameOver();
  }
}

function handleBallInput() {
  if (keyIsDown(LEFT_ARROW)) {
    player.rotateLeft();
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.rotateRight();
  }
}

function handleRestart() {
  if (!isGameOver) {
    return;
  }

  initializeGameObjects();
}

function checkCollisions() {
  // Todo: Improve collision detection, use geometry instead, this is VERY brittle...

  var colorAtBallPosition = get(player.x, player.y);
  isGameOver = isGameOver || colorAtBallPosition[1] == 255;
}

function checkClearedObstacles() {
  for (let obstacle of obstacles) {
    if (obstacle.hasBeenCleared) {
      continue;
    }

    if (player.radius - obstacle.radius > 15) {
      score++;
      obstacle.hasBeenCleared = true;
    }
  }
}

function updateObstacles() {
  var largestRadius = 0;
  for (let obstacle of obstacles) {
    largestRadius = largestRadius < obstacle.radius 
      ? obstacle.radius 
      : largestRadius;
  }

  var respawnRadius = largestRadius + obstacleSpacing;

  for (let obstacle of obstacles) {
    obstacle.update(deltaTime, respawnRadius);
  }
}

function updatePlayer() {
  player.update(windowWidth / 2, windowHeight / 2);
}

function drawObstacles() {
  for (let obstacle of obstacles) {
    obstacle.draw();
  }
}

function drawPlayer() {
  player.draw();
}

function updateControls() {
  for (let i in gui.__controllers)
    gui.__controllers[i].updateDisplay();
}

function drawDiagnostics() {
  push();

  strokeWeight(0);
  textSize(12);
  fill(255, 255, 255);
  stroke(0);

  let left = 10;
  let top = 20;
  let offset = 12;

  text("FPS:   " + frameRate().toFixed(), left, top);
  text("Score: " + score.toFixed(), left, top + 1 * offset);
  text("GOver: " + isGameOver, left, top + 3 * offset);
  text("BallA: " + player.rotationAngle.toFixed(2), left, top + 4 * offset);
  text("BallX: " + player.x, left, top + 5 * offset);
  text("BallY: " + player.y, left, top + 6 * offset);
  text("CX:    " + windowWidth / 2, left, top + 7 * offset);
  text("CY:    " + windowHeight / 2, left, top + 8 * offset);

  pop();
}

function drawScore() {
  push();

  textSize(75);
  fill(255, 255, 255);
  stroke(0, 0, 0);
  strokeWeight(2.5);
  textAlign(CENTER, TOP);
  text("Score: " + score, windowWidth / 2, 50);

  pop();
}

function drawGameOver() {
  push();

  var size = 75;
  textSize(size);
  fill(255, 255, 255);
  stroke(0, 0, 0);
  strokeWeight(2.5);
  textAlign(CENTER, BOTTOM);
  text("GAME OVER", windowWidth / 2, windowHeight - size);
  text("SPACE TO RESTART", windowWidth / 2, windowHeight);

  pop();
}