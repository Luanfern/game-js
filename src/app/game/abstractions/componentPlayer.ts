import { Position } from "../interfaces/position.interface";
import { Size } from "../interfaces/size.interface";
import { Velocity } from "../interfaces/velocity.interface";
import { ComponentGame } from "./componentGame";

export abstract class ComponentPlayer extends ComponentGame{
    velocity: Velocity;
    zoneRadiusControl: number;

    constructor(
        position: Position,
        size: Size,
        ctx: CanvasRenderingContext2D,
        velocity: Velocity,
        zoneRadiusControl: number
        ){
        super(ctx, size, position);
            this.velocity = velocity
            this.zoneRadiusControl = zoneRadiusControl
            this.velocity = velocity
            this.zoneRadiusControl = zoneRadiusControl
        }
}