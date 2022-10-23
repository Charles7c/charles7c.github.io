---
title: CentOS 8.2 安装 JDK 1.8.0_202
author: 查尔斯
date: 2022/10/23 11:29
categories:
 - Java基础快速入门
tags:
 - Java
 - JDK
 - Linux
 - CentOS
showComment: false
---

# CentOS 8.2 安装 JDK 1.8.0_202

## 检查系统是否自带JDK

::: warning 笔者说
检查系统中是否已经安装了 JDK ，安装的基本是 OpenJDK，如果已经安装了，那就提前卸载掉它。
:::

```shell
rpm -qa | grep jdk
# 如果上方命令查询出了内容，就把查出的软件卸载掉
rpm -e --nodeps 软件名
```

## 下载并上传安装包

可前往 [官网](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html) 下载 JDK Linux 安装包然后上传到服务器。

![202210231130566](../../../public/img/2022/10/23/202210231130566.png)

也可以直接在服务器内下载。

```shell
wget https://repo.huaweicloud.com/java/jdk/8u202-b08/jdk-8u202-linux-x64.tar.gz
```

## 解压安装包

::: warning 笔者说
除去一些固定的东西，一定要记得根据你实际的情况调整好目录位置或命名。
:::

```shell
# 解压安装包到指定目录（如指定目录不存在则需要先提前用 mkdir 创建）
# 下方 /opt/disk 是服务器的一块数据盘挂载目录
mkdir -p /opt/disk/java

tar -zxvf jdk-8u202-linux-x64.tar.gz -C /opt/disk/java
```

切换到 `/opt/disk/java/jdk1.8.0_202` 目录下。

```shell
cd /opt/disk/java/jdk1.8.0_202
```

里面就是我们熟悉的 JDK 那些内容。

```
bin
include
jre
LICENSE
README.html
src.zip
THIRDPARTYLICENSEREADME.txt
COPYRIGHT
javafx-src.zip
lib
man
release
THIRDPARTYLICENSEREADME-JAVAFX.txt
```

## 设置环境变量

::: tip 笔者说
还差最后一步，配置环境变量 JAVA_HOME。不配好它，很多 Java 写的程序可就没法直接使用了。而且你配好了环境变量，我们也可以方便的在任何目录下使用 Java 的命令。
:::

```shell
# 1、打开 profile 文件
vim /etc/profile

# 2、在其中插入环境变量配置
JAVA_HOME=/opt/disk/java/jdk1.8.0_202
CLASSPATH=.:$JAVA_HOME/lib.tools.jar
PATH=$JAVA_HOME/bin:$PATH
export JAVA_HOME CLASSPATH PATH

# 3、重新加载 profile 文件，使最新配置生效
source /etc/profile
```

## 检验是否安装成功

执行查看 Java 版本命令。

```shell
java -version
```

如果能看到下方这么一串版本信息输出，那就道上一声恭喜。

```shell
java version "1.8.0_202"
Java(TM) SE Runtime Environment (build 1.8.0_202-b08)
Java HotSpot(TM) 64-Bit Server VM (build 25.202-b08, mixed mode)
```
