import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import galaxyVertexShader from './shaders/galaxy/vertex.glsl'
import galaxyFragmentShader from './shaders/galaxy/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xf0f0f0 );

// Light
const light = new THREE.DirectionalLight( 0xffffff, 3 );
light.position.set( 1, 1, 1 ).normalize();
scene.add( light );

/**
 * Geometry
 */

const geometry = new THREE.InstancedBufferGeometry();

// positions
const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
positions.setXYZ(0, -0.5, 0.5, 0.0);
positions.setXYZ(1, 0.5, 0.5, 0.0);
positions.setXYZ(2, -0.5, -0.5, 0.0);
positions.setXYZ(3, 0.5, -0.5, 0.0);
geometry.addAttribute('position', positions);

// uvs
const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
uvs.setXYZ(0, 0.0, 0.0);
uvs.setXYZ(1, 1.0, 0.0);
uvs.setXYZ(2, 0.0, 1.0);
uvs.setXYZ(3, 1.0, 1.0);
geometry.addAttribute('uv', uvs);

// index
geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([ 0, 2, 1, 2, 3, 1 ]), 1));

const indices = new Uint16Array(this.numPoints);
const offsets = new Float32Array(this.numPoints * 3);
const angles = new Float32Array(this.numPoints);

for (let i = 0; i < this.numPoints; i++) {
	offsets[i * 3 + 0] = i % this.width;
	offsets[i * 3 + 1] = Math.floor(i / this.width);

	indices[i] = i;

	angles[i] = Math.random() * Math.PI;
}

geometry.addAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));
geometry.addAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
geometry.addAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));


/**
 * Material
 */
const uniforms = {
	uTime: { value: 0 },
	uRandom: { value: 1.0 },
	uDepth: { value: 2.0 },
	uSize: { value: 0.0 },
	uTextureSize: { value: new THREE.Vector2(this.width, this.height) },
	uTexture: { value: this.texture },
	uTouch: { value: null }
};

const material = new THREE.RawShaderMaterial({
	uniforms,
	vertexShader: glslify(require('../../../shaders/particle.vert')),
	fragmentShader: glslify(require('../../../shaders/particle.frag')),
	depthTest: false,
	transparent: true
});





/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster();


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}



/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera( 70, sizes.width / sizes.height, 0.1, 100 );
// const frustumSize = 30
// const aspect = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera( frustumSize * aspect * -0.5, frustumSize * aspect * 0.5, frustumSize * -0.5, frustumSize * 0.5, 1, 1000 );

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Resize
 */

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height


    // const aspect = sizes.width / sizes.height
    // camera.left = - frustumSize * aspect / 2;
    // camera.right = frustumSize * aspect / 2;
    // camera.top = frustumSize / 2;
    // camera.bottom = - frustumSize / 2;
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Pointer movement
 */

let INTERSECTED;

const pointer = new THREE.Vector2();
const radius = 5;

document.addEventListener( 'mousemove', onPointerMove );

function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}




/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    // find intersections

    // raycaster.setFromCamera( pointer, camera );

    // const intersects = raycaster.intersectObjects( scene.children, false );

    // if ( intersects.length > 0 ) {

    //     if ( INTERSECTED != intersects[ 0 ].object ) {

    //         if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

    //         INTERSECTED = intersects[ 0 ].object;
    //         INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
    //         INTERSECTED.material.emissive.setHex( 0xff0000 );

    //         INTERSECTED.scale.set(1.3, 1.3, 1.3)
    //         console.log(INTERSECTED.scale)
    //         // INTERSECTED.scale(1.2, 1.2, 1.2)

    //     }

    // } else {

    //     if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

    //     INTERSECTED = null;

    // }





    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()