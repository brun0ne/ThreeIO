import { Vector3 } from "three";
import box_model from "../models/box";
import GameObject from "./GameObject";
import Pos2D from "./Pos2D";

import random from "../node_modules/random/dist/cjs/random"

export default class BoxObject extends GameObject{
    rotationDir: number

    constructor(pos: Pos2D){
        const randScale = random.float(0.3, 0.5);

        const scale = new Vector3(randScale, randScale, randScale);

        super(pos, box_model, scale);

        this.rotationDir = random.bool() ? 1 : -1; // 1 or -1 randomly
    }

    custom_update(){
        if(this.shaders_data.display.value)
            this.model.rotateY(this.rotationDir * Math.PI/360);
    }
}