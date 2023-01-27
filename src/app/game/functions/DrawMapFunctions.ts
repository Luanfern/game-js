import { TilesetMap } from "../interfaces/tilesetmap.interface"
class DrawMapFunctions {
  calcIsometricPositions(x: number, y: number, xref: number, yref: number): { x: number, y: number } {
    //calc X
    var ppx = xref + x
    var ppy = yref + (x * 0.5)
    //calc Y
    ppx = ppx - y
    ppy = ppy + (y * 0.5)
    return { x: ppx, y: ppy }
  }

  drawLayerMap(
    mapWidth: number,
    tileWidth: number,
    tileHeight: number,
    tilesQtdMapHeight: number,
    tilesQtdMapWidth: number,
    mapTilesets: TilesetMap[],
    scale: number,
    mapLayersData: number[],
    ctx: CanvasRenderingContext2D,
  ) {
    let mapIndex = 0
    let X = 0
    let Y = 0

    var width = (mapWidth / 2) - (tileWidth / 3) // começar do meio (width total / 2)  |   subtrair tileWidth a cada loop
    var maxWidth = width
    var height = tileHeight // somar tileHeight a cada loop
    //MATRIZ : passando por cada quadrado! (conferir valores no tiled map editor)
    for (let widthMatriz = 0; widthMatriz < tilesQtdMapWidth; widthMatriz++) {

      for (let heightMatriz = 0; heightMatriz < tilesQtdMapHeight; heightMatriz++) {

        let tileVal = mapLayersData[mapIndex]!;
        if (tileVal != 0) {
          let tileset = 0
          mapTilesets.map((e, i) => {
            if (tileVal <= e.maxGId && tileVal >= e.minGId) {
              tileset = i
            }
          })

          var tileValNormalize = (tileVal - mapTilesets[tileset].minGId) + 1
          var xp = 0
          var yp = 0
          var someTile = 0

          for (let ir = 0; ir < mapTilesets[tileset].rows; ir++) {
            for (let ic = 0; ic < mapTilesets[tileset].cols; ic++) {
              someTile++
              if (someTile == tileValNormalize) {
                yp = ir
                xp = ic
              }
            }

          }

          Y = yp * tileWidth;
          X = xp * tileWidth;

          ctx.drawImage(
            mapTilesets[tileset].tileImage!,
            X,
            Y,
            tileWidth,
            tileWidth,
            width * scale,
            height * scale,
            tileWidth * scale,
            tileWidth * scale,
          );
        }
        mapIndex++;

        height += tileHeight / 2
        width += tileWidth / 2
      }

      height = ((tileHeight * widthMatriz) / 2) + tileHeight
      width = maxWidth - ((tileWidth / 2) * widthMatriz)

    }
  }
}

export default DrawMapFunctions