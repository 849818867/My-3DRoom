export default class EventEmitter
{

  callbacks: any

  constructor()
  {
    this.callbacks = {
      base: {}
    }
  }

  /**
   * 收集事件
   * @param _names 事件名称(name.namespace)
   * @param callback 回调
   * @returns 
   */
  on(_names: string, callback: Function)
  {
    const that = this

    // 参数错误判断
    if (typeof _names === 'undefined' || _names === '')
    {
      console.warn('wrong names')
      return false
    }

    if (typeof callback === 'undefined')
    {
      console.warn('wrong callback')
      return false
    }

    // 解析names
    const names = this.resolveNames(_names)

    // 给每一个names创建namespace
    names.forEach((_name) =>
    {
      // 解析name
      const name = that.resolveName(_name)

      // 创建namespace callback
      if (!(that.callbacks[name.namespace] instanceof Object)) that.callbacks[name.namespace] = {}

      if (!(that.callbacks[name.namespace][name.value] instanceof Array)) that.callbacks[name.namespace][name.value] = []

      // 添加callback
      that.callbacks[name.namespace][name.value].push(callback)
    })

    // console.log('on', that.callbacks)
    return this
  }

  /**
   * 删除挂载的事件
   * @param _names 删除事件的名称
   */
  off(_names: string)
  {
    const that = this

    // Errors
    if (typeof _names === 'undefined' || _names === '')
    {
      console.warn('wrong name')
      return false
    }

    // Resolve names
    const names = this.resolveNames(_names)

    // Each name
    names.forEach(function (_name)
    {
      // Resolve name
      const name = that.resolveName(_name)

      // Remove namespace
      if (name.namespace !== 'base' && name.value === '')
      {
        delete that.callbacks[name.namespace]
      }

      // Remove specific callback in namespace
      else
      {
        // Default
        if (name.namespace === 'base')
        {
          // Try to remove from each namespace
          for (const namespace in that.callbacks)
          {
            if (that.callbacks[namespace] instanceof Object && that.callbacks[namespace][name.value] instanceof Array)
            {
              delete that.callbacks[namespace][name.value]

              // Remove namespace if empty
              if (Object.keys(that.callbacks[namespace]).length === 0)
                delete that.callbacks[namespace]
            }
          }
        }

        // Specified namespace
        else if (that.callbacks[name.namespace] instanceof Object && that.callbacks[name.namespace][name.value] instanceof Array)
        {
          delete that.callbacks[name.namespace][name.value]

          // Remove namespace if empty
          if (Object.keys(that.callbacks[name.namespace]).length === 0)
            delete that.callbacks[name.namespace]
        }
      }
    })
    console.log('off', that.callbacks)
    return this
  }

  /**
 * Trigger
 */
  trigger(_name: string, _args: any)
  {
    // Errors
    if (typeof _name === 'undefined' || _name === '')
    {
      console.warn('wrong name')
      return false
    }

    const that = this
    let finalResult: any = null
    let result = null

    // Default args
    const args = !(_args instanceof Array) ? [] : _args

    // Resolve names (should on have one event)
    let names = this.resolveNames(_name)

    // Resolve name
    let name = this.resolveName(names[0])

    // Default namespace
    if (name.namespace === 'base')
    {
      // Try to find callback in each namespace
      for (const namespace in that.callbacks)
      {
        if (that.callbacks[namespace] instanceof Object && that.callbacks[namespace][name.value] instanceof Array)
        {
          that.callbacks[namespace][name.value].forEach((callback: any) =>
          {
            result = callback.apply(that, args)

            if (typeof finalResult === 'undefined')
            {
              finalResult = result
            }
          })
        }
      }
    }

    // Specified namespace
    else if (this.callbacks[name.namespace] instanceof Object)
    {
      if (name.value === '')
      {
        console.warn('wrong name')
        return this
      }

      that.callbacks[name.namespace][name.value].forEach((callback: any) =>
      {
        result = callback.apply(that, args)

        if (typeof finalResult === 'undefined')
          finalResult = result
      })
    }

    return finalResult
  }
  /**
   * 解析names => 'name1 name2' => [name1, name2]
   * @param _names 事件名称字符串
   * @returns 
   */
  resolveNames(_names: string)
  {
    let names = _names
    names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '')
    names = names.replace(/[,/]+/g, ' ')
    return names.split(' ')
  }

  /**
   *  解析name  'name1.material' => {original: 'name1.material', value: name1, namespace: material}
   * @param name 待解析名称字符串
   * @returns 
   */
  resolveName(name: any)
  {
    const newName: any = {}
    const parts = name.split('.')

    newName.original = name
    newName.value = parts[0]
    newName.namespace = 'base'

    // Specified namespace
    if (parts.length > 1 && parts[1] !== '')
    {
      newName.namespace = parts[1]
    }

    return newName
  }
}

