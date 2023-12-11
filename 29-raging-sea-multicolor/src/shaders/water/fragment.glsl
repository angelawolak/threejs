precision mediump float;

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

uniform vec3 uColors[ 4 ];
uniform float uSteps[ 4 ];


varying float vElevation;

void main()
{
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = uColors[0];

    for (int i = 1; i < 4; ++i) {
        float stepStart = uSteps[i - 1];
        float stepEnd = uSteps[i];
        color = mix(color, uColors[i], smoothstep(stepStart, stepEnd, mixStrength));
    }

    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
}
