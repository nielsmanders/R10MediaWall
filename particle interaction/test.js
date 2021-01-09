let amt, startColor, newColor;

function setup() {
    createCanvas(400, 400);

    startColor = color(255, 255, 255);
    newColor = color(random(255), random(255), random(255));
    amt = 0;

    background(startColor);

}

function draw() {
    background(lerpColor(startColor, newColor, amt));
    amt += 0.01;
    if (amt >= 1) {
        amt = 0.0;
        startColor = newColor;
        newColor = color(random(255), random(255), random(255));
    }
}