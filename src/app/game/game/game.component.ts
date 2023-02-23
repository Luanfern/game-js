import { Component, OnInit } from '@angular/core';
import { ComponentGame } from '../abstractions/componentGame';
import { Cam } from '../componentsGame/cam';
import { Collisions } from '../componentsGame/collisions';
import { Map } from '../componentsGame/map';
import { SpritePlayer } from '../componentsGame/player-sprite';
import LoadMapInformations from '../functions/LoadMapInformations';
import { Collision } from '../interfaces/collision.interface';
import { MapInformations } from '../interfaces/mapInformations.interface';
interface ComponentGameListLoad{ 
  tag: string,
  gc: ComponentGame,
  multipleLevels: boolean,
  levelsToLoad?: number[]
}
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  canvas: HTMLCanvasElement | undefined
  ctx: CanvasRenderingContext2D | null | undefined
  keyPressControl: String[] = []

  loadMapInformations: boolean = false
  mapInformations!: MapInformations;

  scaleMap: number = 0

  defaultCollisions!: Collision[]

  mapTileLayers: number = 0

  componentsGame: ComponentGameListLoad[] = []

  cam: Cam | undefined

  constructor() { }

  async loadMap() {
    console.log('loading map datas....')
    await new LoadMapInformations().loadTiled(1 + this.scaleMap).then(
      async (mapInfosReturn) => {

        this.mapInformations = mapInfosReturn
        //PREPARE GAME 

        //setando background cenário
        var background = new Image()
        background.src = "../../../assets/map.png"
        const backgroundCenario = new Map({ w: 5000, h: 5000 }, { x: 0, y: 0 }, background, 1 + this.scaleMap, this.ctx!, this.mapInformations, 0)
        this.componentsGame.push({ tag: 'map', gc: backgroundCenario, multipleLevels: true })
        this.mapTileLayers = backgroundCenario.getLevelLayers()

        //setando collisions
        await new Collisions(1 + this.scaleMap, this.mapInformations).setCollisions().then((collision) => {
          this.defaultCollisions = collision
        })

        //setando player
        const player = new SpritePlayer({ x: 2400, y: 200 }, { w: 30, h: 30 }, this.ctx!, 1 + this.scaleMap, { x: 0, y: 0 }, 90, this.mapInformations, this.defaultCollisions, 1)
        this.componentsGame.push({ tag: 'mainPlayer', gc: player,  multipleLevels: false})

        //Setando Câmera
        this.cam = new Cam(this.ctx!, { w: this.canvas!.width, h: this.canvas!.height }, { x: 0, y: 0 }, player, backgroundCenario, 1 + this.scaleMap, true, 1)

        //Event of keydown
        window.addEventListener('keydown', (event) => {

          if (event.ctrlKey) {
            player.mobilityChange()
          }

          if (this.keyPressControl.find(k => k == event.key) == undefined) {
            this.keyPressControl.push(event.key.toLowerCase())
          }
          this.movimentationKeys(3.5, player)

        })

        //Event of keyup
        window.addEventListener('keyup', (event) => {

          this.keyPressControl.splice(this.keyPressControl.findIndex(v => v == event.key), 1)
          this.movimentationKeys(3.5, player)
        })

        //Event of mouse click
        window.addEventListener('click', (event) => {
          if (player.mobilityZone) {
            player.dash(event)
          }
        })


        console.log('loaded map datas!')
        this.loadMapInformations = true
      }
    )
  }

  async ngOnInit(): Promise<void> {
    //setUp Canvas area
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");

    //setUp canvas size
    this.canvas.height = innerHeight
    this.canvas.width = innerWidth

    //setScaleScreen
    let scaleMap = 0
    let scaleDefault = 1707
    let rightscale = (100 - ((innerWidth * 100) / scaleDefault))
    let rightscale2 = (rightscale * -1) / 100
    scaleMap = rightscale2
    this.scaleMap = scaleMap

    //setando informações do mapa e inicializando 
    await this.loadMap()

    //start animate Loop
    this.animate()


  }

  preDraw(): ComponentGameListLoad[]{

    var copyList = this.componentsGame
    var preDrawList: ComponentGameListLoad[] = []
    
    var excludeOfMultipleLevels = 0

    for (let index = 1; index <= this.mapTileLayers; index++) {
      copyList.map((v, i) => {
        if (v.gc.levelZ == 0) {
          if (v.multipleLevels) {
            preDrawList.push({
              tag: v.tag,
              gc: v.gc,
              multipleLevels: v.multipleLevels,
              levelsToLoad: [index]
            })
            //v.gc.setLayersLoad(index)
            //v.gc.update()
          } else {
            copyList.splice(i, 1)
          }
        } else {
          if (v.gc.levelZ == index) {
            preDrawList.push({
              tag: v.tag,
              gc: v.gc,
              multipleLevels: v.multipleLevels,
            })
            //v.gc.update()
            //copyList.splice(i, 1)
          }
        }
      })
    }

    return preDrawList
  }

  animate = () => {
    if (this.loadMapInformations) {
      window.requestAnimationFrame(this.animate)
      this.ctx!.save()

        this.cam!.update()
        this.preDraw().map((v, i) => {
          if(v.levelsToLoad) v.gc.setLayersLoad(v.levelsToLoad!)
          v.gc.update()
        })
      this.ctx!.restore()
    }
  }

  /*animate = () => {
    if (this.loadMapInformations) {
      window.requestAnimationFrame(this.animate)
      this.ctx!.save()
      this.componentsGame.forEach((v, i) => {
        v.gc.update()
      })
      
      this.ctx!.fillStyle = 'red'
      this.defaultCollisions?.map((cl) => {
        cl.polygon.map((cl2) => {
          this.ctx!.fillText('O', cl2.x, cl2.y)
        })
      })
      
      this.ctx!.restore()
    } 
  }*/

  movimentationKeys(v: number, myPlayer: SpritePlayer) {
    switch (this.keyPressControl.join().replace(',', '')) {
      case 'w':
        myPlayer.setMovimentation(0, -v)
        break;
      case 's':
        myPlayer.setMovimentation(0, v)
        break;
      case 'a':
        myPlayer.setMovimentation(-v, 0)
        break;
      case 'd':
        myPlayer.setMovimentation(v, 0)
        break;
      case 'wa':
        myPlayer.setMovimentation(-v, -v)
        break;
      case 'aw':
        myPlayer.setMovimentation(-v, -v)
        break;
      case 'ws':
        myPlayer.setMovimentation(0, 0)
        break;
      case 'sw':
        myPlayer.setMovimentation(0, 0)
        break;
      case 'ad':
        myPlayer.setMovimentation(0, 0)
        break;
      case 'da':
        myPlayer.setMovimentation(0, 0)
        break;
      case 'wd':
        myPlayer.setMovimentation(v, -v)
        break;
      case 'dw':
        myPlayer.setMovimentation(v, -v)
        break;
      case 'sd':
        myPlayer.setMovimentation(v, v)
        break;
      case 'ds':
        myPlayer.setMovimentation(v, v)
        break;
      case 'as':
        myPlayer.setMovimentation(-v, v)
        break;
      case 'sa':
        myPlayer.setMovimentation(-v, v)
        break;

      default:
        myPlayer.setMovimentation(0, 0)
        break;
    }
  }

}
