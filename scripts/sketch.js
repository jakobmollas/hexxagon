'use strict'

// Maybe:
// Todo: Implement random mode with randomly shaped obstacles, for example 3-8 sides
// Todo: Implement some kind of indicator (like pulsating colors) in obstacles that increases when getting closer to player


class Settings {
  constructor() {
    this.animate = true;
    this.showDiagnostics = false;
    this.checkCollisions = true;
  }
}

let settings = new Settings();
let score = 0;
let isGameOver = false;
let leftIsPressed = false;
let rightIsPressed = false;
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
  noCursor();
  initializeGameObjects();
}

function windowResized() {
  setup();
}

function keyTyped() {
  switch (key) {
    case "a":
      settings.animate = settings.showDiagnostics ? !settings.animate : settings.animate;
      break;

    case "d":
      settings.showDiagnostics = !settings.showDiagnostics;
      break;

    case "c":
      settings.checkCollisions = settings.showDiagnostics ? !settings.checkCollisions : settings.checkCollisions;
      break;

    case " ":
      handleRestart();
      break;

    default:
      // Prevent default behavior
      return false;
  }
}

function mousePressed(event) {
  console.log(event.targetTouches[0]);
  leftIsPressed = event.targetTouches[0].clientX < centerX();
  rightIsPressed = event.targetTouches[0].clientX >= centerX();

  return false;
}

function mouseReleased(event) {
  leftIsPressed = false;
  rightIsPressed = false;

  return false;
}

function draw() {
  background(255, 0, 0);

  if (settings.showDiagnostics)
    drawDiagnostics();

  if (!isGameOver && settings.animate) {
    handleKeyboardInput();
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
  drawCenterIndicator();

  if (isGameOver) {
    drawGameOver();
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

function handleRestart() {
  if (!isGameOver) {
    return;
  }

  initializeGameObjects();
}

function handleKeyboardInput() {
  if (mouseIsPressed) {
    // Let touch/mouse code handle this
    return;
  }
  
  leftIsPressed = keyIsDown(LEFT_ARROW);
  rightIsPressed = keyIsDown(RIGHT_ARROW);
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
    obstacle.update(respawnRadius);
  }
}

function updatePlayer() {
  if (leftIsPressed) {
    player.rotation = player.direction.LEFT;
  }
  else if (rightIsPressed) {
    player.rotation = player.direction.RIGHT;
  }
  else {
    player.rotation = player.direction.NONE;
  }

  player.update();
}

function drawObstacles() {
  for (let obstacle of obstacles) {
    obstacle.draw();
  }
}

function drawPlayer() {
  player.draw();
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
  text("CX:    " + centerX(), left, top + 7 * offset);
  text("CY:    " + centerY(), left, top + 8 * offset);

  pop();
}

function drawScore() {
  push();

  var size = 50;
  textSize(size);
  fill(255, 255, 255);
  stroke(0, 0, 0);
  strokeWeight(2.5);
  textAlign(CENTER, TOP);
  text("Score: " + score, centerX(), 50);

  pop();
}

function drawGameOver() {
  push();

  var size = 30;
  textSize(size);
  fill(255, 255, 255);
  stroke(0, 0, 0);
  strokeWeight(2.5);
  textAlign(CENTER, BOTTOM);
  text("GAME OVER", centerX(), windowHeight - 2*size);
  text("PRESS SPACE TO RESTART", centerX(), windowHeight - size);

  pop();
}

function drawCenterIndicator() {
  push();

  fill(0, 0, 0, 100);
  noStroke();
  circle(centerX(), centerY(), 40);

  pop();
}