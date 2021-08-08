'use strict'

class CenterIndicator {
    constructor() {
        this.radius = 5;
        this.pulseSpeed = 0.1;

        // Constants
        this.initialPulseSpeed = this.pulseSpeed;
        this.minRadius = this.radius;
        this.maxRadius = 60;

        this.initialize();
    }

    initialize() {
        this.radius = this.minRadius;
        this.pulseSpeed = this.initialPulseSpeed;
    }

    update(speedIncrement) {
        this.pulseSpeed += deltaSpeed(speedIncrement/25);

        this.radius = this.radius < this.minRadius 
            ? this.maxRadius 
            : this.radius - this.pulseSpeed;
    }

    draw() {
        push();

        fill(0, 0, 0, map(this.radius / this.maxRadius, 0, 1, 0, 100));
        noStroke();
        circle(centerX(), centerY(), this.radius);

        pop();
    }
}