import Pos2D from './Pos2D'
import GameScreen from './GameScreen'
import GameWorld from './GameWorld'
import ParticleObject from './ParticleObject'

import * as THREE from "three"

let INC_ID = 0;

export default class GameObject extends ParticleObject{
    pos: Pos2D
    scale: THREE.Vector3

    model: THREE.Group | null
    shaders_data: any // data to be passed into shaders

    ID: number

    emitter: any

    display: boolean
    eatCooldown: number

    constructor(pos: Pos2D, model: Function | THREE.Group, scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1), eatCooldown: number = 0){
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
        
        this.eatCooldown = eatCooldown;

        this.ID = INC_ID;
        INC_ID += 1;
    }

    load(screen: GameScreen){
        if(this.model != null){
            screen.scene.add(this.model);

            this.model.position.set(this.pos.x, 0, this.pos.y);
            this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
        }
    }

    update(screen: GameScreen, world: GameWorld){
        this.shaders_data["display"] = {
            type: "f",
            value: world.distance(this.pos, world.player.real_pos(world)) < screen.config.CAMERA_WIDTH / 1.5
        };

        if(this.model != null){
            if(this.shaders_data.display.value && this.model.parent == null)
                screen.scene.add(this.model);
            
            if(!this.shaders_data.display.value && this.model.parent != null)
                this.model.removeFromParent();
        }

        if(this.shaders_data.display.value && this.model != null){
            this.model.position.set(this.pos.x, 0, this.pos.y);
            this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
        }

        if(this.eatCooldown > 0)
            this.eatCooldown -= 1;

        this.custom_update(screen, world);
    }

    custom_update(_screen: GameScreen, _world: GameWorld){}
    
    remove(_screen: GameScreen, world: GameWorld){
        const same_ID = (object: GameObject) => object.ID === this.ID;
        const index = world.objects.findIndex(same_ID);

        if(this.model != null)
            this.model.removeFromParent();
        world.objects.splice(index, 1);

        this.custom_remove(_screen, world);
    }

    custom_remove(_screen: GameScreen, _world: GameWorld){}
}