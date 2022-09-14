import * as THREE from "three"

// DEV
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js'

import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from '../node_modules/three/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from '../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from '../node_modules/three/examples/jsm/shaders/FXAAShader.js';

import ParticleSystem, { GPURenderer } from 'three-nebula';

type ConfigType = {
    shadows: boolean
    CAMERA_Y: number,
    CAMERA_WIDTH: number,
    GROUND_LEVEL: number,
    BLOOM_STRENGH: number
}

export default class GameScreen{
    scene: THREE.Scene
    camera: THREE.OrthographicCamera
    renderer: THREE.WebGLRenderer
    composer: EffectComposer
    config: ConfigType
    aspectRatio: number

    stats: Stats

    player_scene: THREE.Scene

    nebula: ParticleSystem

    constructor(){
        this.scene = new THREE.Scene();
        this.player_scene = new THREE.Scene();

        this.config = {
            shadows: true,
            CAMERA_Y: 200,
            CAMERA_WIDTH: 960 / 8, // scale,
            GROUND_LEVEL: 0,
            BLOOM_STRENGH: 0.2
        };
    }

    load(){
        this.setup_camera();
        this.setup_renderer();
        this.setup_plane();
        this.setup_particles();
    }

    setup_camera(){
        this.camera = new THREE.OrthographicCamera();

        this.set_camera();
        
        this.camera.position.set(0, this.config.CAMERA_Y, 0);

        this.camera.lookAt(0, 0, 0);
        this.camera.rotation.set(-Math.PI/2, 0, 0);

        function onWindowResize(){
            console.log(this.composer.passes);
            
            this.composer.passes[3].uniforms['resolution'].value.x = 1 / (window.innerWidth * window.devicePixelRatio);
            this.composer.passes[3].uniforms['resolution'].value.y = 1 / (window.innerHeight * window.devicePixelRatio);

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setSize(window.innerWidth, window.innerHeight);
            console.log(this.composer)

            this.set_camera();
        }

        window.addEventListener('resize', onWindowResize.bind(this), false);
    }

    set_camera(){
        this.aspectRatio = window.innerWidth / window.innerHeight;
        const cameraWidth = this.config.CAMERA_WIDTH;
        const cameraHeight = cameraWidth / this.aspectRatio;

        this.camera.left = cameraWidth / -2;
        this.camera.right = cameraWidth / 2;
        this.camera.top = cameraHeight / 2;
        this.camera.bottom = cameraHeight / -2;

        this.camera.near = 0;
        this.camera.far = 700;
        
        this.camera.updateProjectionMatrix();
    }

    setup_renderer(){
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance"
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (this.config.shadows){
            //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.shadowMap.enabled = true;
        }

        this.renderer.autoClear = false;
        this.renderer.setPixelRatio(window.devicePixelRatio);

        document.body.appendChild(this.renderer.domElement);

        // stats
        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        // post processing
        this.composer = new EffectComposer(this.renderer);

        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        const playerRenderPass = new RenderPass(this.player_scene, this.camera);
        playerRenderPass.autoClear = false;
        playerRenderPass.clear = false;
        this.composer.addPass(playerRenderPass);

        const bloomPass = new UnrealBloomPass(new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0;
		bloomPass.strength = this.config.BLOOM_STRENGH;
		bloomPass.radius = 0;
        this.composer.addPass(bloomPass);

        const FXAA_Pass = new ShaderPass(FXAAShader);
        FXAA_Pass.uniforms['resolution'].value.x = 1 / (window.innerWidth * window.devicePixelRatio);
        FXAA_Pass.uniforms['resolution'].value.y = 1 / (window.innerHeight * window.devicePixelRatio);
        this.composer.addPass(FXAA_Pass);

        const effectFilm = new FilmPass(0, 0, 0, false);
        effectFilm.renderToScreen = true;
        this.composer.addPass(effectFilm);

        //this.particleSystem.addRenderer(new GPURenderer(this.scene, THREE));
    }

    setup_plane(){
        const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: 0x005291
        });

        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        plane.position.set(0, this.config.GROUND_LEVEL, 0);
        plane.rotation.set(-Math.PI/2, 0, 0);

        this.scene.add(plane);
    }

    setup_particles(){
        const nebula = new ParticleSystem();
        const nebulaRenderer = new GPURenderer(this.scene, THREE);
        this.nebula = nebula.addRenderer(nebulaRenderer);
    }

    get w(){
        return window.innerWidth;
    }

    get h(){
        return window.innerHeight;
    }

    update(){
        this.composer.render();
        this.nebula.update();

        this.stats.update();  

        window.requestAnimationFrame(this.update.bind(this));
    }
}