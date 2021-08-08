'use strict'

class Player {
    constructor() {
        this.direction = {
            NONE: "none",
            LEFT: "left",
            RIGHT: "right"
        }

        this.rotationSpeed = 6;
        this.rotationAngle = 0;
        this.movement = this.direction.NONE;
        this.x;
        this.y;

        // Constants
        this.initialRotationSpeed = 6;
        this.driftSpeed = 0.2;
        this.size = 12;
        this.radius = 75;
        
        this.initialize();
    }

    rotate(movement, speed) {
        if (movement == this.direction.NONE)
            return;

        this.rotationAngle += deltaSpeed(speed) * (movement == this.direction.LEFT ? -1 : 1);
        this.rotationAngle = normalizeAngle(this.rotationAngle);
    }

    // Just to tidy up the "api" a bit
    setRotation(direction) {
        this.movement = direction;
    }

    initialize() {
        this.rotationSpeed = this.initialRotationSpeed;
    }

    update(speedIncrement) {
        this.rotationSpeed += deltaSpeed(speedIncrement/60);

        this.rotate(this.movement, this.rotationSpeed);

        // Add base drift
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