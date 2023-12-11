import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'


/**
 * Base
 */

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x050505 );
scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

//Camera
const camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
camera.position.z = 2750;

//Lights
scene.add( new THREE.AmbientLight( 0x444444, 3 ) );

const light1 = new THREE.DirectionalLight( 0xffffff, 1.5 );
light1.position.set( 1, 1, 1 );
scene.add( light1 );

const light2 = new THREE.DirectionalLight( 0xffffff, 4.5 );
light2.position.set( 0, - 1, 0 );
scene.add( light2 );


/**
 * Geometry
 */

const triangles = 5000;

let geometry = new THREE.BufferGeometry();

const positions = new Float32Array( triangles * 3 * 3 );
const normals = new Float32Array( triangles * 3 * 3 );
const colors = new Float32Array( triangles * 3 * 3 );

const color = new THREE.Color();

const n = 800, n2 = n / 2;	// triangles spread in the cube
const d = 120, d2 = d / 2;	// individual triangle size

const pA = new THREE.Vector3();
const pB = new THREE.Vector3();
const pC = new THREE.Vector3();

const cb = new THREE.Vector3();
const ab = new THREE.Vector3();

for ( let i = 0; i < positions.length; i += 9 ) {

    // positions

    const x = Math.random() * n - n2;
    const y = Math.random() * n - n2;
    const z = Math.random() * n - n2;

    const ax = x + Math.random() * d - d2;
    const ay = y + Math.random() * d - d2;
    const az = z + Math.random() * d - d2;

    const bx = x + Math.random() * d - d2;
    const by = y + Math.random() * d - d2;
    const bz = z + Math.random() * d - d2;

    const cx = x + Math.random() * d - d2;
    const cy = y + Math.random() * d - d2;
    const cz = z + Math.random() * d - d2;

    positions[ i ] = ax;
    positions[ i + 1 ] = ay;
    positions[ i + 2 ] = az;

    positions[ i + 3 ] = bx;
    positions[ i + 4 ] = by;
    positions[ i + 5 ] = bz;

    positions[ i + 6 ] = cx;
    positions[ i + 7 ] = cy;
    positions[ i + 8 ] = cz;

    // flat face normals

    pA.set( ax, ay, az );
    pB.set( bx, by, bz );
    pC.set( cx, cy, cz );

    cb.subVectors( pC, pB );
    ab.subVectors( pA, pB );
    cb.cross( ab );

    cb.normalize();

    const nx = cb.x;
    const ny = cb.y;
    const nz = cb.z;

    normals[ i ] = nx;
    normals[ i + 1 ] = ny;
    normals[ i + 2 ] = nz;

    normals[ i + 3 ] = nx;
    normals[ i + 4 ] = ny;
    normals[ i + 5 ] = nz;

    normals[ i + 6 ] = nx;
    normals[ i + 7 ] = ny;
    normals[ i + 8 ] = nz;

    // colors

    const vx = ( x / n ) + 0.5;
    const vy = ( y / n ) + 0.5;
    const vz = ( z / n ) + 0.5;

    color.setRGB( vx, vy, vz );

    colors[ i ] = color.r;
    colors[ i + 1 ] = color.g;
    colors[ i + 2 ] = color.b;

    colors[ i + 3 ] = color.r;
    colors[ i + 4 ] = color.g;
    colors[ i + 5 ] = color.b;

    colors[ i + 6 ] = color.r;
    colors[ i + 7 ] = color.g;
    colors[ i + 8 ] = color.b;

}

geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
geometry.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

geometry.computeBoundingSphere();

let material = new THREE.MeshPhongMaterial( {
    color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
    side: THREE.DoubleSide, vertexColors: true
} );

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );


/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster();

const pointer = new THREE.Vector2();

const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( 4 * 3 ), 3 ) );

const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true } );

const line = new THREE.Line( lineGeometry, lineMaterial );
scene.add( line );


function onPointerMove( event ) {

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}



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


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime() * 0.001;

    mesh.rotation.x = elapsedTime * 0.15;
    mesh.rotation.y = elapsedTime * 0.25;

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObject( mesh );

    if ( intersects.length > 0 ) {

        const intersect = intersects[ 0 ];
        const face = intersect.face;

        const linePosition = line.geometry.attributes.position;
        const meshPosition = mesh.geometry.attributes.position;

        linePosition.copyAt( 0, meshPosition, face.a );
        linePosition.copyAt( 1, meshPosition, face.b );
        linePosition.copyAt( 2, meshPosition, face.c );
        linePosition.copyAt( 3, meshPosition, face.a );

        mesh.updateMatrix();

        line.geometry.applyMatrix4( mesh.matrix );

        line.visible = true;

    } else {

        line.visible = false;

    }



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()