import {
    Body,
    Color,
    Emitter,
    Life,
    Mass,
    Position,
    RandomDrift,
    Rate,
    Scale,
    Span,
    BoxZone,
    ease
  } from 'three-nebula';

import * as THREE from "three"
import GameScreen from './GameScreen'

export default class AmbienceParticles {
    emitter: Emitter

    addAmbience(screen: GameScreen, texture: THREE.Texture){
        this.emitter = new Emitter();

        const createSprite = () => {
            var material = new THREE.SpriteMaterial({
                map: texture,
                color: 0xffffff,
                blending: THREE.NormalBlending,
                fog: false,
            });
            return new THREE.Sprite(material);
        };

        this.emitter
            .setRate(new Rate(new Span(1000), new Span(0, 0.002)))
            .addInitializers([
                new Body(createSprite()),
                new Mass(1),
                new Life(Infinity),
                new Position(new BoxZone(0, 150, 0, screen.config.WORLD_SIZE, 10, screen.config.WORLD_SIZE))
            ])
            .addBehaviours([
                new RandomDrift(0.1, 0, 0.1, 0),
                new Scale(new Span(0.1, 0.2), 0),
                new Color('#ffffff', '#ffffff', Infinity, ease.easeOutSine)
            ])
            
        screen.GPU_nebula.addEmitter(this.emitter);
        this.emitter.emit(0.05);
    }
}