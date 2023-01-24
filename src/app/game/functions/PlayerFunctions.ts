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

        ctx.fillText(`${futurePositionPlayer.x}`, futurePositionPlayer.x, futurePositionPlayer.y - 10)
        ctx.fillText(`${futurePositionPlayer.y}`, futurePositionPlayer.x, futurePositionPlayer.y + sizePlayer.h + 10)
        //filter levelZ
        var filterCollision = collisionsList.filter((collision) => {
            return levelZPlayer == collision.levelZ
        })

        //Character center
        var centerPosition = {
            x: futurePositionPlayer.x + (sizePlayer.w/2),
            y: futurePositionPlayer.y + (sizePlayer.h/2)
        }

        //searchPoint
        filterCollision.map((points) => {
            points.polygon.map((pointTwo) => {
                if (( centerPosition.x >= pointTwo.x - 3 && centerPosition.x <= pointTwo.x + 3) &&
                ( centerPosition.y >= pointTwo.y - 3 && centerPosition.y <= pointTwo.y + 3)) {
                    colid = true
                }    
            })

        })

        return colid

        //teste
        //var ver = {x: 2500, y: 350}
        //console.log(centerPosition)
        //return !(( centerPosition.x >= ver.x - 3 && centerPosition.x <= ver.x + 3) && ( centerPosition.y >= ver.y - 3 && centerPosition.y <= ver.y + 3))

    }
}

export default PlayerFunctions