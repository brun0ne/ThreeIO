import GameScreen from './classes/GameScreen'
import GameWorld from './classes/GameWorld'

import Assets from './classes/Assets'
import Input from './classes/Input'

const screen = new GameScreen();
const world = new GameWorld();

$(document).ready(function(){
    // setup
    Assets.preLoad();
    Input.addListeners();

    let LOADED = false;

    // start main loop
    const FPS = 60;
    
    setInterval(function(){
        if(!LOADED && Assets.TO_LOAD == Assets.loaded()){
            LOADED = true;

            screen.load();
            world.load(screen);

            // start drawing loop
            setTimeout(function(){
                $("#loading").remove();
                screen.update();
            }, 200);
        }
        if(LOADED){
            world.update(screen);
            Input.update(world.player, world.camera, screen);
        }
    }, 1000/FPS);
});
