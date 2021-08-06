'use strict'

class Settings {
  constructor() {
    this.animate = true;
    this.showDiagnostics = false;
    this.checkCollisions = true;
    this.inzaneMode = false;
    this.obstacleSpacing = 235;
    this.obstacleCount = 3;
  }
}

let settings = new Settings();
let score = 0;
let isGameOver = false;
let leftIsPressed = false;
let rightIsPressed = false;
let obstacles = [];
let player = new Player();

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

    case "i":
      settings.inzaneMode = !settings.inzaneMode;
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
  leftIsPressed = event.targetTouches[0].clientX < centerX();
  rightIsPressed = event.targetTouches[0].clientX >= centerX();
  handleRestart();

  return false;
}

function mouseReleased(event) {
  leftIsPressed = false;
  rightIsPressed = false;

  return false;
}

// Main processing loop
function draw() {
  // Process game logic
  if (!isGameOver && settings.animate) {
    handleKeyboardInput();
    updateObstacles();
    updatePlayer();
    checkClearedObstacles();
  }

  background(255, 0, 0);

  // Render game objects
  drawObstacles();
  if (!isGameOver && settings.checkCollisions) {
    checkCollisions();  // Yes, this should be handled in game logic but currently relies on drawing order
  }
  drawPlayer();

  // Render UI elements
  drawScore();
  drawCenterIndicator();

  if (isGameOver) {
    drawGameOver();
  }

  if (settings.showDiagnostics)
    drawDiagnostics();
}

// Private code
function initializeGameObjects() {
  score = 0;
  isGameOver = false;

  obstacles = [];

  var baseRadius = windowHeight > windowWidth ? windowHeight : windowWidth;
  baseRadius /= 1.1;

  for (let i = 0; i < settings.obstacleCount; i++) {
    obstacles.push(new Obstacle(baseRadius + i * settings.obstacleSpacing, settings.inzaneMode));
  }
}

function handleRestart() {
  if (isGameOver) {
    initializeGameObjects();
  }
}

function handleKeyboardInput() {
  if (mouseIsPressed) {
    // Deferr to touch/mouse code
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
      obstacle.setCleared();
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

  var respawnRadius = largestRadius + settings.obstacleSpacing;

  for (let obstacle of obstacles) {
    obstacle.update(respawnRadius);
  }
}

function updatePlayer() {
  var rotation = player.direction.NONE;
  rotation = leftIsPressed ? player.direction.LEFT : rotation;
  rotation = rightIsPressed ? player.direction.RIGHT : rotation;

  player.setRotation(rotation);
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