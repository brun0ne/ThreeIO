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

    constructor(pos: Pos2D, model: Function | THREE.Group, shaders_data: any, scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1)){
        super();

        this.pos = pos;
        this.scale = scale;

        if (typeof model === "function")
            this.model = model(shaders_data);
        else
            this.model = model;

        this.shaders_data = shaders_data;

        this.ID = INC_ID;
        INC_ID += 1;
    }

    load(screen: GameScreen){
        screen.scene.add(this.model);
    }

    update(_screen: GameScreen, _world: GameWorld){
        this.model.position.set(this.pos.x, 0, this.pos.y);
        this.model.scale.set(this.scale.x, this.scale.y, this.scale.z)

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