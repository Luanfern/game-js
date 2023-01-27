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

    constructor(
        size: Size,
        position: Position,
        mapImage: HTMLImageElement,
        scaleMap: number,
        ctx: CanvasRenderingContext2D,
        mapInformations: MapInformations
    ) {
        super(ctx, size, position);
        this.scaleMap = scaleMap
        this.mapImage = mapImage
        this.size = mapInformations.sizeMap
        this.mapInformations = mapInformations
    }

    draw(): void {
        this.ctx!.fillStyle = '#1c1c1c'
        this.ctx!.fillRect(0, 0, this.size!.w * this.scaleMap, this.size!.h * this.scaleMap)

        var mi = this.mapInformations

        for (let layers = 0; layers < mi.mapLayers.length; layers++) {
            const dataLayer = mi.mapLayers[layers].data;

            this.drawMapFunctions.drawLayerMap(
                mi.mapWidth,
                mi.tileWidth,
                mi.tileHeight,
                mi.tilesQtdMapHeight,
                mi.tilesQtdMapWidth,
                mi?.mapTilesets,
                this.scaleMap,
                mi.mapLayers[layers].data,
                this.ctx,
            )
        }

    }
    update(): void {
        this.draw()
    }
}