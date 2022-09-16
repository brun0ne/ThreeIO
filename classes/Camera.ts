import Pos2D from "./Pos2D";

export default class Camera{
    pos: Pos2D
    scale: number
    
    target_speed: number
    speed: number
    
    constructor(pos: Pos2D = new Pos2D(0, 0), scale: number = 1, speed: number = 0.5){
        this.pos = pos;

        this.scale = scale;

        this.target_speed = speed;
        this.speed = speed;
    }
}