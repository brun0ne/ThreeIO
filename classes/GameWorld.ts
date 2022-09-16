import GameScreen from './GameScreen'
import GameObject from './GameObject'
import Pos2D from './Pos2D'
import Camera from './Camera'
import Player from './Player'
import Input from './Input'

import BoxObject from './BoxObject'
import WanderingObject from './WanderingObject'

import random from "../node_modules/random/dist/cjs/random"
import randomWeightedChoice from "random-weighted-choice"

export default class GameWorld{
    objects: GameObject[]
    camera: Camera
    player: Player

    time: number

    shaders_data: any

    constructor(){
        this.objects = Array();

        this.time = 0;

        this.camera = new Camera();
        this.player = new Player();
    }

    load(screen: GameScreen){
        this.populate(screen);

        this.objects.forEach(object => {
            object.load(screen);
        });

        this.player.load(screen);
    }

    update(screen: GameScreen){
        // generate
        this.generate(screen);

        // update objects
        this.objects.forEach(object => {
            object.update(screen, this);
            
            // update shaders data
            object.shaders_data.time.value = this.time;
        });

        this.player.update(screen, this);
        this.player.shaders_data.time.value = this.time;

        // camera follows the player
        if(!Input.camera_angle)
            screen.camera.position.set(this.player.pos.x + this.camera.pos.x, screen.config.CAMERA_Y, this.player.pos.y + this.camera.pos.y);
        else
            screen.camera.position.set(this.player.pos.x + this.camera.pos.x, screen.config.CAMERA_Y / 5, this.player.pos.y + this.camera.pos.y + 25);  
        
        screen.camera.lookAt(this.player.pos.x + this.camera.pos.x, 0, this.player.pos.y + this.camera.pos.y);

        // increase time
        this.time += 1;
    }

    populate(screen: GameScreen){
        const WANDERING = 10;

        for(let i = 0; i < WANDERING; i++){
            const OBJ = new WanderingObject(new Pos2D(0, 0));
            OBJ.randomizePos(screen, this);

            this.addObject(OBJ, screen);
        }
    }

    generate(screen: GameScreen){
        const OBJECTS = 1000;

        while(this.objects.length < OBJECTS){
            const POS = screen.randomPosOnMap();

            const choice = randomWeightedChoice([
                {
                    id: "box",
                    weight: 1
                }
            ]);

            let OBJ: GameObject;

            switch (choice){
                case "box":
                    OBJ = new BoxObject(POS);
                    break;
                default:
                    alert("error");
            }

            this.addObject(OBJ, screen);
        }
    }

    distance(pos1: Pos2D, pos2: Pos2D): number{
        return Math.sqrt((pos1.x - pos2.x)**2 + (pos1.y - pos2.y)**2);
    }

    addObject(obj: GameObject, screen: GameScreen){
        this.objects.push(obj);
        this.objects.at(-1).load(screen);
    }
}