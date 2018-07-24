# 深入浅出 - vue变化侦测原理

其实在一年前我已经写过一篇关于 [vue响应式原理的文章](https://github.com/berwin/Blog/issues/11)，但是最近我翻开看看发现讲的内容和我现在心里想的有些不太一样，所以我打算重新写一篇更通俗易懂的文章。

我的目标是能让读者读完我写的文章能学到知识，有一部分文章标题都以深入浅出开头，目的是把一个复杂的东西排除掉干扰学习的因素后剩下的核心原理通过很简单的描述来让读者学习到知识。

关于vue的内部原理其实有很多个重要的部分，变化侦测，模板编译，virtualDOM，整体运行流程等。

今天主要把变化侦测这部分单独拿出来讲一讲。

## 如何侦测变化？

关于变化侦测首先要问一个问题，在 js 中，如何侦测一个对象的变化，其实这个问题还是比较简单的，学过js的都能知道，js中有两种方法可以侦测到变化，`Object.defineProperty` 和 ES6 的`proxy`。

到目前为止vue还是用的 `Object.defineProperty`，所以我们拿 `Object.defineProperty`来举例子说明这个原理。

这里我想说的是，不管以后vue是否会用 `proxy` 重写这部分，我讲的是原理，并不是api，所以不论以后vue会怎样改，这个原理是不会变的，哪怕vue用了其他完全不同的原理实现了变化侦测，但是本篇文章讲的原理一样可以实现变化侦测，原理这个东西是不会过时的。

之前我写文章有一个毛病就是喜欢对着源码翻译，结果过了半年一年人家源码改了，我写的文章就一毛钱都不值了，而且对着源码翻译还有一个缺点是对读者的要求有点偏高，读者如果没看过源码或者看的和我不是一个版本，那根本就不知道我在说什么。

好了不说废话了，继续讲刚才的内容。

知道 `Object.defineProperty` 可以侦测到对象的变化，那么我们瞬间可以写出这样的代码：

```js
function defineReactive (data, key, val) {
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            return val
        },
        set: function (newVal) {
            if(val === newVal){
                return
            }
            val = newVal
        }
    })
}
```

写一个函数封装一下 `Object.defineProperty`，毕竟 `Object.defineProperty` 的用法这么复杂，封装一下我只需要传递一个 data，和 key，val 就行了。

现在封装好了之后每当 `data` 的 `key` 读取数据 `get` 这个函数可以被触发，设置数据的时候 `set` 这个函数可以被触发，但是，，，，，，，，，，，，，，，，，，发现好像并没什么鸟用？

## 怎么观察？

现在我要问第二个问题，“怎么观察？”

思考一下，我们之所以要观察一个数据，目的是为了当数据的属性发生变化时，可以通知那些使用了这个 `key` 的地方。

举个🌰：

```js
<template>
  <div>{{ key }}</div>
  <p>{{ key }}</p>
</template>
```

模板中有两处使用了 `key`，所以当数据发生变化时，要把这两处都通知到。

所以上面的问题，我的回答是，先收集依赖，把这些使用到 `key` 的地方先收集起来，然后等属性发生变化时，把收集好的依赖循环触发一遍就好了~

总结起来其实就一句话，**getter中，收集依赖，setter中，触发依赖**。

## 依赖收集在哪？

现在我们已经有了很明确的目标，就是要在getter中收集依赖，那么我们的依赖收集到哪里去呢？？

思考一下，首先想到的是每个 `key` 都有一个数组，用来存储当前 `key` 的依赖，假设依赖是一个函数存在 `window.target` 上，先把 `defineReactive` 稍微改造一下：

```js
function defineReactive (data, key, val) {
    let dep = [] // 新增
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.push(window.target) // 新增
            return val
        },
        set: function (newVal) {
            if(val === newVal){
                return
            }
            
            // 新增
            for (let i = 0; i < dep.length; i++) {
            	 dep[i](newVal, val)
            }
            val = newVal
        }
    })
}
```

在 `defineReactive` 中新增了数组 dep，用来存储被收集的依赖。

然后在触发 set 触发时，循环dep把收集到的依赖触发。

但是这样写有点耦合，我们把依赖收集这部分代码封装起来，写成下面的样子：

```js
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      this.addSub(Dep.target)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```

然后在改造一下 `defineReactive`：

```js
function defineReactive (data, key, val) {
    let dep = new Dep()        // 修改
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.depend() // 修改
            return val
        },
        set: function (newVal) {
            if(val === newVal){
                return
            }

            dep.notify() // 新增
            val = newVal
        }
    })
}
```

这一次代码看起来清晰多了，顺便回答一下上面问的问题，依赖收集到哪？收集到Dep中，Dep是专门用来存储依赖的。

## 收集谁？

上面我们假装 `window.target` 是需要被收集的依赖，细心的同学可能已经看到，上面的代码 `window.target` 已经改成了 `Dep.target`，那 `Dep.target`是什么？我们究竟要收集谁呢？？

[![黑人问号脸](https://camo.githubusercontent.com/57c23c5f13a486fee5e4475d321a1c1d25c2ed3c/687474703a2f2f70302e7168696d672e636f6d2f743031626639326264363364333262373362632e6a7067)](https://camo.githubusercontent.com/57c23c5f13a486fee5e4475d321a1c1d25c2ed3c/687474703a2f2f70302e7168696d672e636f6d2f743031626639326264363364333262373362632e6a7067)

收集谁，换句话说是当属性发生变化后，通知谁。

我们要通知那个使用到数据的地方，而使用这个数据的地方有很多，而且类型还不一样，有可能是模板，有可能是用户写的一个 watch，所以这个时候我们需要抽象出一个能集中处理这些不同情况的类，然后我们在依赖收集的阶段只收集这个封装好的类的实例进来，通知也只通知它一个，然后它在负责通知其他地方，所以我们要抽象的这个东西需要先起一个好听的名字，嗯，就叫它watcher吧~

所以现在可以回答上面的问题，收集谁？？收集 Watcher。

## 什么是Watcher？

watcher 是一个中介的角色，数据发生变化通知给 watcher，然后watcher在通知给其他地方。

关于watcher我们先看一个经典的使用方式：

```js
// keypath
vm.$watch('a.b.c', function (newVal, oldVal) {
  // do something
})
```

这段代码表示当 `data.a.b.c` 这个属性发生变化时，触发第二个参数这个函数。

思考一下怎么实现这个功能呢？

好像只要把这个 watcher 实例添加到 `data.a.b.c` 这个属性的 Dep 中去就行了，然后 `data.a.b.c` 触发时，会通知到watcher，然后watcher在执行参数中的这个回调函数。

好，思考完毕，开工，写出如下代码：

```js
class Watch {
    constructor (expOrFn, cb) {
        // 执行 this.getter() 就可以拿到 data.a.b.c
        this.getter = parsePath(expOrFn)
        this.cb = cb
        this.value = this.get()
    }

    get () {
        Dep.target = this
        value = this.getter.call(vm, vm)
        Dep.target = undefined
    }

    update () {
        const oldValue = this.value
        this.value = this.get()
        this.cb.call(this.vm, this.value, oldValue)
    }
}
```

这段代码可以把自己主动 `push` 到 `data.a.b.c` 的 Dep 中去。

因为我在 `get` 这个方法中，先把 Dep.traget 设置成了 `this`，也就是当前watcher实例，然后在读一下 `data.a.b.c` 的值。

因为读了 `data.a.b.c` 的值，所以肯定会触发 `getter`。

触发了 `getter` 上面我们封装的 `defineReactive` 函数中有一段逻辑就会从 `Dep.target` 里读一个依赖 `push` 到 `Dep` 中。

所以就导致，我只要先在 Dep.target 赋一个 `this`，然后我在读一下值，去触发一下 `getter`，就可以把 `this` 主动 `push` 到 `keypath` 的依赖中，有没有很神奇~

依赖注入到 `Dep` 中去之后，当这个 `data.a.b.c` 的值发生变化，就把所有的依赖循环触发 update 方法，也就是上面代码中 update 那个方法。

`update` 方法会触发参数中的回调函数，将value 和 oldValue 传到参数中。

所以其实不管是用户执行的 `vm.$watch('a.b.c', (value, oldValue) => {})` 还是模板中用到的data，都是通过 watcher 来通知自己是否需要发生变化的。

## 递归侦测所有key

现在其实已经可以实现变化侦测的功能了，但是我们之前写的代码只能侦测数据中的一个 key，所以我们要加工一下 `defineReactive` 这个函数：

```js
// 新增
function walk (obj: Object) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]])
  }
}

function defineReactive (data, key, val) {
    walk(val) // 新增
    let dep = new Dep()
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.depend()
            return val
        },
        set: function (newVal) {
            if(val === newVal){
                return
            }

            dep.notify()
            val = newVal
        }
    })
}
```

这样我们就可以通过执行 `walk(data)`，把 `data` 中的所有 `key` 都加工成可以被侦测的，因为是一个递归的过程，所以 `key` 中的 `value` 如果是一个对象，那这个对象的所有key也会被侦测。

## Array怎么进行变化侦测？

现在又发现了新的问题，`data` 中不是所有的 `value` 都是对象和基本类型，如果是一个数组怎么办？？数组是没有办法通过 `Object.defineProperty` 来侦测到行为的。

vue 中对这个数组问题的解决方案非常的简单粗暴，我说说vue是如何实现的，大体上分三步：

第一步：先把原生 `Array` 的原型方法继承下来。

第二步：对继承后的对象使用 `Object.defineProperty` 做一些拦截操作。

第三步：把加工后可以被拦截的原型，赋值到需要被拦截的 `Array` 类型的数据的原型上。

**vue的实现**

第一步：

```js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
```

第二步：

```js
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]

  Object.defineProperty(arrayMethods, method, {
    value: function mutator (...args) {
      console.log(method) // 打印数组方法
      return original.apply(this, args)
    },
    enumerable: false,
    writable: true,
    configurable: true
  })
})
```

现在可以看到，每当被侦测的 `array` 执行方法操作数组时，我都可以知道他执行的方法是什么，并且打印到 `console` 中。

现在我要对这个数组方法类型进行判断，如果操作数组的方法是 push unshift splice （这种可以新增数组元素的方法），需要把新增的元素用上面封装的 `walk` 来进行变化检测。

并且不论操作数组的是什么方法，我都要触发消息，通知依赖列表中的依赖数据发生了变化。

那现在怎么访问依赖列表呢，可能我们需要把上面封装的 `walk` 加工一下：

```js
// 工具函数
function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep() // 新增
    this.vmCount = 0
    def(value, '__ob__', this) // 新增

    // 新增
    if (Array.isArray(value)) {
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      new Observer(items[i])
    }
  }
}
```

我们定义了一个 `Observer` 类，他的职责是将 `data` 转换成可以被侦测到变化的 `data`，并且新增了对类型的判断，如果是 `value` 的类型是 `Array` 循环 Array将每一个元素丢到 Observer 中。

并且在 value 上做了一个标记 `__ob__`，这样我们就可以通过 `value` 的 `__ob__` 拿到Observer实例，然后使用 `__ob__` 上的 `dep.notify()` 就可以发送通知啦。

然后我们在改进一下Array原型的拦截器：

```js
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
```

可以看到写了一个 `switch` 对 `method` 进行判断，如果是 `push`，`unshift`，`splice` 这种可以新增数组元素的方法就使用 `ob.observeArray(inserted)` 把新增的元素也丢到 `Observer` 中去转换成可以被侦测到变化的数据。

在最后不论操作数组的方法是什么，都会调用 `ob.dep.notify()` 去通知 `watcher` 数据发生了改变。

## arrayMethods 是怎么生效的？

现在我们有一个 `arrayMenthods` 是被加工后的 `Array.prototype`，那么怎么让这个对象应用到`Array` 上面呢？

思考一下，我们不能直接修改 `Array.prototype`因为这样会污染全局的Array，我们希望 `arrayMenthods`只对 `data`中的`Array` 生效。

所以我们只需要把 `arrayMenthods` 赋值给 `value` 的 `__proto__` 上就好了。

我们改造一下 `Observer`：

```js
export class Observer {
  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)

    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods // 新增
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
}
```

如果不能使用 `__proto__`，就直接循环 `arrayMethods` 把它身上的这些方法直接装到 `value` 身上好了。

**什么情况不能使用 __proto__ 我也不知道，各位大佬谁知道能否给我留个言？跪谢~**

所以我们的代码又要改造一下：

```js
// can we use __proto__?
const hasProto = '__proto__' in {} // 新增
export class Observer {
  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)

    if (Array.isArray(value)) {
      // 修改
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
}

function protoAugment (target, src: Object, keys: any) {
  target.__proto__ = src
}

function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
```

## 关于Array的问题

关于vue对Array的拦截实现上面刚说完，正因为这种实现方式，其实有些数组操作vue是拦截不到的，例如：

```js
this.list[0] = 2
```

修改数组第一个元素的值，无法侦测到数组的变化，所以并不会触发 `re-render` 或 `watch` 等。

在例如：

```js
this.list.length = 0
```

清空数组操作，无法侦测到数组的变化，所以也不会触发 `re-render` 或 `watch` 等。

因为vue的实现方式就决定了无法对上面举得两个例子做拦截，也就没有办法做到响应，ES6是有能力做到的，在ES6之前是无法做到模拟数组的原生行为的，现在 ES6 的 Proxy 可以模拟数组的原生行为，也可以通过 ES6 的继承来继承数组原生行为，从而进行拦截。

## 总结

[![响应式结构图](https://raw.githubusercontent.com/vuejs/vuejs.org/master/src/images/data.png)](https://raw.githubusercontent.com/vuejs/vuejs.org/master/src/images/data.png)

最后掏出vue官网上的一张图，这张图其实非常清晰，就是一个变化侦测的原理图。

`getter` 到 `watcher` 有一条线，上面写着收集依赖，意思是说 `getter` 里收集 `watcher`，也就是说当数据发生 `get` 动作时开始收集 `watcher`。

`setter` 到 `watcher` 有一条线，写着 `Notify` 意思是说在 `setter` 中触发消息，也就是当数据发生 `set`动作时，通知 `watcher`。

`Watcher` 到 ComponentRenderFunction 有一条线，写着 `Trigger re-render` 意思很明显了。

[![image](https://user-images.githubusercontent.com/3739368/33662223-0834f8c2-dac6-11e7-8c1d-0610fb61b1f3.png)](https://user-images.githubusercontent.com/3739368/33662223-0834f8c2-dac6-11e7-8c1d-0610fb61b1f3.png)