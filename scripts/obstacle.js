'use strict'

class Obstacle {
    constructor(initialRadius, inzaneMode) {
        this.originalRadius = initialRadius;
        this.radius = initialRadius;
        this.hasBeenCleared = false;
        this.inzaneMode = inzaneMode;
        
        // Constants
        this.rotationSpeed = 2000;  // lower = faster
        this.shrinkSpeed = 3.5;   // lower = faster
        this.minimumSize = 10;
        this.thickness = 13;
        this.standardSizes = 6;

        this.initialize(initialRadius);
    }

    initialize(radius) {
        this.originalRadius = radius;
        this.radius = radius;
        this.angle = random(-PI, PI);
        this.sides = this.inzaneMode ? floor(random(3, 9)) : this.standardSizes;
        this.hasBeenCleared = false;
    }

    setCleared() {
        this.hasBeenCleared = true;
    }

    update(respawnRadius) {
        this.angle += deltaTime / this.rotationSpeed;
        this.angle = normalizeAngle(this.angle);

        this.radius -= deltaTime / this.shrinkSpeed;
        if (this.radius < this.minimumSize) {
            this.initialize(respawnRadius);
        }
    }

    draw() {
        push();
        strokeWeight(this.thickness);
        strokeCap(SQUARE);
        strokeJoin(MITER);
        stroke('white');
        noFill();

        createPolygon(centerX(), centerY(), this.radius, this.sides, this.angle);
        pop();
    }
}