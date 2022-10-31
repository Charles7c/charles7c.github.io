---
title: Docker 设置网络代理
author: 查尔斯
date: 2022/10/29 19:50
categories:
 - Bug万象集
tags:
 - Docker
 - Linux
 - CentOS
 - 网络代理
---

# Docker 设置网络代理

## 问题描述

**C：** 今天笔者在公司的一台内网服务器上，打算用 docker-compose 拉起一套开发环境。结果刚回车完命令就报错了。

```shell
docker-compose up -d
```

![202210291930211](../../../../../public/img/2022/10/29/202210291930211.png)

```
Error response from daemon: Get "https://registry-1.docker.io/v2/": x509: certificate signed by unknown authority
```

然后笔者又试了试 `docker pull`、`docker search` 这些命令，也都报这个错误。

## 原因分析

从报错提示上来看的话，笔者有两个怀疑的可能性：

1. SSL 证书的问题
2. 网络问题

第 1 个怀疑主要是因为后面的提示部分：certificate signed by unknown authority，而且简单去搜了一下，确实有一些解决方案是冲着这个点解决的。

第 2 个怀疑主要是因为前面的提示部分：Error response from daemon，前文已经提过了，这是一台内网机器，内网机器这个身份基本可以表明它本身是没有网络的，能上网也是因为设置了网络代理的原因。而且，笔者之前也记录过一个问题，那个问题产生的原因就是系统服务不会识别 `/etc/profile` 中设置的环境变量，docker 也是一种系统服务，所以这让笔者更倾向于是这种可能。

## 解决方案

既然有过类似的经验，那肯定就按之前的经验先操作一下试试。

::: tip 笔者说
摊牌吧，两种可能，笔者都搜了。但笔者太懒了，看了看第 1 种可能的解决方案步骤，实在懒得去操作试试。所以又去简单搜了一下 Docker 网络代理的设置，意外发现它的解决方案和笔者刚才提到记录过的问题解决方案一样，这也让笔者确定了问题的原因。
:::

首先，停止 docker 服务。

```shell
systemctl stop docker
```

然后，创建 docker 服务目录，并创建 HTTP 代理配置文件。

```shell
mkdir -p /etc/systemd/system/docker.service.d

vi /etc/systemd/system/docker.service.d/http-proxy.conf
```

将下方配置贴到 HTTP 代理配置文件中，是的没错，就是添加了两个环境变量，这两个环境变量在 `/etc/profile` 中也设置过，详情见之前笔者记录过的一篇设置网络代理的文章。

```shell
[Service]
Environment="HTTP_PROXY=http://用户名:密码@你的代理服务器地址:你的代理服务器端口号"
Environment="HTTPS_PROXY=http://用户名:密码@你的代理服务器地址:你的代理服务器端口号"
```

最后，重新加载服务配置，重启服务。

```shell
systemctl daemon-reload
systemctl restart docker
```

OK，再执行 docker 命令就没问题了。

## 参考资料

1. Control Docker with systemd#Custom Docker daemon options 之 HTTP/HTTPS proxy：https://docs.docker.com/config/daemon/systemd/#httphttps-proxy

::: tip 笔者说
这里提一下，官方文档真的很香。
:::
