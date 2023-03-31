precision highp float;

uniform float time;
uniform float display;

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