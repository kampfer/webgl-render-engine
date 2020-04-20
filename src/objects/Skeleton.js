import GraphObject from './GraphObject';
import { OBJECT_TYPE_SKELETON } from '../constants';

export default class Skeleton extends GraphObject {

    constructor() {
        super();
        this.type = OBJECT_TYPE_SKELETON;
    }

}