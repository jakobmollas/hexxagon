'use strict'

class Obstacle {
    constructor(initialRadius, inzaneMode) {
        this.originalRadius = initialRadius;
        this.radius = initialRadius;
        this.hasBeenCleared = false;
        this.inzaneMode = inzaneMode;
        this.shrinkSpeed = 125;     // Initial speed

        // Constants
        this.rotationSpeed = 0.3;
        this.minimumSize = 10;
        this.thickness = 13;
        this.standardSideCount = 6;
        this.minRandomSides = 3;
        this.maxRandomSides = 8;
        this.shrinkSpeedIncrement = 4;

        this.initialize(initialRadius);
    }

    initialize(radius) {
        this.originalRadius = radius;
        this.radius = radius;
        this.angle = random(-PI, PI);
        this.hasBeenCleared = false;
        this.sides = this.inzaneMode
            ? floor(random(this.minRandomSides, this.maxRandomSides + 1))
            : this.standardSideCount;
    }

    setCleared() {
        this.hasBeenCleared = true;
    }

    update(respawnRadius, speedIncrement) {
        this.angle += deltaSpeed(this.rotationSpeed);
        this.angle = normalizeAngle(this.angle);

        this.radius -= deltaSpeed(this.shrinkSpeed);
        if (this.radius < this.minimumSize) {
            this.initialize(respawnRadius);
        }

        this.shrinkSpeed += this.shrinkSpeed > 1
            ? deltaSpeed(this.shrinkSpeedIncrement)
            : 0;
    }

    draw() {
        push();

        strokeWeight(this.thickness);
        strokeCap(SQUARE);
        strokeJoin(MITER);
        stroke(255, 255, 255, this.hasBeenCleared ? 100 : 255);
        noFill();

        createPolygon(centerX(), centerY(), this.radius, this.sides, this.angle);
        pop();
    }
}