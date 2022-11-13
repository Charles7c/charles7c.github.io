---
title: 解决 Docker 安装 Prometheus 启动报 permission denied 的问题
author: 查尔斯
date: 2022/11/04 20:30
categories:
 - Bug万象集
tags:
 - Prometheus
 - Docker
 - Linux
---

# 解决 Docker 安装 Prometheus 启动报 permission denied 的问题

## 问题描述

**C：** 今天，笔者在使用 Docker 安装了 Prometheus 后，发现其容器没有能正常启动，而是处于持续重启的状态。笔者手动尝试了几次重启容器命令，依然如此。

遇到这种情况，单纯去盯容器运行命令哪里有错误，排查和修复就慢了，不如先看看 Prometheus 容器的日志。

```shell
# docker logs 容器ID/容器名称
docker logs prometheus
```

在容器日志中，笔者看到了几段重复性的日志内容，很显然这是几次重启容器出现的重复性日志，笔者从中截取了一段相对完整的日志内容。

![202211042020211](../../../../../public/img/2022/11/04/202211042020211.png)

错误信息部分也很突出，level=error。

```shell
caller=query_logger.go:90 level=error component=activeQueryTracker msg="Error opening quer log file" file=/opt/bitnami/prometheus/data/queries.active err="open data/queries.active: permission denied"
panic: Unable to create mmap-ed active query log
```

<!-- more -->

## 原因分析

简单翻译一下错误信息 msg 及后面部分提示。

> 信息：打开查询日志文件时出错 file=/opt/bitnami/prometheus/data/queries.active 错误：打开 data/queries.active：拒绝访问

其中的关键信息是 `permission denied`（拒绝访问），从这字面意思上可以得知和权限有关。

为了方便大家进行原因分析，笔者把 docker-compose 的 Prometheus 部分脚本贴在下方。

```yaml
version: '3'
services:
  prometheus:
    container_name: prometheus
    image: bitnami/prometheus:2.38.0
    restart: always
    environment:
      TZ: Asia/Shanghai
    ports:
      - 19090:9090
    volumes:
      - /opt/disk/docker/volumes/prometheus/conf:/opt/bitnami/prometheus/conf
      - /opt/disk/docker/volumes/prometheus/data:/opt/bitnami/prometheus/data
    command:
      --config.file=/opt/bitnami/prometheus/conf/prometheus.yml
      --web.enable-lifecycle
      --storage.tsdb.retention.time=90d
    privileged: true
```

很明显，错误信息中的文件路径 `/opt/bitnami/prometheus/data/queries.active`，是 Prometheus 容器中的数据存储目录，笔者还将其挂载到了宿主机的 `/opt/disk/docker/volumes/prometheus/data` 目录。

关于脚本中的两个挂载目录，笔者仅提前创建了 conf 配置目录，上传了配置文件。至于这个 data 数据目录则是 Docker 在运行容器时自动在宿主机创建的。

那问题的原因已经呼之欲出了，很大可能是由于 Docker 在宿主机自动创建的 data 数据挂载目录没有写入权限。

## 解决方案

解决起来也较为容易，给 data 目录授予写入权限就好了。

```shell
chmod 775 /opt/disk/docker/volumes/prometheus/data
```

最后再重启一下 Prometheus 容器。

```shell
docker restart prometheus
```

此时，再通过 `docker ps` 命令查看 Prometheus 容器的状态，已经是正常的 Up 状态了。最后，笔者也是建议大家这类挂载目录尽量提前创建和授权。
