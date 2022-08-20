---
title: 个人SQL优化技巧
author: 查尔斯
date: 2019/12/28 10:00
isTop: true
categories:
 - 杂碎逆袭史
tags:
 - SQL
 - SQL优化
---

# 个人SQL优化技巧

<!-- more -->

## 如果确定结果只有一条，使用 LIMIT 1

我们在根据一个或多个条件查询数据时，如果确定查询结果只有一条，可以在结尾处添加 LIMIT 1 进行限制。

这样既可以让 EXPLAIN 中的 type 达到 const 类型，又可以免去担忧在程序中出现接收是单个对象却返回了一个集合对象的异常问题。

例如：

```sql
# id 是主键，主键是非空唯一的，那么不需要添加 LIMIT 进行限制
SELECT * FROM `user` WHERE `id` = 1;
```

```sql
# email 不是主键，也没有设置唯一约束，根据熵增定律，查询结果是有可能会出现多条的
SELECT * FROM `user` WHERE `email` = 'charles7c@126.com' LIMIT 1;
```

## 避免隐式类型转换

我们在使用 MySQL 时，或多或少都感受过 MySQL 的隐式类型转换。

例如：

```sql
# age 是整数类型，但是依然可以使用字符串类型数据来进行赋值
UPDATE `user` SET `age` = '12' WHERE `id ` = 10;
# id 是整数类型，但是依然可以使用字符串类型数据来进行判断
SELECT * FROM WHERE `id` = '10';
```

但是，MySQL 帮你做完这种隐式类型转换是有代价的，什么代价呢？ **索引不再生效了而已** 。