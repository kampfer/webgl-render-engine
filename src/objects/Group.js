import GraphObject from './GraphObject';
import {
    OBJECT_TYPE_GROUP
} from '../constants';

export default class Group extends GraphObject {

    constructor() {
        super();
        this.type = OBJECT_TYPE_GROUP;
    }

}
