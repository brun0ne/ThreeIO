import GameScreen from './GameScreen'
import GameObject from './GameObject'
import Pos2D from './Pos2D';
import Camera from './Camera';
import Player from './Player';
import Input from './Input';

import BoxObject from './BoxObject';

export default class GameWorld{
    objects: GameObject[]
    camera: Camera
    player: Player

    time: number

    shaders_data: any

    constructor(){
        this.objects = Array();

        this.time = 0;
            
        this.populate();

        this.camera = new Camera();
        this.player = new Player(this.shaders_data);
    }

    load(screen: GameScreen){
        this.objects.forEach(object => {
            object.load(screen);
        });

        this.player.load(screen);
    }

    update(screen: GameScreen){
        this.objects.forEach(object => {
            object.update(screen, this);
        });

        this.player.update(screen, this);

        // camera follows the player
        if(!Input.camera_angle)
            screen.camera.position.set(this.player.pos.x + this.camera.pos.x, screen.config.CAMERA_Y, this.player.pos.y + this.camera.pos.y);
        else
            screen.camera.position.set(this.player.pos.x + this.camera.pos.x, screen.config.CAMERA_Y / 5, this.player.pos.y + this.camera.pos.y + 25);  
        
        screen.camera.lookAt(this.player.pos.x + this.camera.pos.x, 0, this.player.pos.y + this.camera.pos.y);

        // increase time
        this.time += 1;

        // update shaders data
        this.shaders_data.time.value = this.time;
    }

    populate(){
        this.shaders_data = {
            time: {
                type: "f",
                value: 0
            }
        };

        this.objects.push(new BoxObject(new Pos2D(10, 10), this.shaders_data));
        this.objects.push(new BoxObject(new Pos2D(-10, -10), this.shaders_data));
        this.objects.push(new BoxObject(new Pos2D(25, 15), this.shaders_data));
        this.objects.push(new BoxObject(new Pos2D(20, -15), this.shaders_data));
        this.objects.push(new BoxObject(new Pos2D(15, -30), this.shaders_data));
    }

    distance(pos1: Pos2D, pos2: Pos2D): number{
        return Math.sqrt((pos1.x - pos2.x)**2 + (pos1.y - pos2.y)**2);
    }
}