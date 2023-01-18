import { Collision } from "../interfaces/collision.interface";
import { Position } from "../interfaces/position.interface";
import { Size } from "../interfaces/size.interface";

class PlayerFunctions {
    async collideWithCollision(
        collisionsList: Collision[],
        levelZPlayer: number,
        futurePositionPlayer: Position,
        sizePlayer: Size
    ): Promise<any>{
        return true
      }
}

export default PlayerFunctions