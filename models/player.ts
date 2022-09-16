import * as THREE from "three"

import perlin_wobble from "../shaders/perlin_wobble"

export type SettingsType = {
    radius: number
    targetRadius: number
}

export function player_model(uniform_data: any, settings: SettingsType): THREE.Group{
    const model = new THREE.Group();

    // const BoxMaterial = new THREE.MeshStandardMaterial({color: 0xfcba03, wireframe: true});

    const BoxMaterial = new THREE.ShaderMaterial({
        wireframe: false,
        uniforms: uniform_data,
        vertexShader: perlin_wobble(),
        fragmentShader: `
            uniform float time;

            // passed from vertex shader
            varying vec3 pos;

            void main(){
                gl_FragColor = vec4(1.0, sin(time/60.0)/4.0, sin(pos.z/5.0), 1.0);
            }
        `
    });

    const box = new THREE.Mesh(
        new THREE.SphereGeometry(3, 64, 64),
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