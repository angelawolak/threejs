precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;
uniform vec3 uColors[ 4 ];
uniform float uSteps[ 4 ];


varying vec2 vUv;
varying float vElevation;
// varying float vRandom;




// void main(){

//     vec4 textureColor = texture2D(uTexture, vUv);
//     textureColor.rgb *= vElevation * 2.0 + 0.9;

//     // gl_FragColor = vec4(uColor, 1.0);
//     gl_FragColor = textureColor;

//     // gl_FragColor = vec4(vUv, 1.0, 1.0);
// }


void main(){

    vec4 textureColor = texture2D(uTexture, vUv);

    // textureColor.rgb *= vElevation * 2.0 + 0.9;

    textureColor = mix(textureColor, vec4(0.0, 1.0, 0.0, 1.0), 0.6);

    gl_FragColor = textureColor;

}


// void main()
// {

//     vec4 color = texture2D(uTexture, vUv);

//     for (int i = 1; i < 4; ++i) {
//         float stepStart = uSteps[i - 1];
//         float stepEnd = uSteps[i];
//         color = mix(color, vec4(uColors[i], 1.0), smoothstep(stepStart, stepEnd, vElevation));
//     }

//     gl_FragColor = color;

//     // #include <colorspace_fragment>
// }
