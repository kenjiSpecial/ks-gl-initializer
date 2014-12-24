/**
 *
 * Created by kenji-special on 12/22/14.
 */


var ksGl = require('./index.js');

var canvas = document.getElementById("c");
var gl = ksGl.setupWebGL(canvas, { width: window.innerWidth, height: window.innerHeight });
if (!gl) {
    return;
}

// setup GLSL program
var program = ksGl.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
gl.useProgram(program);

// look up where the vertex data needs to go.
var positionLocation = gl.getAttribLocation(program, "a_position");

// lookup uniforms
var timeLocation = gl.getUniformLocation(program, "u_time");
var mouseLocation = gl.getUniformLocation(program, "u_mouse");

// Create a buffer and put a single clipspace rectangle in
// it (2 triangles)
var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1.0, -1.0,
    1.0, -1.0,
    -1.0,  1.0,
    -1.0,  1.0,
    1.0, -1.0,
    1.0,  1.0]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// draw
gl.drawArrays(gl.TRIANGLES, 0, 6);

var request;
var totalTime = 0;
var startTime = new Date().getTime();

loop();

var mousePos = {x: 0, y: 0};


function loop(){
    // initialize canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    totalTime = (new Date().getTime() - startTime) /1000 ;
    var value = (Math.cos(totalTime) + 1 ) / 2;

    gl.uniform1f(timeLocation, value);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.flush();

    request = requestAnimationFrame(loop);
}

