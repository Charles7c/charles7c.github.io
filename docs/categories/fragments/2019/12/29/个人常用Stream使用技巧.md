---
title: 个人常用 Stream 使用技巧
author: 查尔斯
date: 2019/12/29 15:00
isTop: true
categories:
 - 杂碎逆袭史
tags:
 - Java
 - Stream
 - Lambda
---

# 个人常用 Stream 使用技巧 <Badge text="持续更新" type="warning" />

<!-- more -->

## 映射并以指定分隔符进行拼接

::: details 需求：将角色中的角色名称取出来，并以“,”号分隔的形式将所有角色名称拼接成一个字符串。
实现方案：通过 `map()` 可以只保留角色名称信息, 通过 `Collectors.joining()` 可以将角色名称以指定分隔符拼接起来。
:::

```java
// 1、准备一些实验数据, 代码不会像注释一样骗人, 所以就不单独对角色类中的字段解释了
List<Role> roleList = new ArrayList<>(3);
roleList.add(new Role(1, "超级管理员"));
roleList.add(new Role(2, "管理员"));
roleList.add(new Role(3, "普通用户"));

// 2、通过 map() 可以只保留角色名称, 通过 Collectors.joining() 可以将角色名称以指定分隔符拼接起来
String result = roleList.stream()
    .map(Role::getName)
    .collect(Collectors.joining(","));

// 3、输出结果
// 超级管理员,管理员,普通用户
System.out.println(result);
```



