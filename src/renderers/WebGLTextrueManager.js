import {
    REPEAT_WRAPPING,
    CLAMP_TO_EDGE_WRAPPING,
    MIRRORED_REPEAT_WRAPPING,
    NEAREST_FILTER,
    NEAREST_MIPMAP_NEAREST_FILTER,
    NEAREST_MIPMAP_LINEAR_FILTER,
    LINEAR_FILTER,
    LINEAR_MIPMAP_NEAREST_FILTER,
    LINEAR_MIPMAP_LINEAR_FILTER,
    DATA_TEXTURE,
} from '../constants';
import { convertConstantToGLenum } from './uitls';

const wrappingToGL = {
    [ REPEAT_WRAPPING ]: 'REPEAT',
    [ CLAMP_TO_EDGE_WRAPPING ]: 'CLAMP_TO_EDGE',
    [ MIRRORED_REPEAT_WRAPPING ]: 'MIRRORED_REPEAT'
};

const filterToGL = {
    [NEAREST_FILTER]: 'NEAREST',
    [NEAREST_MIPMAP_NEAREST_FILTER]: 'NEAREST_MIPMAP_NEAREST',
    [NEAREST_MIPMAP_LINEAR_FILTER]: 'NEAREST_MIPMAP_LINEAR',
    [LINEAR_FILTER]: 'LINEAR',
    [LINEAR_MIPMAP_NEAREST_FILTER]: 'LINEAR_MIPMAP_NEAREST',
    [LINEAR_MIPMAP_LINEAR_FILTER]: 'LINEAR_MIPMAP_LINEAR'
};

// 正在使用的纹理数量，用于分配纹理单元
let textureUnits = -1;

// 如果不支持mipmap，那么filter只能是NEAREST或LINEAR
function filterFallback(filter) {

    if (filter === NEAREST_FILTER || filter === NEAREST_MIPMAP_NEAREST_FILTER || filter === NEAREST_MIPMAP_LINEAR_FILTER) {
        return 'NEAREST';
    }

    return 'LINEAR';

}

export default class WebGLTextrueManager {

    constructor(gl, extensions, capabilities) {

        this._gl = gl;
        this._extensions = extensions;
        this._capabilities = capabilities;

        this._textures = new WeakMap();

    }

    allocateTextrueUnit() {

        let maxTextureUnits = this._capabilities.maxTextureUnits,
            textureUnit = ++textureUnits;

        if (textureUnit >= maxTextureUnits) console.warn(`尝试使用${textureUnit}个纹理，但是浏览器仅支持${maxTextureUnits}个！`);

        return textureUnit;

    }

    resetTextrueUnits() {
        textureUnits = -1;
    }

    getWebGLTexture(texture) {

        let webglTexture = this._textures.get(texture);

        if (webglTexture === undefined) {

            let gl = this._gl;

            webglTexture = gl.createTexture();

            this._textures.set(texture, webglTexture);

        }

        return webglTexture;

    }

    // 参数texture是Texture类及其子类的实例
    setTexture2D(texture, slot) {

        let gl = this._gl,
            // mipmap
            supportsMips = false,
            target;

        switch(texture.type) {

            default: 
                target = gl.TEXTURE_2D;

        }

        let webglTextrue = this.getWebGLTexture(texture);

        // gl.TEXTURE0 + 6 = gl.TEXTURE6
        gl.activeTexture(gl.TEXTURE0 + slot);

        gl.bindTexture(target, webglTextrue);

        // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
        // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha);
        // gl.pixelStorei(gl.UNPACK_ALIGNMENT, texture.unpackAlignment);

        // [纹理参数](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/texParameter)
        if (supportsMips) {
            // 水平填充
            gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl[wrappingToGL[texture.wrapS]]);
            // 垂直填充
            gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl[wrappingToGL[texture.wrapT]]);
            // 放大
            gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl[filterToGL[texture.magFilter]]);
            // 缩小
            gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl[filterToGL[texture.minFilter]]);
        } else{

            if (texture.wrapS !== CLAMP_TO_EDGE_WRAPPING || texture.wrapT !== CLAMP_TO_EDGE_WRAPPING) {
                console.warn('纹理不是2的幂。texture.wrapS和texture应该设置为CLAMP_TO_EDGE_WRAPPING');
            }

            gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            if (texture.minFilter !== NEAREST_FILTER && texture.minFilter !== LINEAR_FILTER) {
                console.warn('纹理不是2的幂。Texture.minFilter应该设置为NEAREST或LINEAR');
            }

            gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl[filterFallback(texture.magFilter)]);
            gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl[filterFallback(texture.minFilter)]);

        }

        let image = texture.image,
            glFormat = convertConstantToGLenum(texture.format, gl),
            glType = convertConstantToGLenum(texture.texelType, gl),
            glInternalFormat = this.getInternalFormat(texture.internalFormat, glFormat, glType);

        // [填充纹理](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/texImage2D)
        if (texture.type === DATA_TEXTURE) {

            if (supportsMips) {

                // supportsMips

            } else {

                // level = 0, border = 0
                gl.texImage2D(target, 0, glInternalFormat, image.width, image.height, 0, glFormat, glType, image.data);

            }

        }

    }

    getInternalFormat(internalFormatName, glFormat, glType) {

        if (this._capabilities.isWebGL2 === false) return glFormat;

    }

    resizeImage() {}

}