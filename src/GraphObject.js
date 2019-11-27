import EventEmitter from 'events';
import composable from './composable';

export default composable(class GraphObject extends EventEmitter {

    constructor() {
        super();
    }

});