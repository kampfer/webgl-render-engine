import Box3 from '../math/Box3';
import { arrayMax } from '../math/utils';
import BufferAttribute from '../renderers/BufferAttribute';

export default class Geometry {

    constructor() {
        this.vertices = [];
        this.normals = [];
        this.colors = [];
        this.indices = [];
        this._attributes = {};
    }

    setIndex(v) {
        this.setAttribute('index', v);
        v.isIndex = true;
    }

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

    getBoundingBox() {
        if (!this._boundingBox) {
            this._boundingBox = this.computeBoundingBox();
        }
        return this._boundingBox;
    }

    computeBoundingBox() {
        let box = new Box3(),
            position = this.getAttribute('position');
        
        if (position) {
            box.setFromBufferAttribute(position);

            // TODO：还需要处理morph attributes
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
