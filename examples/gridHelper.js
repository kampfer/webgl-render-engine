import GridHelper from '../src/helpers/GridHelper';
import Example from './Example';

export default class GridHelperExample extends Example {

    constructor() {
        super();

        let gridHelper = new GridHelper(100, 100, 'red');
        this.scene.add(gridHelper);
    }

}