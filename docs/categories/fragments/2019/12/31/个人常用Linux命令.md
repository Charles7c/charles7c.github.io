---
title: 个人常用Linux命令
author: 查尔斯
date: 2019/12/31 21:00
isTop: true
categories:
 - 杂碎逆袭史
tags:
 - Linux
---

# 个人常用Linux命令

<!-- more -->

## 系统相关

### 查询系统详情

```sh
# 详细输出所有信息，依次为内核名称，主机名，内核版本号，内核版本，硬件名，处理器类型，硬件平台类型，操作系统名称
uname -a
```

![201912312031666](../../../../../public/img/2019/12/31/201912312031666.png)

### 查询系统发行版本

```sh
# 只适合Redhat系的Linux
cat /etc/redhat-release
```

![201912312031777](../../../../../public/img/2019/12/31/201912312031777.png)

### 查看CPU信息

```sh
# 逻辑CPU数量和CPU型号
cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c
```

![201912312031888](../../../../../public/img/2019/12/31/201912312031888.png)

```sh
# CPU真实数量（有时候虽然逻辑CPU是8核，但可能是由两颗4核CPU构成的）
cat /proc/cpuinfo | grep physical | uniq -c
```

![201912312031999](../../../../../public/img/2019/12/31/201912312031999.png)

### 查询RAM信息(内存)

```sh
# 用于查看有关系统 RAM 使用情况的信息（带大小单位）
free -h
```

![201912312032666](../../../../../public/img/2019/12/31/201912312032666.png)

### 查询ROM信息(磁盘)

```sh
# 以磁盘分区为单位查看文件系统，可以获取硬盘被占用了多少空间，目前还剩下多少空间等信息
df -h
```

![201912312032777](../../../../../public/img/2019/12/31/201912312032777.png)

### 查询环境变量

```sh
env
# 过滤环境变量中的配置
env | grep xxx
```

## 防火墙相关

::: tip 已测试适用系统
CentOS 7.5
:::

### 查看防火墙状态

```sh
systemctl status firewalld
```

### 开启防火墙

```sh
systemctl start firewalld
```

### 关闭防火墙

```sh
systemctl stop firewalld
```

### 查看开放的端口列表

```sh
firewall-cmd --zone=public --list-ports
```

### 查看防火墙某个端口是否开放

```sh
firewall-cmd --query-port=端口号/tcp
```

### 开放端口

```sh
# 开放某个端口
firewall-cmd --zone=public --add-port=端口号/tcp --permanent
# 开放指定端口范围
firewall-cmd --zone=public --add-port=端口号起-端口号止/tcp --permanent
```

### 关闭端口

```sh
firewall-cmd --zone=public --remove-port=端口号/tcp --permanent
```

### 重启防火墙（防火墙配置立即生效）

```sh
firewall-cmd --reload
```