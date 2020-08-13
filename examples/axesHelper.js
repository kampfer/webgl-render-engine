import Example from './example';
import AxesHelper from '../src/helpers/AxesHelper';

export default class AxesHelperExample extends Example {

    constructor() {

        super();

        this.scene.add(new AxesHelper(1));

    }

}
