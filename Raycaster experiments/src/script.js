import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Raycaster
const raycaster = new THREE.Raycaster()

const boxColor = new THREE.Color();
const white = new THREE.Color().setHex( 0xffffff );
const count = 200

const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );

const mesh = new THREE.InstancedMesh(geometry, material, count)

//If you need to change matrices in tick function add this line:
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

const matrix = new THREE.Matrix4()
const dummy = new THREE.Object3D()

for (let i = 0; i < count; i++) {
    dummy.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
    mesh.setColorAt(i, boxColor)
  }


// for(let i = 0; i < count; i++)
// {
    
//     const position = new THREE.Vector3(
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10
//     )
//     const quaternion = new THREE.Quaternion()
//     quaternion.setFromEuler(new THREE.Euler(
//         (Math.random() - 0.5) * Math.PI * 2,
//         (Math.random() - 0.5) * Math.PI * 2,
//         0
//     ))
        
    
//     matrix.makeRotationFromQuaternion(quaternion)
//     matrix.setPosition(position)
//     mesh.setMatrixAt(i, matrix)
//     mesh.setColorAt(i, boxColor)


// }

scene.add(mesh)

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
 * Mouse position
 */

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
})

/**
 * Light
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

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

let currentIntersect = null

let hoverColor = new THREE.Color( 'pink' )
let INTERSECTED;

// const tick = () =>
// {
//     const elapsedTime = clock.getElapsedTime()

//     // Cast a ray

//     raycaster.setFromCamera(mouse, camera)

//     const intersects = raycaster.intersectObject( mesh );

//     if ( intersects.length > 0 ) {

//         const intersectedId = intersects[ 0 ].instanceId;

//         mesh.getColorAt( intersectedId, boxColor );

//         if ( boxColor.equals( white ) ) {

//             mesh.setColorAt( intersectedId, boxColor.setHex( Math.random() * 0xffffff ) );

//             mesh.instanceColor.needsUpdate = true;

//         }

//     }

//     // Update controls
//     controls.update()

//     // Render
//     renderer.render(scene, camera)

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }

// tick()



const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Cast a ray
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(mesh);
    const matrixReset = new THREE.Matrix4();

    // Reset color and scale for the previously hovered cube
    if (INTERSECTED !== undefined && INTERSECTED !== null ) {
        mesh.setColorAt(INTERSECTED, white);
        mesh.getMatrixAt(INTERSECTED, matrixReset);

        matrixReset.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.scale.setScalar(1); // Reset the scale to 1
        dummy.updateMatrix();
        mesh.setMatrixAt(INTERSECTED, dummy.matrix);
        mesh.instanceMatrix.needsUpdate = true;

        mesh.instanceColor.needsUpdate = true;
        mesh.instanceMatrix.needsUpdate = true;
        
        INTERSECTED = null;
    }

    if (intersects.length > 0) {
        const intersectedId = intersects[0].instanceId;

        // Change color of the hovered cube
        mesh.getColorAt(intersectedId, boxColor);
        mesh.getMatrixAt(intersectedId, matrix);

        if (boxColor.equals(white)) {
            mesh.setColorAt(intersectedId, boxColor.setHex(0x00ffff));
            // mesh.setMatrixAt(intersectedId, dummy.matrix)

            matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
            dummy.scale.setScalar(2);
            dummy.updateMatrix();
            mesh.setMatrixAt(intersectedId, dummy.matrix);
            mesh.instanceMatrix.needsUpdate = true;

            mesh.instanceColor.needsUpdate = true;
            mesh.instanceMatrix.needsUpdate = true;
            INTERSECTED = intersectedId; // Save the current hovered cube ID
        }
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();