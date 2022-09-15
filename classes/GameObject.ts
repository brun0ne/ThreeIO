import Pos2D from './Pos2D'
import GameScreen from './GameScreen'
import GameWorld from './GameWorld'
import ParticleObject from './ParticleObject'

import * as THREE from "three"

let INC_ID = 0;

export default class GameObject extends ParticleObject{
    pos: Pos2D
    scale: THREE.Vector3

    model: THREE.Group
    shaders_data: any // data to be passed into shaders

    ID: number

    emitter: any

    display: boolean

    constructor(pos: Pos2D, model: Function | THREE.Group, scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1)){
        super();

        this.pos = pos;
        this.scale = scale;

        this.shaders_data = {
            time: {
                type: "f",
                value: 0
            },
            display: {
                type: "f",
                value: 0
            }
        };

        if (typeof model === "function")
            this.model = model(this.shaders_data);
        else
            this.model = model;

        this.ID = INC_ID;
        INC_ID += 1;
    }

    load(screen: GameScreen){
        screen.scene.add(this.model);

        this.model.position.set(this.pos.x, 0, this.pos.y);
        this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
    }

    update(screen: GameScreen, world: GameWorld){
        this.shaders_data["display"] = {
            type: "f",
            value: world.distance(this.pos, world.player.real_pos(world)) < screen.config.CAMERA_WIDTH / 1.5
        };

        if(this.shaders_data.display.value && this.model.parent == null)
            screen.scene.add(this.model);
        
        if(!this.shaders_data.display.value && this.model.parent != null)
            this.model.removeFromParent();

        if(this.shaders_data.display.value){
            this.model.position.set(this.pos.x, 0, this.pos.y);
            this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
        }

        this.custom_update();
    }

    custom_update(){}
    
    remove(world: GameWorld){
        const same_ID = (object: GameObject) => object.ID === this.ID;
        const index = world.objects.findIndex(same_ID);

        this.model.removeFromParent();
        world.objects.splice(index, 1);
    }
}