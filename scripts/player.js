'use strict'

class Player {
    constructor() {
        this.direction = {
            NONE: "none",
            LEFT: "left",
            RIGHT: "right"
        }

        this.rotationAngle = 0;
        this.rotation = this.direction.NONE;
        this.rotateRight = false;
        this.x;
        this.y;

        // Constants
        this.rotationSpeed = 6.5;
        this.size = 12;
        this.radius = 75;
        this.driftSpeed = 0.2;
    }

    // Just to tidy up the "api" a bit
    setRotation(direction) {
        this.rotation = direction;
    }

    rotate(rotationDirection, speed) {
        if (rotationDirection == this.direction.NONE)
            return;

        var delta = deltaSpeed(speed);
        delta = delta * (rotationDirection == this.direction.LEFT ? -1 : 1);
        this.rotationAngle += delta;
        this.rotationAngle = normalizeAngle(this.rotationAngle);
    }

    update() {
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