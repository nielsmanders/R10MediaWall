var capture;
var video;
var imgName;


function setup() {
    createCanvas(1920, 1080);
    video = createCapture(VIDEO);
    video.position(0, 0);
    video.size(1920, 1080);
}

function draw() {
    video.show();
    filter('THRESHOLD');
    image(video, 0, 0);
}

function mousePressed() {
    imgName = new Date().toISOString().slice(0, 19).replace(/-/g, "");
    //save(imgName);
    //storeItem(save(imgName));
    //console.log(imgName);

    // saveFrames('out', 'png', 1, 1, data => {
    //     console.log(data);
    // });

}