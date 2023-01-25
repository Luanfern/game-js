import { ComponentGame } from "../abstractions/componentGame";
import DrawMapFunctions from "../functions/DrawMapFunctions";
import { Collision } from "../interfaces/collision.interface";
import { MapInformations } from "../interfaces/mapInformations.interface";
import { Position } from "../interfaces/position.interface";
import { Size } from "../interfaces/size.interface";

export class Collisions {
    size: Size
    mapImage: HTMLImageElement | undefined
    scaleMap: number = 1
    mapInformations!: MapInformations;

    constructor(
        scaleMap: number,
        mapInformations: MapInformations,
    ) {
        this.scaleMap = scaleMap
        this.size = mapInformations.sizeMap
        this.mapInformations = mapInformations
    }

    async setCollisions(): Promise<Collision[]> {
        var mi = this.mapInformations
        //Collisions
        //filter collisions of same levelZ Player
        var allCollisionsPoints = [] as Collision[]
        await Promise.all(
            mi.collisions.map(
                async (collision) => {
                    var pointsCollisions = [] as Position[]

                    //Points of lines from verticie to verticie 
                    var polygonPoints = collision.polygon
                    var currentPointX = polygonPoints[0].x
                    var currentPointY = polygonPoints[0].y

                    await Promise.all(
                        polygonPoints.map(async (pPoints) => {
                            var pointMoreX = pPoints.x
                            var pointMoreY = pPoints.y

                            var sizeAreaForCollision = 5

                            var forCaclIndiceX = (currentPointX - pointMoreX) < 0 ? (currentPointX - pointMoreX) * -1 : (currentPointX - pointMoreX)
                            var forCaclIndiceY = (currentPointY - pointMoreY) < 0 ? (currentPointY - pointMoreY) * -1 : (currentPointY - pointMoreY)
                            var indice = forCaclIndiceX >= forCaclIndiceY ?
                                Math.floor((currentPointX - pointMoreX) / sizeAreaForCollision < 0 ?
                                    ((currentPointX - pointMoreX) / sizeAreaForCollision) * -1 :
                                    (currentPointX - pointMoreX) / sizeAreaForCollision) :
                                Math.floor((currentPointY - pointMoreY) / sizeAreaForCollision < 0 ?
                                    ((currentPointY - pointMoreY) / sizeAreaForCollision) * -1 :
                                    (currentPointY - pointMoreY) / sizeAreaForCollision)

                            var bfnx = (currentPointX - pointMoreX) / indice
                            var bfny = (currentPointY - pointMoreY) / indice
                            var fnx = bfnx
                            var fny = bfny

                            for (let i = 0; i < indice; i++) {
                                pointsCollisions.push({ x: currentPointX - fnx, y: currentPointY - fny })
                                //  ctx.fillText(`O`, currentPointX - fnx, currentPointY - fny)
                                fnx += bfnx
                                fny += bfny
                            }

                            currentPointX = pointMoreX
                            currentPointY = pointMoreY
                        })
                    )

                    allCollisionsPoints.push({ levelZ: collision.levelZ, polygon: pointsCollisions, sizeRectBase: undefined })
                }
            ))

            return allCollisionsPoints
    }
}