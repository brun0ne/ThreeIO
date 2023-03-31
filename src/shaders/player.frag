uniform float time;

// passed from vertex shader
varying vec3 pos;

void main(){
    gl_FragColor = vec4(1.0, sin(time/60.0)/4.0, sin(pos.z/5.0), 1.0);
}