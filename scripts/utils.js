'use strict'

function normalizeAngle(angle) {
    let newAngle = angle - TWO_PI * floor((angle + PI) / TWO_PI);
    return newAngle;
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