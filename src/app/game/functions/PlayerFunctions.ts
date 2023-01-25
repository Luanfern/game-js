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
        var colid = false
        
        //filter levelZ
        var filterCollision = collisionsList.filter((collision) => {
            return levelZPlayer == collision.levelZ
        })

        //Character center
        var centerPoint = {
            x: futurePositionPlayer.x,
            y: futurePositionPlayer.y + (sizePlayer.h - (sizePlayer.h/3))
        }

        //Area of collision player
        var centerArea = [
            {
                x: centerPoint.x,
                y: centerPoint.y
            },
            {
                x: centerPoint.x,
                y: centerPoint.y + (sizePlayer.h/3)
            },
            {
                x: centerPoint.x + (sizePlayer.w),
                y: centerPoint.y + (sizePlayer.h/3)
            },
            {
                x: centerPoint.x + (sizePlayer.w),
                y: centerPoint.y
            },
            {
                x: centerPoint.x,
                y: centerPoint.y
            }
        ]

        //points of area of collision player (divide por 6 e pega esses pontos)
        var pointsCenterArea: Position[] = []
        var currentPointX = centerArea[0].x
        var currentPointY = centerArea[0].y
        centerArea.map(async (pPoints) => {
            var pointMoreX = pPoints.x
            var pointMoreY = pPoints.y

            var sizeAreaForCollision = 7

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
                pointsCenterArea.push({ x: currentPointX - fnx, y: currentPointY - fny })
                //  ctx.fillText(`O`, currentPointX - fnx, currentPointY - fny)
                fnx += bfnx
                fny += bfny
            }

            currentPointX = pointMoreX
            currentPointY = pointMoreY
        })

        //searchPoint
        filterCollision.map((points) => {
            /*points.polygon.map((pointTwo) => {
                if (( centerArea.x >= pointTwo.x - 3 && centerArea.x <= pointTwo.x + 3) &&
                ( centerArea.y >= pointTwo.y - 3 && centerArea.y <= pointTwo.y + 3)) {
                    colid = true
                }
            })*/
            if (!colid) {
               colid = points.polygon.some((pointTwo) => {

                    //aumentar ponto de contato do player - pelo mnos 1/3 do tamanho (do meio para baixo)
                    return pointsCenterArea.some((pointThree) => {
                        return ( pointThree.x >= pointTwo.x - 3 && pointThree.x <= pointTwo.x + 3) &&
                                ( pointThree.y >= pointTwo.y - 3 && pointThree.y <= pointTwo.y + 3)
                    })
                })
            }
        })

        return colid

        //teste
        //var ver = {x: 2500, y: 350}
        //console.log(centerArea)
        //return !(( centerArea.x >= ver.x - 3 && centerArea.x <= ver.x + 3) && ( centerArea.y >= ver.y - 3 && centerArea.y <= ver.y + 3))

    }
}

export default PlayerFunctions