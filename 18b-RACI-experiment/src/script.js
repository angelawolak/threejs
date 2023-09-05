import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.fog = new THREE.Fog( 0x000000, 5, 20 );

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture1 = textureLoader.load('/textures/particles/R.png')
const particleTexture2 = textureLoader.load('/textures/particles/A.png')
const particleTexture3 = textureLoader.load('/textures/particles/C.png')
const particleTexture4 = textureLoader.load('/textures/particles/I.png')

// let texturesList = [
//     '/textures/particles/1.png',
//     '/textures/particles/2.png',
//     '/textures/particles/3.png',
//     '/textures/particles/4.png'
// ];

// console.log(texturesList)
// let randIndex = THREE.Math.randInt(0, texturesList.length - 1);


// let randTexture = textureLoader.load(texturesList[randIndex]);
// var testMat = new THREE.MeshPhongMaterial({ map: randTexture });


/**
 * Particles
 */

// Geometry
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
const particlesGeometry1 = new THREE.BufferGeometry()
const particlesGeometry2 = new THREE.BufferGeometry()
const particlesGeometry3 = new THREE.BufferGeometry()
const particlesGeometry4 = new THREE.BufferGeometry()




const count = 30000
const positions1 = new Float32Array(count * 3) // need x, y, z values for each vertex
const positions2 = new Float32Array(count * 3) // need x, y, z values for each vertex
const positions3 = new Float32Array(count * 3) // need x, y, z values for each vertex
const positions4 = new Float32Array(count * 3) // need x, y, z values for each vertex
const colors = new Float32Array(count * 3) // 3 for R, g, b

for(let i = 0; i < count * 3; i++) {
    positions1[i] = (Math.random() - .5) * 90
} 
for(let i = 0; i < count * 3; i++) {
    positions2[i] = (Math.random() - .5) * 90
} 
for(let i = 0; i < count * 3; i++) {
    positions3[i] = (Math.random() - .5) * 90
} 
for(let i = 0; i < count * 3; i++) {
    positions4[i] = (Math.random() - .5) * 90
} 
particlesGeometry1.setAttribute('position', new THREE.BufferAttribute(positions1, 3))
particlesGeometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3))
particlesGeometry3.setAttribute('position', new THREE.BufferAttribute(positions3, 3))
particlesGeometry4.setAttribute('position', new THREE.BufferAttribute(positions4, 3))

particlesGeometry1.rotateY = .5
particlesGeometry1.rotation = 1
// particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))


// Material
const particlesMaterial1 = new THREE.PointsMaterial({
    size: 1,
    alphaMap: particleTexture1,
    color: '#58A618',
    transparent: true
})
const particlesMaterial2 = new THREE.PointsMaterial({
    size: 1,
    alphaMap: particleTexture2,
    color: '#FFA100',
    transparent: true
})
const particlesMaterial3 = new THREE.PointsMaterial({
    size: 1,
    alphaMap: particleTexture3,
    color: '#006983',
    transparent: true
})
const particlesMaterial4 = new THREE.PointsMaterial({
    size: 1,
    alphaMap: particleTexture4,
    color: '#DD4814',
    transparent: true
})
// particlesMaterial.alphaMap = randTexture
// particlesMaterial.transparent = true
// particlesMaterial.vertexColors = true
// particlesMaterial.alphaTest = 0.001
// particlesMaterial.depthTest = false
// particlesMaterial.depthWrite = false

// particlesMaterial.blending = THREE.AdditiveBlending

// Points
const particles1 = new THREE.Points(particlesGeometry1, particlesMaterial1)
const particles2 = new THREE.Points(particlesGeometry2, particlesMaterial2)
const particles3 = new THREE.Points(particlesGeometry3, particlesMaterial3)
const particles4 = new THREE.Points(particlesGeometry4, particlesMaterial4)

scene.add(particles1, particles2, particles3, particles4)



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
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 2
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    // particles.rotation.y = elapsedTime * .02
    // particles.rotation.x = Math.cos(elapsedTime) * .02
    // console.log(particlesGeometry.attributes.position.array)
    // for(let i = 0; i < count; i++) {
    //     const i3 = i * 3
    //     const x = particlesGeometry.attributes.position.array[i3]
    //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    // }
    // particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()