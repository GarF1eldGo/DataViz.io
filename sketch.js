let cnt = 0;
let angle = 0.0;
let prevSec = -1;
let prevMin = -1;
let secTrail = [];
let backgroundColor = 60;

// for debug
let sec = 57;

// TODO: opimize color
// TODO: add motion effect when second run a round
// TODO: add motion effect when minute changes
// TODO: add stars background

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
    // let sec = second();
    if (cnt == 59) {
        sec += 1;
    }
    sec = sec % 60;

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
    gradientSecColor = lerpColor(color("#ebf0f7"), color("#222D83"), sec/60);
    drawSecondsTrail(sec, gradientSecColor);
    drawMeteor(sec, gradientSecColor);

    // draw minute
    drawMinueTrail(min);
    drawMinute(min);

    // draw hour
    drawHourTrail(hr);
    drawHour(hr);
}

function drawSecondsTrail(sec, particleColor) {
    // draw seconds trail
    if (sec == 0) {
        particleColor = lerpColor(particleColor, color("#ebf0f7"), (60+cnt)/120);
    }
    if (sec == 59 ) {
        particleColor = lerpColor(particleColor, color("#ebf0f7"), cnt/120);
    }

    n = secTrail.length;
    for (let i = 0; i < n; i++) {
        let alpha = i/n * 200;
        secColor = lerpColor(particleColor, color(235, 240, 247, alpha), (n-i)/n);
        r = 20 - (n-i)/n * 10;
        let p = secTrail[i];
        stroke(secColor);
        fill(secColor);
        ellipse(p.x, p.y, r, r);
    }
}

function drawMeteor(sec, secColor) {
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

    // draw halo
    if (sec == 59) { // halo expand
        noFill();
        n = min(cnt, 25)
        let originR = 15
        for (let i=0; i<n; i++){
            let alpha = map(i, 0, n, 225, 0)
            let haloColor = lerpColor(color(backgroundColor), color(250, 250, 210, alpha), (n-i)/n)
            originR += (n-i)/n * 3
            strokeWeight((n-i)/n * 3)
            stroke(haloColor);
            ellipse(x, y, originR, originR);
        }
        strokeWeight(1)// reset strokeWeight
    }

    if (sec == 0){// halo shrink
        noFill();
        
    }


    // adjust color when sec == 59
    if (sec == 59) {
        secColor = lerpColor(secColor, color("#ebf0f7"), cnt/120);
    }
    if (sec == 0) {
        secColor = lerpColor(secColor, color("#ebf0f7"), (60+cnt)/120);
    }

    // draw meteor
    noStroke();
    fill(secColor);
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
        minColor = lerpColor(color("#ebf0f7"), color("#222D83"), (i + HALF_PI)/TWO_PI);
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
    minColor = lerpColor(color("#ebf0f7"), color("#222D83"), min/60);
    stroke(minColor);
    fill(minColor);
    ellipse(x,y, 20, 20);

    // update minTrail
    if (min != prevMin) {
        prevMin = min;
        console.log(min)
    }
}

function drawHourTrail(hr) {
    // draw hour
    let r = 80;
    hr12 = hr % 12
    let angle = map(hr12, 0, 12, 0, TWO_PI) - HALF_PI;
    for (let i = -HALF_PI; i < angle; i += 0.01){
        hourColor = lerpColor(color("#ebf0f7"), color("#222D83"), (i + HALF_PI)/TWO_PI);
        let x = windowWidth / 2  + r * cos(i);
        let y = windowHeight / 2  + r * sin(i);
        stroke(hourColor);
        fill(hourColor);
        ellipse(x, y, 40, 40);
    }
}

function drawHour(hr){
    // draw hour
    let r = 80;
    hr12 = hr % 12
    let angle = map(hr12, 0, 12, 0, TWO_PI) - HALF_PI;
    let x = windowWidth / 2  + r * cos(angle);
    let y = windowHeight / 2  + r * sin(angle);
    hourColor = lerpColor(color("#ebf0f7"), color("#222D83"), hr12/12);
    stroke(hourColor);
    fill(hourColor);
    ellipse(x, y, 40, 40);
}

class Particle {
    constructor(r, angle) {
        this.r = r;
        this.angle = angle;
        this.x = windowWidth / 2  + r * cos(angle);
        this.y = windowHeight / 2  + r * sin(angle);
    }
}