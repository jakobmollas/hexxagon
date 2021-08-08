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
        this.rotation = this.direction.NONE;
        this.rotateRight = false;
        this.x;
        this.y;

        // Constants
        this.initialRotationSpeed = 6;
        this.driftSpeed = 0.2;
        this.size = 12;
        this.radius = 75;
        
        this.initialize();
    }

    rotate(rotationDirection, speed) {
        if (rotationDirection == this.direction.NONE)
            return;

        var delta = deltaSpeed(speed);
        delta = delta * (rotationDirection == this.direction.LEFT ? -1 : 1);
        this.rotationAngle += delta;
        this.rotationAngle = normalizeAngle(this.rotationAngle);
    }

    // Just to tidy up the "api" a bit
    setRotation(direction) {
        this.rotation = direction;
    }

    initialize() {
        this.rotationSpeed = this.initialRotationSpeed;
    }

    update(speedIncrement) {
        let adjustedSpeedIncrement = deltaSpeed(speedIncrement/60);
        this.rotationSpeed += adjustedSpeedIncrement;

        this.rotate(this.rotation, this.rotationSpeed);

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