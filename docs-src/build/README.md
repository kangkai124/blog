# npm scripts 打造前端工作流

> 代码在[这里](https://github.com/kangkai124/IdontknowJS/tree/master/projects/automated-workflow-with-npm-script)。

## npm script 命令

*npm init -y* 或者 *npm init -f* 跳过参数问答，快速生成 package.json。

shell 命令修改默认配置：

```shell
npm config set init.author.email "kkstrive0124@gmail.com"
npm config set init.author.name "kangkai"
npm config set init.author.url "https://github.com/kangkai124"
npm config set init.license "MIT"
npm config set init.version "0.1.0"
```

*npm run* 是 npm 内置的核心功能之一， 当运行 *npm run xx* 时：

1. 从 package.json 文件中读取 scripts 对象里面的全部配置
2. 以 xx 为键，在 scripts 对象里获取对应的值做为接下来要执行的命令，没找到报错
3. 在 shell 中执行上述命令

执行 *npm run* 不带任何参数，列出可执行的所有命令。



## 运行多个 npm script 命令

安利常用的 4 种代码检查：

1. [eslint](https://link.juejin.im/?target=https%3A%2F%2Feslint.org)，可定制的 js 代码检查
2. [stylelint](https://link.juejin.im/?target=https%3A%2F%2Fstylelint.io)，可定制的样式文件检查，支持 css、less、scss
3. [jsonlint](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Fzaach%2Fjsonlint)，json 文件语法检查，踩过坑的同学会清楚，json 文件语法错误会知道导致各种失败
4. [markdownlint-cli](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Figorshubovych%2Fmarkdownlint-cli)，Markdown 文件最佳实践检查，个人偏好

单元测试：

1. [mocha](https://link.juejin.im/?target=https%3A%2F%2Fmochajs.org)，测试用例组织，测试用例运行和结果收集的框架；
2. [chai](https://link.juejin.im/?target=http%3A%2F%2Fchaijs.com)，测试断言库，必要的时候可以结合 [sinon](https://link.juejin.im/?target=http%3A%2F%2Fsinonjs.org) 使用；

####  多个 npm script 串行

```json
"test": "npm run lint:js && npm run lint:css && npm run lint:json && npm run lint:markdown && mocha tests/"
```

串行执行的时候，如果前面的命令失败，后续的都会终止。

#### 多个 npm script 并行

在严格串行的情况下，我们必须要确保代码中没有编码规范问题才能运行测试，在某些时候可能并不是我们想要的，因为我们真正需要的是，代码变更时同时给出测试结果和测试运行结果。这就需要把子命令的运行从串行改成并行，实现方式更简单，把连接多条命令的 **&&** 符号替换成 **&** 即可。

```json
"test": "npm run lint:js & npm run lint:css & npm run lint:json & npm run lint:markdown & mocha tests/"
```

在命令的最后增加 **& wait** ，如果我们在任何子命令中启动了长时间运行的进程，比如启动了 mocha 的 **—watch** 配置，可以使用 **Ctrl + c** 结束进程。

```json
"test": "npm run lint:js & npm run lint:css & npm run lint:json & npm run lint:markdown & mocha tests/ & wait"
```

#### 更好的管理方式

[npm-run-all](https://github.com/mysticatea/npm-run-all)



## 给 npm script 传参

简单粗暴方法：

```json
"lint:js": "eslint *.js",
"lint:js:fix": "eslint *.js --fix",
```

当 *lint:js* 命令变长之后，可能会忘记修改 *lint:js:fix* ，所以更健壮的做法是，在运行 *npm script* 是给定额外的参数。

```json
"lint:js": "eslint *.js",
"lint:js:fix": "npm run lint:js -- --fix",
```

要格外注意 `--fix` 参数前面的 `--` 分隔符，意指要给 `npm run lint:js` 实际指向的命令传递额外的参数。



## npm script 钩子

*pre* 和 *post* ：

举例来说，运行 npm run test 的时候，分 3 个阶段：

1. 检查 scripts 对象中是否存在 pretest 命令，如果有，先执行该命令
2. 检查是否有 test 命令，有的话运行 test 命令，没有的话报错
3. 检查是否存在 posttest 命令，如果有，执行 posttest 命令

```json
"precover": "rm -rf coverage",
"cover": "nyc --reporter=html npm test",
"postcover": "rm -rf .nyc_output && opn coverage/index.html"
```



## 在 npm script 中使用变量

通过运行 `npm run env` 就能拿到完整的变量列表。

`npm run env | grep npm_package | sort` 拿到部分排序后的预定义环境变量：

```shell
// 作者信息...
npm_package_author_email=wangshijun2010@gmail.com
npm_package_author_name=wangshijun
npm_package_author_url=http://github.com/wangshijun
// 依赖信息...
npm_package_devDependencies_markdownlint_cli=^0.5.0
npm_package_devDependencies_mocha=^4.0.1
npm_package_devDependencies_npm_run_all=^4.1.2
// 各种 npm script
npm_package_scripts_lint=npm-run-all --parallel lint:*
npm_package_scripts_lint_css=stylelint *.less
npm_package_scripts_lint_js=eslint *.js
npm_package_scripts_lint_js_fix=npm run lint:js -- --fix
npm_package_scripts_lint_json=jsonlint --quiet *.json
// 基本信息
npm_package_version=0.1.0
npm_package_gitHead=3796e548cfe406ec33ab837ac00bcbd6ee8a38a0
npm_package_license=MIT
npm_package_main=index.js
npm_package_name=hello-npm-script
npm_package_readmeFilename=README.md
// 依赖的配置
npm_package_nyc_exclude_0=**/*.spec.js
npm_package_nyc_exclude_1=.*.js
```

变量的使用方法遵循 shell 里面的语法，直接在 npm script 给想要引用的变量前面加上 *$* 符号即可。

```json
"cover": "nyc --reporter=html npm test",
"cover:cleanup": "rm -rf coverage && rm -rf .nyc_output",
"cover:archive": "mkdir -p coverage_archive/k-script-$npm_package_version && cp -r coverage/* coverage_archive/k-script-$npm_package_version",
"postcover": "npm run cover:archive && npm run cover:cleanup && opn coverage_archive/k-script-$npm_package_version/index.html"
```

*cover:archive* 做了 2 件事情：

1. *mkdir -p coverage_archive/$npm_package_version* 准备当前版本号的归档目录
2. *cp -r coverage/* coverage_archive/$npm_package_version*，直接复制文件来归档

而 *postcover* 做了 3 件事情：

1. *npm run cover:archive*，归档本次覆盖率报告
2. *npm run cover:cleanup*，清理本次覆盖率报告
3. *opn coverage_archive/$npm_package_version/index.html*，直接预览覆盖率报告





## npm 命令行自动补全

#### npm run | less

使用 */* 进入搜索模式

#### npm completion 集成到 shell 中

npm 自身提供了自动完成工具 [completion](https://link.juejin.im/?target=https%3A%2F%2Fdocs.npmjs.com%2Fcli%2Fcompletion)，将其集成到 [bash](https://link.juejin.im/?target=https%3A%2F%2Fwww.gnu.org%2Fsoftware%2Fbash) 或者 [zsh](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Frobbyrussell%2Foh-my-zsh) 里也非常容易。

官方文档里面的集成方法如下：

```
npm completion >> ~/.bashrc
npm completion >> ~/.zshrc
```

如果你也有代码洁癖，为了保持 .zshrc 或者 .bashrc 文件的整洁，可以用下面的方法：

第 1 步，把 npm completion 产生的那坨命令放在单独的文件中：

```shell
npm completion >> ~/.npm-completion.bash
```

第 2 步，在 .bashrc 或者 .zshrc 中引入这个文件：

```shell
echo "[ -f ~/.npm-completion.bash ] && source ~/.npm-completion.bash;" >> ~/.bashrc
echo "[ -f ~/.npm-completion.bash ] && source ~/.npm-completion.bash;" >> ~/.zshrc
```

>  TIP：执行完上面的命令一定要记得 *source ~/.zshrc* 或者 *source ~/.bashrc*

#### 更高级的自动补全

[zsh-better-npm-completion](https://github.com/lukechilds/zsh-better-npm-completion)

[yarn-completions](https://github.com/mklabs/yarn-completions)



## npm script 跨平台兼容

#### 文件系统操作的跨平台兼容

- [rimraf](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Fisaacs%2Frimraf) 或 [del-cli](https://link.juejin.im/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fdel-cli)，用来删除文件和目录，实现类似于 `rm -rf` 的功能
- [cpr](https://link.juejin.im/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcpr)，用于拷贝、复制文件和目录，实现类似于 `cp -r` 的功能
- [make-dir-cli](https://link.juejin.im/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fmake-dir-cli)，用于创建目录，实现类似于 `mkdir -p` 的功能

```shell
npm i rimraf cpr make-dir-cli -D
# npm install rimraf cpr make-dir-cli --save-dev
# yarn add rimraf cpr make-dir-cli -D
```

#### 用 cross-var 引用变量

Linux 下直接可以用 `$npm_package_name`，而 Windows 下必须使用 `%npm_package_name%`，我们可以使用 [cross-var](https://link.juejin.im/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcross-var) 实现跨平台的变量引用:

```patch
"scripts": {
     "cover:cleanup": "rm -rf coverage && rm -rf .nyc_output",
-    "cover:archive": "mkdir -p coverage_archive/$npm_package_version && cp -r coverage/* coverage_archive/$npm_package_version",
-    "cover:serve": "http-server coverage_archive/$npm_package_version -p $npm_package_config_port",
-    "cover:open": "opn http://localhost:$npm_package_config_port",
+    "cover:archive": "cross-var \"mkdir -p coverage_archive/$npm_package_version && cp -r coverage/* coverage_archive/$npm_package_version\"",
+    "cover:serve": "cross-var http-server coverage_archive/$npm_package_version -p $npm_package_config_port",
+    "cover:open": "cross-var opn http://localhost:$npm_package_config_port",
     "postcover": "npm-run-all cover:archive cover:cleanup --parallel cover:serve cover:open"
   }
```

#### 用 cross-env 设置环境变量

第 1 步，添加 cross-env 到开发依赖：

```shell
npm i cross-env -D
```

第 2 步，改写使用了环境变量的 npm script：

```patch
 "scripts": {
- "test": "NODE_ENV=test mocha tests/",
+ "test": "cross-env NODE_ENV=test mocha tests/",
  },
```



## 把庞大的 npm script 拆到单独的文件中

借助 [scripty](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Ftestdouble%2Fscripty) 我们可以将 npm script 剥离到单独的文件中。

```shell
npm i scripty -D

mkdir -p scripts/cover

touch scripts/cover.sh
touch scripts/cover/serve.sh
touch scripts/cover/open.sh
```

然后创建空白的脚本文件，因为有了单独的脚本，我们可以把原来的 precover、cover、postcover、cover:archive、cover:cleanup 合并到一个文件中。

按照 *scripty* 的默认约定，npm script 命令和上面各文件的对应关系如下：

|命令	|文件	|备注|
| ---- | ---- | ---- |
|cover|	scripts/cover.sh|	内含 precover、postcover 的逻辑|
|cover:serve|	scripts/cover/serve.sh|	启动服务|
|cover:open|	scripts/cover/open.sh|	打开预览|

**特别注意的是，给所有脚本增加可执行权限是必须的，否则 scripty 执行时会报错，** 我们可以给所有的脚本增加可执行权限：

```shell
chmod -R a+x scripts/*/.sh
```

脚本内容在[这里](../../projects/automated-workflow-with-npm-script/scripts)。



## NodeJs 脚本代替复杂的 npm script

Node.js 本身是跨平台的，用它编写的脚本出现跨平台兼容问题的概率很小。

需要用到 [shelljs](https://link.juejin.im/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fshelljs) 、 [chalk](https://link.juejin.im/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fchalk) 。

```shell
"cover": "node scripts/cover.js"
```



## livereload 自动刷新

安装 livereload http-server 到 dev 依赖。

```patch
+    "client": "npm-run-all --parallel client:*",
+    "client:reload-server": "livereload client/",
+    "client:static-server": "http-server client/"
```

在 html 中嵌入 livereload 脚本：

```patch
<body>
   <h2>LiveReload Demo</h2>
+  <script>
+    document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
+      ':35729/livereload.js?snipver=1"></' + 'script>')
+  </script>
 </body>
```



## git hooks 运行 npm script

安装 [husky](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Ftypicode%2Fhusky)  [lint-staged](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Fokonet%2Flint-staged) 到项目 dev 依赖。

lint-staged ，每个团队成员提交的时候，只检查当次改动的文件。

```patch
"scripts": {
-    "precommit": "npm run lint",
+    "precommit": "lint-staged",
     "prepush": "npm run test",
     "lint": "npm-run-all --parallel lint:*",
   },
+  "lint-staged": {
+    "*.js": "eslint",
+    "*.less": "stylelint",
+    "*.css": "stylelint",
+    "*.json": "jsonlint --quiet",
+    "*.md": "markdownlint --config .markdownlint.json"
+  },
```



## npm script 实现构建流水线

在现代前端项目的交付工作流中，部署前最关键的环节就是构建，构建环节要完成的事情通常包括：

- 源代码预编译：比如 less、sass、typescript
- 图片优化、雪碧图生成
- JS、CSS 合并、压缩
- 静态资源加版本号和引用替换
- 静态资源传 CDN 等

