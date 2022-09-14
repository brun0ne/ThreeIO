import { Vector3 } from "three";
import box_model from "../models/box";
import GameObject from "./GameObject";
import Pos2D from "./Pos2D";

import random from "../node_modules/random/dist/cjs/random"

export default class BoxObject extends GameObject{
    constructor(pos: Pos2D, shaders_data: any){
        const randScale = random.float(0.3, 0.5);

        const scale = new Vector3(randScale, randScale, randScale);

        super(pos, box_model, shaders_data, scale);
    }

    custom_update(){
        this.model.rotateY(Math.PI/360);
    }
}