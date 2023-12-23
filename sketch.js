let cnt = 0;
let angle = 0.0;
let prevSec = -1;
let prevMin = -1;
let secTrail = [];
let backgroundColor = 60;

// TODO: opimize color
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
    let sec = second();

    // for debug
    background(backgroundColor);
    // textSize(32);
    // fill(180);
    // text(hr, 10, 30);
    // fill(100);
    // text(min, 10, 60);
    // fill(0);
    // text(sec, 10, 90);

    // draw seconds 
    gradientSecColor = lerpColor(color("#ebf0f7"), color("#222D83"), sec/60);
    drawSecondsTrail(sec, gradientSecColor);
    drawMeteor(sec, gradientSecColor);

    // draw minute
    drawMinueTrail(min, sec);
    drawMinute(min, sec);

    // draw hour
    drawHourTrail(hr);
    drawHour(hr);
}

function drawSecondsTrail(sec, particleColor) {
    // draw seconds trail
    if (sec == 0 && cnt < 15) {
        particleColor = lerpColor(color("#222D83"), color("#ebf0f7"), (60+cnt)/75);
    }
    if (sec == 59 ) {
        particleColor = lerpColor(color("#222D83"), color("#ebf0f7"), cnt/75);
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
        if (cnt > 0){
            tinyR = 15 + min(cnt, 20) * 0.5;
            noStroke();
            fill(250, 250, 103, 150);
            ellipse(x, y, tinyR, tinyR);
        }  
        if (cnt > 20) {
            midR = 25 + (min(cnt, 40) - 20 ) * 0.5;
            noStroke();
            fill(250, 250, 176, 100);
            ellipse(x, y, midR, midR);
        }
        if (cnt > 40) {
            largeR = 45 + (min(cnt, 60) - 40 ) * 0.5;
            noStroke();
            fill(250, 250, 210, 50);
            ellipse(x, y, largeR, largeR);
        }
    }

    if (sec == 0){// halo shrink
        if (cnt < 20) {
            largeR = 45 + 10 - cnt * 0.5;
            noStroke();
            fill(250, 250, 103, 50);
            ellipse(x, y, largeR, largeR);
        }
        if (cnt < 40) {
            midR = 25 + 20 - max(cnt, 20) * 0.5;
            noStroke();
            fill(250, 250, 176, 100);
            ellipse(x, y, midR, midR);
        }
        if (cnt < 60) {
            tinyR = 15 + 30 - max(cnt, 40) * 0.5;
            noStroke();
            fill(250, 250, 210, 150);
            ellipse(x, y, tinyR, tinyR);
        }
    }

    // adjust color gradually 
    if (sec == 59) {
        secColor = lerpColor(color("#222D83"), color("#ebf0f7"), cnt/75);
    }
    if (sec == 0 && cnt < 15) {
        secColor = lerpColor(color("#222D83"), color("#ebf0f7"), (60+cnt)/75);
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

function drawMinueTrail(min, sec) {
    targetAngle = map(min*60+sec, 0, 3600, 0, TWO_PI) - HALF_PI;
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

function drawMinute(min, sec) {
    // draw minute
    let r = 130;
    let angle = map(min*60+sec, 0, 3600, 0, TWO_PI) - HALF_PI;
    let x = windowWidth / 2  + r * cos(angle);
    let y = windowHeight / 2  + r * sin(angle);
    minColor = lerpColor(color("#ebf0f7"), color("#222D83"), min/60);
    stroke(minColor);
    fill(minColor);
    ellipse(x,y, 20, 20);

    // update minTrail
    if (min != prevMin) {
        prevMin = min;
        console.log("minute: ",min)
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