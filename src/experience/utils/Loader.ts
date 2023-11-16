import EventEmitter from './EventEmitter.ts'
import Experience from '../Experience.ts'
// threejs提供的loader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { BasisTextureLoader } from 'three/examples/jsm/loaders/BasisTextureLoader.js'

export default class Resource extends EventEmitter
{
  experience
  rendenerer

  // loaders
  loaders: Array<any> | undefined
  items: Array<any> = []
  toLoad: number = 0
  loaded: number = 0

  constructor()
  {
    super()

    this.experience = new Experience()
    this.rendenerer = this.experience.renderer?.instance
    this.setLoader()
  }

  // 设置loader数组
  setLoader() 
  {
    this.loaders = []

    // 图片loader
    this.loaders.push({
      extensions: ['jpg', 'png'],
      action: (_resource: any) =>
      {
        const image = new Image()

        image.addEventListener('load', () =>
        {
          this.fileLoadEnd(_resource, image)
        })

        image.addEventListener('error', () =>
        {
          this.fileLoadEnd(_resource, image)
        })
        image.src = _resource.source
      }
    })

    // basis images
    const basisLoader = new BasisTextureLoader()
    basisLoader.setTranscoderPath('basis')
    basisLoader.detectSupport(this.rendenerer as any)

    this.loaders.push({
      extensions: ['basis'],
      action: (_resource: any) =>
      {
        basisLoader.load(_resource.source, (_data: any) =>
        {
          this.fileLoadEnd(_resource, _data)
        })
      }
    })

    // draco
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('draco/')
    dracoLoader.setDecoderConfig({ type: 'js' })

    // gltf loader
    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)

    this.loaders.push({
      extensions: ['glb', 'gltf'],
      action: (_resource: any) =>
      {
        gltfLoader.load(_resource.source, (_data) =>
        {
          this.fileLoadEnd(_resource, _data)
        })
      }
    })

    // RGBE | HDR
    const rgbeLoader = new RGBELoader()

    this.loaders.push({
      extensions: ['hdr'],
      action: (_resource: any) =>
      {
        rgbeLoader.load(_resource.source, (_data) =>
        {
          this.fileLoadEnd(_resource, _data)
        })
      }
    })
  }

  load(_resources: Array<any> = [])
  {
    for (const _resource of _resources)
    {
      this.toLoad++
      // 配置后缀
      const extensionMatch = _resource.source.match(/\.([a-z]+)$/)
      if (typeof extensionMatch[1] !== 'undefined')
      {
        const extension = extensionMatch[1]

        // 查找后缀匹配的loader
        const loader = this.loaders?.find((_loader: any) => _loader.extensions.find((_extension: string) => _extension === extension))

        if (loader) loader.action(_resource)
        else console.warn(`Cannot found loader for ${_resource}`)

      } else
      {
        console.warn(`Cannot found loader for ${_resource}`)
      }
    }
  }

  fileLoadEnd(_resource: any, _data: any)
  {
    this.loaded++
    this.items[_resource.name] = _data

    this.trigger('fileEnd', [_resource, _data])

    if (this.loaded == this.toLoad)
    {
      this.trigger('end', null)
    }
  }
}