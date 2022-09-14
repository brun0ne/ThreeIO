export default class Pos2D{
    x: number
    y: number

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    get length(){
        return Math.sqrt(this.x**2 + this.y**2);
    }

    get normalized(){
        return new Pos2D(this.x / this.length, this.y / this.length);
    }
}