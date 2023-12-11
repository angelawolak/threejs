precision highp float;

uniform float uTime;

varying vec3 vPosition;
varying vec4 vColor;

void main() {

    vec4 color = vec4( vColor );
    // color.r += sin( vPosition.x * 10.0 + uTime ) * 0.5;
    vec4 colorMixer = vec4( 0.0, 1.0, 0.0, 0.0);
    vec4 mixedColor = mix(color, colorMixer, 0.2);
    gl_FragColor = mixedColor;

}


// varying vec3 vColor;

// void main()
// {
//     gl_FragColor = vec4(vColor, 1.0);
// }