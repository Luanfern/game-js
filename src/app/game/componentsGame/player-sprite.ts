import { ComponentPlayer } from "../abstractions/componentPlayer";
import PlayerFunctions from "../functions/PlayerFunctions";
import { MapInformations } from "../interfaces/mapInformations.interface";
import { Position } from "../interfaces/position.interface";
import { Size } from "../interfaces/size.interface";
import { Velocity } from "../interfaces/velocity.interface";

export class SpritePlayer extends ComponentPlayer{
    scaleMap: number = 1
    mobilityZone: boolean = false
    animationTimer: any
    collisionState: boolean = true
    levelZPlayer: number = 1
    playerFunctions: PlayerFunctions = new PlayerFunctions()
    mapInformations: MapInformations

    constructor(
        position: Position,
        size: Size,
        ctx: CanvasRenderingContext2D,
        scaleMap: number,
        velocity: Velocity,
        zoneRadiusControl: number,
        mapInformations: MapInformations
        ){
        super( position, size, ctx, velocity, zoneRadiusControl);
            this.scaleMap = scaleMap,
            this.mapInformations = mapInformations
        }

        draw(){
            this.ctx!.fillStyle = '#1c1c1cA8'
            this.ctx!.beginPath();
            this.ctx!.arc(this.position!.x + ((this.size!.w * this.scaleMap) / 2), this.position!.y + ((this.size!.h * this.scaleMap) / 2), this.zoneRadiusControl! * this.scaleMap, 0, 2 * Math.PI);
            this.ctx!.closePath();
            this.ctx!.fill();
            this.ctx!.stroke();
            this.ctx!.fillStyle = 'red'
            this.ctx!.fillRect(this.position!.x, this.position!.y, this.size!.w  * this.scaleMap, this.size!.h  * this.scaleMap)
        }

        setMovimentation(x: number, y: number){
            this.velocity = {x: x, y: y}
           // console.log(this.velocity)
        }

        /*setPosition(x: number, y: number){
            this.position = {x: x, y: y}
           // console.log(this.velocity)
        }*/

        resizeZoneRadiusControl(resize: number){
            this.zoneRadiusControl = this.zoneRadiusControl! * resize
        }

        dash(e:MouseEvent){
            /*let px = this.position.x > innerWidth ? (this.position.x/innerWidth - Math.floor(this.position.x/innerWidth)) * innerWidth : this.position.x//this.position.x
            let py = this.position.y > innerHeight ? (this.position.y/innerHeight - Math.floor(this.position.x/innerHeight)) * innerHeight : this.position.y
            let cx = e.clientX - (this.size.w/2)
            let cy = e.clientY - (this.size.h/2)
        
            let currentStep = 1
            let steps = 8
        
            let a = (cx-px!)
            let b = (cy-py!)
            let c = Math.sqrt(Math.pow(a,2)+Math.pow(b,2))

            console.log(px)
            console.log(py)
            console.log(this.position.x)
            console.log(this.position.y)
            console.log(cx)
            console.log(cy)

            console.log('max distance possible: ' + (this.zoneRadiusControl! + 20 * this.scaleMap))
            console.log('>=')
            console.log('distance point to point: '+c)
        
            let valuestepA = a/steps
            let valuestepB = b/steps
            
           if (((this.zoneRadiusControl! + 20) * this.scaleMap) >= c) {
              this.animationTimer = setInterval(() => {
                this.setPosition((px! + valuestepA*currentStep), (py! + valuestepB*currentStep))
                currentStep++
                if (currentStep == steps) {
                  clearInterval(this.animationTimer)
                }
              }, 10)
              this.mobilityChange()
            }
            */
          }
        
          mobilityChange(){
            this.mobilityZone = !this.mobilityZone
            console.log(this.mobilityZone)
            this.mobilityZone ? this.resizeZoneRadiusControl(2.8) : this.resizeZoneRadiusControl(0.357142857143)
          }

          async move(){
            //verify collision
            var canWalk = this.playerFunctions.collideWithCollision(
              this.mapInformations.collisions,
              this.levelZPlayer,
              {
                x: this.position!.x + (this.velocity!.x),
                y: this.position!.y + (this.velocity!.y)
              },
              this.size,
              this.ctx
            )

            if (canWalk) {
              this.position!.x += (this.velocity!.x)
              this.position!.y += (this.velocity!.y) 
            }
          }

        update(){          
            this.move()
            this.draw()
        }
}