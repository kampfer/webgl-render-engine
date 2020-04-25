import Box3 from '../math/Box3';
import { arrayMax } from '../math/utils';
import BufferAttribute from '../renderers/BufferAttribute';
import { generateUid } from '../math/utils';
import Vec3 from '../math/Vec3';

const _box = new Box3();
const _vec3 = new Vec3();

/**
 * 渲染使用的attribute变量:
 * position
 * normal
 * tangent
 * uv
 * uv2
 * color
 * skinIndex
 * skinWeight
 */
 export default class Geometry {

    constructor() {

        this.uid = generateUid();

        this.vertices = [];
        this.normals = [];
        this.colors = [];
        this.indices = [];

        this._attributes = {};

        this._morphAttributes = {};
        this.morphTargetsRelative = false;

    }

    setIndex(v) {
        this.setAttribute('index', v);
        v.isIndex = true;
    }

    // value: BufferAttribute
    setAttribute(name, value) {
        this._attributes[name] = value;
        value.name = name;
    }

    removeAttribue(name) {
        delete this._attributes[name];
    }

    getAttribute(name) {
        return this._attributes[name];
    }

    getAttributes() {
        return this._attributes;
    }

    // value: array
    setMorphAttribute(name, value) {
        this._morphAttributes[name] = value;
    }

    removeMorphAttribue(name) {
        delete this._morphAttributes[name];
    }

    getMorphAttribute(name) {
        return this._morphAttributes[name];
    }

    getMorphAttributes() {
        return this._morphAttributes;
    }

    getBoundingBox() {
        if (!this._boundingBox) {
            this._boundingBox = this.computeBoundingBox();
        }
        return this._boundingBox;
    }

    computeBoundingBox() {

        let box = new Box3(),
            position = this.getAttribute('position'),
            morphPositions = this.getMorphAttribute('position');

        if (position) {

            box.setFromBufferAttribute(position);

            if (morphPositions) {

                for(let i = 0, l = morphPositions.length; i < l; i++) {

                    _box.setFromBufferAttribute(morphPositions[i]);

                    if (this.morphTargetsRelative) {

                        _vec3.setFromVectorsSum(box.max, _box.max);
                        box.expandByPoint(_vec3);

                        _vec3.setFromVectorsSum(box.min, _box.min);
                        box.expandByPoint(_vec3);

                    } else {

                        box.expandByPoint(_box.max);
                        box.expandByPoint(_box.min);

                    }

                }

            }

        } else {

            box.setEmpty();

        }

        return box;

    }

    getWireframeAttribute() {

        if (!this._wireframeAttribute) {

            // this._wireframeAttribute = new BufferAttribute();
            let indices = [],
                indexAttribute = this.getAttribute('index'),
                positionAttribute = this.getAttribute('position');
            
            if (indexAttribute) {

                let array = indexAttribute.array;

                for(let i = 0, l = array.length; i < l; i += 3) {

                    let a = array[i],
                        b = array[i + 1],
                        c = array[i + 2];

                    indices.push(a, b, b, c, c, a);

                }

            } else if (positionAttribute) {

                let array = positionAttribute.array;

                for(let i = 0, l = array.length / 3; i < l; i += 3) {

                    let a = i,
                        b = i + 1,
                        c = i + 2;

                    indices.push(a, b, b, c, c, a);

                }

            }

            // 当indices成员太大时使用Math.max会报错：range error
            // 自己使用循环遍历的方式找出最大值就没问题了
            let TypedArrayConstructor = arrayMax(indices) > 65535 ? Uint32Array : Uint16Array,
                attribute = new BufferAttribute(new TypedArrayConstructor(indices), 1);

            attribute.isIndex = true;
            attribute.name = 'wireframeIndex';
            this._wireframeAttribute = attribute;

        }

        return this._wireframeAttribute;

    }

}
