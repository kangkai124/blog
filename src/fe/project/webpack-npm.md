# 关于 webpack、npm 等。

## webpack require.context


自定义匹配规则，动态引入模块。

```js
// 目录结构
|- index.js
|- components
    |- a.js
    |- b.js
// a.js
console.log(1);

module.exports = {
    hello: 'hello'
}
// b.js
console.log(2);

module.exports = {
    kk: 'kk'
}
// index.js
const componentsContext = require.context('./components', true, /\.js$/)
console.log(componentsContext.keys()) // ["./a.js", "./b.js"]

function importAll(r) {
    console.log(r) // ƒ webpackContext(req) {}
    r.keys().forEach(component => {
        console.log(component);  // ./a.js    ./b.js
        const componentConfig = componentsContext(component)
        console.log(componentConfig)  // {hello: "hello"}  {kk: 'kk'}
    });
}

importAll(componentsContext);
```

**在 vue 中的应用：在components目录下创建一个global目录，里面放置一些需要全局注册的组件。**

```js
// components/index.js
import Vue from 'vue'

// 自动加载 global 目录下的 .js 结尾的文件
const componentsContext = require.context('./global', true, /\.js$/)

componentsContext.keys().forEach(component => {
  const componentConfig = componentsContext(component)
  /**
  * 兼容 import export 和 require module.export 两种规范
  */
  const ctrl = componentConfig.default || componentConfig
  Vue.component(ctrl.name, ctrl)
})
```

上面 require.context 同样可以在运用在 vue 的自动导入子路由。
（等我项目中配好了再来补充）🤓

## npm

npm 脚本的原理非常简单。每当执行npm run，就会自动新建一个 Shell，在这个 Shell 里面执行指定的脚本命令。因此，只要是 Shell（一般是 Bash）可以运行的命令，就可以写在 npm 脚本里面。

**比较特别的是，npm run新建的这个 Shell，会将当前目录的node_modules/.bin子目录加入PATH变量，执行结束后，再将PATH变量恢复原样。**

这意味着，当前目录的node_modules/.bin子目录里面的所有脚本，都可以直接用脚本名调用，而不必加上路径。比如，当前项目的依赖里面有 Mocha，只要直接写mocha test就可以了。

```bash
"test": "mocha test"
```

由于 npm 脚本的唯一要求就是可以在 Shell 执行，因此它不一定是 Node 脚本，任何可执行文件都可以写在里面。

npm 脚本的退出码，也遵守 Shell 脚本规则。如果退出码不是0，npm 就认为这个脚本执行失败。



## npm 执行顺序

如果 npm 脚本里面需要执行多个任务，那么需要明确它们的执行顺序。

如果是并行执行（即同时的平行执行），可以使用 `&` 符号。

```bash
$ npm run script1.js & npm run script2.js
```

如果是继发执行（即只有前一个任务成功，才执行下一个任务），可以使用 `&&` 符号。

```bash
$ npm run script1.js && npm run script2.js
```

这两个符号是 Bash 的功能。此外，还可以使用 node 的任务管理模块：[script-runner](https://github.com/paulpflug/script-runner)、[npm-run-all](https://github.com/mysticatea/npm-run-all)、[redrun](https://github.com/coderaiser/redrun)。



## npm-scripts

- prepublish: Run BEFORE the package is packed and published, as well as on local **npm install**without any arguments. (See below)
- prepare: Run both BEFORE the package is packed and published, on local **npm install** without any arguments, and when installing git dependencies (See below). This is run AFTER **prepublish**, but BEFORE **prepublishOnly**.
- prepublishOnly: Run BEFORE the package is prepared and packed, ONLY on **npm publish**. (See below.)



## npx

npx 有两个主要作用：

#### 1. 调用项目安装的模块

比如项目中安装了 eslint，初始化的时候需要

```bash
./node_modules/.bin/eslint --init
```

使用 npx

```bash
npx eslint --init
```

npx 的原理是，运行的时候到 `node_modules/.bin` 和环境变量 `@PATH` 里面，检查命令是否存在。

#### 2. 避免全局安装模块

比如使用 `create-react-app` 创建项目时，不需要全局安装这个模块，使用 npx

```
npx create-react-app my-react-app
```

npx 将 `create-react-app` 下载到一个临时目录，使用以后再删除，下次使用还会重新下载。

参考：[npx 使用教程](http://www.ruanyifeng.com/blog/2019/02/npx.html)