'use strict'

class Player {
    constructor() {
        this.rotationAngle = 0;
        this.x;
        this.y;
  
        // Constants
        this.rotationSpeed = 300;  // lower = faster
        this.size = 20;
        this.distance = 100;
    }

    rotateLeft() {
        this.rotationAngle -= deltaTime / this.rotationSpeed;
        this.rotationAngle = normalizeAngle(this.rotationAngle);
    }

    rotateRight() {
        this.rotationAngle += deltaTime / this.rotationSpeed;
        this.rotationAngle = normalizeAngle(this.rotationAngle);
    }

    update(centerX, centerY) {
        var rotationVector = p5.Vector.fromAngle(player.rotationAngle, player.distance);
        this.x = centerX + rotationVector.x;
        this.y = centerY + rotationVector.y;
    }

    draw() {
        push();
        strokeWeight(2);
        stroke('black');
        fill('white');

        circle(this.x, this.y, this.size);
        pop();
    }
}