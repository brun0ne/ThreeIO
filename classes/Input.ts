import Player from "./Player";
import Camera from "./Camera";
import Pos2D from "./Pos2D";
import GameScreen from "./GameScreen";

type MouseType = {
    left: boolean
    mid: boolean
    right: boolean
    pos: Pos2D
};

export default class Input{
    static keys: boolean[]
    static mouse: MouseType

    static camera_angle: boolean

    static addListeners(){
        Input.keys = [];
        
        Input.mouse = {
            left: false,
            mid: false,
            right: false,
            pos: new Pos2D(0, 0)
        };

        document.body.addEventListener("keydown", function(e: KeyboardEvent){
            Input.keys[e.keyCode] = true;

            if(Input.keys[81]){ // Q
                Input.camera_angle = !Input.camera_angle;
            }
        });
        document.body.addEventListener("keyup", function(e: KeyboardEvent){
            Input.keys[e.keyCode] = false;
        });

        document.body.addEventListener("mousedown", function(e: MouseEvent){
            if(e.button == 0){
                Input.mouse.left = true; // left
            }
            else if(e.button == 1){
                Input.mouse.mid = true; // mid
            }
            else{
                Input.mouse.right = true; // right
            }
        });
        document.body.addEventListener("mouseup", function(e: MouseEvent){
            if(e.button == 0){
                Input.mouse.left = false; // left
            }
            else if(e.button == 1){
                Input.mouse.mid = false; // mid
            }
            else{
                Input.mouse.right = false; // right
            }
        });

        document.body.addEventListener("mousemove", function(e: MouseEvent){
            Input.mouse.pos.x = e.pageX;
            Input.mouse.pos.y = e.pageY;
        });
    }

    static followMouse(player: Player, camera: Camera){
        let distance = new Pos2D(
            Input.mouse.pos.x - window.innerWidth/2,
            Input.mouse.pos.y - window.innerHeight/2
        );

        let speed = {
            x: 0,
            y: 0
        }

        if(Math.abs(distance.x) > 50)
            speed.x = distance.normalized.x * camera.speed;
        if(Math.abs(distance.y) > 50)
            speed.y = distance.normalized.y * camera.speed;

        camera.pos.x += speed.x;
        camera.pos.y += speed.y;
    }

    static update(player: Player, camera: Camera, screen: GameScreen){
        if(Input.keys[87]){ // W
            camera.pos.y -= camera.speed;
        }
        if(Input.keys[83]){ // S
            camera.pos.y += camera.speed;
        }
        if(Input.keys[65]){ // A
            camera.pos.x -= camera.speed;
        }
        if(Input.keys[68]){ // D
            camera.pos.x += camera.speed;
        }

        //Input.followMouse(player, camera);
    }
}