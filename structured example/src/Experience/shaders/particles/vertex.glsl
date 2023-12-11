    precision highp float;

    uniform float uSineTime;

    attribute vec3 offset;
    attribute vec4 color;
    attribute vec4 orientationStart;
    attribute vec4 orientationEnd;

    varying vec3 vPosition;
    varying vec4 vColor;

    void main(){

        vPosition = offset * max( abs( uSineTime * 2.0 + 1.0 ), 0.5 ) + position;
        vec4 orientation = normalize( mix( orientationStart, orientationEnd, uSineTime ) );
        vec3 vcV = cross( orientation.xyz, vPosition );
        vPosition = vcV * ( 2.0 * orientation.w ) + ( cross( orientation.xyz, vcV ) * 2.0 + vPosition );

        vColor = color;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );

    }











// uniform sampler2D uDisplacementTexture;
// uniform float uDisplacementStrength;

// varying vec3 vColor;

// void main()
// {
    
//     // Position
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//     float elevation = texture2D(uDisplacementTexture, uv).r;
//     modelPosition.y += max(elevation, 0.5) * uDisplacementStrength;
//     gl_Position = projectionMatrix * viewMatrix * modelPosition;

//     // Color
//     float colorElevation = max(elevation, 0.25);
//     vec3 color = mix(vec3(1.0, 0.1, 0.1), vec3(0.1, 0.0, 0.5), colorElevation);

//     vColor = color;

// }