import GameScreen from './classes/GameScreen'
import GameWorld from './classes/GameWorld'

import Assets from './classes/Assets'
import Input from './classes/Input'

const screen = new GameScreen();
const world = new GameWorld();

$(document).ready(function(){
    // setup
    screen.load();

    window.onresize = function(){
        // screen.resize(window.innerWidth, window.innerHeight);
    }

    Assets.preLoad();
    world.load(screen);

    Input.addListeners();

    // start main loop
    const FPS = 60;
    
    setInterval(function(){
        world.update(screen);
        Input.update(world.player, world.camera, screen);
    }, 1000/FPS);

    screen.update();
});
