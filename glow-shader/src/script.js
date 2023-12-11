// Inspired by https://codepen.io/prisoner849/pen/LYmXKrr
// https://discourse.threejs.org/t/help-floating-animation/43464/11

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
// import waterVertexShader from './shaders/water/vertex.glsl'
// import waterFragmentShader from './shaders/water/fragment.glsl'
import noise from './shaders/simplex4d.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
// const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)
const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 10, 200, 200, true);

// Material

const customUniforms = {
    uTime: { value: 0 }
}

let cylinderMaterial = new THREE.MeshBasicMaterial({
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75,
    onBeforeCompile: shader => {
      shader.uniforms.uTime = customUniforms.uTime,
      shader.vertexShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        uniform float uTime;
        varying vec3 nView;
        varying vec3 nNor;
        ${noise}
        
        
        vec3 getShaped(vec3 p){
          float curve = ss(0., 0.2, uv.y);
          curve += ss(0.5, 1., uv.y) * 2.5;
          p.xz *= 0.75 + curve;
          return p;
        }
        
        vec3 getNoised(vec3 p){
          float t = uTime * 0.5;
          float n = snoise(vec4(p * 0.4 - vec3(0, t, 0), 3.14));
          n *= 0.5 + 0.5 * (uv.y);
          p += normal * n;
          return p;
        }
        
        vec3 rotY(vec3 p, float a){
          float s = sin(a);
          float c = cos(a);
          p.xz *= mat2(c, -s, s, c);
          return p;
        }
        
        ${shader.vertexShader}
      `.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
          vec3 pos = getNoised(getShaped(position));
          vec3 pos2 = getNoised(getShaped(rotY(position, 3.1415926 * 0.001)));
          vec3 pos3 = getNoised(getShaped(position + vec3(0., 0.001, 0.)));
          transformed = pos;
          
          vec3 nor = cross(normalize(pos2 - pos),normalize(pos3 - pos));
          nNor = normalMatrix * nor;
          
        `
      ).replace(
        `#include <fog_vertex>`,
        `#include <fog_vertex>
          nView = normalize(mvPosition.xyz);
          
        `
      );
      console.log(shader.vertexShader);
      shader.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        varying vec3 nView;
        varying vec3 nNor;
        ${shader.fragmentShader}
      `.replace(
        `#include <color_fragment>`,
        `#include <color_fragment>
          diffuseColor.rgb = mix(vec3(1, 0.375, 0), vec3(0.12, 0.5, 1), pow(vUv.y, 2.));
          float alpha = ss(0., 0.2, vUv.y) - ss(0.8, 1., vUv.y);
          //alpha = alpha;
          
          vec3 nor = nNor * (gl_FrontFacing ? 1. : -1.);
          float vAlpha = abs(dot(normalize(nView), nor));
          
          float angleAlpha = (1. - vAlpha) * 0.9 + 0.1;
          //angleAlpha = pow(angleAlpha, 4.);
          
          float totalAlpha = clamp(alpha * 0.5  +  angleAlpha * 0.5, 0., 1.) * alpha;
          diffuseColor.rgb += vec3(1) * totalAlpha * 0.1;
          diffuseColor.a *= totalAlpha;
        `
      );
      //console.log(shader.fragmentShader);
    }
  });
  cylinderMaterial.defines = {
    "USE_UV" : ""
  };
  let o = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  o.rotation.z = -Math.PI * 0.25;
  scene.add(o);



// Colors
// debugObject.depthColor = '#186691'
// debugObject.surfaceColor = '#9bd8ff'

// gui.addColor(debugObject, 'depthColor').onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) })
// gui.addColor(debugObject, 'surfaceColor').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })

// Material
// const waterMaterial = new THREE.ShaderMaterial({
//     vertexShader: waterVertexShader,
//     fragmentShader: waterFragmentShader,
//     uniforms:
//     {
//         uTime: { value: 0 },
        
//         uBigWavesElevation: { value: 0.074 },
//         uBigWavesFrequency: { value: new THREE.Vector2(1.903, 1.825) },
//         uBigWavesSpeed: { value: 0.359 },

//         uSmallWavesElevation: { value: 0.221 },
//         uSmallWavesFrequency: { value: 10.116 },
//         uSmallWavesSpeed: { value: 0.2 },
//         uSmallIterations: { value: 4 },

//         uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
//         uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
//         uColorOffset: { value: 0.097 },
//         uColorMultiplier: { value: 4 },

//         uColors: {
//             value: [
//                 new THREE.Color( 0x000000 ),
//                 new THREE.Color( 0x113b2b ),
//                 new THREE.Color( 0x58A618 ),
//                 new THREE.Color( 0x8ec51c ),
//             ]
//         },
//         uSteps: {
//             value: [
//                 0.0,
//                 0.35,
//                 0.66,
//                 1.0
//             ]
//         }

//     }
// })

// gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
// gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')


// gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
// gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
// gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
// gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')

// gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
// gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')

// // Mesh
// const water = new THREE.Mesh(waterGeometry, waterMaterial)
// water.rotation.x = - Math.PI * 0.5
// scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(10, 10, 7)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Water
    // waterMaterial.uniforms.uTime.value = elapsedTime

    // Cylinder
    customUniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()