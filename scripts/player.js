'use strict'

class Player {
    constructor() {
        this.direction = {
            NONE: "none",
            LEFT: "left",
            RIGHT: "right"
        }

        this.rotationAngle = 0;
        this.movement = this.direction.NONE;
        this.x;
        this.y;

        // Constants
        this.rotationSpeed = 6;
        this.driftSpeed = 0.2;
        this.size = 12;
        this.radius = 75;
        
        this.initialize();
    }

    rotate(movement, amount) {
        if (movement == this.direction.NONE)
            return;

        this.rotationAngle += amount * (movement == this.direction.LEFT ? -1 : 1);
        this.rotationAngle = normalizeAngle(this.rotationAngle);
    }

    // "Public" API methods
    initialize() {
    }

    setMovement(direction) {
        this.movement = direction;
    }

    update(deltaTime) {
        let rotationAmount = deltaSpeed(deltaTime, this.rotationSpeed);
        this.rotate(this.movement, rotationAmount);

        // Add base drift
        let driftAmount = deltaSpeed(deltaTime, this.driftSpeed);
        this.rotate(this.direction.RIGHT, driftAmount);

        let rotationVector = p5.Vector.fromAngle(player.rotationAngle, player.radius);
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