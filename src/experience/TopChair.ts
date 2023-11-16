import * as THREE from 'three'

import Experience from './Experience'

export default class TopChair
{
  experience
  resources
  scene
  world
  time
  model: any

  constructor()
  {
    this.experience = new Experience()
    this.resources = this.experience.resource
    this.scene = this.experience.scene
    this.world = this.experience.world
    this.time = this.experience.time

    this.setModel()
  }

  setModel()
  {
    this.model = {}

    this.model.group = this.resources?.items.topChairModel.scene.children[0]
    this.scene?.add(this.model.group)

    this.model.group.traverse((_child: any) =>
    {
      if (_child instanceof THREE.Mesh)
      {
        _child.material = this.world?.baked?.model.material
      }
    })
  }

  update()
  {
    this.model.group.rotation.y = this.time?.elapsed * 0.0005 * 0.5
  }
}