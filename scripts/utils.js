'use strict'

function normalizeAngle(angle) {
    let newAngle = angle - TWO_PI * floor((angle + PI) / TWO_PI);
    return newAngle;
}

function deltaSpeed(speed) {
    // deltaTime = ms since last frame
    return deltaTime * (speed / 1000);
}

function deltaSpeedIncrease(adjustmentFactor = 1) {
    return deltaSpeed(settings.speedIncrease * adjustmentFactor);
}

// Create a basic polygon, handles triangles, squares, pentagons, etc
function createPolygon(x, y, radius, sides = 3, angle = 0) {
    beginShape();
    
    for (let i = 0; i < sides; i++) {
        const a = angle + TWO_PI * (i / sides);
        let sx = x + cos(a) * radius;
        let sy = y + sin(a) * radius;
        vertex(sx, sy);
    }

    endShape();
}

function centerX() {
    return windowWidth / 2;
}

function centerY() {
    return windowHeight / 2;
}