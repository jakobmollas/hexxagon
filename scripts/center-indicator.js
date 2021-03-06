'use strict'

class CenterIndicator {
    constructor() {
        this.radius = 5;

        // Constants
        this.pulseSpeed = 60;
        this.minRadius = this.radius;
        this.maxRadius = 60;

        this.initialize();
    }

    // "Public" API methods
    initialize() {
        this.radius = this.minRadius;
    }

    update(deltaTime) {
        // Note: We want to speed up animation quite a bit, so we adjust delta
        this.radius = this.radius < this.minRadius 
            ? this.maxRadius 
            : this.radius - pow(deltaSpeed(deltaTime, this.pulseSpeed), 3);
    }

    draw() {
        push();

        fill(0, 0, 0, map(this.radius / this.maxRadius, 0, 1, 0, 100));
        noStroke();
        circle(centerX(), centerY(), this.radius);

        pop();
    }
}