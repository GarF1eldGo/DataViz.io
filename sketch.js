let cnt = 0;
let angle = 0.0;
let prevSec = -1;

// setup() is called once at page-load
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight); // make an HTML canvas element width x height pixels
    canvas.style('display', 'block')
}

// resize canvas when the browser window resizes
function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    background(123)
}

// draw() is called 60 times per second
function draw() {
    let hr = hour();
    let min = minute();
    let sec = second();

    background(225);
    textSize(32);
    fill(180);
    text(hr, 10, 30);
    fill(100);
    text(min, 10, 60);
    fill(0);
    text(sec, 10, 90);

    drawMeteor(sec);

    stroke(0);
    line(0, height / 2, width, height / 2);
    line(width / 2, 0, width / 2, height);

    
}

function drawMeteor(sec) {
    // calculate angle
    if (sec != prevSec) {
        angle = map(sec, 0, 60, 0, TWO_PI) - HALF_PI - 3 * PI / 180; // consider meteor's size
        cnt = 0;
        prevSec = sec;
    }

    if (cnt != 0) {
        angle += 0.1 * Math.PI / 180;
    }

    width = 300;
    height = 300;
    x = width / 2 + 100 * cos(angle);
    y = height / 2 + 100 * sin(angle);

    // calculate gradient color
    gradientColor = lerpColor(color(0, 191, 114), color(5, 25, 55), sec/60);

    // draw meteor
    noStroke();
    fill(gradientColor);
    ellipse(x, y, 20, 20);

    // update cnt
    cnt += 1;
}