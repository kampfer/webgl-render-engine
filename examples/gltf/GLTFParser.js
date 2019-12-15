import Scene from '../../src/Scene';
import Mesh from '../../src/Mesh';
import Geometry from '../../src/geometries/Geometry';
import Material from '../../src/materials/Material';
import path from 'path';
import { BufferAttribute } from '../../src/renderers/WebGLAttribute';
import GraphObject from '../../src/GraphObject';

/*
 * 文档：https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#properties-reference
 */

const attributeNameMap = {
    'POSITION': 'position',
    'NORMAL': 'normal',
    'TANGENT': 'tangent',
    'TEXCOORD_0': 'uv',
    'TEXCOORD_1': 'uv2',
    'COLOR_0': 'color',
    'JOINTS_0': 'skinIndex',
    'WEIGHTS_0': 'skinWeight'
};

const componentTypeToTypedArray = {
    '5120': Int8Array,
    '5121': Uint8Array,
    '5122': Int16Array,
    '5123': Uint16Array,
    '5125': Uint32Array,
    '5126': Float32Array
};

const accessorTypeToNumComponentsMap = {
    'SCALAR': 1,
    'VEC2': 2,
    'VEC3': 3,
    'VEC4': 4,
    'MAT2': 4,
    'MAT3': 9,
    'MAT4': 16
};

export default class GLTFParser {

    setBaseUrl(baseUrl) {
        this._baseUrl = baseUrl;
    }

    request(url, opts) {
        url = path.join(this._baseUrl, url);
        return fetch(url, opts);
    }

    parse(data) {
        console.log('data:', data);
        let sceneDefs = data.scenes;
        return Promise.all(
                sceneDefs.map((scenedef, index) => {
                    return this.parseScene(data, index);
                })
            ).then(function (scenes) {
                return {
                    asset: data.asset,
                    scenes,
                    scene: data.scene,
                    cameras: []
                }
            })
    }

    parseScene(data, sceneIndex) {
        let sceneDef = data.scenes[sceneIndex],
            nodeDefs = sceneDef.nodes;
        return Promise.all(
            nodeDefs.map((nodeIndex) => {
                return this.parseNode(data, nodeIndex);
            })
        ).then((nodes) => {
            let scene = new Scene();
            nodes.forEach((node) => {
                scene.add(node);
            });
            return scene;
        });
    }

    parseNode(data, nodeIndex) {
        let nodeDef = data.nodes[nodeIndex],
            parsePromises = [];

        if (nodeDef.mesh !== undefined) {
            parsePromises.push(this.parseMesh(data, nodeDef.mesh));
        }

        if (nodeDef.camera !== undefined) {
            parsePromises.push(this.parseCamera(data, nodeDef.camera));
        }

        return Promise.all(parsePromises)
            .then((objects) => {
                let object;

                if (objects.length === 0) {
                    object = new GraphObject();
                } else if(objects.length === 1) {
                    object = objects[0];
                } else {
                    // object = new Group();
                    object = new GraphObject();
                    objects.forEach((childObject) => {
                        object.add(childObject);
                    });
                }

                if (nodeDef.matrix) {
                    object.matrix.set(nodeDef.matrix);
                }

                if (nodeDef.translation || nodeDef.rotation || nodeDef.scale) {
                    if (nodeDef.translation) {
                        object.position.setFromArray(nodeDef.translation);
                    }

                    if (nodeDef.rotation) {
                        object.quaternion.setFromArray(...nodeDef.rotation);
                    }

                    if (nodeDef.scale) {
                        object.scale.setFromArray(nodeDef.translation);
                    }

                    object.updateMatrix();
                }

                return object;
            })
            .then((object) => {
                if(nodeDef.children !== undefined) {
                    return Promise.all(
                        nodeDef.children.map((childNodeIndex) => {
                            return this.parseNode(data, childNodeIndex);
                        })
                    )
                    .then((childObjects) => {
                        childObjects.forEach((childObject) => {
                            object.add(childObject);
                        });
                        return object;
                    });
                }
                return object;
            });
    }

    // 如果primitives是空数组，返回一个GraphObject实例
    // 如果primitives仅有1个元素，返回该元素
    // 如果primitives包含1个以上的元素，返回一个GraphObject实例，所有元素都是GraphObject实例的子元素
    parseMesh(data, meshIndex) {
        let meshDef = data.meshes[meshIndex],
            primitives = meshDef.primitives;
        return Promise.all(
            primitives.map((primitive) => {
                return this.parsePrimitive(data, primitive);
            })
        ).then((objects) => {
            let object;
            if (objects.length === 0) {
                object = new GraphObject();
            } else if (objects.length === 1) {
                object = objects[0];
            } else {
                // object = new Group();
                object = new GraphObject();
                objects.forEach((childObject) => {
                    object.add(childObject);
                });
            }
            return object;
        });
    }

    parseCamera(data, cameraIndex) {
        let cameraDef = data.cameras[cameraIndex];
        return cameraDef;
    }

    parsePrimitive(data, primitive) {
        let attributes = primitive.attributes,
            parsePromises = [],
            geometry = new Geometry();

        for(let gltfAttributeName in attributes) {
            let attributeName = attributeNameMap[gltfAttributeName],
                accessIndex = attributes[gltfAttributeName];
            parsePromises.push(
                this.parseAccessor(data, accessIndex)
                    .then(function (bufferAttribute) {
                        geometry.setAttribute(attributeName, bufferAttribute);
                    })
            );
        }

        if (primitive.indices !== undefined) {
            parsePromises.push(
                this.parseAccessor(data, primitive.indices)
                    .then(function (bufferAttribute) {
                        geometry.setIndex(bufferAttribute);
                    })
            );
        }

        return Promise.all(parsePromises)
            .then(function () {
                let material = new Material({color: [0, 1, 1]});

                let mesh = new Mesh(geometry, material);
                mesh.drawMode = primitive.mode === undefined ? 4 : primitive.mode;

                return mesh;
            });
    }

    parseAccessor(data, accessorIndex) {
        let accessorDef = data.accessors[accessorIndex];

        if (accessorDef.bufferView === undefined) {
            return Promise.resolve(null);
        }

        return this.parseBufferView(data, accessorDef.bufferView)
            .then(function (arrayBuffer) {
                let bufferViewDef = data.bufferViews[accessorDef.bufferView],
                    TypedArray = componentTypeToTypedArray[accessorDef.componentType],
                    byteOffset = accessorDef.byteOffset,
                    byteStride = bufferViewDef.byteStride,
                    itemSize = accessorTypeToNumComponentsMap[accessorDef.type],
                    itemBytes = itemSize * TypedArray.BYTES_PER_ELEMENT,
                    normalized = accessorDef.normalized === true,
                    array = new TypedArray(arrayBuffer, byteOffset, accessorDef.count * itemSize);
                if (byteStride !== undefined && byteStride !== itemBytes ) {
                    // The buffer is not interleaved if the stride is the item size in bytes.
                } else {
                    return new BufferAttribute(array, itemSize, normalized);
                }
            });
    }

    parseBufferView(data, bufferViewIndex) {
        let bufferViewDef = data.bufferViews[bufferViewIndex];
        return this.parseBuffer(data, bufferViewDef.buffer)
            .then(function (buffer) {
                let byteLength = bufferViewDef.byteLength || 0,
                    byteOffset = bufferViewDef.byteOffset || 0,
                    start = byteOffset,
                    end = byteOffset + byteLength;
                return buffer.slice(start, end);
            });
    }

    parseBuffer(data, bufferIndex) {
        let bufferDef = data.buffers[bufferIndex],
            dataURLReg = /^data:(.*?)(;base64)?,(.*)/,
            execRet = dataURLReg.exec(bufferDef.uri);
        if (execRet) {
            let content = execRet[3],
                isBase64 = !!execRet[2],
                type = execRet[1];

            content = decodeURIComponent(content);
            if (isBase64) {
                content = atob(content);
            }
            
            let bufferView = new Uint8Array(content.length);
            for(let i = 0, l = content.length; i < l; i++) {
                bufferView[i] = content.charCodeAt(i);
            }
            return Promise.resolve(bufferView.buffer);
        } else {
            return this.request(bufferDef.uri)
                .then(function (res) {
                    if (res.ok) {
                        return res.arrayBuffer();
                    }
                });
        }
    }

}