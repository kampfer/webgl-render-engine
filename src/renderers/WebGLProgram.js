export default class {
    
    constructor() {

    }

    getActiveAttributesLocation() {
        let n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for(let i = 0; i < n; i++) {
            let info = gl.getActiveAttrib(program, i);
            console.log(info);
        }
    }

    getActiveUniformsLocation() {}

}