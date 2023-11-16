import * as THREE from 'three'
import { gsap } from 'gsap'

import Experience from './Experience'

export default class LoupedeckButtons
{

  experience
  resources
  debug
  scene
  time

  model: any
  animation: any
  debugFolder: any
  constructor()
  {
    this.experience = new Experience()
    this.resources = this.experience.resource
    this.debug = this.experience.debug
    this.scene = this.experience.scene
    this.time = this.experience.time

    this.setModel()
    this.setAnimation()
    this.setDebug()
  }

  // 加载模型
  setModel()
  {
    this.model = {}
    this.model.items = []

    const buttons = [...this.resources?.items.loupedeckButtonsModel.scene.children]

    buttons.sort((_a: any, _b: any) =>
    {
      return _a.name < _b.name ? -1 : _a.name > _b.name ? 1 : 0
    })

    let index = 0
    for (const button of buttons)
    {
      const item: any = {}

      item.index = index

      item.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true
      })

      item.mesh = button
      item.mesh.material = item.material
      this.scene?.add(item.mesh)
      this.model.items.push(item)
      index++
    }
  }

  setDebug()
  {
    if (this.debug)
    {
      this.debugFolder = this.debug.addFolder({
        title: 'loupedeckButtons',
        expanded: false
      })
      for (const _colorIndex in this.animation.colors)
      {
        this.debugFolder.addInput(
          this.animation.colors,
          _colorIndex,
          { view: 'color' }
        ).on('change', () =>
        {
          // 改变颜色
        })
      }
    }
  }
  // 设置动画
  setAnimation()
  {
    this.animation = {}

    this.animation.colors = ['#af55cf', '#dbd85d', '#e86b24', '#b81b54']

    this.animation.play = () =>
    {
      const buttons = []
      const outButtons = []

      // 随机将按键分配到两个数组内
      for (const _button of this.model.items)
      {
        const randomNum = Math.random()

        randomNum < 0.5 ? buttons.push(_button) : outButtons.push(_button)
      }

      // outButtons 设置透明度0
      for (const _button of outButtons)
      {
        _button.material.opacity = 0
      }

      // buttons设置颜色动画
      let colorIndex = 0
      for (const _button of buttons) 
      {
        // 随机更换当前按键颜色
        _button.material.color.set(this.animation.colors[Math.floor(Math.random() * this.animation.colors.length)])

        // gsap实现平滑变化效果
        gsap.to(
          _button.material,
          {
            delay: colorIndex * 0.05,
            duration: 0.2,
            opacity: 1,
            onComplete: () =>
            {
              gsap.to(
                _button.material,
                {
                  delay: 3,
                  duration: 0.5,
                  opacity: 0
                }
              )
            }
          }
        )
        colorIndex++
      }
    }

    this.animation.play()
    window.setInterval(this.animation.play, 5000)
  }
}