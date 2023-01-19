import { ComponentGame } from "../abstractions/componentGame";
import DrawMapFunctions from "../functions/DrawMapFunctions";
import { MapInformations } from "../interfaces/mapInformations.interface";
import { Position } from "../interfaces/position.interface";
import { Size } from "../interfaces/size.interface";

export class Map extends ComponentGame {
    mapImage: HTMLImageElement | undefined
    scaleMap: number = 1
    mapInformations!: MapInformations;

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
        this.ctx!.fillRect(0, 0, this.size!.w  * this.scaleMap, this.size!.h  * this.scaleMap)

        let mapIndex = 0
        let X = 0
        let Y = 0

        var mi = this.mapInformations

        var width = (mi.mapWidth/2)-(mi.tileWidth/3) // começar do meio (width total / 2)  |   subtrair mi.tileWidth a cada loop
        var maxWidth = width
        var height = mi.tileHeight // somar mi.tileHeight a cada loop

       for (let layers = 0; layers < mi.mapLayers.length; layers++) {
        const dataLayer = mi.mapLayers[layers].data;

        //MATRIZ : passando por cada quadrado! (conferir valores no tiled map editor)
        for (let widthMatriz = 0; widthMatriz < mi.tilesQtdMapWidth; widthMatriz++) {
            
            for (let heightMatriz = 0; heightMatriz < mi.tilesQtdMapHeight; heightMatriz++) {

                let tileVal = dataLayer[mapIndex]!;
                if (tileVal != 0) {
                    let tileset = 0
                    mi?.mapTilesets.map((e, i) => {
                        if (tileVal <= e.maxGId && tileVal >= e.minGId) {
                            tileset = i
                        }
                    })

                    var tileValNormalize = (tileVal-mi?.mapTilesets[tileset].minGId)+1
                    var xp = 0
                    var yp = 0
                    var someTile = 0

                    for (let ir = 0; ir < mi?.mapTilesets[tileset].rows; ir++) {
                        for (let ic = 0; ic < mi?.mapTilesets[tileset].cols; ic++) {
                            someTile++
                            if (someTile == tileValNormalize) {
                                yp = ir  
                                xp = ic   
                            }
                        }
                        
                    }

                    Y = yp * mi?.tileWidth!;
                    X = xp * mi?.tileWidth!;

                    this.ctx.drawImage(
                        mi?.mapTilesets[tileset].tileImage!,
                        X,
                        Y,
                        mi?.tileWidth,
                        mi?.tileWidth,
                        width* this.scaleMap,
                        height* this.scaleMap,
                        mi?.tileWidth * this.scaleMap,
                        mi?.tileWidth * this.scaleMap,
                    );
                }
                mapIndex++;

                height += mi.tileHeight/2
                width += mi.tileWidth/2
            }

            height = ((mi.tileHeight * widthMatriz)/2)+ mi.tileHeight
            width = maxWidth - ((mi.tileWidth/2) * widthMatriz)
            
        }
        mapIndex = 0;
       }

    }
    update(): void {
            this.draw()
    }
}