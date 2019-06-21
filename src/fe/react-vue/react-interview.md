#### React是什么

是一个轻量级 js UI 库，虚拟 dom，组件化。



#### 什么是 virtual dom

是真实 dom 的 js 对象表示，js 的渲染比 dom 渲染更高效。



#### 什么是 jsx

js 的语法扩展，结合 js 和 xml，遇到 `<` 当 html 解析，遇到 `{` 当 js 解析。



#### React 组件的种类

有无状态分为：

- 函数（无状态）组件，是个纯函数
- 类（有状态）组件

有无受控分为：

- 受控组件
- 非受控组件



#### 如何在React中应用样式

- className
- style



#### redux

需要详细了解。



#### ErrorBoundary

这里有[一个栗子](https://codepen.io/gaearon/pen/wqvxGa?editors=0010)。

作用：自定义错误UI，记录错误。



#### Portals

Portals 提供了一种方法，可以将子节点渲染到父组件之外的 dom 上。

```js
ReactDOM.createPortal(child, container)
```

对于要通过 createPortal() “分离”出去的内容，其间的数据传递，生命周期，甚至事件冒泡，依然存在于原本的抽象组件树结构当中。

这里有个[栗子](https://codepen.io/gaearon/pen/jGBWpE)。



#### Context API

