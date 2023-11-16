import * as THREE from 'three'
import Experience from './Experience.ts'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
  experience
  config
  scene
  targetElement

  mode: 'default' | 'debug'
  instance: THREE.PerspectiveCamera | undefined
  orbitControls: OrbitControls | undefined

  constructor()
  {
    // expenrience options
    this.experience = new Experience()
    this.config = this.experience.config
    this.scene = this.experience.scene
    this.targetElement = this.experience.targetElement

    // set up
    this.mode = 'default'
    this.setInstance()
    this.setOrbitControl()
  }

  setInstance()
  {
    // 创建camera实例
    this.instance = new THREE.PerspectiveCamera(20, this.config.width / this.config.height, 0.1, 150)
    this.instance.rotation.reorder('YXZ')
    this.scene?.add(this.instance)

    this.instance.position.set(- 15, 15, 15);
    // this.instance.lookAt(0, 0, 0)
  }

  setOrbitControl()
  {
    this.orbitControls = new OrbitControls(this.instance as any, this.targetElement)
    this.orbitControls.enabled = true
    this.orbitControls.screenSpacePanning = true
    this.orbitControls.enableKeys = false
    this.orbitControls.zoomSpeed = 0.25
    this.orbitControls.enableDamping = true
    this.orbitControls.update()
  }

  resize()
  {
    if (this.instance)
    {
      // 设置宽高比
      this.instance.aspect = this.config.width / this.config.height
      // 更新视图矩阵
      this.instance.updateProjectionMatrix()
    }
  }

  update()
  {
    this.orbitControls?.update()
    // this.instance?.position.copy(this.modes[this.mode].instance.position)
    // this.instance?.quaternion.copy(this.modes[this.mode].instance.quaternion)
    this.instance?.updateMatrixWorld()
  }
}