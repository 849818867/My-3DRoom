import * as THREE from 'three'
import Experience from './Experience'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'


export default class Renderer
{
  experience
  config
  scene
  camera
  stats
  context: any

  clearColor: string | undefined
  postProcess: any
  instance: THREE.WebGLRenderer | undefined
  renderTarget: THREE.WebGLMultisampleRenderTarget | THREE.WebGLRenderTarget | undefined

  usePostprocess

  constructor()
  {
    // expenrience options
    this.experience = new Experience()
    this.config = this.experience.config
    this.scene = this.experience.scene
    this.camera = this.experience.camera
    this.stats = this.experience.stats

    // 是否使用合成器
    this.usePostprocess = false

    this.setInstance()
  }

  /**
   * 创建redenerer
   */
  setInstance()
  {
    this.clearColor = '#010101'

    // 创建renderer
    this.instance = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true
    })
    // 设置创建的dom样式
    this.instance.domElement.style.position = 'absolute'
    this.instance.domElement.style.top = '0px'
    this.instance.domElement.style.left = '0px'
    this.instance.domElement.style.width = '100%'
    this.instance.domElement.style.height = '100%'

    // 设置屏幕参数
    this.instance.setClearColor(this.clearColor, 1)
    this.instance.setSize(this.config.width, this.config.height)
    this.instance.setPixelRatio(this.config.pixelRatio)

    // 样色空间
    this.instance.outputEncoding = THREE.sRGBEncoding

    // 创建stats
    this.context = this.instance.getContext()
    if (this.stats)
    {
      this.stats.setRenderPanel(this.context)
    }
  }

  /**
   * 设置合成器
   */
  setPostProcess()
  {
    this.postProcess = {}

    // render pass
    if (!this.scene || !this.camera?.instance || !this.instance) return

    this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

    // effect pass
    const RenderTargetClass = this.config.pixelRatio >= 2 ? THREE.WebGLRenderTarget : THREE.WebGLMultisampleRenderTarget

    // 创建RenderTarget
    this.renderTarget = new RenderTargetClass(this.config.width, this.config.height, {
      generateMipmaps: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      encoding: THREE.sRGBEncoding
    })

    // 创建合成器
    this.postProcess.composer = new EffectComposer(this.instance, this.renderTarget)
    this.postProcess.composer.setSize(this.config.width, this.config.height)
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
    this.postProcess.composer.addPass(this.postProcess.renderPass)

  }

  resize()
  {
    // Instance
    this.instance?.setSize(this.config.width, this.config.height)
    this.instance?.setPixelRatio(this.config.pixelRatio)

    // Post process
    // this.postProcess.composer.setSize(this.config.width, this.config.height)
    // this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
  }

  update()
  {
    if (this.stats)
    {
      this.stats.beforeRender()
    }
    if (!this.scene || !this.camera?.instance) return
    if (this.usePostprocess) this.postProcess.composer.render()
    else this.instance?.render(this.scene, this.camera.instance)

    if (this.stats)
    {
      this.stats.afterRender()
    }
  }

  destory()
  {
    this.instance?.renderLists.dispose()
    this.instance?.dispose()
    this.renderTarget?.dispose()
    this.postProcess.composer.renderTarget1.dispose()
    this.postProcess.composer.renderTarget2.dispose()
  }
}