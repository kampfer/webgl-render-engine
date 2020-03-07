import GraphObject from './GraphObject';
import {
    OBJECT_TYPE_SCENE
} from '../constants';

export default class Scene extends GraphObject {

    constructor() {
        super();
        this.type = OBJECT_TYPE_SCENE;
    }

}
