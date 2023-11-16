import * as THREE from 'three'

import Experience from './Experience'

export default class Screen
{
  // experience instance
  expenrience
  resources
  scene
  world

  mesh
  sourcePath
  model: any

  constructor(_mesh: THREE.Mesh, _sourcePath: string)
  {
    this.expenrience = new Experience()
    this.resources = this.expenrience.resource
    this.scene = this.expenrience.scene
    this.world = this.expenrience.world

    this.mesh = _mesh
    this.sourcePath = _sourcePath

    this.setScreen()
  }

  setScreen()
  {
    this.model = {}

    // 创建video元素
    this.model.element = document.createElement('video')
    this.model.element.muted = true
    this.model.element.loop = true
    this.model.element.controls = true
    this.model.element.playsInline = true
    this.model.element.autoplay = true
    this.model.element.src = this.sourcePath
    this.model.element.play()

    // 创建vedio textrue
    this.model.textrue = new THREE.VideoTexture(this.model.element)
    this.model.textrue.encoding = THREE.sRGBEncoding

    // 创建Material
    this.model.material = new THREE.MeshBasicMaterial({
      map: this.model.textrue
    })

    // Mesh
    this.model.mesh = this.mesh
    this.model.mesh.material = this.model.material
    this.scene?.add(this.model.mesh)
  }

}