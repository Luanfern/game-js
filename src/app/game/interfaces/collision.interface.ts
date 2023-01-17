import { Position } from './position.interface'
import { Size } from './size.interface'

export interface Collision{
    initialPoint: Position
    sizeRectBase: Size
    polygon: Position[]
}