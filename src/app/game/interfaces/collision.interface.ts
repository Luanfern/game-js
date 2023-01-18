import { Position } from './position.interface'
import { Size } from './size.interface'

export interface Collision{
    levelZ: number
    sizeRectBase: Size
    polygon: Position[]
}