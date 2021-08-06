'use strict'

// TODO: Calculate scaling factor based on screen size
// Todo: Implement scoring
// Todo: Implement multiple hexagons
// Todo: Adjust speeds 
// Todo: Refactor
// Todo: Cleanup
// Todo: Implement random mode with randomly shaped obstacles, for example 3-8 sides
// Todo: Implement some kind of indicator (like pulsating colors) in obstacles that increases when getting closer to player


class Settings {
  constructor() {
    this.animate = true;
    this.showDiagnostics = true;
    this.size = 15;
    this.speed = 0.01;
  }
}

let gui = null;
let settings = new Settings();

let sclx, scly;
let angle = 0;
let hexagonRadius = 0;
let ballAngle = 0;
let score = 0;
let ballDistance = 100;
let isGameOver = false;
let ballX = 0;
let ballY = 0;
let color = null;
let obstacles = [];

// Constants
let obstacleSpacing = 500;

// Called by P5.js
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');

  textFont('monospace');
  initializeGuiControls();
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

    case "h":
      gui.closed ? gui.open() : gui.close();
      break;

    case " ":
      handleRestart();
      break;

    default:
      // Prevent default behavior
      return false;
  }
}

function initializeGuiControls() {
  gui = new dat.GUI()
  gui.add(settings, 'animate');

  gui.add(settings, 'size', 1, 20);
  gui.add(settings, 'speed', 0, 1.0);

  gui.close();
}

function initializeGameObjects() {
  score = 0;
  isGameOver = false;
  
  obstacles = []; 

  var baseRadius = windowHeight > windowWidth ? windowHeight : windowWidth;
  baseRadius /= 1.1;

  for (let i = 0; i < 3; i++) {
    obstacles.push(new Obstacle(baseRadius + i*500, baseRadius));
  }
}

// Main update loop
function draw() {
  updateControls();

  background(255, 0, 0);

  if (settings.showDiagnostics)
    drawDiagnostics();

  if (!isGameOver && settings.animate) {
    handleBallInput();
    //checkCollision();
    checkScore();
    updateObstacles();
  }

  drawObstacles();
  if (!isGameOver) {
    //checkCollision();
  }
  drawBall();
  drawScore();
  
  if (isGameOver) {
    drawGameOver();
  }
}

function handleBallInput() {
  if (keyIsDown(LEFT_ARROW)) {
    ballAngle -= deltaTime / 300;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    ballAngle += deltaTime / 300;
  }

  ballAngle = normalizeAngle(ballAngle);
}

function handleRestart() {
  if (!isGameOver) {
    return;
  }

  // Todo: Reset properly
  initializeGameObjects();
}

function checkCollision() {
  // Todo: Improve collision detection, use geometry instead, this is VERY brittle...
  var x = windowWidth / 2;
  var y = windowHeight / 2;
  var ballVector = p5.Vector.fromAngle(ballAngle, ballDistance);
  ballX = x + ballVector.x;
  ballY = y + ballVector.y;

  color = get(ballX, ballY);
  isGameOver = isGameOver || color[1] == 255;
}

function checkScore() {
  // Todo: Implement
  // if (hexagonRadius - ballDistance < 10) {
  //   score++;
  // }
}

function updateObstacles() {
  for (let obstacle of obstacles) {
    obstacle.update(deltaTime);
  }
}

function drawObstacles() {
  for (let obstacle of obstacles) {
    obstacle.draw();
  }
}

// Todo: Create separate class/file
function drawBall() {
  strokeWeight(2);
  stroke('black');
  fill('white');

  push();

  translate(windowWidth / 2, windowHeight / 2);
  translate(p5.Vector.fromAngle(ballAngle, 100));
  circle(0, 0, 20);

  pop();
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
  text("Hexa:  " + angle.toFixed(2), left, top + 2 * offset);
  text("GOver: " + isGameOver, left, top + 3 * offset);
  text("BallA: " + ballAngle.toFixed(2), left, top + 4 * offset);
  text("BallX: " + ballX, left, top + 5 * offset);
  text("BallY: " + ballY, left, top + 6 * offset);
  text("CX:    " + windowWidth / 2, left, top + 7 * offset);
  text("CY:    " + windowHeight / 2, left, top + 8 * offset);
  text("color: " + color, left, top + 9 * offset);

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