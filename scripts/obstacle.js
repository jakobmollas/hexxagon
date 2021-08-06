'use strict'

class Obstacle {
    constructor(initialRadius, baseRadius) {
        this.radius = initialRadius;
        this.baseRadius = baseRadius;
        
        // Constants
        this.rotationSpeed = 1000;  // lower = faster
        this.shrinkSpeed = 5;   // higher = faster
        this.minimumSize = 10;  // pixels

        this.initialize(initialRadius);
    }

    update(deltaTime) {
        this.angle += deltaTime / this.rotationSpeed;
        this.angle = normalizeAngle(this.angle);

        this.radius -= deltaTime / this.shrinkSpeed;
        if (this.radius < this.minimumSize) {
            this.initialize(this.baseRadius);
        }
    }

    initialize(radius) {
        this.radius = radius;
        this.angle = random(-PI, PI);
        //this.sides = floor(random(3, 9));
        this.sides = 6;
    }

    draw() {
        push();
        //strokeWeight(this.radius / 8);
        strokeWeight(20);
        strokeCap(SQUARE);
        strokeJoin(MITER);
        stroke(255, 255, 255);
        noFill();

        translate(windowWidth / 2, windowHeight / 2);
        createPolygon(0, 0, this.radius, this.sides, this.angle);
        pop();
    }
}