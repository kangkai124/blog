# 使用 webpack 定制前端开发环境

## webpack 一些基本概念

### 入口

如果是单页面应用，那么可能入口只有一个；如果是多个页面的项目，那么经常是一个页面会对应一个构建入口。

入口可以使用 `entry` 字段来进行配置，webpack 支持配置多个入口来进行构建：

```js
module.exports = {
  entry: './src/index.js' 
}

// 上述配置等同于
module.exports = {
  entry: {
    main: './src/index.js'
  }
}

// 或者配置多个入口
module.exports = {
  entry: {
    foo: './src/page-foo.js',
    bar: './src/page-bar.js', 
    // ...
  }
}

// 使用数组来对多个文件进行打包
module.exports = {
  entry: {
    main: [
      './src/foo.js',
      './src/bar.js'
    ]
  }
}
```

### loader

webpack 中提供一种处理多种文件格式的机制，便是使用 loader。我们可以把 loader 理解为是一个转换器，负责把某种文件格式的内容转换成 webpack 可以支持打包的模块。

在 `module.rules` 字段下来配置相关的规则。

###  plugin

在 webpack 的构建流程中，plugin 用于处理更多其他的一些构建任务。通过添加我们需要的 plugin，可以满足更多构建中特殊的需求。

例如，要使用压缩 JS 代码的 uglifyjs-webpack-plugin 插件，只需在配置中通过 `plugins` 字段添加新的 plugin 即可。

### 输出

webpack 的输出即指 webpack 最终构建出来的静态文件，使用 `output` 字段配置。

```js
module.exports = {
  // ...
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
}

// 或者多个入口生成不同文件
module.exports = {
  entry: {
    foo: './src/foo.js',
    bar: './src/bar.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
}

// 路径中使用 hash，每次构建时会有一个不同 hash 值，避免发布新版本时线上使用浏览器缓存
module.exports = {
  // ...
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/[hash]',
  },
}
```

webpack 的配置其实是一个 Node.js 的脚本，这个脚本对外暴露一个配置对象，webpack 通过这个对象来读取相关的一些配置。



## 搭建基本的前端开发环境

### 关联 HTML

通常一个前端项目从一个 HTML 页面出发，引用 css 和 js 文件，但是我们构建出来的文件一般都会用 `[hash]` 命名，所以需要用到 [html-webpack-plugin](https://link.juejin.im/?target=https%3A%2F%2Fdoc.webpack-china.org%2Fplugins%2Fhtml-webpack-plugin%2F) 将路径和我们的构建结果关联起来。

```js
new HtmlWebpackPlugin({
    template : project.paths.client('index.html'), // 文件模板
    hash     : false, // 是否需要 hash 命名
    favicon  : project.paths.public('logo.png'), // favicon 图表路径
    filename : 'index.html', // 配置输出文件名和路径
    inject   : 'body', // 构件后的 js 在 body 底部引用
    minify   : {
      collapseWhitespace : true // 压缩 html
    }
  }),
```

### 构建 CSS

我们编写 CSS，并且希望使用 webpack 来进行构建，为此，需要在配置中引入 loader 来解析和处理 CSS 文件。

css-loader：负责解析 css 代码，处理 css 中的依赖如 *@import* 和 *url()* 等。

style-loader：将 css-loader 解析的结果转变成 js 代码，动态插入 style 标签。

如果需要单独把 css 文件分离出来，需要使用 [extract-text-webpack-plugin](https://link.juejin.im/?target=https%3A%2F%2Fdoc.webpack-china.org%2Fplugins%2Fextract-text-webpack-plugin) 。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.less$/,
        // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader
        use: ExtractTextPlugin.extract({ 
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader'],
        }), 
      },
    ],
  },
  // ...
}
```

> **loader 的加载顺序是从右往左，从下往上。**

### 处理图片文件

file-loader

### 使用 Babel

babel-loader

### 启动静态服务

 [webpack-dev-server](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Fwebpack%2Fwebpack-dev-server) 

```patch
"scripts": {
+  "start": "webpack-dev-server --mode development"
}
```



## webpack 如何解析代码模块路径

### 模块解析规则

- 解析相对路径

  1. 查找相对当前模块的路径下是否有对应文件或文件夹
  2. 是文件则直接加载
  3. 是文件夹则继续查找文件夹下的 package.json 文件
  4. 有 package.json 文件则按照文件中 main 字段的文件名来查找文件
  5. 无 package.json 或者无 main 字段则查找 index.js 文件

- 解析模块名

  查找当前文件目录下，父级目录及以上目录下的 node_modules 文件夹，看是否有对应名称的模块

- 解析绝对路径（不建议使用）

  直接查找对应路径的文件

### 常用配置

> 在 webpack 配置中，和模块路径解析相关的配置都在 `resolve` 字段下。

#### resolve.alias

假设我们有个 `utils` 模块极其常用，经常编写相对路径很麻烦，希望可以直接 `import 'utils'` 来引用，那么我们可以配置某个模块的别名，如：

```js
alias: {
  utils: path.resolve(__dirname, 'src/utils') // 这里使用 path.resolve 和 __dirname 来获取绝对路径
}
```

如果需要进行精确匹配可以使用：

```
alias: {
  utils$: path.resolve(__dirname, 'src/utils') // 只会匹配 import 'utils'
}
```

#### resolve.extensions

```js
extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
```

例如有了上述的配置，当你在 src/utils/ 目录下有一个 common.js 文件时，就可以这样来引用：

```
import * as common from './src/utils/common'
```

#### resolve.modules

对于直接声明依赖名的模块（如 `react` ），webpack 会类似 Node.js 一样进行路径搜索，搜索 node_modules 目录，这个目录就是使用 *resolve.modules* 字段进行配置的，默认就是：

```js
resolve: {
  modules: ['node_modules'],
},
```

如果你想要添加一个目录到模块搜索目录，此目录优先于 `node_modules/` 搜索：

```
modules: [path.resolve(__dirname, "src"), "node_modules"]
```



## 配置 loader

懒得写。。。



## 使用 plugin

更多的插件可以在这里查找：[plugins in awesome-webpack](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Fwebpack-contrib%2Fawesome-webpack%23webpack-plugins)。

### DefinePlugin

`DefinePlugin` 允许创建一个在**编译**时可以配置的全局常量，社区中使用最多的方式是定义环境变量，例如 `PRODUCTION = true` 或者 `__DEV__ = true` 等。

```js
module.exports = {
  // ...
  plugins: [
      new webpack.DefinePlugin({
          'process.env': {
              "NODE_ENV": JSON.stringify("production")
          }，
          '__IWIND_API__': JSON.stringify("http://10.1.20.37:8080/iwind/api/v1/"),
          'VERSION': JSON.stringify('5fa3b9')
      }),
  ]
}
```

> 注意，因为这个插件直接执行文本替换，给定的值必须包含字符串本身内的**实际引号**。通常，有两种方式来达到这个效果，使用 `'"production"'`, 或者使用 `JSON.stringify('production')`。

### copy-webpack-plugin

### extract-text-webpack-plugin

### ProvidePlugin

自动加载模块，而不必到处 `import` 或 `require` 。

要自动加载 `jquery`，我们可以将两个变量都指向对应的 node 模块：

```
new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery'
})
```

然后在我们任意源码中：

```
// in a module
$('#item'); // <= 起作用
jQuery('#item'); // <= 起作用
// $ 自动被设置为 "jquery" 输出的内容
```

> 对于 ES2015 模块的 default export，必须指定模块的 default 属性。



## 更好地使用 webpack-dev-server

