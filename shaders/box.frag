uniform float time;
uniform float display;

// passed from vertex shader
varying vec3 pos;

void main(){
    gl_FragColor = vec4(1.0, sin(time/20.0) / 2.0 + cos(time/20.0) / 2.0, 0.0, 1.0 * display);
}