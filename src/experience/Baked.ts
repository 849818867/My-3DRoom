import * as THREE from 'three'

import Experience from './Experience'
import baseVertex from './shaders/baked/vertex.glsl?raw'
import baseFragmennt from './shaders/baked/fragment.glsl?raw'

export default class CoffeeSteam
{
  experience
  resources
  scene
  debug

  debugFolder: any
  model: any
  colors: any
  constructor()
  {
    this.experience = new Experience()
    this.resources = this.experience.resource
    this.scene = this.experience.scene
    this.debug = this.experience.debug

    this.setModel()

    this.setDebug()
  }

  setModel()
  {
    this.model = {}

    this.model.mesh = this.resources?.items.roomModel.scene.children[0]

    this.model.bakedDayTexture = this.resources?.items.bakedDayTexture
    this.model.bakedDayTexture.encoding = THREE.sRGBEncoding
    this.model.bakedDayTexture.flipY = false

    this.model.bakedNightTexture = this.resources?.items.bakedNightTexture
    this.model.bakedNightTexture.encoding = THREE.sRGBEncoding
    this.model.bakedNightTexture.flipY = false

    this.model.bakedNeutralTexture = this.resources?.items.bakedNeutralTexture
    this.model.bakedNeutralTexture.encoding = THREE.sRGBEncoding
    this.model.bakedNeutralTexture.flipY = false

    this.model.lightMapTexture = this.resources?.items.lightMapTexture
    this.model.lightMapTexture.flipY = false

    this.colors = {}
    this.colors.tv = '#ff115e'
    this.colors.desk = '#ff6700'
    this.colors.pc = '#0082ff'

    this.model.material = new THREE.ShaderMaterial({
      uniforms: {
        // 不同环境的烘焙贴图
        uBakedDayTexture: { value: this.model.bakedDayTexture },
        uBakedNightTexture: { value: this.model.bakedNightTexture },
        uBakedNeutralTexture: { value: this.model.bakedNeutralTexture },
        uLightMapTexture: { value: this.model.lightMapTexture },

        // 颜色插值权值
        uNightMix: { value: 1 },
        uNeutralMix: { value: 0 },

        // 局部光照颜色、强度
        uLightTvColor: { value: new THREE.Color(this.colors.tv) },
        uLightTvStrength: { value: 1.47 },

        uLightDeskColor: { value: new THREE.Color(this.colors.desk) },
        uLightDeskStrength: { value: 1.9 },

        uLightPcColor: { value: new THREE.Color(this.colors.pc) },
        uLightPcStrength: { value: 1.4 }
      },
      vertexShader: baseVertex,
      fragmentShader: baseFragmennt
    })

    this.model.mesh.traverse((_child: any) =>
    {
      if (_child instanceof THREE.Mesh)
      {
        _child.material = this.model.material
      }
    })

    this.scene?.add(this.model.mesh)
  }

  setDebug()
  {
    if (!this.debug) return
    this.debugFolder = this.debug.addFolder({
      title: 'baked',
      expended: true
    })

    this.debugFolder.addInput(
      this.model.material.uniforms.uNightMix,
      'value',
      { label: 'uNightMix', min: 0, max: 1 })

    this.debugFolder.addInput(
      this.model.material.uniforms.uNeutralMix,
      'value',
      { label: 'uNeutralMix', min: 0, max: 1 })

    this.debugFolder.addInput(
      this.colors,
      'tv',
      { view: 'color' })
      .on('change', () =>
      {
        this.model.material.uniforms.uLightTvColor.value.set(new THREE.Color(this.colors.tv))
      })

    this.debugFolder
      .addInput(
        this.model.material.uniforms.uLightTvStrength,
        'value',
        { label: 'uLightTvStrength', min: 0, max: 3 }
      )

    this.debugFolder.addInput(
      this.colors,
      'desk',
      { view: 'color' })
      .on('change', () =>
      {
        this.model.material.uniforms.uLightDeskColor.value.set(new THREE.Color(this.colors.desk))
      })

    this.debugFolder
      .addInput(
        this.model.material.uniforms.uLightDeskStrength,
        'value',
        { label: 'uLightDeskStrength', min: 0, max: 3 }
      )

    this.debugFolder
      .addInput(
        this.colors,
        'pc',
        { view: 'color' }
      )
      .on('change', () =>
      {
        this.model.material.uniforms.uLightPcColor.value.set(this.colors.pc)
      })

    this.debugFolder
      .addInput(
        this.model.material.uniforms.uLightPcStrength,
        'value',
        { label: 'uLightPcStrength', min: 0, max: 3 }
      )
  }
}