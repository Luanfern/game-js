import { Position } from "../interfaces/position.interface";
import { Size } from "../interfaces/size.interface";

export abstract class ComponentGame{
    ctx: CanvasRenderingContext2D;
    size: Size;
    position: Position;
    levelZ: number;
    constructor(
        ctx: CanvasRenderingContext2D,
        size: Size,
        position: Position,
        levelZ: number){
            this.ctx = ctx,
            this.size = size,
            this.position = position
            this.levelZ = levelZ
        }

    abstract draw(): void
    abstract update(): void
    abstract setLayersLoad(layerLoad: number): void

    //() => {}
}