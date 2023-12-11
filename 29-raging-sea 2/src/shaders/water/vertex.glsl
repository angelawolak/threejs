#include '../perlinNoise3d.glsl'

uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallWavesIterations;

uniform vec3 uColorGreen;
uniform vec3 uColorForestGreen;
uniform vec3 uColorBlue;
uniform vec3 uColorBlack;

varying float vElevation;
varying vec2 vUv;
varying float vTime;

varying vec3 vColorGreen;
varying vec3 vColorForestGreen;
varying vec3 vColorBlue;
varying vec3 vColorBlack;

void main(){

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Elevation
    float elevation =   sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) * 
                        sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) * 
                        uBigWavesElevation;

    // Small waves
    for(float i = 1.0; i <= uSmallWavesIterations; i++){
        elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);   
    };   

    modelPosition.y += elevation;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;


    // Varyings
    vElevation = elevation;
    vUv = uv;
    vTime = uTime;

    vColorGreen = uColorGreen;
    vColorForestGreen = uColorForestGreen;
    vColorBlue = uColorBlue;
    vColorBlack = uColorBlack;

}