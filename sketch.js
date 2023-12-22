let cnt = 0;
let angle = 0.0;
let prevSec = -1;
let prevMin = -1;
let secTrail = [];
let backgroundColor = 60;

// TODO: opimize color
// TODO: add motion effect when second run a round
// TODO: add motion effect when minute changes

// setup() is called once at page-load
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight); // make an HTML canvas element width x height pixels
    canvas.style('display', 'block')
}

// resize canvas when the browser window resizes
function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    background(225)
}

// draw() is called 60 times per second
function draw() {
    let hr = hour();
    let min = minute();
    let sec = second();

    // for debug
    background(backgroundColor);
    textSize(32);
    fill(180);
    text(hr, 10, 30);
    fill(100);
    text(min, 10, 60);
    fill(0);
    text(sec, 10, 90);

    // draw seconds 
    gradientSecColor = lerpColor(color(235, 240, 247), color(34, 45, 131), sec/60);
    drawSecondsTrail(gradientSecColor);
    drawMeteor(sec, gradientSecColor);

    // draw minute
    drawMinueTrail(min);
    drawMinute(min);

    // draw hour
    drawHour(hr);

}

function drawSecondsTrail(particleColor) {
    // draw seconds trail
    n = secTrail.length;
    for (let i = 0; i < n; i++) {
        let alpha = i/n * 200;
        secColor = lerpColor(particleColor, color(255, 255, 255, alpha), (n-i)/n);
        r = 20 - (n-i)/n * 10;
        let p = secTrail[i];
        stroke(secColor);
        fill(secColor);
        ellipse(p.x, p.y, r, r);
    }
}

function drawMeteor(sec, color) {
    // calculate angle
    if (sec != prevSec) {
        angle = map(sec, 0, 60, 0, TWO_PI) - HALF_PI - 3 * PI / 180; // consider meteor's size
        cnt = 0;
        prevSec = sec;
    }

    if (cnt != 0) {
        angle += 0.1 * Math.PI / 180;
    }

    let r = 200;
    x = windowWidth / 2  + r * cos(angle);
    y = windowHeight / 2  + r * sin(angle);

    // draw meteor
    noStroke();
    fill(color);
    ellipse(x, y, 20, 20);

    // update cnt
    cnt += 1;
    secTrail.push(new Particle(r, angle));
    if (secTrail.length > 80) {
        secTrail.shift();// remove the first element
    }
}

function drawMinueTrail(min) {
    targetAngle = map(min, 0, 60, 0, TWO_PI) - HALF_PI;
    for (let i = -HALF_PI; i < targetAngle; i += 0.01){
        minColor = lerpColor(color(235, 240, 247), color(34, 45, 131), (i + HALF_PI)/TWO_PI);
        let r = 130;
        let x = windowWidth / 2  + r * cos(i);
        let y = windowHeight / 2  + r * sin(i);
        stroke(minColor);
        fill(minColor);
        ellipse(x,y, 20, 20);
    }
}

function drawMinute(min) {
    // draw minute
    let r = 130;
    let angle = map(min, 0, 60, 0, TWO_PI) - HALF_PI;
    let x = windowWidth / 2  + r * cos(angle);
    let y = windowHeight / 2  + r * sin(angle);
    minColor = lerpColor(color(235, 240, 247), color(34, 45, 131), min/60);
    stroke(minColor);
    fill(minColor);
    ellipse(x,y, 20, 20);

    // update minTrail
    if (min != prevMin) {
        prevMin = min;
        console.log(min)
    }
}

function drawHour(hr) {
    // draw hour
    let r = 80;
    let angle = map(hr, 0, 24, 0, TWO_PI) - HALF_PI;
    for (let i = -HALF_PI; i < angle; i += 0.01){
        hourColor = lerpColor(color(235, 240, 247), color(34, 45, 131), (i + HALF_PI)/TWO_PI);
        let x = windowWidth / 2  + r * cos(i);
        let y = windowHeight / 2  + r * sin(i);
        stroke(hourColor);
        fill(hourColor);
        ellipse(x, y, 40, 40);
    }
}

class Particle {
    constructor(r, angle) {
        this.r = r;
        this.angle = angle;
        this.x = windowWidth / 2  + r * cos(angle);
        this.y = windowHeight / 2  + r * sin(angle);
    }
}