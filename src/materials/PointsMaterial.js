import Material from './Material';

export default class PointMaterial extends Material {

    constructor(opts) {
        super(opts);
        this.pointSize = opts.pointSize;
    }

}