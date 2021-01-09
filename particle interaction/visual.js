/******************
Code by Vamoss
Original code link:
https://www.openprocessing.org/sketch/751983

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

//Inspired by Felix Auer
//http://www.felixauer.com/javascript/difeqrk.html

var blobs = [];
let variation = 0;
let xScale, yScale, centerX, centerY;
var maxX = window.innerWidth;
var maxY = window.innerHeight;

//particles
var particles = 200;
var deviation = 20;
var speed = 0.001;

//motion
var avgMotion;

const colorSchemes = [
    ["#581845", "#900C3F", "#C70039", "#FF5733", "#FFC30F"],
    ["#a7414a", "#282726", "#6a8a82", "#a37c27", "#563838"],
    ["#c2d3da", "#81a3a7", "#585a56", "#f1f3f2", "#272424"],
    ["#000d29", "#118c8b", "#bca18d", "#f2746b", "#f14d49"],
    ["#5aa382", "#78d6ac", "#bda728", "#704307", "#f7b178"],
    ["#e0e8f0", "#51a2d9", "#53c0f0", "#b9e5f3", "#8a140e"]
];

//auto change
let changeDuration = 10000;
let lastChange = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);

    xScale = width / 20;
    yScale = height / 20 * (width / height);

    centerX = width / 2;
    centerY = height / 2;

}

function draw() {


    var cookieAvgMotionName = "cookieAvgMotion";
    var cookie = getCookie(cookieAvgMotionName);

    var old_min = 0;
    var old_max = 100;
    var new_min = 0.001;
    var new_max = 0.1;

    speed = ((cookie - old_min) / (old_max - old_min)) * (new_max - new_min) + new_min

    console.log("Cookie:" + cookie + ";");
    console.log("Speed:" + speed + ";");

    var length = blobs.length;
    if (length == 0) {
        background("#1a0633");
        noStroke();
        fill(255);
        textSize(40);
        //text("Press to emmit particles", centerX, centerY);
        return;
    }

    noStroke();
    fill(26, 6, 51, 10);
    rect(0, 0, width, height);

    //auto change
    let time = millis();
    if (time - lastChange > changeDuration) {
        lastChange = time;
        variation++;
        if (variation > 11) variation = 0;
    }

    var stepsize = deltaTime * speed;
    for (var i = length - 1; i >= 0; i--) {
        let blob = blobs[i];

        var x = getSlopeX(blob.x, blob.y);
        var y = getSlopeY(blob.x, blob.y);
        blob.x += blob.direction * x * stepsize;
        blob.y += blob.direction * y * stepsize;

        x = getXPrint(blob.x);
        y = getYPrint(blob.y);
        stroke(blob.color);
        strokeWeight(blob.size);
        line(x, y, blob.lastX, blob.lastY);
        blob.lastX = x;
        blob.lastY = y;

        const border = 200;
        if (x < -border || y < -border || x > width + border || y > height + border) {
            blobs.splice(i, 1);
        }
    }
}

function getSlopeY(x, y) {
    switch (variation) {
        case 0:
            return Math.sin(x);
        case 1:
            return Math.sin(x * 5) * y * 0.3;
        case 2:
            return Math.cos(x * y);
        case 3:
            return Math.sin(x) * Math.cos(y);
        case 4:
            return Math.cos(x) * y * y;
        case 5:
            return Math.log(Math.abs(x)) * Math.log(Math.abs(y));
        case 6:
            return Math.tan(x) * Math.cos(y);
        case 7:
            return -Math.sin(x * 0.1) * 3; //orbit
        case 8:
            return (x - x * x * x) * 0.01; //two orbits
        case 9:
            return -Math.sin(x);
        case 10:
            return -y - Math.sin(1.5 * x) + 0.7;
        case 11:
            return Math.sin(x) * Math.cos(y);
    }
}

function getSlopeX(x, y) {
    switch (variation) {
        case 0:
            return Math.cos(y);
        case 1:
            return Math.cos(y * 5) * x * 0.3;
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            return 1;
        case 7:
            return Math.sin(y * 0.1) * 3; //orbit
        case 8:
            return y / 3; //two orbits
        case 9:
            return -y;
        case 10:
            return -1.5 * y;
        case 11:
            return Math.sin(y) * Math.cos(x);
    }
}

function getXPos(x) {
    return (x - centerX) / xScale;
}

function getYPos(y) {
    return (y - centerY) / yScale;
}

function getXPrint(x) {
    return xScale * x + centerX;
}

function getYPrint(y) {
    return yScale * y + centerY;
}

function mouseClicked() {
    test();
}

function keyPressed() {
    test();
}

function test(avgMotion) {

    colorIndex = Math.floor(Math.random() * colorSchemes.length);
    colors = colorSchemes[colorIndex];

    let x = Math.round(Math.random(0, 1) * maxX);
    let y = Math.round(Math.random(0, 1) * maxY);

    for (let i = 0; i < particles; i++) {

        // let x = mouseX + random(-100, 100);
        // let y = mouseY + random(-100, 100);

        x = x + Math.round(random((-1 * deviation), deviation));
        y = y + Math.round(random((-1 * deviation), deviation));

        var blob = {
            x: getXPos(x),
            y: getYPos(y),
            size: random(1, 5),
            lastX: x,
            lastY: y,
            color: colors[floor(random(colors.length))],
            direction: random(0.1, 1) * (random() > 0.5 ? 1 : -1)
        };
        blobs.push(blob);
    }
}

function getCookie(cookieAvgMotionName) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == cookieAvgMotionName) {
            return unescape(y);
        }
    }
}