class DrawMapFunctions {
    calcIsometricPositions(x: number, y: number, xref: number, yref: number): {x: number, y: number}{
      //calc X
      var ppx = xref + x
      var ppy = yref + (x * 0.5)
      //calc Y
      ppx = ppx - y
      ppy = ppy + (y * 0.5)
      return {x: ppx, y: ppy}
    }
}

export default DrawMapFunctions