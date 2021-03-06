'use strict'

class Ui {
  constructor() { 
    this.isGameOver = false;
    this.showDiagnostics = false;
  }

  draw() {
    if (this.showDiagnostics) {
      this.drawDiagnostics();
    }

    if (this.isGameOver) {
      this.drawGameOver();
    }
    
    this.drawScore();
  }

  drawDiagnostics() {
    push();

    strokeWeight(0);
    textSize(12);
    fill(255, 255, 255);
    stroke(0);

    let left = 10;
    let top = 20;
    let offset = 12;

    text("FPS:    " + frameRate().toFixed(), left, top);
    text("Score:  " + score.toFixed(), left, top + 1 * offset);
    text("SpeedF: " + speedFactor.toFixed(1), left, top + 2 * offset);
    text("GOver:  " + isGameOver, left, top + 3 * offset);
    text("BallA:  " + player.rotationAngle.toFixed(2), left, top + 4 * offset);
    text("BallX:  " + player.x, left, top + 5 * offset);
    text("BallY:  " + player.y, left, top + 6 * offset);
    text("BallSp: " + player.rotationSpeed.toFixed(2), left, top + 7 * offset);

    pop();
  }

  drawScore() {
    push();

    let size = 40;
    textSize(size);
    fill(255, 255, 255);
    stroke(0, 0, 0);
    strokeWeight(2.5);
    textAlign(CENTER, TOP);
    text("Score: " + score, centerX(), size);

    pop();
  }

  drawGameOver() {
    push();

    let size = 20;
    textSize(size);
    fill(255, 255, 255);
    stroke(0, 0, 0);
    strokeWeight(2.5);
    textAlign(CENTER, BOTTOM);
    text("GAME OVER", centerX(), windowHeight - 3*size);
    text("PRESS SPACE/TOUCH", centerX(), windowHeight - 2*size);
    text("TO RESTART", centerX(), windowHeight - size);

    pop();
  }
}