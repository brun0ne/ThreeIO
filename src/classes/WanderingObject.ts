import * as THREE from "three"
import Pos2D  from "./Pos2D"
import GameObject from "./GameObject"
import GameScreen from "./GameScreen"

import GameWorld from "./GameWorld";

import random from "../node_modules/random/dist/cjs/random"

import { Span, Color } from "three-nebula";
import Assets from "./Assets";

export default class WanderingObject extends GameObject{
    light: THREE.PointLight

    SPEED: number
    INTENSITY: number

    dirAngle: number
    dirAngleChange: number

    constructor(pos: Pos2D){
        const SIZE_FOR_SCORE = 5;
        super(pos, null, new THREE.Vector3(SIZE_FOR_SCORE, SIZE_FOR_SCORE, SIZE_FOR_SCORE));

        this.SPEED = 0.5;
        this.INTENSITY = 1;

        this.dirAngle = 2 * Math.PI * random.int(0, 360) / 360;
        this.randomDirChange();
    }

    randomDirChange(){
        this.dirAngleChange = random.bool() ? 1 : -1; // 1 or -1 randomly
    }

    load(screen: GameScreen){
        // light
        this.light = new THREE.PointLight(0xffffff, this.INTENSITY, 35);
        this.light.castShadow = false;

        screen.scene.add(this.light);

        this.loadGPUExplosion(screen, Assets.get("white"), new Span(1, 2), new Color("#ffffff"));
    }

    update(screen: GameScreen, world: GameWorld){
        this.shaders_data["display"] = {
            type: "f",
            value: world.distance(this.pos, world.player.real_pos(world)) < screen.config.CAMERA_WIDTH * 2
        };

        // if visible
        if(this.shaders_data.display.value){
            // update light position
            this.updateLightPos();

            // emit particles regularly
            const POS = new THREE.Vector3(this.pos.x, 150, this.pos.y);
            this.emitParticles(0.05, POS);
        }

        // smoothly change the movement angle
        this.dirAngle += (this.dirAngleChange / 360) * 2 * Math.PI;

        // movement (angular)
        this.pos.x += Math.sin(this.dirAngle) * this.SPEED;
        this.pos.y += Math.cos(this.dirAngle) * this.SPEED;

        // randomize dirChange regularly
        if(world.time % 60*10 == 0){
            this.randomDirChange();
        }

        // optimization
        if(this.shaders_data.display.value)
            this.light.intensity = this.INTENSITY;
        else
            this.light.intensity = 0;

        // map boundaries
        if(Math.abs(this.pos.x) > screen.config.WORLD_SIZE / 2)
            this.pos.x = 0;
        if(Math.abs(this.pos.y) > screen.config.WORLD_SIZE / 2)
            this.pos.y = 0;
    }

    updateLightPos(){
        this.light.position.set(this.pos.x, 12, this.pos.y);
    }

    randomizePos(screen: GameScreen, world: GameWorld){
        this.pos = screen.randomPosOnMap();

        if(world.distance(this.pos, world.player.real_pos(world)) < screen.config.CAMERA_WIDTH / 2){
            this.randomizePos(screen, world);
        }
    }

    remove(screen: GameScreen, world: GameWorld){
        this.randomizePos(screen, world);

        // update light position
        this.updateLightPos();
    }
}