import * as THREE from "three"
import { player_model, SettingsType } from "../models/player";
import GameObject from "./GameObject";
import GameScreen from "./GameScreen";
import GameWorld from "./GameWorld";
import Pos2D from "./Pos2D";

import dot from "../assets/white.png"

export default class Player extends GameObject{
    light: THREE.PointLight
    Z: number
    LIGHT_Z: number
    settings: SettingsType

    shaders_data: any

    constructor(){
        super(new Pos2D(0, 0), null, new THREE.Vector3(1, 1, 1));

        this.settings = {
            radius: 3,
            targetRadius: 3
        };

        this.updateShadersData();
        this.model = player_model(this.shaders_data, this.settings);

        this.Z = 0;
        this.LIGHT_Z = 12;
    }

    load(screen: GameScreen){
        // light
        this.light = new THREE.PointLight(0xffffff, 2, 2000);
        this.light.castShadow = true;

        this.light.shadow.mapSize.width = 1024;
        this.light.shadow.mapSize.height = 1024;
        //this.light.shadow.radius = 25;

        screen.player_scene.add(this.model);
        screen.scene.add(this.light);

        this.loadParticles(screen, dot);
    }

    update(screen: GameScreen, world: GameWorld){
        this.model.position.set(this.pos.x + world.camera.pos.x, this.Z, this.pos.y + world.camera.pos.y);
        this.light.position.set(this.pos.x + world.camera.pos.x, this.LIGHT_Z, this.pos.y + world.camera.pos.y);

        world.objects.forEach(object => {
            if(world.distance(this.real_pos(world), object.pos) < this.settings.radius)
                this.eat(screen, object, world);
        });
        
        if(this.settings.radius < this.settings.targetRadius)
            this.settings.radius += 0.01;

        this.updateShadersData();

        $("#score").html("Score: " + Math.floor(this.settings.targetRadius*10 - 30));
    }

    eat(screen: GameScreen, object: GameObject, world: GameWorld){
        const BONUS = object.scale.x * 2 / this.settings.targetRadius;

        this.settings.targetRadius += BONUS;

        const POS = object.model.position;
        POS.y += 150;
        this.emitParticles(0.05, POS);

        screen.config.TARGET_CAMERA_WIDTH += BONUS * 10;

        object.remove(world);
    }

    real_pos(world: GameWorld): Pos2D{
        return new Pos2D(this.pos.x + world.camera.pos.x, this.pos.y + world.camera.pos.y);
    }

    updateShadersData(){
        this.shaders_data["radius"] = {
            type: "f",
            value: this.settings.radius
        };
    }
}