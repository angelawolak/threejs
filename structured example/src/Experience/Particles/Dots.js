import * as THREE from 'three'
import Experience from "../Experience"
import particlesVertexShader from '../shaders/particles/vertex.glsl'
import particlesFragmentShader from '../shaders/particles/fragment.glsl'

export default class Dots {

    constructor() {

        this.experience = new Experience()
        this.scene = this.experience.scene
        // this.resources = this.experience.resources
        // this.time = this.experience.time
        this.debug = this.experience.debug
        this.time = this.experience.time

        console.log(this.time.current)

        this.renderer = this.experience.renderer
        this.rendererInstance = this.experience.renderer.instance

        this.setDots()
    }

    setDots(){

        // geometry based on https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_instancing.html

        const vector = new THREE.Vector4();

        const instances = 5000;

        const positions = [];
        const offsets = [];
        const colors = [];
        const orientationsStart = [];
        const orientationsEnd = [];

        positions.push( 0.025, - 0.025, 0 );
        positions.push( - 0.025, 0.025, 0 );
        positions.push( 0, 0, 0.025 );

        // instanced attributes

        for ( let i = 0; i < instances; i ++ ) {

            // offsets

            offsets.push( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );

            // colors

            colors.push( Math.random() / 1.5, Math.random() / 2 + 0.5, Math.random() / 1.5, Math.random() );

            // orientation start

            vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
            vector.normalize();

            orientationsStart.push( vector.x, vector.y, vector.z, vector.w );

            // orientation end

            vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
            vector.normalize();

            orientationsEnd.push( vector.x, vector.y, vector.z, vector.w );

        }

        const geometry = new THREE.InstancedBufferGeometry();
        geometry.instanceCount = instances; // set so its initalized for dat.GUI, will be set in first draw otherwise

        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );

        geometry.setAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 ) );
        geometry.setAttribute( 'color', new THREE.InstancedBufferAttribute( new Float32Array( colors ), 4 ) );
        geometry.setAttribute( 'orientationStart', new THREE.InstancedBufferAttribute( new Float32Array( orientationsStart ), 4 ) );
        geometry.setAttribute( 'orientationEnd', new THREE.InstancedBufferAttribute( new Float32Array( orientationsEnd ), 4 ) );


        this.material = new THREE.ShaderMaterial( {

            uniforms: {
                'uTime': { value: 0 },
                'uSineTime': { value: 1.0 }
            },
            vertexShader: particlesVertexShader,
            fragmentShader: particlesFragmentShader,
            side: THREE.DoubleSide,
            forceSinglePass: true,
            transparent: true

        } );



        const mesh = new THREE.Mesh( geometry, this.material );
        this.scene.add( mesh );


    }

    update() {
        this.material.uniforms.uTime.value = this.time.current
        this.material.uniforms.uSineTime.value = Math.sin( this.time.current * 0.0005 )
    }

}