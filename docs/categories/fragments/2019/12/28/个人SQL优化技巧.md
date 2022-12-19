---
title: 个人 SQL 优化技巧
author: 查尔斯
date: 2019/12/28 10:00
isTop: true
categories:
 - 杂碎逆袭史
tags:
 - SQL
 - SQL优化
---

# 个人 SQL 优化技巧 <Badge text="持续更新" type="warning" />

<!-- more -->

## 查询优化

### 如果确定结果只有一条，使用 LIMIT 1 <Badge text="建议" />

我们在根据一个或多个条件查询数据时，如果确定查询结果只有一条，可以在结尾处添加 LIMIT 1 进行限制。

这样既可以让 EXPLAIN 中的 type 达到 const 类型，又可以免去担忧在程序中出现接收是单个对象却返回了一个集合对象的异常问题。

::: code-group
```sql [正例]
# email 不是主键，也没有设置唯一约束，根据熵增定律，查询结果是有可能会出现多条的
SELECT * FROM `sys_user` WHERE `email` = 'charles7c@126.com' LIMIT 1;
```

```sql [反例]
# user_id 是主键，主键是非空唯一的，那么不需要添加 LIMIT 进行限制
SELECT * FROM `sys_user` WHERE `user_id` = 1;
```
:::

### 避免隐式类型转换 <Badge text="强制" type="danger" />

我们在使用 MySQL 时，或多或少都感受过 MySQL 的隐式类型转换。例如：user_id 是整数类型，但是依然可以使用字符串类型数据来进行判断。MySQL 帮你做完这种隐式类型转换是有代价的，什么代价呢？ **索引不再生效了而已** 。

::: code-group
```sql [正例]
SELECT * FROM `sys_user` WHERE `user_id` = 10;
```

```sql [反例]
SELECT * FROM `sys_user` WHERE `user_id` = '10';
```
:::

## 数据库表设计

### 列名带上前缀 <Badge text="建议" />

部分列名带上前缀或缩写，可以有效减少在连接查询、ORM 映射等场景下刻意起别名或思考区分不同的问题。

::: code-group
```sql [正例]
CREATE TABLE `sys_customer` (
  `customer_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '客户ID',
  `customer_name` varchar(255) NOT NULL COMMENT '客户名称',
  PRIMARY KEY (`customer_id`) USING BTREE,
) COMMENT = '客户表';

CREATE TABLE `sys_contact_user` (
  `contact_user_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '联系人ID',
  `contact_user_name` varchar(255) NOT NULL COMMENT '联系人名称',
  `customer_id` bigint(20) UNSIGNED NOT NULL COMMENT '客户ID',
  PRIMARY KEY (`contact_user_id`) USING BTREE,
) COMMENT = '联系人表';

# 连接查询，你完全不需要用脑去考虑到底是 c.`id` 还是 cu.`customer_id` 的问题，都是 `customer_id`
SELECT * FROM `sys_customer` c 
LEFT JOIN `sys_contact_user` cu ON c.`customer_id` = cu.`customer_id`
```
:::

### 非负数列添加UNSIGNED无符号约束 <Badge text="建议" />

在大部分的数据存储场景中，我们只会使用正整数，如果能确定该列为非负数，建议添加 `UNSIGNED` 无符号约束。

::: code-group
```sql [正例]
# 不添加 UNSIGNED 约束，取值范围
TINYINT：[-128, 127]
# 添加 UNSIGNED 约束，取值范围
TINYINT：[0, 255]
```
:::

### 合理采用整数类型 <Badge text="建议" />

例如：状态类的信息，状态再多能有多少个，采用 `TINYINT` 即可，减少存储空间占用。

下方表数据整理于：[MySQL 5.7官方文档/数据类型/数值数据类型/整数类型](https://dev.mysql.com/doc/refman/5.7/en/integer-types.html)

| 类型      | 存储（字节） | 取值范围                  | 取值范围（无符号） |
| :-------- | :----------- | :------------------------ | :----------------- |
| TINYINT   | 1            | [-128, 127]               | [0, 255]           |
| SMALLINT  | 2            | [-32768, 32767]           | [0, 65535]         |
| MEDIUMINT | 3            | [-8388608, 8388607]       | [0, 16777215]      |
| INT       | 4            | [-2147483648, 2147483647] | [0, 4294967295]    |
| BIGINT    | 8            | [-2^63^, 2^63^-1]         | [0, 2^64^-1]       |

### 布尔列采用bit类型 <Badge text="建议" />

例如：是否删除这种只有两种状态的信息，在表设计时建议对该列设置 `bit` 类型（0表示否/假/false，1表示是/真/true），在程序语言中可以采用 boolean 类型对应。

::: code-group
```sql [SQL]
`is_deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否已删除（0否 1是）'
```

```java [Java]
@Data
public class User {
    /**
     * 是否已删除（0否 1是）
     */
    private Boolean isDeleted;
}
```
:::

## 数据库设计

### 采用utf8mb4编码 <Badge text="建议" />

::: tip 如果要存储特殊字符（例如：emoij表情符），使用 utf8mb4 编码。
MySQL 5.5.3 后增加了一个新的编码： `utf8mb4` ，其中 mb4 是 most bytes 4 的意思，用于兼容四字节的 unicode。  

`utf8mb4` 是 utf8 的超集，除了将编码改为 `utf8mb4` 外不需要做其他转换。  

设计数据库时如果想要允许用户使用特殊符号，最好使用 `utf8mb4` 编码来存储，使得数据库有更好的兼容性，但是这样设计会导致耗费更多的存储空间。
:::



