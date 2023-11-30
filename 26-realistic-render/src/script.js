import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const global = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh && child.material.isMeshStandardMaterial)
        {
            child.material.envMapIntensity = global.envMapIntensity
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
// Global intensity
global.envMapIntensity = 1
gui
    .add(global, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials)

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Directional light
 */

const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
directionalLight.position.set(-12.5, 7, 3.2)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-20).max(20).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(-20).max(20).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(-20).max(20).step(0.001).name('lightZ')

// Shadows
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 30
directionalLight.shadow.mapSize.set(512, 512)
directionalLight.shadow.normalBias = 0.027
directionalLight.shadow.bias = 0.04
gui.add(directionalLight, 'castShadow')

gui.add(directionalLight.shadow, 'normalBias').min(-0.05).max(0.05).step(0.001)
gui.add(directionalLight.shadow, 'bias').min(-0.05).max(0.05).step(0.001)

// Helper

// const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightHelper)

// Target
directionalLight.target.position.set(0, 4, 0)
directionalLight.target.updateWorldMatrix()


/** 
 * Surfaces
 */

// Textures

const woodARMTexture = textureLoader.load('textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg')
const woodColorTexture = textureLoader.load('textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg')
const woodNormalTexture = textureLoader.load('textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png')

const brickARMTexture = textureLoader.load('textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg')
const brickColorTexture = textureLoader.load('textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg')
const brickNormalTexture = textureLoader.load('textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png')

// woodARMTexture.repeat.set(2,2)
// woodColorTexture.repeat.set(2,2)
// woodNormalTexture.repeat.set(2,2)

woodColorTexture.colorSpace = THREE.SRGBColorSpace
brickColorTexture.colorSpace = THREE.SRGBColorSpace

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8,8),
    new THREE.MeshStandardMaterial(
        {
            side: THREE.DoubleSide,
            map: woodColorTexture,
            aoMap: woodARMTexture,
            normalMap: woodNormalTexture, 
            roughnessMap: woodARMTexture,
            metalnessMap: woodARMTexture
        }
    )
)
floor.rotation.x = Math.PI / -2
floor.position.y = -.001
scene.add(floor)


const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(8,8),
    new THREE.MeshStandardMaterial(
        {
            side: THREE.DoubleSide,
            map: brickColorTexture,
            aoMap: brickARMTexture,
            normalMap: brickNormalTexture, 
            roughnessMap: brickARMTexture,
            metalnessMap: brickARMTexture
        }
    )
)


wall.position.z = -4
wall.position.y = 4
scene.add(wall)

/**
 * Models
 */
// // Helmet
// gltfLoader.load(
//     '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(10, 10, 10)
//         scene.add(gltf.scene)

//         updateAllMaterials()
//     }
// )

// Hamburger
gltfLoader.load(
    '/models/hamburger.glb',
    (gltf) =>
    {
        gltf.scene.scale.set(0.3,0.3,0.3)
        gltf.scene.position.set(0, 2.5, 0)
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)


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
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    logarithmicDepthBuffer: true 
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Tone mapping
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

// Physically accurate lighting

renderer.useLegacyLights = false
gui.add(renderer, 'useLegacyLights')

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap


/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()