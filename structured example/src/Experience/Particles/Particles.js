import Experience from "../Experience";
import Dots from './Dots';

export default class Particles {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () => {
            
            // Setup
            // this.fox = new Fox() 
            this.dots = new Dots() 

        })

    }

    update() {

        if(this.dots) {
            this.dots.update()
        }
    }

}