import Texture from './Texture';
import { CANVAS_TEXTURE } from '../constants';

export default class CanvasTexture extends Texture {

    constructor(...args) {

        super(...args);

        this.type = CANVAS_TEXTURE;

    }

} 