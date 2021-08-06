'use strict'

class Player {
    constructor() {
        this.rotationAngle = 0;
        this.x;
        this.y;

        // Constants
        this.rotationSpeed = 180;  // lower = faster
        this.size = 12;
        this.radius = 100;
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
        var rotationVector = p5.Vector.fromAngle(player.rotationAngle, player.radius);
        this.x = centerX + rotationVector.x;
        this.y = centerY + rotationVector.y;
    }

    draw() {
        push();
        strokeWeight(1);
        stroke('black');
        fill('white');

        circle(this.x, this.y, this.size);
        pop();
    }
}