import { Collision } from "../interfaces/collision.interface";
import { Position } from "../interfaces/position.interface";
import { Size } from "../interfaces/size.interface";

class PlayerFunctions {
    collideWithCollision(
        collisionsList: Collision[],
        levelZPlayer: number,
        futurePositionPlayer: Position,
        sizePlayer: Size,
         ctx: any
    ): any {

        //AREA - four veticies from player area
        var verticiesOfPlayerArea = [
            {x: futurePositionPlayer.x, y: futurePositionPlayer.y},
            {x: futurePositionPlayer.x+sizePlayer.w, y: futurePositionPlayer.y},
            {x: futurePositionPlayer.x, y: futurePositionPlayer.y+sizePlayer.h},
            {x: futurePositionPlayer.x+sizePlayer.w, y: futurePositionPlayer.y+sizePlayer.h},
        ]

        //DRAW VERTICIES - player
        ctx!.fillStyle = 'yellow'
        verticiesOfPlayerArea.forEach(
            (p)=>{
                ctx.fillText('0', p.x, p.y)
            }
        )

        //filter collisions of same levelZ Player
        var filterCollisions = collisionsList.filter((collision) => { return collision.levelZ == levelZPlayer })
        filterCollisions.map(
            (collision) => {
                
                //Points of lines from verticie to verticie
                var polygonPoints = collision.polygon
                var currentPointX = polygonPoints[0].x
                var currentPointY = polygonPoints[0].y
                for (let ipolypoints = 0; ipolypoints < polygonPoints.length; ipolypoints++) {
                    var pointMoreX = polygonPoints[ipolypoints].x
                    var pointMoreY = polygonPoints[ipolypoints].y

                    var indice = 200
                    var bfnx = (currentPointX - pointMoreX) / indice
                    var bfny = (currentPointY - pointMoreY) / indice
                    var fnx = bfnx
                    var fny = bfny
                    for (let i = 0; i < indice; i++) {
                        fnx += bfnx
                        fny += bfny
                    }

                    currentPointX = pointMoreX
                    currentPointY = pointMoreY

                }
            }
        )
    }
}

export default PlayerFunctions