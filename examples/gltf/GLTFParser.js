import Scene from '../../src/Scene';
import Mesh from '../../src/Mesh';

/*
 * 文档：https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#properties-reference
 */

export default class GLTFParser {

    buildNodeHierarchy(data, index, parent) {
        let nodeDefs = data.nodes,
            nodeDef = nodeDefs[index];

        if (nodeDef.mesh !== undefined) {
            let meshIndex = nodeDef.mesh,
                meshDef = data.meshes[meshIndex];

            this.parseGeometry(meshDef).then((geometry) => {
                return this.parseMaterial(meshDef).then((material) => {
                    let mesh = new Mesh(geometry, material);
                    parent.add(mesh);
                    if (nodeDef.children !== undefined) {
                        nodeDef.children.forEach((childIndex) => {
                            this.buildNodeHierarchy(data, childIndex, mesh);
                        });
                    }
                });
            });

        }
        
        if (nodeDef.camera !== undefined) {
        }

        return parent;
    }

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

    parseScene(sceneDef) {
        let nodeDefs = sceneDef.nodes,
            scene = new Scene();
        nodeDefs.forEach((nodeIndex) => {
            this.buildNodeHierarchy(data, nodeIndex, scene);
        });
        return scene;
    }

    parseNode(nodeDef) {
        if (nodeDef.camera !== undefined) {

        }

        if (nodeDef.mesh !== undefined) {

        }
    }

    parseMesh(meshDef) {

    }

    parseGeometry() {
        return Promise.resolve({});
    }

    parseMaterial() {
        return Promise.resolve({});
    }

}