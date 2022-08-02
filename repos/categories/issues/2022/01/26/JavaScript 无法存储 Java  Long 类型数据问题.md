---
title: JavaScript 无法存储 Java Long 类型数据问题
author: 查尔斯
date: 2022/01/26 09:07
categories:
 - Bug万象集
tags:
 - JavaScript
---

# JavaScript 无法存储 Java Long 类型数据问题

## 问题描述

今天在解决一个需求问题的时候，遇到了一个难得一见的 JS 问题。这个问题大概是和一些同学在开发环境使用 == 来比较包装类型的整数一样，由于比较的数值在缓存范围内，因缘际会的错过了 bug 的出现。

简单说一下问题经过，是这样的，笔者这个需求最终要求接口返回一组自定义结构的 k-v （不是单纯的键值对）数据，用于在前端表单中进行分类展示。

后端响应的数据结构类似如下：

```json {11,16,29,34}
{
    "code": 200, 
    "errorMsg": "", 
    "result": [
        {
            "extend": null, 
            "items": [
                {
                    "extend": null, 
                    "key": "CentOS 8.1 64位", 
                    "val": 8014753905961037835
                }, 
                {
                    "extend": null, 
                    "key": "CentOS 8.0 64位", 
                    "val": 8014753905961037838
                }, 
            ], 
            "key": "CentOS", 
            "pubProperty": "", 
            "val": 14
        }, 
        {
            "extend": null, 
            "items": [
                {
                    "extend": null, 
                    "key": "RedHat Enterprise Linux 8.0 64位", 
                    "val": 7979917486755315712
                }, 
                {
                    "extend": null, 
                    "key": "RedHat Enterprise Linux 7.7 64位", 
                    "val": 8014753905961037829
                }
            ], 
            "key": "Redhat", 
            "pubProperty": "", 
            "val": 5
        }
    ], 
    "success": true
}
```

在前端表单中的展示效果大概如下：

![202201260941889](../../../../../public/img/2022/01/26/202201260941889.png)

## 原因分析

笔者相信各位同学都应该猜得到，当提交表单的时候，前端肯定会把选中的镜像的 val 值传递给后端，然后由后端继续进行处理。

但是就在这个环节，由前端传给后端的 val 值竟然错了，例如：当选中了 CentOS 8.1 64 位这个镜像时，本该传递的 val 值为  8014753905961037835，实际传递的却是： 8014753905961038000。

后端接口测试的响应数据没问题，那问题显然就是出在前端了。

最终，配合前端开发定位这个问题的原因是因为： JavaScript 中无法存储 Java 中的 Long 类型数据，当位数超过 JavaScript 整数存储的范围，就会以0来代替了。

![202201260942561](../../../../../public/img/2022/01/26/202201260942561.png)

## 解决方案

JavaScript 存储不了就存储不了吧，咱们这个需求还得解决啊，最终的解决方法就是将后端响应回来的 Long 类型数据转换为字符串。

```java {2}
// 在序列化为 JSON 时将该字段转换为 String 类型
@JsonFormat(shape = JsonFormat.Shape.STRING)
private Long val;
```

后端响应的数据结构类似如下：

```json {11,16,29,34}
{
    "code": 200, 
    "errorMsg": "", 
    "result": [
        {
            "extend": null, 
            "items": [
                {
                    "extend": null, 
                    "key": "CentOS 8.1 64位", 
                    "val": "8014753905961037835"
                }, 
                {
                    "extend": null, 
                    "key": "CentOS 8.0 64位", 
                    "val": "8014753905961037838"
                }, 
            ], 
            "key": "CentOS", 
            "pubProperty": "", 
            "val": 14
        }, 
        {
            "extend": null, 
            "items": [
                {
                    "extend": null, 
                    "key": "RedHat Enterprise Linux 8.0 64位", 
                    "val": "7979917486755315712"
                }, 
                {
                    "extend": null, 
                    "key": "RedHat Enterprise Linux 7.7 64位", 
                    "val": "8014753905961037829"
                }
            ], 
            "key": "Redhat", 
            "pubProperty": "", 
            "val": 5
        }
    ], 
    "success": true
}
```