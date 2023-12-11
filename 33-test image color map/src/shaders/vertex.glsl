uniform sampler2D uDisplacementTexture;
uniform float uDisplacementStrength;
uniform vec3 uColorGreen;
uniform vec3 uColorForestGreen;
uniform vec3 uColorBlue;
uniform vec3 uColorBlack;

varying vec3 vColor;

void main()
{
    
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = texture2D(uDisplacementTexture, uv).r;
    modelPosition.y += max(elevation, 0.5) * uDisplacementStrength;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Color
    // vec3 color = mix(uColorGreen, uColorPink, elevation);

    float step1 = 0.3;
    float step2 = 0.4;
    float step3 = 0.9;

    vec3    color = mix(uColorBlack, uColorForestGreen, smoothstep(0.0, step1, elevation));
            color = mix(color, uColorBlue, smoothstep(step1, step2, elevation));
            color = mix(color, uColorGreen, smoothstep(step2, 1.0, elevation));


    vColor = color;

}