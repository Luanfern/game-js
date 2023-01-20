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

        for (let polygonsIndex = 0; polygonsIndex < mi.collisions.length; polygonsIndex++) {
            this.ctx!.fillStyle = '#FFF'

            var polygonPoints = mi.collisions[polygonsIndex].polygon

            var currentPointX = polygonPoints[0].x
            var currentPointY = polygonPoints[0].y
            for (let ipolypoints = 0; ipolypoints < polygonPoints.length; ipolypoints++) {
                var pointMoreX = polygonPoints[ipolypoints].x
                var pointMoreY = polygonPoints[ipolypoints].y

                var indice = 200
                var bfnx = (currentPointX-pointMoreX)/indice
                var bfny = (currentPointY-pointMoreY)/indice
                var fnx = bfnx
                var fny = bfny
                for (let i = 0; i < indice; i++) {
                    this.ctx.fillText(`O`,currentPointX-fnx,currentPointY-fny)             
                    fnx+=bfnx
                    fny+=bfny
                }

                currentPointX = pointMoreX
                currentPointY = pointMoreY
                
            }
            this.ctx.strokeStyle = "#000";
           
        }

       /* //TESTE - only points

       for (let polygonsIndex = 0; polygonsIndex < mi.collisions.length; polygonsIndex++) {
            this.ctx!.fillStyle = '#FFF'

            var polygonPoints = mi.collisions[polygonsIndex].polygon

            for (let ipolypoints = 0; ipolypoints < polygonPoints.length; ipolypoints++) {
                
                var pointMoreX = polygonPoints[ipolypoints].x
                var pointMoreY = polygonPoints[ipolypoints].y

                this.ctx.fillText(`${pointMoreX.toFixed(2)}, ${pointMoreY.toFixed(2)}`,pointMoreX,pointMoreY)
                this.ctx!.fillStyle = '#FFF'
                
            }
           
        }*/

    }
    update(): void {
            this.draw()
    }
}