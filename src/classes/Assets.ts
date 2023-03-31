import * as THREE from "three"

import a_white from "../assets/white.png"
import a_red from "../assets/red.png"
import a_blue from "../assets/blue.png"
import a_smoke from "../assets/smokeparticle.png"

export default class Assets{
    static images: {}
    static TO_LOAD: number

    static load(name: string, imported_image: any){
        new THREE.TextureLoader().load(imported_image, function(texture: THREE.Texture){
            Assets.images[name] = texture;
        });
    }

    static get(name: string){
        return Assets.images[name];
    }

    static preLoad(){
        Assets.images = Array();

        Assets.TO_LOAD = 4;
        Assets.load("white", a_white);
        Assets.load("red", a_red);
        Assets.load("blue", a_blue);
        Assets.load("smoke", a_smoke);
    }

    static loaded(){
        return Object.keys(Assets.images).length;
    }
}