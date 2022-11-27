---
title: CentOS 安装 Docker、Docker Compose
author: 查尔斯
date: 2022/10/31 20:56
categories:
 - 杂碎逆袭史
tags:
 - Docker
 - Linux
 - CentOS
---

# CentOS 安装 Docker、Docker Compose

::: tip 笔者说
笔者下面的步骤及配置是基于发帖时间当下的实践，大多数程序大多数情况下在相差不大的版本时可以直接参考。
:::

## Docker 安装

### 方式一

1. 软件更新

   ```shell
   yum -y update
   ```

2. 安装 yum-utils

   ```shell
   yum -y install yum-utils device-mapper-persistent-data lvm2
   ```

3. 设置 yum 软件源

   ```shell
   yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
   ```

4. 安装 docker-ce（免费社区版）

   ```shell
   yum -y install docker-ce
   ```

5. 启动 docker

   ```shell
   systemctl start docker
   ```

6. 设置 docker 开机自启

   ```shell
   systemctl enable docker
   ```

7. 检验是否安装成功

   ```shell
   docker -v
   ```

### 方式二（推荐）

一条命令安装 docker。

1. 下载并安装 docker
2. 启动并设置 docker 开机自启

```shell
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun && systemctl start docker && systemctl enable docker
```

## Docker 配置

在 Windows 系统中安装软件时，我们都清楚要尽量不安装在 C 盘，数据存储也尽量迁移到其他空间更大的盘。不然随着程序的使用，数据越来越多，再加上大多数情况下 C 盘空间并不大，最终导致 C 盘很快会被占满。   

同理，不更改 docker 的数据存储目录，那它的镜像、容器等存储占用随着使用时间的增长而增长，那你的服务器系统盘很快就会被占满了。所以建议你将 docker 的数据存储目录改到你服务器的数据盘挂载目录。    

更改 docker 数据存储目录这一点是笔者推荐的，而设置 docker 镜像加速这一点其实根本无需笔者多言，你先不配置，用用 docker 再说，如果你 `docker pull` 速度很快，那完全不需要配置。这三个镜像加速源是笔者验证过的，当你感受到拉镜像的 “绝望” 时，不妨再来配置试一试。

::: tip 笔者说
关于镜像加速地址，你还可以从阿里云找到你专属的镜像加速地址。  

按下面的路径就可以找到：  

产品与服务 -> 容器与中间件 -> 容器服务 -> 容器镜像服务 -> 镜像加速器
:::

![202210312020985](../../../../../public/img/2022/10/31/202210312020985.png)

闲话不多说，配置只需要 3~5 步即可搞定。

1. 编辑 daemon.json 配置文件

   ```shell
   # 如果 /etc 下没有 docker 目录，可以先创建一下
   # mkdir -p /etc/docker
   
   vim /etc/docker/daemon.json
   ```

2. 将下方配置内容写入 daemon.json 配置文件

   ```json
   {
     "data-root": "/opt/disk/docker",
     "registry-mirrors": [
       "https://hub-mirror.c.163.com",
       "https://mirror.baidubce.com",
       "https://ustc-edu-cn.mirror.aliyuncs.com"
     ]
   }
   ```

3. 重新加载服务配置文件并重启 docker 服务

   ```shell
   # 重新加载服务配置文件
   systemctl daemon-reload
   # 重启 docker
   systemctl restart docker
   ```

## Docker Compose 安装

1. 下载 docker-compose 脚本，并改名为 docker-compose

   ```shell
   curl -L https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
   ```

2. 给脚本授予可执行权限

   ```shell
   chmod +x /usr/local/bin/docker-compose
   ```

3. 检验是否安装成功

   ```shell
   docker-compose -v
   ```

## 参考资料

1. Custom Docker daemon options#Runtime directory and storage driver：https://docs.docker.com/config/daemon/systemd/#runtime-directory-and-storage-driver
