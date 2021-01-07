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
var particles = 2000;
var deviation = 20;
var speed = 0.002;

const colorSchemes = [
    ["#581845", "#900C3F", "#C70039", "#FF5733", "#FFC30F"],
    ["#fff222", "#222fff", "#fcfcfc", "#ffffff", "#fgfgfg"],
    ["#fac901", "#225095", "#dd0100", "#ffffff", "#000000"]
];

//auto change
let changeDuration = 300;
let lastChange = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);

    xScale = width / 20;
    yScale = height / 20 * (width / height);

    centerX = width / 2;
    centerY = height / 2;

    // const colorSchemes = [
    //     [color("#581845"), color("#900C3F"), color("#C70039"), color("#FF5733"), color("#FFC30F")],
    //     [color("#fff222"), color("#222fff"), color("#fcfcfc"), color("#ffffff"), color("#fgfgfg")],
    //     [color("#fac901"), color("#225095"), color("#dd0100"), color("#ffffff"), color("#000000")]
    // ];

    // colors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    //colors = colorSchemes[colorIndex];
    //colors = [color("#581845"), color("#900C3F"), color("#C70039"), color("#FF5733"), color("#FFC30F")];
}

function draw() {

    // //DEBUG
    // textSize(20);
    // noStroke();
    // fill(255);
    // ellipse(centerX, centerY, 60, 60);
    // fill(0);
    // text(variation, centerX, centerY - 10);
    // text(length, centerX, centerY + 10);


    //////////////////////////////////////////////////
    //replacing this with mouseclicked function

    // if (mouseIsPressed) {
    //     for (let i = 0; i < 20; i++) {

    //         // let x = mouseX + random(-100, 100);
    //         // let y = mouseY + random(-100, 100);


    //         let x = Math.round(Math.random(0, 1) * maxX);
    //         let y = Math.round(Math.random(0, 1) * maxY);


    //         console.log(x);
    //         console.log(y);

    //         var blob = {
    //             x: getXPos(x),
    //             y: getYPos(y),
    //             size: random(1, 5),
    //             lastX: x,
    //             lastY: y,
    //             color: colors[floor(random(colors.length))],
    //             direction: random(0.1, 1) * (random() > 0.5 ? 1 : -1)
    //         };
    //         blobs.push(blob);
    //     }
    // }

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

//testing different triggers
function mouseClicked() {
    //colorIndex = colorIndex;
    //colorIndex = Math.floor(Math.random() * colorSchemes.length);
}

function keyPressed() {
    test();
}

function test() {

    // const colorSchemes = [
    //     [color("#581845"), color("#900C3F"), color("#C70039"), color("#FF5733"), color("#FFC30F")],
    //     [color("#fff222"), color("#222fff"), color("#fcfcfc"), color("#ffffff"), color("#fgfgfg")],
    //     [color("#fac901"), color("#225095"), color("#dd0100"), color("#ffffff"), color("#000000")]
    // ];

    //colorIndex = Math.round(Math.random() * (colorSchemes.length));
    //console.log("colorIndex: " + Math.floor(Math.random() * colorSchemes.length))

    colorIndex = Math.floor(Math.random() * colorSchemes.length);

    //colors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    colors = colorSchemes[colorIndex];

    //colors = [color("#581845"), color("#900C3F"), color("#C70039"), color("#FF5733"), color("#FFC30F")];
    //colors = colorSchemes[2];

    let x = Math.round(Math.random(0, 1) * maxX);
    let y = Math.round(Math.random(0, 1) * maxY);

    for (let i = 0; i < particles; i++) {

        // let x = mouseX + random(-100, 100);
        // let y = mouseY + random(-100, 100);

        x = x + Math.round(random((-1 * deviation), deviation));
        y = y + Math.round(random((-1 * deviation), deviation));


        //console.log(x);
        //console.log(y);

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