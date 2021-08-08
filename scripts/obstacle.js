'use strict'

class Obstacle {
    constructor(initialRadius) {
        this.radius = initialRadius;
        this.hasBeenCleared = false;
        this.shrinkSpeed = 125;     // Initial speed

        // Constants
        this.rotationSpeed = 0.3;
        this.minimumSize = 10;
        this.thickness = 13;
        this.sides = 6;
        this.minRandomSides = 3;
        this.maxRandomSides = 8;

        this.respawn(initialRadius);
    }

    respawn(radius) {
        this.radius = radius;
        this.hasBeenCleared = false;
        
        // It is very hard for players when opening is to the right/left (horizontal), 
        // ensure opening is more vertically aligned
        // Also account for rotation.
        // Clock-wise:
        // PI (left) -> 0 (right)
        // 0 (right) -> -PI (left)
        this.angle = !random([0, 1]) 
            ? random(PI, PI * 1.5/6)
            : random(0, -PI * 4.5/6);

    }

    setCleared() {
        this.hasBeenCleared = true;
    }

    update(respawnRadius, speedIncrement) {
        this.angle += deltaSpeed(this.rotationSpeed);
        this.angle = normalizeAngle(this.angle);

        this.radius -= deltaSpeed(this.shrinkSpeed);
        if (this.radius < this.minimumSize) {
            this.respawn(respawnRadius);
        }

        this.shrinkSpeed += deltaSpeed(speedIncrement);
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