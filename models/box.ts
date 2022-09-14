import * as THREE from "three"

export default function box_model(uniform_data: any): THREE.Group{
    const model = new THREE.Group();

    console.log(uniform_data);
    
    const BoxMaterial = new THREE.ShaderMaterial({
        wireframe: false,
        uniforms: uniform_data,
        vertexShader: `
            precision highp float;
            uniform float time;

            // passed to fragment shader
            varying vec3 pos;

            void main(){
                // projectionMatrix, modelViewMatrix, position <--- passed in

                // varying
                pos = position;

                vec4 result;
                result = vec4(position, 1.0);

                gl_Position = projectionMatrix * modelViewMatrix * result;
            }
        `,
        fragmentShader: `
            uniform float time;

            // passed from vertex shader
            varying vec3 pos;

            void main(){
                gl_FragColor = vec4(1.0, sin(time/20.0) / 2.0 + cos(time/20.0) / 2.0, 0.0, 1.0);
            }
        `
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