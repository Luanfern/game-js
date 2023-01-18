import { ComponentGame } from "../abstractions/componentGame";
import DrawMapFunctions from "../functions/DrawMapFunctions";
import { MapInformations } from "../interfaces/mapInformations.interface";
import { Position } from "../interfaces/position.interface";
import { Size } from "../interfaces/size.interface";

export class Collisions extends ComponentGame {
    mapImage: HTMLImageElement | undefined
    scaleMap: number = 1
    mapInformations!: MapInformations;

    constructor(
        size: Size,
        position: Position,
        scaleMap: number,
        ctx: CanvasRenderingContext2D,
        mapInformations: MapInformations
        ) {
        super(ctx, size, position);
        this.scaleMap = scaleMap
        this.size = mapInformations.sizeMap
        this.mapInformations = mapInformations
    }

    draw(): void {
        var mi = this.mapInformations
        var widthZero = (((mi.mapWidth/2)+32) * this.scaleMap)
        var heightZero = ((mi.tileHeight+16) * this.scaleMap)

        //Collisions

        var drawFunctions = new DrawMapFunctions()

        for (let polygonsIndex = 0; polygonsIndex < mi.collisions.length; polygonsIndex++) {
            this.ctx!.fillStyle = '#FFF'

            var polygonPoints = mi.collisions[polygonsIndex].polygon

            var initialPosition = drawFunctions.calcIsometricPositions(
                mi.collisions[polygonsIndex].sizeRectBase.w * this.scaleMap,
                mi.collisions[polygonsIndex].sizeRectBase.h * this.scaleMap,
                widthZero,
                heightZero)

            var currentPointX = initialPosition.x
            var currentPointY = initialPosition.y
            for (let ipolypoints = 0; ipolypoints < polygonPoints.length; ipolypoints++) {
                var pointMoreX = polygonPoints[ipolypoints].x * this.scaleMap
                var pointMoreY = polygonPoints[ipolypoints].y * this.scaleMap

                var positionsxy = drawFunctions.calcIsometricPositions(pointMoreX, pointMoreY, initialPosition.x, initialPosition.y)

                this.ctx.beginPath();
                this.ctx.moveTo(currentPointX, currentPointY);
                this.ctx.lineTo(positionsxy.x, positionsxy.y);
                this.ctx.strokeStyle = "#fff";
                this.ctx.lineWidth   = 2;            
                this.ctx.stroke();
                this.ctx.fillStyle = "steelblue";

                currentPointX = positionsxy.x
                currentPointY = positionsxy.y
                
            }

            this.ctx.beginPath();
            this.ctx.moveTo(currentPointX, currentPointY);
            this.ctx.lineTo(initialPosition.x, initialPosition.y);
            this.ctx.strokeStyle = "#fff";
            this.ctx.lineWidth   = 2;            
            this.ctx.stroke();
            
            this.ctx.strokeStyle = "#000";
           
        }

    }
    update(): void {
            this.draw()
    }
}