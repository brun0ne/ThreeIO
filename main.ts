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
    
    const loop = setInterval(function(){
        if(!LOADED && Assets.TO_LOAD == Assets.loaded()){
            LOADED = true;

            screen.load();
            world.load(screen);

            // start drawing loop
            setTimeout(function(){
                $("#loading").remove();
                screen.update(world);
                clearInterval(loop);
            }, 200);
        }
    }, 1000*10/FPS);
});
