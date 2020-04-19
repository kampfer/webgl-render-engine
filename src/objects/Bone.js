import GraphObject from './GraphObject';
import { OBJECT_TYPE_BONE } from '../constants';

export default class Bone extends GraphObject {

    constructor() {
        super();
        this.type = OBJECT_TYPE_BONE;
    }

}