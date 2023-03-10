import { Collision } from "../interfaces/collision.interface"
import { LayersMap } from "../interfaces/layersMap.interface"
import { MapInformations } from "../interfaces/mapInformations.interface"
import { Position } from "../interfaces/position.interface"
import { TilesetMap } from "../interfaces/tilesetmap.interface"
import DrawMapFunctions from "./DrawMapFunctions"
import LoadMapFunctions from "./LoadMapFunctions"

class LoadMapInformations {

    mapInformations!: MapInformations;

    async loadTiled(scale: number): Promise<MapInformations> {
        var loadMapFunctions = new LoadMapFunctions()
        var map = await loadMapFunctions.loadJson('../../../assets/mapTile/mapTile.json')

        var tilewidth = map.tilewidth
        var tileheight = map.tileheight
        var tilesQtdMapWidth = map.width
        var tilesQtdMapHeight = map.height
        var width = (map.width * tilewidth)
        var height = (map.height * tileheight)

        var tilesetsMap: TilesetMap[] = []
        var layersMap: LayersMap[] = []
        var collisions: Collision[] = []

        //set size of map
        var sizeMap = { w: width + (2 * tilewidth), h: height + (2 * tileheight) }

        await Promise.all(
            map.tilesets.map(async (e: any, i: number) => {
                var source = e.source
                await loadMapFunctions.loadJson(`../../../assets/mapTile/${source}`)
                    .then((tileInfo) => {
                        var cols = tileInfo.columns as number
                        var rows = (tileInfo.tilecount / tileInfo.columns) as number
                        var minGId = map.tilesets[i].firstgid
                        var maxGId = 0
                        if (i + 1 < map.tilesets.length) {
                            maxGId = map.tilesets[i + 1].firstgid - 1
                        } else {
                            maxGId = map.tilesets[i].firstgid + tileInfo.tilecount
                        }
                        var image = new Image();
                        image.src = `../../../assets/mapTile/${tileInfo.image}`;
                        //image.onload = drawFunction;

                        const tsm = {
                            rows: rows,
                            cols: cols,
                            tileset: source,
                            minGId: minGId,
                            maxGId: maxGId,
                            tileImage: image
                        }
                        tilesetsMap.push(tsm)
                    }).catch(() => {
                        console.log('ERRO LOAD TILESETS!')
                    })
            })
        )

        await Promise.all(
            map.layers.map(async (e: any, i: number) => {
                if (e.type == "tilelayer") {
                    var data = e.data
                    var levelZ = 1
                    await Promise.all(
                        e.properties.map(async (et2: any, i: number) => {
                            if (et2.name == "levelZ") {
                                levelZ = et2.value
                            }
                        })
                    )
                    const tsm = {
                        levelZ: levelZ,
                        data: data
                    }
                    layersMap.push(tsm)
                }

                if (e.name == "collisions" ||
                    e.name == "collision" ||
                    e.name == "COLLISIONS"
                ) {
                    await Promise.all(
                        e.objects.map(async (et: any, i: number) => {
                            var polygon = et.polygon
                            var sizeRectBase = { w: et.x, h: et.y }
                            var levelZ = 1
                            await Promise.all(
                                et.properties.map(async (et2: any, i: number) => {
                                    if (et2.name == "levelZ") {
                                        levelZ = et2.value
                                    }
                                })
                            )

                            var drawFunctions = new DrawMapFunctions()
                            var polygonPositions = [] as Position[]
    
                            var widthZero = (((width/2)+32) * scale)
                            var heightZero = ((tileheight+16) * scale)
    
                            var initialPosition = drawFunctions.calcIsometricPositions(
                                sizeRectBase.w * scale,
                                sizeRectBase.h * scale,
                                widthZero,
                                heightZero)
                
                            for (let ipolypoints = 0; ipolypoints < et.polygon.length; ipolypoints++) {
                                
                                var pointMoreX = et.polygon[ipolypoints].x * scale
                                var pointMoreY = et.polygon[ipolypoints].y * scale
                
                                var positionsxy = drawFunctions.calcIsometricPositions(
                                    pointMoreX,
                                    pointMoreY,
                                    initialPosition.x,
                                    initialPosition.y)
                                
                                polygonPositions.push({x: positionsxy.x,y: positionsxy.y})
                            }
    
                            const colli = {
                                levelZ: levelZ,
                                polygon: polygonPositions,
                                sizeRectBase: sizeRectBase
                            }

                            collisions.push(colli)
                        })
                    )
                }
            })
        )

        this.mapInformations = {
            tileWidth: tilewidth,
            tileHeight: tileheight,
            tilesQtdMapWidth: tilesQtdMapWidth,
            tilesQtdMapHeight: tilesQtdMapHeight,
            mapWidth: width,
            mapHeight: height,
            sizeMap: sizeMap,
            mapTilesets: tilesetsMap,
            mapLayers: layersMap,
            collisions: collisions
        }

        return this.mapInformations

        //this.loadMapInformations = true
    }

}

export default LoadMapInformations