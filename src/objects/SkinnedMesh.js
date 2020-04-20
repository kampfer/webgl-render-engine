import Mesh from './Mesh';
import { OBJECT_TYPE_SKINNED_MESH } from '../constants';

export default class SkinnedMesh extends Mesh {

    constructor(geometry, material) {
        super(geometry, material);
        this.type = OBJECT_TYPE_SKINNED_MESH;
    }

}