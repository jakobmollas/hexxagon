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
        this.driftSpeed = 5000;
        
        this.direction = {
            LEFT: "left",
            RIGHT: "right"
        }
    }

    rotateLeft() {
        this.rotate(this.direction.LEFT, this.rotationSpeed);
    }

    rotateRight() {
        this.rotate(this.direction.RIGHT, this.rotationSpeed);
    }

    rotate(rotationDirection, speed) {
        var delta = deltaTime;
        delta = delta * (rotationDirection == this.direction.LEFT ? -1 : 1);
        this.rotationAngle += delta / speed;
        this.rotationAngle = normalizeAngle(this.rotationAngle);
    }

    update() {
        // Drift
        this.rotate(this.direction.RIGHT, this.driftSpeed);

        var rotationVector = p5.Vector.fromAngle(player.rotationAngle, player.radius);
        this.x = centerX() + rotationVector.x;
        this.y = centerY() + rotationVector.y;
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