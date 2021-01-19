//https://www.rijksmuseum.nl/api/en/collection/?key=rhvQLt9g&format=json&q=van20%rijn
//https://www.rijksmuseum.nl/api/en/collection/?key=rhvQLt9g&format=json&q=van20%vermeer
//https://www.rijksmuseum.nl/api/en/collection/?key=rhvQLt9g&format=json&q=mondriaan
//https://www.rijksmuseum.nl/api/en/collection/?key=rhvQLt9g&format=json&q=van20%gogh

//declare and assign number of rows and columns
var rows = 5;
var columns = 5;

//declare randomColor
var randomColor;

//variables for steps
var stepX;
var stepY;

let img;
let loadedImages;

//const images = ["https://lh5.ggpht.com/QjSoKZOeS1lkYXUgPHgy9W3ZwFYoDGbXLknZ_z5RyjrKbi4eBMDW5ek5O2vcD5Mp-EtAWSIb8vCrqdR2I2HQrBDgpg=s0", "https://lh5.ggpht.com/LeONPNh8oPUpjMUWxUe3d0G_DkktDb3FKgQuy9rRe-1usn_Ls6u5yrQfvlLC3nARNJWTe3ZOLUR7-hbe1Zai6NN3RU8=s0", "https://lh3.googleusercontent.com/tsDt4HzphYAcVQ2pLLVwO0ISrOw8mqwWJxEy_NkCE7Dr5j7AZoIVt8zeW2OFPa8E96ut7hgeMDwd8Ux7eSBCmo1-xpZj=s0", "https://lh4.ggpht.com/p0gQfwn5ryZ6Fazbkv9dG2MGXJlZF0SGuzQRwyBm8W-7H-JhYUgdhkh6R2iDstWCMaAk-Sisg5O1Z1PM4GVGL0xNZHIL=s0"];




const images = [{
        title: "De Nachtwacht",
        url: "https://lh3.googleusercontent.com/J-mxAE7CPu-DXIOx4QKBtb0GC4ud37da1QK7CzbTIDswmvZHXhLm4Tv2-1H3iBXJWAW_bHm7dMl3j5wv_XiWAg55VOM=s0",
        width: 2500,
        height: 2034,
    },
    {
        title: "Het melkmeisje",
        url: "https://lh3.googleusercontent.com/cRtF3WdYfRQEraAcQz8dWDJOq3XsRX-h244rOw6zwkHtxy7NHjJOany7u4I2EG_uMAfNwBLHkFyLMENzpmfBTSYXIH_F=s0",
        width: 2261,
        height: 2548,
    },
    {
        title: "De bedreigde zwaan",
        url: "https://lh3.googleusercontent.com/tm1DbZrAP0uBM-OJhLwvKir1Le5LglRF_bvbaNi6m-F_pIyttsWQz040soRY9pWA9PgNEYFA_fBkg_keYixRXCAjz9Q=s0",
        width: 2916,
        height: 2459,
    },

]


//const randomImage = Math.floor(Math.random() * images.length);

function preload() {

    // for (var k = 0; k < images.length; k++) {
    //     img = loadImage(images[(k - 1)]);
    // }

    loadedImages = images.map((image) => {
        return loadImage(image.url);
    })

    console.log('Loaded images', loadedImages)

    //img = loadImage(images[randomImage]);
    //img = loadImage('https://lh5.ggpht.com/LeONPNh8oPUpjMUWxUe3d0G_DkktDb3FKgQuy9rRe-1usn_Ls6u5yrQfvlLC3nARNJWTe3ZOLUR7-hbe1Zai6NN3RU8=s0');
}

function setup() {


    //tiny canvas
    createCanvas(windowWidth, windowHeight);

    //white background
    background(255);

    //draw rectangles from the corner
    rectMode(CORNER);

    //no border
    noStroke();

    //calculate steps
    stepX = width / columns;
    stepY = height / rows;

    //for loop to iterate columns
    for (var i = 0; i < columns; i++) {

        //for loop to iterate rows
        for (var j = 0; j < (rows + 1); j++) {

            //console.log(images[randomImage]);
            //console.log(i, j);
            //console.log(img);

            var index = randomNumber();

            img = loadedImages[index];

            var a = (i * stepX);
            var b = ((j - 1) * stepY);

            var location = randomLocation(images[index], stepX, stepX);
            //console.log(location);

            image(img, a, b, stepX, stepY, location.x, location.y, stepX, stepY);

            //random gray
            randomColor = color(random(255), random(255), random(255));

            fill(randomColor);
            noStroke();
            rect(i * stepX, j * stepY, stepX, stepY);
        }
    }

}

function randomNumber() {
    return Math.floor(Math.random() * images.length)
}

function randomLocation(image, stepX, stepY) {
    console.log(image, stepX, stepY);
    const x = Math.floor(Math.random() * (image.width - stepX));
    const y = Math.floor(Math.random() * (image.height - stepY));
    //console.log(x, y);
    return { x, y };
}