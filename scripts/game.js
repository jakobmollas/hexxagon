'use strict'

class Settings {
  constructor() {
    this.animate = true;
    this.showDiagnostics = false;
    this.checkCollisions = true;
    this.obstacleSpacing = 235;
    this.obstacleCount = 3;
    this.speedIncrease = 4; // "units/second" higher = faster speed increase => harder gameplay
    this.maxSpeed = 200; // Approximate point where things becomes very hard
  }
}

let score = 0;
let isGameOver = false;
let leftIsPressed = false;
let rightIsPressed = false;
let settings = new Settings();
let ui = new Ui();
let obstacles = [];
let player = new Player();
let centerIndicator = new CenterIndicator();

let speed = 0;


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
    updateGlobalState();
    updateObstacles();
    updatePlayer();
    updateCenterIndicator();
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
  speed = 0;
  isGameOver = false;

  var baseRadius = windowHeight > windowWidth ? windowHeight : windowWidth;
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

function checkGameOver() {
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

function updateGlobalState() {
  speed += deltaSpeedIncrease();
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
  var movement = player.direction.NONE;
  movement = leftIsPressed ? player.direction.LEFT : movement;
  movement = rightIsPressed ? player.direction.RIGHT : movement;

  player.setMovement(movement);
  player.update();
}

function updateCenterIndicator() {
  centerIndicator.update();
}

function drawBackground() {
  // Fade from blue -> red based on current speed
  let red = map(speed / settings.maxSpeed, 0, 1, 0, 255, true);
  let blue = map(speed / settings.maxSpeed, 0, 1, 255, 0, true);
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

