import Experience from './Experience'
import Baked from './Baked'
import Screen from './Screen'
import TopChair from './TopChair'
import CoffeeSteam from './CoffeeSteam'
import LoupedeckButtons from './LoupedeckButtons'
import ElgatoLight from './ElgatoLight'

export default class World
{
  experience
  config
  scene
  resources

  baked: Baked | undefined
  pcScreen: Screen | undefined
  macScreen: Screen | undefined
  topChair: TopChair | undefined
  coffeeSteam: CoffeeSteam | undefined
  loupedeckButtons: LoupedeckButtons | undefined
  elgatoLight: ElgatoLight | undefined

  constructor()
  {
    this.experience = new Experience()
    this.config = this.experience.config
    this.scene = this.experience.scene
    this.resources = this.experience.resource

    this.resources?.on('groupEnd', (_group: any) =>
    {
      if (_group.name === 'base')
      {
        this.setBaked()
        this.setScreen()
        this.setTopChair()
        this.setElgatoLight()
        this.setCoffeeSteam()
        this.setLoupedeckButtons()
      }
    })
  }

  setBaked()
  {
    this.baked = new Baked()
  }

  setScreen()
  {
    this.pcScreen = new Screen(
      this.resources?.items.pcScreenModel.scene.children[0],
      '/assets/videoPortfolio.mp4')
    this.macScreen = new Screen(
      this.resources?.items.macScreenModel.scene.children[0],
      '/assets/videoStream.mp4'
    )
  }

  setTopChair()
  {
    this.topChair = new TopChair()
  }

  setCoffeeSteam()
  {
    this.coffeeSteam = new CoffeeSteam()
  }

  setLoupedeckButtons()
  {
    this.loupedeckButtons = new LoupedeckButtons()
  }

  setElgatoLight()
  {
    this.elgatoLight = new ElgatoLight()
  }

  update()
  {
    if (this.topChair)
      this.topChair.update()
    if (this.coffeeSteam)
      this.coffeeSteam.update()
  }
}