# 学习 docker
`docker images`							列出已经下载下来的镜像

`docker images ubuntu` 					列出特定的某个镜像

`docker images -f since=mongo:3.2`		mongo:3.2 之后建立的镜像

>  run = create 容器 + start 容器

```shell
docker run --name webserver -d -p 3000:80 nginx
```

用 nginx 镜像启动一个容器，命名为 webserver ，并且映射了80端口，这样我们可以用在浏览器中输入 http://localhost:3000 去访问这个 nginx 服务器。

```shell
docker exec -it webserver bash
```

以交互式终端方式进入 webserver 容器，并执行了 bash 命令，也就是获得一个可操作的 Shell。

```shell
# docker build [选项] <上下文路径/URL/->
docker build -t nginx:v3 .
```

如果注意，会看到 docker build 命令最后有一个` .` 。` .` 这是在指定上下文路径。


#### *镜像构建上下文（Context）* *

`docker build` 的工作原理：*Docker 在运行时分为 Docker 引擎（也就是服务端守护进程）和客户端工具。 docker 命令这样的客户端工具与 Docker 引擎交互，完成各种功能。虽然表面上我们好像是在本机执行各种 docker 功能，但实际上，**一切都是使用的远程调用形式在服务端（Docker 引擎）完成**。*

当我们进行镜像构建的时候，并非所有定制都会通过指令完成，经常会需要将一些本地文件复制进镜像，比如通过 COPY 指令、指令等。**而 `docker build` 命令构建镜像，其实并非在本地构建，而是在服务端，也就是 Docker 引擎中构建的。**

这就引入了上下文的概念。当构建的时候，用户会指定构建镜像上下文的路径， **`docker build` 命令得知这个路径后，会将路径下的所有内容打包，然后上传给 Docker 引擎。**这样 Docker 引擎收到这个上下文包后，展开就会获得构建镜像所需的一切文件。

如果在 `Dockerfile` 中这么写：

```dockerfile
 COPY ./package.json /app/
```

这并不是要复制 `docker build` 命令所在的目录下的 `package.json` ，也不是复制 `Dockerfile` 所在目录下的 `package.json` ，而是复制 **上下文（即下面shell中的 `.`）** 目录下的 `package.json` 。

```shell
# docker build [选项] <上下文路径/URL/->
docker build -t nginx:v3 .
```

因此， 这类指令中的源文件的路径都是相对路径。

 `docker build -t nginx:v3` 中的这个 `.` ，实际上是在指定上下文的目录，`docker build` 命令会将该目录下的内容打包交给 Docker 引擎以帮助构建镜像。

如果观察 `docker build` 输出，我们其实已经看到了这个发送上下文的过程：

```shell
$ docker build -t nginx:v3 .
Sending build context to Docker daemon 2.048 kB
...
```

如果目录下有些东西确实不希望构建时传给 Docker 引擎，那么可以用 `.gitignore` 一样的语法写一个 `.dockerignore` ，该文件是用于剔除不需要作为上下文传递给 Docker 引擎的。

#### 使用 Dockerfile 定制镜像

FROM 指定基础镜像，因此一个 Dockerfile 中 FROM 是必备的指令，并且必须是第一条指令。

**RUN** 执行命令，其格式有两种：

- shell 格式：RUN <命令>

```dockerfile
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index
.html
```

- exec 格式： RUN ["可执行文件", "参数1", "参数2"]

> 一定要确保每一层只添加真正需要添加的东西，任何无关的东西都应该清理掉。

**COPY** 复制文件：

`<源路径>` 可以是多个，甚至可以是通配符，其通配符规则要满足 Go 的 [filepath.Match](https://golang.org/pkg/path/filepath/#Match) 规则。

`<目标路径>` 可以是容器内的绝对路径，也可以是相对于工作目录的相对路径（工作目录可以用 `WORKDIR` 指令来指定）。目标路径不需要事先创建，如果目录不存在会在复制文件前先行创建缺失目录。

> **使用 COPY 指令，源文件的各种元数据都会保留。比如读、写、执行权限、文件变更时间等。**这个特性对于镜像定制很有用。特别是构建相关文件都在使用 Git 进行管理的时候。

**ADD** 更高级的复制文件：

比如 `<源路径>` 可以是一个 URL，也可以是一个 `tar` 压缩文件，`ADD` 会自动解压缩这个文件到 `<目标路径>` 去。

> 尽可能的使用 COPY ，仅在需要自动解压缩的场合使用 ADD。

**CMD** 容器启动命令

在指令格式上，一般推荐使用 `exec` 格式，这类格式在解析时会被解析为 JSON 数组，因此一定要使用双引号 ，而不要使用单引号。

如果使用 shell 格式的话，实际的命令会被包装为 `sh -c` 的参数的形式进行执行。比如: 

```dockerfile
CMD echo $
```

在实际执行中，会将其变更为:

```dockerfile
CMD [ "sh", "-c", "echo $HOME" ]
```

这就是为什么我们可以使用环境变量的原因，因为这些环境变量会被 shell 进行解 析处理。 

**ENTRYPOINT** 入口点

ENTRYPOINT 和 CMD 一样，都是指定容器启动程序及参数。不同的是，ENTRYPOINT 可以在使用 docker 命令时，**在后面加参数。**

下面是个使用 ENTRYPOINT 的例子：

```dockerfile
FROM alpine:3.4
...
RUN addgroup -S redis && adduser -S -G redis redis
...
ENTRYPOINT ["docker-entrypoint.sh"]
EXPOSE 6379
CMD [ "redis-server" ]
```

可以看到其中为了 redis 服务创建了 redis 用户，并在最后指定了 ENTRYPOINT 为 `docker-entrypoint.sh` 脚本。

```shell
#!/bin/sh
...
# allow the container to be started with `--user`
if [ "$1" = 'redis-server' -a "$(id -u)" = '0' ]; then
    chown -R redis .
    exec su-exec redis "$0" "$@"
fi
exec "$@"
```

该脚本的内容就是根据 CMD 的内容来判断，如果是 的话，则切换到 redis 用户身份启动服务器，否则依旧使用身份执行。比如:

```shell
$ docker run -it redis id
uid=0(root) gid=0(root) groups=0(root)
```

**ENV** 设置环境变量

**ARG** 构建参数

**VOLUME** 定义匿名卷

**EXPOSE** 声明端口

**WORKDIR** 指定工作目录

**USER** 指定当前用户

**HEALTHCHECK** 健康检查

...



`docker rmi` 			删除本地镜像

`docker rm `			删除

`docker run` 		新建并启动  (-itd)



在用 `docker run` 命令的时候，使用 `-v` 标记来创建一个数据卷并挂载到容器里。在一次 `run` 中多次使用可以挂载多个数据卷。

```shell
$ sudo docker run -d -P --name web -v /webapp training/webapp py
thon app.py
```

上面创建了一个名为 web 的容器，并加载一个数据卷到容器的 `/webapp` 目录。

删除容器不会自动删除数据卷，使用 `docker rm -v` 命令同时删除数据卷。

```shell
$ docker inspect web
```

上面命令查看指定容器的信息。

**使用 `-P` 或者 `-p` 指定端口映射**

```shell
# -P (大写) 随机映射一个 49000~49900 的端口到内部容器开放的网络端口
$ sudo docker run -d -P training/webapp python app.py
$ sudo docker ps -l
CONTAINER ID  IMAGE                   COMMAND       CREATED
   STATUS        PORTS                    NAMES
bc533791f3f5  training/webapp:latest  python app.py 5 seconds ag
o  Up 2 seconds  0.0.0.0:49155->5000/tcp  nostalgic_morse
```

可以看到，访问本机的 49155 端口就可以访问容器内 web 应用提供的界面。

可以通过 `docker logs` 命令来查看应用的信息。

```shell
$ sudo docker logs -f nostalgic_morse
* Running on http://0.0.0.0:5000/
10.0.2.2 - - [23/May/2014 20:16:31] "GET / HTTP/1.1" 200 -
10.0.2.2 - - [23/May/2014 20:16:31] "GET /favicon.ico HTTP/1.1"
404 -
```

`-p` (小写)则可以指定要映射的端口，并且，在一个指定端口上只可以绑定一个容器。

支持的格式：

- ip:hostPort:containerPort
- ip::containerPort
- hostPort:containerPort

```shell
$ sudo docker run -d -p 5000:5000 training/webapp python app.py
$ sudo docker run -d -p 127.0.0.1:5000:5000 training/webapp python app.py
$ sudo docker run -d -p 127.0.0.1::5000 training/webapp python app.py
```

`docker port nostalgic_morse 5000` 查看当前映射的端口配置

