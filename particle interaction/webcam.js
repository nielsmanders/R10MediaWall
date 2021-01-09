// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 16-14: Overall motion

// Variable for capture device
let video;
// Previous Frame
let prevFrame;
// How different must a pixel be to be a "motion" pixel
let threshold = 50;

function setup() {
    createCanvas(320, 240);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();
    // Create an empty image the same size as the video
    prevFrame = createImage(video.width, video.height, RGB);
}

function draw() {

    video.loadPixels();
    prevFrame.loadPixels();

    let totalMotion = 0;

    // Begin loop to walk through every pixel
    for (let x = 0; x < video.width; x++) {
        for (let y = 0; y < video.height; y++) {

            // Step 1, what is the location into the array
            let loc = (x + y * video.width) * 4;

            // Step 2, what is the previous color
            let r1 = prevFrame.pixels[loc];
            let g1 = prevFrame.pixels[loc + 1];
            let b1 = prevFrame.pixels[loc + 2];

            // Step 3, what is the current color
            let r2 = video.pixels[loc];
            let g2 = video.pixels[loc + 1];
            let b2 = video.pixels[loc + 2];

            // Step 4, compare colors (previous vs. current)
            let diff = dist(r1, g1, b1, r2, g2, b2);

            totalMotion += diff;
        }
    }

    // Save frame for the next cycle
    if (video.canvas) {
        prevFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height); // Before we read the new frame, we always save the previous frame for comparison!
    }


    // averageMotion is total motion divided by the number of pixels analyzed.
    let avgMotion = totalMotion / (video.width * video.height);

    // Draw a circle based on average motion
    noStroke();
    fill(0);
    var r = avgMotion * 2;
    //ellipse(width / 2, height / 2, r, r);

    //background(220, 100, 50);

    //fill(0, 0, 255, (r * 10))
    //ellipse(width / 2, height / 2, 50, 50);

    var cookie = (Math.floor(avgMotion));

    //console.log(r);
    //console.log(cookie);
    //sessionStorage.setItem("avgMotion", r);
    //document.cookie = 'avgMotion=' + r + ';';
    //document.cookie = 'avgMotion=' + r + '; expires=Thu, 18 Dec 2043 12:00:00 UTC; path=/';

    var cookieAvgMotionName = "cookieAvgMotion"
    if (isBigEnough(cookie) == true) {
        document.cookie = cookieAvgMotionName + "=" + cookie;
    }


    //console.log(document.cookie);
    console.log(getCookie(cookieAvgMotionName));
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

function isBigEnough(cookie) {
    return cookie >= 1;
}