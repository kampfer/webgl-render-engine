import { generateUid } from '../math/utils';
import {
    TEXTURE,
    RGBA_FORMAT,
    UNSIGNED_BYTE_TYPE,
    LINEAR_FILTER,
    LINEAR_MIPMAP_LINEAR_FILTER,
    CLAMP_TO_EDGE_WRAPPING,
} from '../constants';

export default class Texture {

    constructor({
        image,
        format = RGBA_FORMAT,
        texelType = UNSIGNED_BYTE_TYPE,
        magFilter = LINEAR_FILTER,
        minFilter = LINEAR_MIPMAP_LINEAR_FILTER,
        wrapS = CLAMP_TO_EDGE_WRAPPING,
        wrapT = CLAMP_TO_EDGE_WRAPPING
    }) {

        this.type = TEXTURE;

        this.uid = generateUid();

        this.image = image;

        this.magFilter = magFilter;
        this.minFilter = minFilter;

        this.wrapT = wrapT;
        this.wrapS = wrapS;

        this.format = format;
        this.internalFormat = null;
        this.texelType = texelType;

        this.flipY = true;

    }

}