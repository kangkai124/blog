# 记录一条属于自己的gitlab流水线

作者：[YYJay](https://juejin.im/user/597620755188256705615451)

背景: 一次偶然的机会看到了其它项目组强大的GitLab流水线, 想起自己每天还要手动打镜像做一些重复性工作,瞬间眼红. 这不就是我想要的流水线吗.凑巧项目组决定把代码迁移到公司的机器上, 那就借着这个机会把gitlab弄完整吧.

## 名词: 

- .gitlab-ci.yml

YAML

 

```yaml
.gitlab-ci.yml
```

YAML

官方教程

```yaml
image: docker:stable

before_script:
- echo http://mirrors.ustc.edu.cn/alpine/v3.6/main > /etc/apk/repositories; echo http://mirrors.ustc.edu.cn/alpine/v3.6/community >> /etc/apk/repositories
- apk update
- apk add --update git bash
- docker login -u yourName -p yourPas yourDockerIp

stages:
  - test
  - build_docker
  - cleanup_build

test:
  stage: test
  allow_failure: true
  cache:
    paths:
    - node_modules/
  script:
    - apk add --update nodejs nodejs-npm
    - npm install --registry=http://192.168.130.131:9090
    - npm test
  only:
    - branches

build_docker:
  stage: build_docker
  retry: 2
  script:
    - apk add bash
    - bash build-docker.sh
  only:
    - dev
    - master
    - release
    - /^hotfixes-\d.\d.\d$/
  cache:
    paths:
    - node_modules/

cleanup_build_dicker:
  stage: cleanup_build
  retry: 2
  when: on_failure
  script:
    - CI_COMMIT_REF_NAME=${CI_COMMIT_REF_NAME} bash build-docker.sh
  only:
    - branches
     - dev
     - master
     - release
复制代码
```

- [Gitlab-runner](https://link.juejin.im/?target=https%3A%2F%2Fdocs.gitlab.com%2Fce%2Fci%2Frunners%2FREADME.html)

Gitlab-runner

```
.gitlab-ci.yml
```

- Pipelines

```
.gitlab-ci.yml
```

Pipelines

stages

jobs

```
.gitlab-ci.yml
```

## 下面我们开始正式安装

在这次搭建过程中, 我使用的是ubuntu虚拟机, 进入虚拟机一套命令下来之后,也就安装得差不多了,大部分时间还是在谷歌以及尝试各种方法 。比较几个教程之后, 也找到了比较适合我的[方法](https://link.juejin.im/?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000011632220%23articleHeader2)。

```shell
for ubuntu

添加 GitLab 镜像源并安装curl -sS http://packages.gitlab.com.cn/install/gitlab-ce/script.rpm.sh | sudo bash
sudo yum install gitlab-ce
配置并启动 GitLab
sudo gitlab-ctl reconfigure复制代码
```

接下来通过域名就可以访问我们的GitLab了, 第一次访问会要求初始化管理员密码, 设置完成之后, 系统会重定向到登录页面, 默认管理员账号为root, 登录之后, 就可以修改管理员账号为自己喜欢的账号了

2.安装gitlab-runner

最初安装时,我选用了官方提供的[安装方法](https://link.juejin.im/?target=https%3A%2F%2Fdocs.gitlab.com%2Frunner%2F), 一顿操作之后, 发现并不好用(一定是我打开的方式不对).于是我默默打开了万能的谷歌, 最后选择了安装gitlab-ci-multi-runner.这里依然还是一堆命令,默默等待它下载吧.详细介绍参考这位网友的[文章](https://link.juejin.im/?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000007180257)

```shell
1.添加Gitlab的官方源：
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-ci-multi-runner/script.deb.sh | sudo bash
2.安装
sudo apt-get install gitlab-ci-multi-runner
3.注册
sudo gitlab-ci-multi-runner registe
Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com )
https://mygitlab.com/ci
Please enter the gitlab-ci token for this runner
xxx-xxx-xxx
Please enter the gitlab-ci description for this runner
my-runner
INFO[0034] fcf5c619 Registering runner... succeeded
Please enter the executor: shell, docker, docker-ssh, ssh?
docker
Please enter the Docker image (eg. ruby:2.1):
node:4.5.0
INFO[0037] Runner registered successfully. Feel free to start it, but if it's
running already the config should be automatically reloaded!
复制代码
```

在第3步注册过程中, 会填一些信息,按提示一直往下走就行了,其中toker可以在我们的gitlab管理员主页获得 ip/admin/runners.

![img](https://user-gold-cdn.xitu.io/2018/8/6/1650e70a2d06e0ff?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

配置完成之后, 还需要在页面底部编辑runner, 将runner 与项目关联,关联之后才能运行流水线.

![img](https://user-gold-cdn.xitu.io/2018/8/6/1650e748bf74f2d5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

至此, 我们离配置runner还差最后一步:为项目设置runner.进入项目的CI/CD设置界面(Settings => CI/CD => Runners), 找到刚刚关联好的runner, 激活即可.![img](https://user-gold-cdn.xitu.io/2018/8/6/1650e7acd9a41d88?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

完成这步之后, 项目就可以顺利开始跑流水线啦.当项目分支有代码更新时, 就能看到我们在.gitlab-ci-yml中定义好的任务当前所处状态.![img](https://user-gold-cdn.xitu.io/2018/8/6/1650e80c371cbcc5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 遇到的坑:

安装GitLab时, 遇到错误

```shell
There was an error running gitlab-ctl reconfigure:

execute[/opt/gitlab/embedded/bin/initdb -D /var/opt/gitlab/postgresql/data -E UTF8] (postgresql::enable line 80) had an error: Mixlib::ShellOut::ShellCommandFailed: Expected process to exit with [0], but received '1'
---- Begin output of /opt/gitlab/embedded/bin/initdb -D /var/opt/gitlab/postgresql/data -E UTF8 ----
STDOUT: The files belonging to this database system will be owned by user "gitlab-psql".
This user must also own the server process.
STDERR: initdb: invalid locale settings; check LANG and LC_* environment variables
---- End output of /opt/gitlab/embedded/bin/initdb -D /var/opt/gitlab/postgresql/data -E UTF8 ----
Ran /opt/gitlab/embedded/bin/initdb -D /var/opt/gitlab/postgresql/data -E UTF8 returned 1复制代码
```

在全栈leader的指导下, 修改/etc/default/locale文件, 添加以下两行配置重启之后果然很香.

```shell
LC_CTYPE="en_US.UTF-8"
LC_ALL="en_US.UTF-8"复制代码
```

还有就是docker in docker 的问题, 在runner中每次都安装一个docker显然不太现实, 所以我们用了外部docker的方式, GitLab官方也给出了相应[教程](https://link.juejin.im/?target=https%3A%2F%2Fdocs.gitlab.com%2Fee%2Fci%2Fdocker%2Fusing_docker_build.html%23use-docker-socket-binding).

在安装过程中, 下载部分资源非常慢, 一定要切换到国内镜像源!!!附上中国科技大学的镜像源

```shell
echo http://mirrors.ustc.edu.cn/alpine/v3.6/main > /etc/apk/repositories; echo http://mirrors.ustc.edu.cn/alpine/v3.6/community >> /etc/apk/repositories
复制代码
```

## 总结:

这次的gitlab流水线搭建之旅, 在leader以及几位运维同事的帮助下, 也算是基本能用了,由于知识面太窄, 过程中大部分时间都在查资料看文档,不断测试.确实是开卷有益, 想起了高中物理老师说的那句话:"多读点书总不可能把人读坏吧".

整个流程弄下来发现并不是太难,命令也不多.但在安装之前,需要靠自己网上去搜各种教程, 中途也会出现千奇百怪的错误,每个步骤都可以单独出一个教程.我们需要一篇篇看完教程,甄选出最适合自己的.这是最花费时间的地方.另一个比较费时间的点就是测试和安装依赖, 有时可能会花费1个小时的时间去等待下载, 最后发现,下载失败,啊哈哈哈哈.



> 原文链接：[https://juejin.im/post/5b67b5d6e51d4519721be7c0](https://juejin.im/post/5b67b5d6e51d4519721be7c0)