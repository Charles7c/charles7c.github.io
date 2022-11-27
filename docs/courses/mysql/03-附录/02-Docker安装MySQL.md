---
title: Docker 安装 MySQL 详细步骤
author: 查尔斯
date: 2022/10/30 17:36
categories:
 - MySQL快速入门
tags:
 - MySQL
 - Docker
 - 容器
showComment: false
---

# Docker 安装 MySQL 详细步骤

::: tip 笔者说
笔者下面的步骤及配置是基于指定版本的实践，大多数程序大多数情况下在相差不大的版本时可以直接参考。（当然了，即使是非 Docker 方式安装程序也是一样道理）  
:::

## 拉取镜像

::: warning 笔者说
拉取镜像时需要明确镜像版本（Tag）。
:::

不指定版本（Tag）就拉取镜像，那拉取下来的镜像版本（Tag）默认是 `latest`（最新的）。`latest` 会跟随 Docker Registry 中的记录变化，现在拉取下来的 `latest` 是 x1 版本，但隔了一段时间后你在其他机器上再拉取 `latest` 可能就是 x2 版本了。

变化的版本，不利于生产环境部署的稳定。无论是后续在其他环境部署还是扩容集群等场景均要求根据架构要求指定好版本。

```shell
docker pull mysql:8.0.29
```

## 运行容器

::: warning 笔者说
**下方的配置，切记要根据个人实际情况来修改。**  
:::

- 容器的名称
- 镜像名称:版本
- 是否设置自启动？
- 环境变量配置
- 是否端口映射？
- 映射的话映射到宿主机哪个端口？
- 是否挂载卷？
- 挂载的话要挂载宿主机哪个目录？
- ......
- 等自定义配置

```shell
# MYSQL_ROOT_PASSWORD：root 用户密码
# MYSQL_DATABASE：初始化数据库
# MYSQL_USER：初始化普通用户
# MYSQL_PASSWORD：初始化普通用户密码
docker run -d \
--name mysql mysql:8.0.29 \
--restart=always \
-e TZ=Asia/Shanghai \
-e MYSQL_ROOT_PASSWORD=123456 \
-e MYSQL_DATABASE=test \
-e MYSQL_USER=test \
-e MYSQL_PASSWORD=123456 \
-p 3306:3306 \
-v /opt/disk/docker/volumes/mysql/conf:/etc/mysql/conf.d \
-v /opt/disk/docker/volumes/mysql/data:/var/lib/mysql \
-v /opt/disk/docker/volumes/mysql/logs:/logs \
# 使用该参数，容器内的 root 用户才拥有真正的 root 权限
--privileged=true
```

## 验证

服务器开放好相应端口或设置好安全组规则后，直接用 Navicat 连接即可。

## Docker Compose脚本

如果你是用的 docker-compose 来安装，下方附上相应 docker-compose.yml 脚本内容。

```yaml
version: '3'
services:
  mysql:
    container_name: mysql
    image: mysql:8.0.29
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: test
      MYSQL_USER: test
      MYSQL_PASSWORD: 123456
    ports:
      - 3306:3306
    volumes:
      - /opt/disk/docker/volumes/mysql/conf:/etc/mysql/conf.d
      - /opt/disk/docker/volumes/mysql/data:/var/lib/mysql
      - /opt/disk/docker/volumes/mysql/logs:/logs
    privileged: true
```

编写好 docker-compose.yml 脚本后，在脚本同级目录执行下方命令即可。

```shell
docker-compose up -d
```

## 附：安装MariaDB

### 运行容器

```shell
docker run -d \
--name mariadb mariadb \
--restart=always \
-e TZ=Asia/Shanghai \
-e MYSQL_ROOT_PASSWORD=123456 \
-e MYSQL_DATABASE=test \
-e MYSQL_USER=test \
-e MYSQL_PASSWORD=123456 \
-p 3306:3306 \
-v /opt/disk/docker/volumes/mysql/conf:/etc/mysql/conf.d \
-v /opt/disk/docker/volumes/mysql/data:/var/lib/mysql \
--privileged=true
```

### Docker Compose脚本

```yaml
version: '3'
services:
  mariadb:
    container_name: mariadb
    image: mariadb
    restart: always
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: test
      MYSQL_USER: test
      MYSQL_PASSWORD: 123456
    ports:
      - 3306:3306
    volumes:
      - /opt/disk/docker/volumes/mysql/conf:/etc/mysql/conf.d
      - /opt/disk/docker/volumes/mysql/data:/var/lib/mysql
    privileged: true
```

