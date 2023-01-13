import { Collision } from "./collision.interface";
import { LayersMap } from "./layersMap.interface";
import { TilesetMap } from "./tilesetmap.interface";

export interface MapInformations{
    tileWidth: number,
    tileHeight: number,
    tilesQtdMapHeight: number,
    tilesQtdMapWidth: number,
    mapWidth: number,
    mapHeight: number,
    mapTilesets: TilesetMap[]
    mapLayers: LayersMap[],
    collisions: Collision[]
}