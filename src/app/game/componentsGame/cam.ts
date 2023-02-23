import { ComponentGame } from "../abstractions/componentGame"
import { ComponentPlayer } from "../abstractions/componentPlayer";
import { Position } from "../interfaces/position.interface";
import { Size } from "../interfaces/size.interface";
import { Map } from "./map";

export class Cam extends ComponentGame{
    setLayersLoad(layerLoad: number[]): void {
        throw new Error("Method not implemented.");
    }
    map: Map | undefined
    followerSprite: ComponentPlayer | undefined
    scaleMap: number | undefined
    centralizeCam: boolean | undefined

    constructor(ctx: CanvasRenderingContext2D, size: Size, position: Position, followerSprite: ComponentPlayer, map: Map, scaleMap: number, centralizeCam: boolean, levelZ: number){
        super(ctx, size, position, levelZ);
        this.map = map
        this.followerSprite = followerSprite
        this.scaleMap = scaleMap
        this.centralizeCam = centralizeCam
    }

    setFollower(sprite: ComponentPlayer){
        this.followerSprite = sprite
    }

    centralize(): void {
        if (this.centralizeCam) {
            this.position.x = (this.followerSprite?.position.x! - (this.followerSprite?.size.w!/2)) - (this.size.w!/2)
            this.position.y = (this.followerSprite?.position.y! - (this.followerSprite?.size.h!/2)) - (this.size.h!/2)
            this.centralizeCam = false
        }
    }

    draw(): void {

        //20% da extremidade
        if (this.followerSprite!.position.x < (this.position.x + ((this.size.w * 0.45) - this.followerSprite?.size.w!)) && this.position.x > 0) {
            this.followerSprite?.velocity.x! != 0 ?
            this.position.x = this.position.x + this.followerSprite?.velocity.x! :
            this.position.x = this.position.x - 4
            
        }
        if (this.followerSprite!.position.x > (this.position.x + ((this.size.w * 0.65) - this.followerSprite?.size.w!)) && this.position.x + this.size.w < this.map?.size.w! * this.scaleMap!) {
            this.followerSprite?.velocity.x! != 0 ?
            this.position.x = this.position.x + this.followerSprite?.velocity.x! :
            this.position.x = this.position.x + 4
        }
        if (this.followerSprite!.position.y < (this.position.y + ((this.size.h * 0.45) - this.followerSprite?.size.h!)) && this.position.y > 0) {
            this.followerSprite?.velocity.y! != 0 ?
            this.position.y = this.position.y + this.followerSprite?.velocity.y! :
            this.position.y = this.position.y - 4
        }
        if (this.followerSprite!.position.y > (this.position.y + ((this.size.h * 0.65) - this.followerSprite?.size.h!))&& this.position.y + this.size.h < this.map?.size.h! * this.scaleMap!) {
            this.followerSprite?.velocity.y! != 0 ?
            this.position.y = this.position.y + this.followerSprite?.velocity.y! :
            this.position.y = this.position.y + 4
        }

        if (this.position.y < 0) {
            this.position.y = 0
        }
        
        if (this.position.x < 0) {
            this.position.x = 0
        }

        if (this.position.x + this.size.w > this.map?.size.w! * this.scaleMap!) {
            this.position.x = this.map?.size.w! * this.scaleMap! - this.size.w
        }
        
        if (this.position.y + this.size.h > this.map?.size.h!* this.scaleMap!) {
            this.position.y = this.map?.size.h! * this.scaleMap! - this.size.h
        }

        if (this.followerSprite!.position!.x + this.followerSprite!.velocity!.x <= 0 ||
            this.followerSprite!.position!.x + this.followerSprite!.velocity!.x >= this.map?.size.w! * this.scaleMap! - this.followerSprite!.size.w) {
            this.followerSprite!.velocity!.x = 0
        }

        if (this.followerSprite!.position!.y + this.followerSprite!.velocity!.y <= 0 ||
            this.followerSprite!.position!.y + this.followerSprite!.velocity!.y >= this.map?.size.h! * this.scaleMap! - this.followerSprite!.size.h) {
            this.followerSprite!.velocity!.y = 0
        }
    }
    update(): void {
        this.draw()
        this.centralize()
        this.ctx!.translate(-this.position.x, -this.position.y)
    }
}