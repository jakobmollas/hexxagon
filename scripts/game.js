'use strict'

class Settings {
  constructor() {
    this.animate = true;
    this.showDiagnostics = false;
    this.checkCollisions = true;
    this.obstacleSpacing = 235;
    this.obstacleCount = 3;
    this.speedIncreasePerSecond = 0.02; // faster speed increase => harder gameplay
    this.maxSpeedFactor = 2; // Approximate point where things becomes very hard
  }
}

let score = 0;
let speedFactor = 1;
let isGameOver = false;
let leftIsPressed = false;
let rightIsPressed = false;
let settings = new Settings();
let ui = new Ui();
let obstacles = [];
let player = new Player();
let centerIndicator = new CenterIndicator();

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

// Main game loop
function draw() {
  // Process game logic
  if (!isGameOver && settings.animate) {
    handleKeyboardInput();

    let dt = calculateDeltaTime();
    updateObstacles(dt);
    updatePlayer(dt);
    updateCenterIndicator(dt);
    checkClearedObstacles();
  }

  drawBackground();

  // Render stuff
  drawObstacles();
  if (!isGameOver && settings.checkCollisions) {
    checkGameOver();  // Yes, this should be handled in game logic but currently relies on drawing order
  }
  drawPlayer();
  drawCenterIndicator();
  drawUi();
}

// Private code
function initializeGameObjects() {
  score = 0;
  speedFactor = 1;
  isGameOver = false;

  let baseRadius = windowHeight > windowWidth ? windowHeight : windowWidth;
  baseRadius /= 1.1;

  obstacles = [];
  for (let i = 0; i < settings.obstacleCount; i++) {
    obstacles.push(new Obstacle(baseRadius + i * settings.obstacleSpacing, settings.inzaneMode));
  }

  player.initialize();
  centerIndicator.initialize();
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

function calculateDeltaTime() {
  // Adjust actual delta time to simulate global game speedup
  speedFactor += settings.speedIncreasePerSecond * deltaTime / 1000; 
  return deltaTime * speedFactor;
}

function checkGameOver() {
  // Todo: Improve collision detection, use geometry instead, this is VERY brittle...

  let colorAtBallPosition = get(player.x, player.y);
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

function updateObstacles(deltaTime) {
  let largestRadius = 0;
  for (let obstacle of obstacles) {
    largestRadius = largestRadius < obstacle.radius 
      ? obstacle.radius 
      : largestRadius;
  }

  var respawnRadius = largestRadius + settings.obstacleSpacing;

  for (let obstacle of obstacles) {
    obstacle.update(deltaTime, respawnRadius);
  }
}

function updatePlayer(deltaTime) {
  let movement = player.direction.NONE;
  movement = leftIsPressed ? player.direction.LEFT : movement;
  movement = rightIsPressed ? player.direction.RIGHT : movement;

  player.setMovement(movement);
  player.update(deltaTime);
}

function updateCenterIndicator(deltaTime) {
  centerIndicator.update(deltaTime);
}

function drawBackground() {
  // Fade from blue -> red based on current speed factor
  let red = map(speedFactor / settings.maxSpeedFactor, 0.5, 1, 0, 255, true);
  let blue = map(speedFactor / settings.maxSpeedFactor, 0.5, 1, 255, 0, true);
  background(red, 0, blue);
}

function drawObstacles() {
  for (let obstacle of obstacles) {
    obstacle.draw();
  }
}

function drawPlayer() {
  player.draw();
}

function drawCenterIndicator() {
  centerIndicator.draw();
}

function drawUi() {
  ui.isGameOver = isGameOver;
  ui.showDiagnostics = settings.showDiagnostics;
  
  ui.draw();
}

