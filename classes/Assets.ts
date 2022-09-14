export default class Assets{
    static images: HTMLCanvasElement[]

    static loadImage(src: string): (HTMLCanvasElement | HTMLImageElement){
        const useCanvasCache = true;
        let decodeCanvas: any;
        let decodeCtx: CanvasRenderingContext2D;

        if (useCanvasCache){
            // creates a canvas to store the decoded image
            decodeCanvas = document.createElement('canvas') as HTMLCanvasElement;
            decodeCtx = decodeCanvas.getContext('2d') as CanvasRenderingContext2D;
        }
        let image = new Image();
        
        image.onload = function(){
            // transfer the image to the canvas to keep the data unencoded in memory
            if (useCanvasCache){
                decodeCanvas.width = image.width;
                decodeCanvas.height = image.height;
                decodeCtx.drawImage(image, 0, 0);

                console.log("loaded", decodeCanvas.width, decodeCanvas.height, src)
            }
        }
        image.src = src;

        // returns canvas or image
        if (useCanvasCache){
            return decodeCanvas;
        }
        else{
            return image;
        }
    }

    static getImage(path: string) {
        path = "/assets/" + path;
    
        if (path == null)
            return false;
    
        if (Assets.images[path] != null) {
            return Assets.images[path];
        } else {
            Assets.images[path] = Assets.loadImage(path);
    
            return Assets.images[path];
        }
    }

    static preLoad(){
        Assets.images = [];

        Assets.getImage("square.png");
        Assets.getImage("player.png");
    }
}