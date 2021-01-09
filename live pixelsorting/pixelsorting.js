let img, baseImg; //img is for manipulating, baseImg to keep the image's original state
let newFileFlag = false; //i couldn't make file handling work nice so it's a mess
let sortBySel, sortRevChk, sortDirSel, sortLineLengthMinInp, sortLineLengthMaxInp, sortLengthWeightedSel; //control html elements

let sortLineLengthMin = 15; //minimum length of sorted lines
let sortLineLengthMax = 40; //maximum length of sorted lines
let sortBy = 'BR'; //(R)ed, (G)reen, (B)lue, (A)lpha, (BR)ightness, (H)ue, (S)aturation, (F)lip
let sortRev = false; //reverse the direction of the sorted lines 
let sortLengthWeighted = 'N'; //(N)ot weighted, weighted (F)or sortBy, weighted (A)gainst sortBy
let resizeImg = true; // resize large images to fit the canvas. false will still scale the image to fit in the display, but does all the sorting on an un-scaled image
let sortDir = 'V'; //sort image (V)ertically, (H)orizontally, (W)alker, (S)piral


let imgx = 0; //to keep track of x position while going over the image
let imgy = 0; //to keep track of y position while going over the image
let spiralTightness = 0; //to keep track of spiral tightness
let loopsPerDraw = 18; //how many sorting loops to go through before drawing to the screen (low = slow, but shows progress)

function preload() {
    baseImg = loadImage('https://openprocessing-usercontent.s3.amazonaws.com/files/user235532/visual948402/h48e2edd4087419d5bddc0ed743daa2fa/lukasz-lada-q7z-AUlHPaw-unsplash.jpg');
}

function setup() {
    pixelDensity(1); //to combat retina displays
    img = baseImg.get();
    let cnv = createCanvas(windowWidth, windowHeight * 0.75); //0.75 to leave space for the controls
    let canvasDiv = createDiv()
        .id('canvasDiv')
        .style('flex-direction:column');
    cnv.parent('canvasDiv');
    img.loadPixels();
    displayScaledImg();
    createControls(); //create html controls below image
}

function draw() {
    clear();
    if (newFileFlag) { //idk 
        img.loadPixels();
        displayScaledImg();
        resetImg();
        newFileFlag = false;
    }

    let loopCount = 0;
    let sortLineLength = sortLineLengthMax;
    if (sortDir == 'V') { //main loop: iterate across img width (imgx) & exit  occasionally to draw updates to screen
        for (imgx; loopCount < loopsPerDraw && imgx < img.width; imgx++) {
            //for each imgx co-ordinate, go down the img height (imgy)
            for (imgy = 0; imgy < img.height; imgy += sortLineLength) {

                //calculate sort line length with weighting if selected & not sorted by 'flip', else random
                if (sortLengthWeighted != 'N' && sortBy != 'F') sortLineLength = weightSortLineLength(fastGet(img, imgx, imgy), sortLengthWeighted, sortBy);
                else sortLineLength = round(random(sortLineLengthMin, sortLineLengthMax));

                //if the section to sort would stretch off the img, just stop at the bottom
                if (imgy + sortLineLength >= img.height) sortLineLength = img.height - imgy;

                //grab from pixels array, add to the array to be sorted
                let lineToSort = [];
                for (let i = 0; i < sortLineLength; i++) {
                    lineToSort.push(fastGet(img, imgx, imgy + i));
                }

                //time to sort!
                lineToSort = sortLine(lineToSort, sortBy);
                if (sortRev) lineToSort.reverse();

                //replace img.pixels with newly sorted pixels
                for (let j = 0; j < lineToSort.length; j++) {
                    fastSet(img, imgx, imgy + j, lineToSort[j]);
                }
            }
            loopCount++;
        }
    } else if (sortDir == 'H') {
        //main loop: iterate across img height (imgy) & exit  occasionally to draw updates to screen
        for (imgy; loopCount < loopsPerDraw && imgy < img.height; imgy++) {
            //for each imgy co-ordinate, go across the img width (imgx)
            for (imgx = 0; imgx < img.width; imgx += sortLineLength) {

                //calculate sort line length with weighting if selected & not sorted by 'flip', else random
                if (sortLengthWeighted != 'N' && sortBy != 'F') sortLineLength = weightSortLineLength(fastGet(img, imgx, imgy), sortLengthWeighted, sortBy);
                else sortLineLength = round(random(sortLineLengthMin, sortLineLengthMax));

                //if the section to sort would stretch off the img, just stop at the edge
                if (imgx + sortLineLength >= img.width) sortLineLength = img.width - imgx;

                //grab from pixels array, add to the array to be sorted
                let lineToSort = [];
                for (let i = 0; i < sortLineLength; i++) {
                    lineToSort.push(fastGet(img, imgx + i, imgy));
                }

                //time to sort!
                lineToSort = sortLine(lineToSort, sortBy);
                if (sortRev) lineToSort.reverse();

                //replace img.pixels with newly sorted pixels
                for (let j = 0; j < lineToSort.length; j++) {
                    fastSet(img, imgx + j, imgy, lineToSort[j]);
                }
            }
            loopCount++;
        }

    } else if (sortDir == 'W') {
        let walkerX = 0,
            walkerY = 0;
        for (let lc = 0; lc < loopsPerDraw; lc++) {
            //calculate sort line length with weighting if selected & not sorted by 'flip', else random
            if (sortLengthWeighted != 'N' && sortBy != 'F') {
                walkerX = weightSortLineLength(fastGet(img, imgx, imgy), sortLengthWeighted, sortBy);
                walkerY = weightSortLineLength(fastGet(img, imgx, imgy), sortLengthWeighted, sortBy);
            } else {
                walkerX = round(random(sortLineLengthMin, sortLineLengthMax));
                walkerY = round(random(sortLineLengthMin, sortLineLengthMax));
            }

            if (random(2) < 1) {
                //walkerX = -walkerX;
                if (imgx - walkerX <= 0) {
                    walkerX = imgx - 1;
                }
                //---
                let lineToSort = [];
                for (let i = 0; i < walkerX; i++) {
                    lineToSort.push(fastGet(img, imgx - i, imgy));
                }

                lineToSort = sortLine(lineToSort, sortBy);
                if (sortRev) lineToSort.reverse();

                for (let i = 0; i < walkerX; i++) {
                    fastSet(img, imgx - i, imgy, lineToSort[i]);
                }
                //---
                imgx -= walkerX;
            } else {
                if (imgx + walkerX >= img.width) {
                    walkerX = img.width - imgx;
                }

                //---
                let lineToSort = [];
                for (let i = 0; i < walkerX; i++) {
                    lineToSort.push(fastGet(img, imgx + i, imgy));
                }

                lineToSort = sortLine(lineToSort, sortBy);
                if (!sortRev) lineToSort.reverse();

                for (let i = 0; i < walkerX; i++) {
                    fastSet(img, imgx + i, imgy, lineToSort[i]);
                }
                //---
                imgx += walkerX;
            }



            if (random(2) < 1) {
                //walkerY = -walkerY;
                if (imgy - walkerY <= 0) {
                    walkerY = imgy - 1;
                }

                //---
                let lineToSort = [];
                for (let i = 0; i < walkerY; i++) {
                    lineToSort.push(fastGet(img, imgx, imgy - i));
                }

                lineToSort = sortLine(lineToSort, sortBy);
                if (!sortRev) lineToSort.reverse();

                for (let i = 0; i < walkerY; i++) {
                    fastSet(img, imgx, imgy - i, lineToSort[i]);
                }
                //---
                imgy -= walkerY;
            } else {
                if (imgy + walkerY >= img.height) {
                    walkerY = img.height - imgy;
                }

                //---
                let lineToSort = [];
                for (let i = 0; i < walkerY; i++) {
                    lineToSort.push(fastGet(img, imgx, imgy + i));
                }

                lineToSort = sortLine(lineToSort, sortBy);
                if (sortRev) lineToSort.reverse();

                for (let i = 0; i < walkerY; i++) {
                    fastSet(img, imgx, imgy + i, lineToSort[i]);
                }
                //---
                imgy += walkerY;
            }
            imgx = constrain(imgx, 0, img.width - 1);
            imgy = constrain(imgy, 0, img.height - 1);

        }
    } else if (sortDir == 'S') {
        imgx = spiralTightness;
        imgy = spiralTightness;
        //console.log(spiralTightness);
        for (imgx; imgx < img.width - spiralTightness; imgx += sortLineLength) {
            if (sortLengthWeighted != 'N' && sortBy != 'F') sortLineLength = weightSortLineLength(fastGet(img, imgx, imgy), sortLengthWeighted, sortBy);
            else sortLineLength = round(random(sortLineLengthMin, sortLineLengthMax));

            if (imgx + sortLineLength >= img.width - spiralTightness) sortLineLength = img.width - imgx - spiralTightness;

            let lineToSort = [];
            for (let i = 0; i < sortLineLength; i++) {
                lineToSort.push(fastGet(img, imgx + i, imgy));
            }

            lineToSort = sortLine(lineToSort, sortBy);
            if (sortRev) lineToSort.reverse();

            for (let j = 0; j < lineToSort.length; j++) {
                fastSet(img, imgx + j, imgy, lineToSort[j]);
            }
        }
        //console.log(spiralTightness);
        for (imgy; imgy < img.height - spiralTightness; imgy += sortLineLength) {
            if (sortLengthWeighted != 'N' && sortBy != 'F') sortLineLength = weightSortLineLength(fastGet(img, imgx, imgy), sortLengthWeighted, sortBy);
            else sortLineLength = round(random(sortLineLengthMin, sortLineLengthMax));

            if (imgy + sortLineLength >= img.height - spiralTightness) sortLineLength = img.height - imgy - spiralTightness;

            let lineToSort = [];
            for (let i = 0; i < sortLineLength; i++) {
                lineToSort.push(fastGet(img, imgx, imgy + i));
            }

            lineToSort = sortLine(lineToSort, sortBy);
            if (sortRev) lineToSort.reverse();

            for (let j = 0; j < lineToSort.length; j++) {
                fastSet(img, imgx, imgy + j, lineToSort[j]);
            }
        }
        //console.log(spiralTightness);
        spiralTightness++;
        imgx = spiralTightness;
        imgy = spiralTightness;
        if (spiralTightness > img.height / 2) noLoop();
    }

    img.updatePixels();
    displayScaledImg();

    //stop going through the draw loop if you've sorted the whole image. loop will restart in resetImg function
    if (imgx >= img.width && imgy >= img.height) noLoop();
}

function sortLine(lineToSort, sortType) {
    switch (sortType) {
        case 'R': //red
            lineToSort.sort((a, b) => a[0] > b[0] ? 1 : -1);
            break;
        case 'G': //green
            lineToSort.sort((a, b) => a[1] > b[1] ? 1 : -1);
            break;
        case 'B': //blue
            lineToSort.sort((a, b) => a[2] > b[2] ? 1 : -1);
            break;
        case 'A': //alpha
            lineToSort.sort((a, b) => a[3] > b[3] ? 1 : -1);
            break;
        case 'BR':
            //brightness - formula shortcut from here stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
            lineToSort.sort((a, b) => fastBrightness(a[0], a[1], a[2]) > fastBrightness(b[0], b[1], b[2]) ? 1 : -1);
            break;
        case 'H':
            //hue - formula from stackoverflow.com/questions/23090019/fastest-formula-to-get-hue-from-rgb
            lineToSort.sort((a, b) => fastHue(a[0], a[1], a[2]) > fastHue(b[0], b[1], b[2]) ? 1 : -1);
            break;
        case 'S':
            //saturation - formula from www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
            lineToSort.sort((a, b) => fastSaturation(a[0], a[1], a[2]) > fastSaturation(b[0], b[1], b[2]) ? 1 : -1);
            break;
        case 'F': //flip
            lineToSort.reverse();
            break;
        default:
            //add r+g+b 
            lineToSort.sort((a, b) => a[0] + a[1] + a[2] > b[0] + b[1] + b[2] ? 1 : -1);
    }
    return lineToSort;
}

function weightSortLineLength(pixel, weightDirection, weightBy) {
    //grabs the value of the first pixel in the line to sort & maps its value to be between 
    //sortLineLengthMin & Max. for ex: the brighter first pixel, the closer the line length is to max length
    let c;

    switch (weightBy) {
        case 'R':
            c = pixel[0];
            break;
        case 'G':
            c = pixel[1];
            break;
        case 'B':
            c = pixel[2];
            break;
        case 'A':
            c = pixel[3];
            break;
        case 'BR':
            c = fastBrightness(pixel[0], pixel[1], pixel[2]);
            break;
        case 'H':
            c = round(map(fastHue(pixel[0], pixel[1], pixel[2]), 0, 360, 0, 255, true));
            break;
        case 'S':
            c = round(map(fastSaturation(pixel[0], pixel[1], pixel[2]), 0, 1, 0, 255, true));
            break;
    }
    //if weighted against is selected, get "opposite" number
    if (weightDirection === 'A') c = 255 - c;

    return round(map(c, 0, 255, sortLineLengthMin, sortLineLengthMax, true));

}

function fastSaturation(red, green, blue) {
    //saturation - formula from www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
    let min = Math.min(Math.min(red, green), blue);
    let max = Math.max(Math.max(red, green), blue);

    let brightness = fastBrightness(red, green, blue);
    let saturation;
    //changed formula here because fastBrightness returns values from 0-255. (127.5 is 1/2, 510 is *2)
    if (brightness <= 127.5) saturation = (max - min) / (max + min);
    if (brightness > 127.5) saturation = (max - min) / (510 - max - min);

    //value between 0-1
    return saturation;
}

function fastBrightness(red, green, blue) {
    //brightness - formula shortcut from here stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
    //value between 0-255
    return (red + red + blue + green + green + green) / 6;
}

function fastHue(red, green, blue) {
    //hue - formula from stackoverflow.com/questions/23090019/fastest-formula-to-get-hue-from-rgb
    let min = Math.min(Math.min(red, green), blue);
    let max = Math.max(Math.max(red, green), blue);

    if (min == max) {
        return 0;
    }

    let newhue = 0;
    if (max == red) {
        newhue = (green - blue) / (max - min);

    } else if (max == green) {
        newhue = 2 + (blue - red) / (max - min);

    } else {
        newhue = 4 + (red - green) / (max - min);
    }

    newhue = newhue * 60;
    if (newhue < 0) newhue = newhue + 360;
    //value between 0-360
    return Math.round(newhue);
}

function fastGet(imageToUse, x, y) {
    //from https://medium.com/@pasquini/lets-build-digital-sand-paintings-with-p5js-a44a3d8587e7
    let index = 4 * (x + imageToUse.width * y);
    return [imageToUse.pixels[index],
        imageToUse.pixels[index + 1],
        imageToUse.pixels[index + 2],
        imageToUse.pixels[index + 3]
    ];
}

function fastSet(imageToUse, x, y, c) {
    //from https://medium.com/@pasquini/lets-build-digital-sand-paintings-with-p5js-a44a3d8587e7
    let index = 4 * (x + imageToUse.width * y);
    imageToUse.pixels[index] = c[0];
    imageToUse.pixels[index + 1] = c[1];
    imageToUse.pixels[index + 2] = c[2];
    imageToUse.pixels[index + 3] = c[3];
}

function resetImg() {
    //reset the image using the original (stored in baseImg) when settings change
    img = null;
    imgx = 0;
    imgy = 0;
    spiralTightness = 0;
    img = baseImg.get();
    if (resizeImg) {
        if (img.width > width) img.resize(width, 0);
        if (img.height > height) img.resize(0, height);
    }
    clear();
    img.loadPixels();
    displayScaledImg();
    loop();
}

function displayScaledImg() {
    if (img.width < width && img.height < height) { //if image is already small, no need to scale
        image(img, (width / 2) - (img.width) / 2, (height / 2) - (img.height) / 2);
    } else { //else scale image to fit on the canvas
        let displayImg = img.get();
        if (displayImg.width > width) displayImg.resize(width, 0);
        if (displayImg.height > height) displayImg.resize(0, height);
        image(displayImg, (width / 2) - (displayImg.width) / 2, (height / 2) - (displayImg.height) / 2);
    }
}

function randomiseSettings() {
    //randomise everything and update the controls to reflect it
    sortBy = random(['R', 'G', 'B', 'A', 'BR', 'H', 'S', 'F']);

    sortDir = random(['V', 'H', 'W']);

    sortLengthWeighted = random(['N', 'F', 'A']);

    sortRev = random([true, false]);
    if (sortBy === 'F') sortRev = false; //flip + reverse = normal image, so stop that from happening

    if (floor(random(0, 2)) === 0) {
        sortLineLengthMin = floor(random(1, img.height));
        sortLineLengthMax = floor(random(sortLineLengthMin, img.height));
    } else {
        sortLineLengthMax = floor(random(1, img.height));
        sortLineLengthMin = floor(random(1, sortLineLengthMax));
    }

    sortBySel.value(sortBy);
    sortDirSel.value(sortDir);
    sortRevChk.checked(sortRev);
    sortLineLengthMinInp.value(sortLineLengthMin);
    sortLineLengthMaxInp.value(sortLineLengthMax);
    sortLengthWeightedSel.value(sortLengthWeighted);

    //console.log('sortby '+sortBy+' weighted '+sortLengthWeighted+' rev '+sortRev+' min '+sortLineLengthMin+' max '+sortLineLengthMax);
    resetImg();
}

function saveImg() {
    //save the image with a unique dated name
    let date = '' + year() + month() + day() + hour() + minute() + second();
    save(img, 'SortedOn' + date + '.png');
}

function handleFile(file) {
    //file handling :/
    if (file.type === 'image') {
        baseImg = null;
        baseImg = loadImage(file.data);
        newFileFlag = true;
    } else {
        console.log('too big or maybe not an image');
    }
}

function createControls() {
    createDiv()
        .id('controls')
        .parent('canvasDiv')
        .style('padding:10px')
        .style('display:flex')
        .style('flex-direction:column')
        .style('align-content:space-between')
        .style('justify-content:center')
        .style('height:24%')
        .style('overflow-y:auto')
        .style('overflow-x:auto');

    createDiv()
        .id('uploadControls')
        .style('left-margin:10px')
        .style('right-margin:10px')
        .style('display:flex')
        .style('flex-direction:row')
        .parent('controls');

    let uploadImgBtn = createFileInput(handleFile, false)
        .style('font-size:1em')
        .parent('uploadControls');

    let resizeChk = createCheckbox('resize large images', true)
        .changed(updateResizeImg)
        .style('font-size:1em')
        .parent('uploadControls');

    /*createP()
		.parent('controls')
		.style('font-size:0.3em');
*/
    createDiv()
        .id('buttonControls')
        .style('left-margin:10px')
        .style('right-margin:10px')
        .style('display:flex')
        .style('flex-direction:row')
        .parent('controls');

    let randomiseBtn = createButton('randomise settings')
        .parent('buttonControls')
        .style('margin:5px')
        .style('font-size:1em')
        .mouseClicked(randomiseSettings);

    let resetBtn = createButton('reset image')
        .parent('buttonControls')
        .style('margin:5px')
        .style('font-size:1em')
        .mouseClicked(resetImg);

    let saveBtn = createButton('save image')
        .parent('buttonControls')
        .style('margin:5px')
        .style('font-size:1em')
        .mouseClicked(saveImg);

    //createP()
    //.parent('controls')
    //.style('font-size:0.3em');

    createDiv()
        .id('sortByControls')
        .style('margin:10px')
        .style('display:flex')
        .style('flex-direction:row')
        .parent('controls');

    createElement('label', 'Sort by:&ensp;')
        .parent('sortByControls')
        .style('font-size:1em')
        .attribute('for', 'sortBySel');

    sortBySel = createSelect()
        .id('sortBySel')
        .style('font-size:1em')
        .parent('sortByControls');
    sortBySel.changed(updateSortBy);
    sortBySel.option('Red', 'R');
    sortBySel.option('Green', 'G');
    sortBySel.option('Blue', 'B');
    sortBySel.option('Alpha', 'A');
    sortBySel.option('Hue', 'H');
    sortBySel.option('Saturation', 'S');
    sortBySel.option('Brightness', 'BR');
    sortBySel.option('Flip', 'F');
    sortBySel.selected('BR');

    createP('&emsp;&emsp;')
        .parent('sortByControls')
        .style('font-size:0.5em');

    createElement('label', 'Sort direction:&ensp;')
        .parent('sortByControls')
        .style('font-size:1em')
        .attribute('for', 'sortDirSel');

    sortDirSel = createSelect()
        .id('sortDirSel')
        .parent('sortByControls')
        .style('font-size:1em');
    sortDirSel.option('Vertical', 'V');
    sortDirSel.option('Horizontal', 'H');
    sortDirSel.option('Spiral WIP', 'S');
    sortDirSel.option('Walker', 'W');
    sortDirSel.selected(true);
    sortDirSel.changed(updateSortDir);

    createP('&emsp;&emsp;')
        .parent('sortByControls')
        .style('font-size:0.5em');

    sortRevChk = createCheckbox('Reverse sort direction', false)
        .parent('sortByControls')
        .style('font-size:1em')
        .changed(updateSortRev);

    createP()
        .parent('controls')
        .style('font-size:0.3em');

    createDiv()
        .id('sortLengthControls')
        .style('display:flex')
        .style('flex-direction:row')
        .parent('controls');

    createElement('label', 'sort length:&emsp;')
        .style('font-size:1em')
        .parent('sortLengthControls');

    sortLineLengthMinInp = createInput(sortLineLengthMin + '')
        .parent('sortLengthControls')
        .style('font-size:1em')
        .attribute('size', '4')
        .changed(updateSortLineLengthMin);
    createElement('label', 'min&emsp;')
        .style('font-size:1em')
        .parent('sortLengthControls')
        .attribute('for', 'sortLineLengthMinInp');

    sortLineLengthMaxInp = createInput(sortLineLengthMax + '')
        .parent('sortLengthControls')
        .style('font-size:1em')
        .attribute('size', '4')
        .changed(updateSortLineLengthMax);
    createElement('label', 'max&emsp;')
        .parent('sortLengthControls')
        .style('font-size:1em')
        .attribute('for', 'sortLineLengthMaxInp');

    sortLengthWeightedSel = createSelect()
        .parent('sortLengthControls')
        .style('font-size:1em');
    sortLengthWeightedSel.option('Not weighted', 'N');
    sortLengthWeightedSel.option('Weighted for', 'F');
    sortLengthWeightedSel.option('Weighted against', 'A');
    sortLengthWeightedSel.changed(updateSortLengthWeighting);

    createP()
        .parent('controls')
        .style('font-size:0.3em');
}

//these update stored values if the sort settings are changed via the html elements
function updateSortBy() {
    sortBy = this.value();
    resetImg();
}

function updateSortDir() {
    sortDir = this.value();
    resetImg();
}

function updateSortRev() {
    sortRev = this.checked();
    resetImg();
}

function updateSortLineLengthMin() {
    let val = int(this.value());
    if (val <= sortLineLengthMax && val >= 0) {
        sortLineLengthMin = val;
        resetImg();
    }
}

function updateSortLineLengthMax() {
    let val = int(this.value());
    if (val >= sortLineLengthMin && val >= 0) {
        sortLineLengthMax = val;
        resetImg();
    }
}

function updateSortLengthWeighting() {
    sortLengthWeighted = this.value();
    resetImg();
}

function updateResizeImg() {
    resizeImg = this.checked();
    resetImg();
}