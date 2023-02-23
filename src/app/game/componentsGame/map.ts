import { ComponentGame } from "../abstractions/componentGame";
import DrawMapFunctions from "../functions/DrawMapFunctions";
import { MapInformations } from "../interfaces/mapInformations.interface";
import { Position } from "../interfaces/position.interface";
import { Size } from "../interfaces/size.interface";

export class Map extends ComponentGame {
    mapImage: HTMLImageElement | undefined
    scaleMap: number = 1
    mapInformations!: MapInformations;
    drawMapFunctions = new DrawMapFunctions()

    layerToLoad: number[] | undefined

    constructor(
        size: Size,
        position: Position,
        mapImage: HTMLImageElement,
        scaleMap: number,
        ctx: CanvasRenderingContext2D,
        mapInformations: MapInformations,
        levelZ: number
    ) {
        super(ctx, size, position, levelZ);
        this.scaleMap = scaleMap
        this.mapImage = mapImage
        this.size = mapInformations.sizeMap
        this.mapInformations = mapInformations
    }

    getLevelLayers(): number{
        return this.mapInformations.mapLayers.length
    }

    setLayersLoad(layerLoad: number[]): void {
        this.layerToLoad = layerLoad
    }

    draw(): void {

        var mi = this.mapInformations

        for (let layers = 0; layers < this.layerToLoad!.length; layers++) {
            if(mi.mapLayers[this.layerToLoad![layers]].levelZ == 1) {
                this.ctx!.fillStyle = '#1c1c1c'
                this.ctx!.fillRect(0, 0, this.size!.w * this.scaleMap, this.size!.h * this.scaleMap)
            }

            this.drawMapFunctions.drawLayerMap(
                mi.mapWidth,
                mi.tileWidth,
                mi.tileHeight,
                mi.tilesQtdMapHeight,
                mi.tilesQtdMapWidth,
                mi?.mapTilesets,
                this.scaleMap,
                mi.mapLayers[this.layerToLoad![layers]].data,
                this.ctx,
            )
       }

    }
    update(): void {
        this.draw()
    }
}