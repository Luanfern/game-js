import { ComponentGame } from "../abstractions/componentGame";
import LoadMapFunctions from "../functions/LoadMapFunctions";
import { Collision } from "../interfaces/collision.interface";
import { LayersMap } from "../interfaces/layersMap.interface";
import { MapInformations } from "../interfaces/mapInformations.interface";
import { Position } from "../interfaces/position.interface";
import { Size } from "../interfaces/size.interface";
import { TilesetMap } from "../interfaces/tilesetmap.interface";

export class Map extends ComponentGame {
    mapImage: HTMLImageElement | undefined
    scaleMap: number = 1
    loadMapInformations: boolean = false
    mapInformations!: MapInformations;

    constructor(size: Size, position: Position, mapImage: HTMLImageElement, scaleMap: number, ctx: CanvasRenderingContext2D) {
        super(ctx, size, position);
        this.scaleMap = scaleMap
        this.mapImage = mapImage
    }

    async loadTiled() {
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
        var orderLayer = 0

        //set size of map
        this.size = {w:width + (2*tilewidth), h:height + (2*tileheight)}

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
                        maxGId:maxGId,
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
                    const tsm = {
                        layerOrder: orderLayer,
                        data: data
                    }
                    layersMap.push(tsm)
                    orderLayer++
                }

                if (e.name == "collisions" ||
                e.name == "collision" ||
                e.name == "COLLISIONS"
                ) {
                   await Promise.all(
                    e.objects.map(async (et: any, i: number) => {
                        var polygon = et.polygon
                        var sizeRectBase = {w: et.x, h: et.y}
                        var inP = {x: 0, y: 0}
                        await Promise.all(
                            et.properties.map(async (et2: any, i: number) => {
                                if (et2.name == "initialPoint") {
                                    var v = JSON.parse(et2.value)
                                    inP = {x: v.x, y: v.y}
                                }
                            })
                        )
                        const colli = {
                            initialPoint: inP,
                            polygon: polygon,
                            sizeRectBase: sizeRectBase
                        }
                        console.log(inP)
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
            mapTilesets: tilesetsMap,
            mapLayers: layersMap,
            collisions: collisions
        }

        this.loadMapInformations = true
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

                    //this.ctx.fillText(width+', '+height+', '+tileValNormalize, (width*this.scaleMap)+20, (height*this.scaleMap)+17);// show values
                }
                mapIndex++;

                height += mi.tileHeight/2
                width += mi.tileWidth/2


            }

            height = ((mi.tileHeight * widthMatriz)/2)+ mi.tileHeight
            width = maxWidth - ((mi.tileWidth/2) * widthMatriz)


            
        }
        mapIndex = 0;

        for (let polygonsIndex = 0; polygonsIndex < mi.collisions.length; polygonsIndex++) {
            var xpolygon = mi.collisions[polygonsIndex].initialPoint.x
            var ypolygon = mi.collisions[polygonsIndex].initialPoint.y
            this.ctx!.fillStyle = '#FFF'

            //this.ctx.fillText(`${mi.collisions[polygonsIndex].initialPoint.x}`, xpolygon, ypolygon);// show values

            var polygonPoints = mi.collisions[polygonsIndex].polygon

            var currentPointX = xpolygon
            var currentPointY = ypolygon
            for (let ipolypoints = 0; ipolypoints < polygonPoints.length; ipolypoints++) {
                var pointMoreX = polygonPoints[ipolypoints].x
                var pointMoreY = polygonPoints[ipolypoints].y
                //calc X
                var ppx = xpolygon + pointMoreX
                var ppy = ypolygon + (pointMoreX/2)
                //calc Y
                ppx = ppx - pointMoreY
                ppy = ppy + (pointMoreY/2)

                this.ctx.beginPath();
                this.ctx.moveTo(currentPointX, currentPointY);
                this.ctx.lineTo(ppx, ppy);
                this.ctx.strokeStyle = "#fff";
                this.ctx.lineWidth   = 2;            
                this.ctx.stroke();
                this.ctx.fillStyle = "steelblue";
                //this.ctx.fillText(`${countteste}`, ppx, ppy);// show values - second point should be Here! in X + Y

                currentPointX = ppx
                currentPointY = ppy
    
                //this.ctx.fillText(`${mi.collisions[polygonsIndex].initialPoint.x}`, currentPointX, currentPointY);// show values
                //this.ctx.fillText(`${currentPointX+pointMoreX}, ${currentPointY+pointMoreY}`, currentPointX+pointMoreX, currentPointY+pointMoreY);// show values
                
            }

            this.ctx.beginPath();
            this.ctx.moveTo(currentPointX, currentPointY);
            this.ctx.lineTo(xpolygon, ypolygon);
            this.ctx.strokeStyle = "#fff";
            this.ctx.lineWidth   = 2;            
            this.ctx.stroke();
            
            this.ctx.strokeStyle = "#000";

            /**
             * 
             * 2324, 252
                2203, 355
                2470, 500
                2600, 405

             */

                /*
                this.ctx.fillText(`o`, 2324, 252);// show values
                this.ctx.fillText(`o`, 2203, 355);// show values
                this.ctx.fillText(`o`, 2470, 500);// show values
                this.ctx.fillText(`o`, 2600, 405);// show values
                */
           // this.ctx.beginPath();
            //this.ctx.moveTo(xpolygon, ypolygon);
            //this.ctx.lineTo(xpolygon+300, ypolygon+150);
            //this.ctx.strokeStyle = "#FFF";
            //this.ctx.stroke();
           
        }
        
       }


       //this.ctx.drawImage(this.mapImage!, 0, 0, this.size.w, this.size.h, this.position.x, this.position.y, this.size.w * this.scaleMap, this.size.h * this.scaleMap)
    }
    update(): void {
        if (this.loadMapInformations) {
            this.draw()
        }
    }
}