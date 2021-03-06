var gl, noctaves, c;

//variables for randomwords code
var excecuted = false;
var excecutedNumber = 0;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    gl = this.canvas.getContext('webgl');
    gl.disable(gl.DEPTH_TEST);
    noctaves = 4;
    c = [];
    initc();
    test = new p5.Shader(this._renderer, vert, frag); //shaders are loaded
    shader(test); //shaders are applied   
}

function initc() {
    for (var i = 0; i < 22; i++) {
        c[i] = random(-5, 5);
    }
}

function draw() {

    var mouseX = sessionStorage.getItem("x");
    // console.log("x:" + mouseX);

    var mouseY = sessionStorage.getItem("y");
    // console.log("y" = mouseY);

    var handX = mouseX * 10;
    var handY = mouseY * 10;

    test.setUniform("iResolution", [width, height]); //pass some values to the shader
    test.setUniform("iTime", millis() * .001);
    test.setUniform('iMouse', [handX, handY]);
    test.setUniform("noctaves", noctaves);
    test.setUniform("c", c);
    shader(test);
    box(width / 2);
}

function mouseReleased() {
    noctaves = (noctaves == 5) ? 4 : noctaves + 1;
    if (noctaves == 4) initc();
}