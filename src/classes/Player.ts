import * as THREE from "three"
import { player_model, SettingsType } from "../models/player";
import Assets from "./Assets";
import BoxObject from "./BoxObject";
import GameObject from "./GameObject";
import GameScreen from "./GameScreen";
import GameWorld from "./GameWorld";
import Pos2D from "./Pos2D";

export default class Player extends GameObject{
    light: THREE.PointLight
    Z: number
    LIGHT_Z: number
    SPEED_UP: boolean

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
        this.SPEED_UP = false;
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

        this.loadSmallExplosion(screen, Assets.get("white"));

        // pre-scale the view
        screen.config.CAMERA_WIDTH = screen.config.BASE_CAMERA_WIDTH + this.settings.radius * 10;
    }

    update(screen: GameScreen, world: GameWorld){
        this.model.position.set(this.pos.x + world.camera_obj.pos.x, this.Z, this.pos.y + world.camera_obj.pos.y);
        this.light.position.set(this.pos.x + world.camera_obj.pos.x, this.LIGHT_Z, this.pos.y + world.camera_obj.pos.y);

        // check for intersecting with objects
        world.objects.forEach(object => {
            if(world.distance(this.real_pos(world), object.pos) < this.settings.radius)
                this.eat(screen, object, world);
        });
        
        this.settings.radius = screen.interlace(this.settings.radius, this.settings.targetRadius, Math.abs(1 - this.settings.targetRadius / this.settings.radius));

        this.updateShadersData();

        // scale the view
        this.updateCameraView(screen);

        // SPEED UP
        if(this.SPEED_UP){
            world.camera_obj.target_speed = 1.0; 
            this.loose_mass(world, screen);
        }
        else{
            world.camera_obj.target_speed = 0.5;
        }

        world.camera_obj.speed = screen.interlace(world.camera_obj.speed, world.camera_obj.target_speed);

        // refresh score display
        $("#score").html("Score: " + Math.floor(this.settings.targetRadius*10 - 30));
    }

    updateCameraView(screen: GameScreen){
        screen.config.TARGET_CAMERA_WIDTH = screen.config.BASE_CAMERA_WIDTH + this.settings.radius * 10;
    }

    eat(screen: GameScreen, object: GameObject, world: GameWorld){
        if(object.eatCooldown > 0)
            return false;

        const BONUS = object.scale.x * 2 / this.settings.targetRadius;
        this.settings.targetRadius += BONUS;

        if(object instanceof BoxObject){
            const POS = new THREE.Vector3(object.pos.x, 150, object.pos.y);
            this.emitParticles(0.05, POS);
        }

        object.remove(screen, world);
    }

    loose_mass(world: GameWorld, screen: GameScreen){
        if(world.time % 30 == 0){
            world.addObject(new BoxObject(this.real_pos(world), world.camera_obj.target_speed * this.settings.radius * 2), screen);
            this.settings.targetRadius -= 0.5;
        }
    }

    real_pos(world: GameWorld): Pos2D{
        return new Pos2D(this.pos.x + world.camera_obj.pos.x, this.pos.y + world.camera_obj.pos.y);
    }

    updateShadersData(){
        this.shaders_data["radius"] = {
            type: "f",
            value: this.settings.radius
        };
    }
}