import EventEmitter from 'events';
import composable from './composable';
import Mat4 from './math/mat4';

export default composable(class GraphObject extends EventEmitter {

    constructor() {
        super();
        this.matrix = new Mat4();
    }

    update() {}

});