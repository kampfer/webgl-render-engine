import Scene from '../../src/Scene';
import Mesh from '../../src/Mesh';
import Geometry from '../../src/geometries/Geometry';
import Material from '../../src/materials/Material';
import request from './request';

/*
 * 文档：https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#properties-reference
 */

const ATTRIBUTE_MAP = {
    'POSITION': 'position',
    'NORAML': 'normal',
    'TANGENT': '',
    'TEXCOORD_0': '',
    'TEXCOORD_1': '',
    'COLOR_0': 'color',
    'JOINTS_0': '',
    'WEIGHTS_0': ''
};

export default class GLTFParser {

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
                    nodeDefs.forEach((index) => {
                        this.buildNodeHierarchy(data, index, scene);
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
            let attributeName = ATTRIBUTE_MAP[gltfAttributeName],
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
        let accessorDef = data.accessors[accessorIndex],
            bufferViewDef = data.bufferViews[accessorDef.bufferView],
            bufferDef = data.bufferViews[bufferViewDef.buffer];
        return request({
                url: bufferDef.uri
            }).then((res) => {

            });
    }

}