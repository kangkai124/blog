# Vue 源码学习

## 1. Vue 的本质

runtime-only 版的 vue.js 的构建入口文件是 `src/platforms/web/entry-runtime.js`，runtime + compile 版的 vue.js 的构建入口文件是 `src/platforms/web/entry-runtime-with-compile.js`。在文件中顺着 Vue 的引入层层往上找，就会找到定义 Vue 的文件，`src/core/instance/index.js`。Vue 的定义如下：

```js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```

Vue 就是一个用 function 实现的类，通过 new Vue 去实例化它。用函数的方式定义类而不是用 es6 的 class 方法，是因为下面会有一些函数（如上），他们会在 Vue 的 prototype 上扩展一些方法。*Vue 按功能把这些扩展分散到多个模块（文件）中去实现，非常方便代码的维护和管理*，但是这样用 class 是很难实现的，因此使用了函数的定义。



## 2. new Vue 的时候发生了什么

从上面 Vue 类的定义看到，new 一个实例时会调用 `this._init` 方法，这个方法是通过 `inITMixin（Vue）` 挂在到 Vue 原型上的，代码在 `src/core/instance/init.js` 。



