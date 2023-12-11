import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import Experience from "./Experience"


export default class PostProcess {
    constructor() {
        this.experience = new Experience()
    }
   
}