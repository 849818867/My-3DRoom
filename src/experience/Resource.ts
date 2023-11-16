import * as THREE from 'three'
import EventEmitter from './utils/EventEmitter'
import Loader from './utils/Loader'

export default class Resource extends EventEmitter
{

  items: any = {}
  groups: any = {}
  loader
  constructor(_assets: any)
  {
    super()

    this.loader = new Loader()

    this.groups.assets = [..._assets]
    this.groups.loaded = []
    this.groups.current = null
    this.loadNextGroup()

    // 单个模型加载完成时
    this.loader.on('fileEnd', (_resource: any, _data: any) =>
    {
      let data = _data

      // 贴图类型
      if (_resource.type === 'texture')
      {
        if (!(data instanceof THREE.Texture))
          data = new THREE.Texture(_data)

        data.needsUpdate = true
      }

      this.items[_resource.name] = data

      this.groups.current.loaded++

      this.trigger('progress', [this.groups.current, _resource, data])
    })

    // 一组模型加载完成时
    this.loader.on('end', () =>
    {
      // console.log('end')
      this.groups.loaded.push(this.groups.current)

      // 发送事件  当前group加载完成
      this.trigger('groupEnd', [this.groups.current])

      if (this.groups.assets.length > 0)
      {
        this.loadNextGroup()
      }
      else
      {
        this.trigger('end', null)
      }
    })
  }

  loadNextGroup()
  {
    this.groups.current = this.groups.assets.shift()
    this.groups.current.toLoad = this.groups.current.items.length
    this.groups.current.loaded = 0

    this.loader.load(this.groups.current.items)
  }
}