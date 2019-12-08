export function getWebGLContext(canvas) {
    let names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    let context = null;
    for (let i = 0; i < names.length; i++) {
        try {
            context = canvas.getContext(names[i]);
        } catch (e) { }
        if (context) {
            break;
        }
    }
    return context;
}

export function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    if (!shader) {
        console.warn('unable to create shader');
        return null;
    }

    // Set the shader program
    gl.shaderSource(shader, source);

    // Compile the shader
    gl.compileShader(shader);

    // Check the result of compilation
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        var error = gl.getShaderInfoLog(shader);
        console.warn('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

export function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    if (!program) {
        console.warn('unable to create program');
        return null;
    }

    // Attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link the program object
    gl.linkProgram(program);

    // Check the result of linking
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        var error = gl.getProgramInfoLog(program);
        console.warn('Failed to link program: ' + error);
        gl.deleteProgram(program);
        return null;
    }

    return program;
}

export function createProgramBySource(gl, vShaderSource, fShaderSource) {
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fShaderSource);
    if (!vertexShader || !fragmentShader) {
        return null;
    }

    let program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
        return null;
    }

    return program;
}
