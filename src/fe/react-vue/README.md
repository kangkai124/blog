# mpvue + koa 搭建小程序全栈开发环境

## 1. 创建项目

使用 vue-cli 生成前端框架：

```shell
# 1. 全局安装 vue-cli
npm i -g vue-cli
# 2. 基于 mpvue-quickstart 模板创建项目
vue init mpvue/mpvue-quickstart my-project
# 3. 安装依赖
cd my-project
npm i
# 4. 启动构建
npm run dev
```

当然，也可以使用 `yarn` 安装：

```shell
yarn -g vue-cli
vue init mpvue/mpvue-quickstart my-project
cd my-project
yarn
yarn dev
```

然后在项目根目录下创建 `server` 文件夹，放服务端代码。这里有个[Demo](https://github.com/tencentyun/wafer2-quickstart-nodejs).

结构如下：

```
.
├── build                    # 与build相关的代码(mpvue内置)
├── dist                     # mpvue编译后的代码
├── server                   # koa服务端代码
├── src                      # Application source code
│   ├── components           # vue组件
│   ├── pages                # 小程序页面
│   ├── styles               # 公共样式
│   ├── utils           	 # 工具函数
│   ├── App.vue              # 根组件
│   ├── config.js            # 配置文件
│   ├── main.js              # 小程序主入口，export出小程序app.json配置
└── static					 # 静态文件 
```



## 2. 搭建后台本地开发环境

> 提示：本地不能测试信道和客服相关接口

打开 `server/config.js` **添加**以下配置：

```js
const CONF = {
      // 其他配置 ...
    serverHost: 'localhost',
    tunnelServerUrl: '',
    tunnelSignatureKey: '27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89',
      // 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
    qcloudAppId: '您的腾讯云 AppID',
    qcloudSecretId: '您的腾讯云 SecretId',
    qcloudSecretKey: '您的腾讯云 SecretKey',
    wxMessageToken: 'weixinmsgtoken',
    networkTimeout: 30000
}
```

并修改 MySQL 相关的配置为本地的 MySQL 数据库。

```
# 切换到服务端代码目录
cd server

# 安装依赖
npm install

# 安装全局依赖
npm install -g nodemon

npm run dev
```

初始化数据库 - 打开 terminal 输入如下命令：

```
node tools/initdb.js
```

进入Mysql选中刚才创建的数据库，输入 `show tables;` 可以看到初始化时创建了一个名叫 `cSessionInfo` 的表。说明本地环境已经搭建成功。



## 3.  部署到腾讯云开发环境

当本地本地开发出一版时，可以部署到腾讯云的开发环境，这样就可以在线上访问该项目。

首先修改项目根目录的 `project.config.json` 文件，添加：

```js
"qcloudRoot": "./server/",
```

然后将本地开发时添加到 `server/config.js` 的配置删除，在 mysql.pass 那里填上自己的 APPID。

接着进入小程序开发工具，点击右上角的 *腾讯云*，上传测试代码，弹出如图选项。第一次部署如下选择，之后再次上传选择 *智能上传* 即可。部署成功会有提示。

![上传到腾讯云](http://static.imkk.xin/blog/photo/uploadToTecentCloud.png)



## 4. 把小程序设为体验版本并分享给好友

在小程序开发工具右上角找到 *上传* 选项，填写版本信息，上传后进入开发者控制台，开发管理页面，将该小程序设置为体验版本。

然后在用户身份 ==> 成员管理中，添加项目成员，配置权限，这样好友也可以体验该小程序了。



emmmmmm…...有什么遗漏的想起来再补吧:-)