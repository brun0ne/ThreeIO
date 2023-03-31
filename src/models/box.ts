import * as THREE from "three"

export default function box_model(uniform_data: any): THREE.Group{
    const model = new THREE.Group();
    
    const BoxMaterial = new THREE.ShaderMaterial({
        wireframe: false,
        uniforms: uniform_data,
        vertexShader: require("raw-loader!/shaders/box.vert").default,
        fragmentShader: require("raw-loader!/shaders/box.frag").default
    });

    const box = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5, 1, 1, 1),
        BoxMaterial
    );

    box.castShadow = true;
    box.receiveShadow = true;

    model.add(box);
    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);

    model.castShadow = true;
    model.receiveShadow = true;

    return model;
}