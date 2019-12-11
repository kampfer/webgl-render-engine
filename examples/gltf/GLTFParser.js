import Scene from '../../src/Scene';
import Mesh from '../../src/Mesh';
import Geometry from '../../src/geometries/Geometry';
import Material from '../../src/materials/Material';
import path from 'path';
import { BufferAttribute } from '../../src/renderers/WebGLAttribute';

/*
 * 文档：https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#properties-reference
 */

const attributeNameMap = {
    'POSITION': 'position',
    'NORAML': 'normal',
    'TANGENT': '',
    'TEXCOORD_0': '',
    'TEXCOORD_1': '',
    'COLOR_0': 'color',
    'JOINTS_0': '',
    'WEIGHTS_0': ''
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

    // buildNodeHierarchy(data, index, parent) {
    //     let nodeDefs = data.nodes,
    //         nodeDef = nodeDefs[index],
    //         pArr = [];

    //     if (nodeDef.mesh !== undefined) {
    //         let meshIndex = nodeDef.mesh,
    //             meshDef = data.meshes[meshIndex];

    //         pArr.push(Promise.all([
    //             this.parseGeometry(meshDef),
    //             this.parseMaterial(meshDef),
    //         ]).then(([geometry, material]) => {
    //             let mesh = new Mesh(geometry, material);
    //             parent.add(mesh);
    //             if (nodeDef.children !== undefined) {
    //                 return Promise.all(nodeDef.children.map((childIndex) => {
    //                     return this.buildNodeHierarchy(data, childIndex, mesh);
    //                 }));
    //             } else {
    //                 return mesh;
    //             }
    //         }));
    //     }
        
    //     if (nodeDef.camera !== undefined) {
    //     }

    //     return parent;
    // }

    parse(data) {
        console.log('data:', data);
        let sceneDefs = data.scenes,
            gltf = {
                asset: data.asset,
                scenes: sceneDefs.map((scenedef) => {
                    let nodeDefs = scenedef.nodes,
                        scene = new Scene();
                    nodeDefs.forEach((nodeIndex) => {
                        // this.buildNodeHierarchy(data, index, scene);
                        this.parseNode(data, nodeIndex);
                    });
                    return scene;
                }),
                scene: data.scene,
                cameras: []
            };

        return Promise.resolve(gltf);
    }

    parseScene(data, sceneIndex) {
        let sceneDef = data.scenes[sceneIndex],
            nodeDefs = sceneDef.nodes,
            scene = new Scene();
        nodeDefs.forEach((nodeIndex) => {
            this.parseNode(data, nodeIndex)
        });
        return scene;
    }

    parseNode(data, nodeIndex) {
        let nodeDef = data.nodes[nodeIndex];

        if (nodeDef.camera !== undefined) {
            this.parseCamera(data, nodeDef.camera);
        }

        if (nodeDef.mesh !== undefined) {
            this.parseMesh(data, nodeDef.mesh);
        }

        if (nodeDef.children !== undefined) {
            nodeDef.children.forEach((childIndex) => {
                this.parseNode(data, childIndex);
            });
        }
    }

    parseMesh(data, meshIndex) {
        let meshDef = data.meshes[meshIndex],
            primitives = meshDef.primitives;
        primitives.forEach((primitive) => {
            this.parsePrimitive(data, primitive);
        });
    }

    parseCamera(data, cameraIndex) {
        let cameraDef = data.cameras[cameraIndex];
        return cameraDef;
    }

    parsePrimitive(data, primitive) {
        let geometry = new Geometry(),
            attributes = primitive.attributes;
        for(let gltfAttributeName in attributes) {
            let attributeName = attributeNameMap[gltfAttributeName],
                accessIndex = attributes[gltfAttributeName];
            geometry.setAttribute(attributeName, this.parseAccessor(data, accessIndex));
        }

        if (primitive.indices !== undefined) {
            geometry.setIndex(this.parseAccessor(data, primitive.indices));
        }

        let material = new Material({color: [0, 1, 1]});

        let mesh = new Mesh(geometry, material);
        mesh.drawMode = primitive.mode;

        return mesh;
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
                    array = new TypedArray(arrayBuffer, byteOffset, accessorDef.count * itemSize);
                if (byteStride !== undefined && byteStride !== itemBytes ) {
                    // The buffer is not interleaved if the stride is the item size in bytes.
                } else {
                    return new BufferAttribute(array, itemSize, accessorDef.normalized);
                }
            });
    }

    parseBufferView(data, bufferViewIndex) {
        let bufferViewDef = data.bufferViews[bufferViewIndex],
            bufferDef = data.buffers[bufferViewDef.buffer];
        return this.request(bufferDef.uri)
            .then(function (res) {
                if (res.ok) {
                    return res.arrayBuffer();
                }
            })
            .then(function (buffer) {
                let byteLength = bufferViewDef.byteLength || 0,
                    byteOffset = bufferViewDef.byteOffset || 0,
                    start = byteOffset,
                    end = byteOffset + byteLength;
                return buffer.slice(start, end);
            });
    }

}