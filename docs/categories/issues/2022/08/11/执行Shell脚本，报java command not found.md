---
title: "执行Shell脚本，报java: command not found"
author: 查尔斯
date: 2022/08/11 20:19
categories:
 - Bug万象集
tags:
 - Linux
 - Shell
---

# 执行Shell脚本，报java: command not found

## 问题描述

**C：** 今天笔者在公司的 dev 环境服务器上，将一个 Java 程序启动脚本做成了一个系统服务。本来是一件很简单的事情，但是在启动服务时，却报错了。

报的错误也是言简意赅：java: command not found。很直白的告诉了你，它找不到 java 命令。

![202208112010100](../../../../../public/img/2022/08/11/202208112010100.png)

## 原因分析

既然是找不到 java 命令，首先要排查的自然是服务器里究竟有没有安装和配置好 Java 环境了，用 `java -version` 命令检测一下就可以了。

```shell
[root@business11 ~]# java -version
java version "1.8.0_202"
Java(TM) SE Runtime Environment (build 1.8.0_202-b08)
Java HotSpot(TM) 64-Bit Server VM (build 25.202-b08, mixed mode)
```

Java 环境是配置好的，那还得是看脚本自身的问题了。其实，这个问题以前印象里也出现过，不过是很久以前初次使用 Shell 脚本的时候了，最终的问题点是因为直接写的脚本内容，没有添加 `#!/bin/bash` 声明导致的。

打开脚本内容看了看，这个声明也加着呢。

```shell
#!/bin/bash

Java 启动脚本内容······
```

## 解决方案1

既然以往的经验不能提供帮助，那就对症下药，提示说找不到 java 命令，那说明它识别不到 Java 环境配置，帮它一把就得了呗。复制一份 Java 环境配置，放在脚本内容前，相当于每次执行这个脚本的时候，先做一次临时环境配置。

::: warning 笔者说
如果你要使用下方的配置，不要直接复制了事，记得将配置中的 JDK 安装路径，替换为你自己实际的 JDK 安装路径。
:::

```shell
#!/bin/bash
JAVA_HOME=/opt/disk/java/jdk1.8.0_202 # 如果你要使用，记得替换为你自己实际的 JDK 安装路径
CLASSPATH=.:$JAVA_HOME/lib.tools.jar
PATH=$JAVA_HOME/bin:$PATH
export JAVA_HOME CLASSPATH PATH

Java 启动脚本内容······
```

## 解决方案2

这个问题的根源，其实是因为 `/etc/profile` 或者 `/etc/security/limit.d` 这些文件中配置的环境变量仅对通过 pam 登录的用户生效，systemd 系统服务是不读这些配置的，所以这就造成登录到终端时查看环境变量和手动启动应用都一切正常，但是系统服务无法正常启动应用。

所以，如果想让 systemd 系统服务使用环境变量也可以在编写的服务内指定好环境变量。

```shell
[Unit]
Description=xxx
Wants=network-online.target
After=network-online.target

[Service]
# 如果你要使用，记得替换为你自己实际的 JDK 安装路径
Environment="JAVA_HOME=/opt/disk/java/jdk1.8.0_202"
Environment="CLASSPATH=.:$JAVA_HOME/lib.tools.jar"
Environment="PATH=$JAVA_HOME/bin:$PATH"
ExecStart=/bin/bash /opt/disk/xxx/start-schedule.sh
KillSignal=SIGTERM

[Install]
WantedBy=multi-user.target
```

修改完系统服务，别忘了重新加载和重新启动。

```shell
systemctl daemon-reload
systemctl restart xxx
```

