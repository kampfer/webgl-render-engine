import Texture from './Texture';
import { NEAREST_FILTER, DATA_TEXTURE } from '../constants';

export default class DataTexture extends Texture {

    constructor(args = {}) {

        super(args);

        let { 
            data,
            magFilter = NEAREST_FILTER,
            minFilter = NEAREST_FILTER,
            width,
            height,
        } = args;

        this.type = DATA_TEXTURE;

        this.image = { data, width, height };

        this.magFilter = magFilter;

        this.minFilter = minFilter;

        this.generateMipmaps = false;

        this.flipY = false;

        // this.unpackAlignment = 1;

    }

}