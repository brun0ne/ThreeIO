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
    SphereZone,
    ease
  } from 'three-nebula';

import * as THREE from "three"
import GameScreen from './GameScreen'

export default class ParticleObject{
    emitter: Emitter

    loadSmallExplosion(screen: GameScreen, texture: THREE.Texture){
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
            .setRate(new Rate(new Span(5, 8), new Span(0, 0.002)))
            .addInitializers([
                new Body(createSprite()),
                new Mass(1),
                new Life(0.5, 1),
                new Position(new SphereZone(0.5))
            ])
            .addBehaviours([
                new RandomDrift(5, 0, 5, 0),
                new Scale(new Span(0.2, 0.4), 0),
                new Color('#ff0000', '#ffff00', Infinity, ease.easeOutSine),
            ])
            
        screen.nebula.addEmitter(this.emitter);
    }

    loadGPUExplosion(screen: GameScreen, texture: THREE.Texture, SPAN: Span = new Span(5, 8), COLOR: Color = new Color('#ff0000', '#ffff00', Infinity, ease.easeOutSine)){
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
            .setRate(new Rate(SPAN, new Span(0, 0.002)))
            .addInitializers([
                new Body(createSprite()),
                new Mass(1),
                new Life(0.3, 0.6),
                new Position(new SphereZone(0.5))
            ])
            .addBehaviours([
                new RandomDrift(3, 0, 3, 0),
                new Scale(new Span(0.2, 0.4), 0),
                COLOR
            ])
            
        screen.GPU_nebula.addEmitter(this.emitter);
    }

    emitParticles(time: number = 0.05, position: THREE.Vector3){
        if(this.emitter == null)
            return false;

        this.emitter.position = position;
        this.emitter.emit(time);
    }
}