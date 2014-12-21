/**
 * beefy-fun
 * This is webgl initializer for Kenji Saito module
 * it is based from https://github.com/greggman/webgl-fundamentals/blob/master/webgl/resources/webgl-utils.js
 *
 * @package KsGlInitializer
 * @author Kenji Saito <k.saito.1985@gmail.com>
 */

/**
 * Constructor
 */
function KsGlInitializer () {
    var self = this;

    var defaultShaderType = [
        "VERTEX_SHADER",
        "FRAGMENT_SHADER"
    ];

    self = {
        setupWebGL : function(canvas, option){
            var names = ["webgl", "experimental-webgl"];

            var glContext = null;

            for(var ii = 0; ii < names.length; ii++ ){
                try {
                    glContext = canvas.getContext( names[ii], option );
                }catch (e){}

                if(glContext){
                    break;
                }
            }
            return glContext;
        },

        /**
         * Creates a program, attaches shaders, binds attrib locations, links the
         * program and calls useProgram.
         * @param {WebGLShader[]} shaders The shaders to attach
         * @param {string[]?} opt_attribs The attribs names.
         * @param {number[]?} opt_locations The locations for the
         *        attribs.
         * @param {function(string): void) opt_errorCallback callback for errors.
        */
        loadProgram : function(gl, shaders, opt_attribs, opt_locations, opt_errorCallback){
            var errFn = opt_errorCallback || error;
            var program = gl.createProgram();
            for (var ii = 0; ii < shaders.length; ++ii) {
                gl.attachShader(program, shaders[ii]);
            }

            if (opt_attribs) {
                for (var ii = 0; ii < opt_attribs.length; ++ii) {
                    gl.bindAttribLocation(
                        program,
                        opt_locations ? opt_locations[ii] : ii,
                        opt_attribs[ii]);
                }
            }
            gl.linkProgram(program);

            // Check the link status
            var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linked) {
                // something went wrong with the link
                var lastError = gl.getProgramInfoLog (program);
                errFn("Error in program linking:" + lastError);

                gl.deleteProgram(program);
                return null;
            }

            return program;

        },

        /**
         * Creates a program from 2 script tags.
         *
         * @param {WebGLRenderingContext} gl The WebGLRenderingContext
         *        to use.
         * @param {string[]} shaderScriptIds Array of ids of the script
         *        tags for the shaders. The first is assumed to be the
         *        vertex shader, the second the fragment shader.
         * @param {string[]?} opt_attribs The attribs names.
         * @param {number[]?} opt_locations The locations for the
         *        attribs.
         * @param {function(string): void) opt_errorCallback callback for errors.
         * @return {WebGLProgram} The created program.
         */
        createShadersFromHTML : function( gl, shaderScriptIds, opt_attribs, opt_locations, opt_errorCallback){
            var shaders = [];
            for(var ii = 0; ii < shaders.length; ii++ ){
                shaders.push(this.createShaderFromScript(
                    gl, shaderScriptIds[ii], gl[defaultShaderType[ii]], opt_errorCallback));
            }

            var program = this.loadProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);
            return program;
        },

        /**
         * Loads a shader from script tag.
         * @param {WebGLRenderingContext} gl The webg
         * @param scriptId
         * @param opt_shaderType
         * @param opt_errorCallback
         * @return {*}
         */
        createShaderFromScript : function(gl, scriptId, opt_shaderType, opt_errorCallback){
            var shaderSource = "";
            var shaderType;
            var shaderScript = document.getElementById(scriptId);
            if(!shaderScript) throw("*** Error: unknown script element" + scriptId);
            shaderSource = shaderScript.text;

            if(!opt_shaderType) {
                if(shaderScript.type == "x-shader/x-vertex")         shaderType = gl.VERTEX_SHADER;
                else if(shaderScript.type == "x-shader/x-fragment")  shaderType = gl.FRAGMENT_SHADER;
                else {
                    throw("*** Error: unknown shader type");
                    return null;
                }
            }

            var shader =  this.loadShader(gl, shaderSource, opt_shaderType ? opt_shaderType : shaderType,
                opt_errorCallback);

            return shader;
        },

        /**
         * Loads a shader
         *
         * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
         * @param {string} shaderSource The shader source.
         * @param {number} shaderType the type of shader.
         * @param {function(string): void} opt_errorCallback
         * @return {WebGLShader} the created shader.
         */
        loadShader : function(gl, shaderSource, shaderType, opt_errorCallback) {
            var errFn = opt_errorCallback || error;
            // Create the shader object.
            var shader = gl.createShader(shaderType);

            // Compile the shader
            gl.compileShader(shader);

            // Check the compile status
            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if(!compiled){
                // Something went wrong during compilation: get the error
                var lastError = gl.getShaderInfoLog(shader);
                errFn("*** Error compiling shader '" + shader + "':" + lastError);
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        }


    }

};


/**
 * Export
 */
module.exports = KsGlInitializer;
