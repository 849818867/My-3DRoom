import * as THREE from "three";
import { Pane } from 'tweakpane'

import Time from "./utils/Time";
import Stats from "./utils/Stats";

import Camera from "./Camera";
import Renderer from "./Renderer";
import Resource from "./Resource";
import assets from "./assets";
import World from "./World";

interface Options
{
  targetElement?: HTMLElement | undefined
}

export default class Experience
{
  // 静态实例
  static instance: null | Experience

  targetElement
  config: any
  time
  stats
  debug: any
  scene
  camera
  renderer
  resource
  world

  constructor(_options: Options = {})
  {
    // 单例模式，保证只有一个实例
    if (Experience.instance)
    {
      return Experience.instance
    }
    Experience.instance = this

    // 获取容器dom
    this.targetElement = _options.targetElement
    if (!this.targetElement)
    {
      console.warn('缺少canvas挂载容器!', _options)
      return
    }

    this.setConfig()

    // 创建time对象
    this.time = new Time();

    //  创建stats、Pane
    if (this.config.debug)
    {
      this.stats = new Stats(true);
      this.debug = new Pane();
      this.debug.containerElem_.style.width = "320px";
    }

    // 创建scene
    this.scene = new THREE.Scene()

    // 创建相机
    this.camera = new Camera();

    // 设置renderer
    this.renderer = new Renderer()

    // 将renderer渲染的dom挂载到targetElement
    if (this.renderer.instance?.domElement)
      this.targetElement.appendChild(this.renderer.instance?.domElement)

    // 加载模型、贴图等数据
    this.resource = new Resource(assets)

    // 构造中的物体
    this.world = new World()

    // 监听窗口大小变化
    window.addEventListener('resize', this.resize.bind(this))

    this.update();
  }

  setSize()
  {
    const boundings = this.targetElement?.getBoundingClientRect()
    this.config.width = boundings?.width
    this.config.height = boundings?.height
    this.config.smallestSide = Math.min(this.config.width, this.config.height);
    this.config.largestSide = Math.max(this.config.width, this.config.height);
  }

  setConfig()
  {
    this.config = {}

    // Pixel ratio
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

    // Width Height
    this.setSize()

    // debug
    this.config.debug = this.config.width > 420;
  }

  resize()
  {
    // Pixel ratio
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

    // Width Height
    this.setSize()

    if (this.camera) this.camera.resize();

    if (this.renderer) this.renderer.resize();

    // if (this.world) this.world.resize();

  }
  update()
  {
    if (this.stats) this.stats.update();
    this.camera?.update()
    this.renderer?.update()
    this.world?.update()
    window.requestAnimationFrame(() =>
    {
      this.update()
    })
  }

}
