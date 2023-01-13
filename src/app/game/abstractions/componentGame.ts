import { Position } from "../interfaces/position.interface";
import { Size } from "../interfaces/size.interface";

export abstract class ComponentGame{
    ctx: CanvasRenderingContext2D;
    size: Size;
    position: Position;
    constructor(
        ctx: CanvasRenderingContext2D,
        size: Size,
        position: Position){
            this.ctx = ctx,
            this.size = size,
            this.position = position
        }

    abstract draw(): void
    abstract update(): void
}