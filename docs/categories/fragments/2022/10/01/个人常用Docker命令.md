---
title: 个人常用 Docker 命令
author: 查尔斯
date: 2022/10/01 22:33
isTop: true
categories:
 - 杂碎逆袭史
tags:
 - Docker
---

# 个人常用 Docker 命令 <Badge text="持续更新" type="warning" />

## 镜像相关

### 查看本地镜像列表

```shell
docker images
```

### 从记录中心查询镜像

```shell
docker search 镜像关键词
```

### 从记录中心拉取镜像到本地

::: warning 笔者说
如果镜像名称后不指定 **标签/版本** ，则会默认使用最新版本（latest）。  

例如：docker pull tomcat:8.5.0 拉取的就是 8.5.0 版本的 tomcat 镜像，而 docker pull tomcat -> 拉取的实际是 docker pull tomcat:latest，这个 latest 是跟随记录中心中的最新版本变化的，无法确定当前拉取的是哪一个版本。  
:::

```shell
docker pull 镜像名称[:标签/版本] 
```

### 删除本地镜像

```shell
# 删除指定镜像
docker rmi 镜像ID/镜像名称 [镜像ID/镜像名称...]

# 删除所有镜像
docker rmi `docker images -q`
docker rmi $(docker images -q)
```

::: tip 笔者说
`q` 是 quiet 的意思，加上这个参数后，docker images 输出的就不是镜像详细列表了，而是镜像 ID 列表，通常用于编写脚本时使用。  

所以，上方删除所有镜像的命令实际是 docker rmi 镜像ID1 镜像ID2...
:::

### 从 Dockerfile 创建镜像

::: warning 笔者说
如果镜像名称后不指定 **标签/版本** ，则会默认使用最新版本（latest）。  
:::

```shell
docker build -t 镜像名称[:标签/版本] Dockerfile文件路径
```

### 将本地镜像导出为 tar 文件

::: warning 笔者说
如果镜像名称后不指定 **标签/版本** ，则会默认使用最新版本（latest）。  
:::

```shell
docker save -o/-output 文件路径.tar 镜像名称[:标签/版本]
```

### 从 tar 文件导入为本地镜像

```shell
docker load -i/-input 文件路径.tar
```

## 容器相关

### 查看容器列表

```shell
# 查看正在运行的容器
docker ps  

# 查看全部容器（包含已经停止的）
docker ps -a

# 模糊查询容器
docker ps [-a] | grep 容器关键词
```

### 创建容器并运行

::: warning 笔者说
如果镜像名称后不指定 **标签/版本** ，则会默认使用最新版本（latest）。  

如果本地不存在该版本的镜像，则会先从记录中心拉取到本地。
:::

```shell
# -d 指定容器在后台运行
# --name 指定容器名称
# -m 限定容器内存大小
# --restart 指定重新启动方式，always 表示始终重启
# -e 指定环境变量配置
# -p 指定容器和宿主机的网络端口映射
# -v 指定容器和宿主机的目录挂载
# --network 指定容器使用的网络
# --network-alias 指定容器在网络中的别名

docker run -d \
--name 容器名称 镜像名称[:标签/版本] \
[-m xxxm] \
--restart=always \
[-e 环境变量名=环境变量值] \
[-p 宿主机端口:容器内部端口] \
[-v 宿主机目录:容器内部目录] \
[--network 网络名称 --network-alias 网络别名]
```

### 停止容器

```shell
# 停止指定容器
docker stop 容器ID/容器名称 [容器ID/容器名称...]

# 停止所有容器
docker stop `docker ps -aq`
docker stop $(docker ps -aq)
```

::: tip 笔者说
`q` 是 quiet 的意思，加上这个参数后，docker ps 输出的就不是容器详细列表了，而是容器 ID 列表，通常用于编写脚本时使用。  

所以，上方停止所有容器的命令实际是 docker stop 容器1ID 容器2ID...
:::

### 启动容器

```shell
docker start 容器ID/容器名称
```

### 重启容器

```shell
docker restart 容器ID/容器名称
```

### 删除容器

```shell
# 删除指定容器
docker rm 容器ID/容器名称 [容器ID/容器名称...]

# 删除所有容器
docker rm `docker ps -aq`
docker rm $(docker ps -aq)
```

::: tip 笔者说
`q` 是 quiet 的意思，加上这个参数后，docker ps 输出的就不是容器详细列表了，而是容器 ID 列表，通常用于编写脚本时使用。  

所以，上方删除所有容器的命令实际是 docker rm 容器1ID 容器2ID...
:::

### 进入容器内部

```shell
docker exec -it 容器ID/容器名称 bash

docker exec -it 容器ID/容器名称 sh
```

### 从容器内部退出

```shell
exit
```

### 向容器内拷贝文件

```shell
docker cp 宿主机内文件路径 容器名称:容器内文件路径
```

### 查看容器日志

```shell
# -f/--flow 跟踪日志输出
# -t/--timestamps 显示时间戳
# -n/--tail 从日志末尾显示的行数，默认为 all
# --since 自某个时间之后的日志
# 例如：--since "2022-09-30" 表示显示2022年9月30日后的日志
# 例如：--since 30m 表示显示最近 30 分钟内的日志
# --until 某个时间之前的日志
docker logs -f [-t] [-n 行数] [--since 开始时间] [--until 结束时间] 容器ID/容器名称
```

### 备份容器为本地镜像

::: warning 笔者说
如果镜像名称后不指定 **标签/版本** ，则会默认使用最新版本（latest）。  
:::

```shell
docker commit [-a "作者"] [-m "信息"] 容器ID/容器名称 镜像名称[:标签/版本]
```

### 将容器导出为 tar.gz 文件

```shell
docker export 容器ID/容器名称 > 文件路径.tar.gz
```

### 将 tar.gz 文件导入为镜像

::: warning 笔者说
如果镜像名称后不指定 **标签/版本** ，则会默认使用最新版本（latest）。  
:::

```shell
docker import 文件路径.tar.gz 镜像名称[:标签/版本]
```

## 网络相关

### 查看网络列表

```shell
docker network ls
```

### 创建 bridge 网络

```shell
docker network create 网络名称
```

### 删除网络

```shell
docker network rm 网络ID/网络名称
```

## 其他

### 查看 docker 版本

```shell
docker -v
docker version
```

### 查看 docker 信息

```shell
docker info
```

## docker-compose命令

### 启动并后台运行所有的服务

```shell
docker-compose up -d
```

### 停止并删除容器、网络、卷、镜像

```shell
docker-compose down
```

### 列出项目中目前的所有容器

```shell
docker-compose ps
```

### 停止容器

```shell
docker-compose stop 容器名
```

###  启动容器

```shell
docker-compose start 容器名
```

### 修改 yml 文件后，重新启动并后台运行

```shell
docker-compose up --force-recreate -d
```
