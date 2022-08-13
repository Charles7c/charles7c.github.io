---
title: 一条SQL查询今年每月统计信息
author: 查尔斯
date: 2021/11/22 18:22
categories:
 - 方案春秋志
tags:
 - SQL
---

# 一条SQL查询今年每月统计信息

## 前言

**C：** 前不久，笔者介绍过一种统计近 N 天记录数的需求解决方案。今天，笔者再介绍一种也很常见的统计需求。

::: info 示例需求： 统计今年每月的注册用户数。
你可以基于这个示例需求，去完成各种类似的月统计需求。而且啊，笔者今天这个需求解决方案的重点是在 SQL 上，这类需求问题在 SQL 语句笔试上也挺常见，所以下回再见到类似的需求，你可以好好回想下本篇实现。
:::

## 涉及技术栈

- Spring Boot 2.3.1.RELEASE
- MyBatis Plus 3.1.0（使用了 MyBatis Plus 的代码生成器）
- MySQL 5.6

## Controller层

略

## Service层

略

## DAO层

::: warning 笔者说
记得要采用 LinkedHashMap，这样可以保证结果集的有序，即：1月、2月、......。
:::

```java
@Select({
    "SELECT",
    	"SUM(CASE MONTH(`create_time`) WHEN '1' THEN 1 ELSE 0 END) AS `1月`,",
    	"SUM(CASE MONTH(`create_time`) WHEN '2' THEN 1 ELSE 0 END) AS `2月`,",
    	"SUM(CASE MONTH(`create_time`) WHEN '3' THEN 1 ELSE 0 END) AS `3月`,",
    	"SUM(CASE MONTH(`create_time`) WHEN '4' THEN 1 ELSE 0 END) AS `4月`,",
    	"SUM(CASE MONTH(`create_time`) WHEN '5' THEN 1 ELSE 0 END) AS `5月`,",
    	"SUM(CASE MONTH(`create_time`) WHEN '6' THEN 1 ELSE 0 END) AS `6月`,",
    	"SUM(CASE MONTH(`create_time`) WHEN '7' THEN 1 ELSE 0 END) AS `7月`,",
    	"SUM(CASE MONTH(`create_time`) WHEN '8' THEN 1 ELSE 0 END) AS `8月`,",
    	"SUM(CASE MONTH(`create_time`) WHEN '9' THEN 1 ELSE 0 END) AS `9月`,",
    	"SUM(CASE MONTH(`create_time`) WHEN '10' THEN 1 ELSE 0 END) AS `10月`,",
    	"SUM(CASE MONTH(`create_time`) WHEN '11' THEN 1 ELSE 0 END) AS `11月`,",
   		"SUM(CASE MONTH(`create_time`) WHEN '12' THEN 1 ELSE 0 END) AS `12月`,",
    "FROM `t_user`",
    "WHERE YEAR(`create_time`)= YEAR(NOW())"
})
LinkedHashMap<String, Integer> countRegisterByMonth();
```

## SQL语句

::: tip 笔者说
这条 SQL 的思路就是将每条记录的 create_time（创建时间）求一下月份信息，求出的月份如果是对应的月份，那么就记为 1，否则记为 0，这样每月最后再做个 SUM 求和，就可以快速得到对应月份的记录数量了，不用 COUNT 依然可以计数。  

SQL语句单独放在下面，方便各位同学复制。:smile: 
:::

```sql
# 统计今年每月的注册用户数
SELECT
	SUM(CASE MONTH(`create_time`) WHEN '1' THEN 1 ELSE 0 END) AS `1月`,
	SUM(CASE MONTH(`create_time`) WHEN '2' THEN 1 ELSE 0 END) AS `2月`,
	SUM(CASE MONTH(`create_time`) WHEN '3' THEN 1 ELSE 0 END) AS `3月`,
	SUM(CASE MONTH(`create_time`) WHEN '4' THEN 1 ELSE 0 END) AS `4月`,
	SUM(CASE MONTH(`create_time`) WHEN '5' THEN 1 ELSE 0 END) AS `5月`,
	SUM(CASE MONTH(`create_time`) WHEN '6' THEN 1 ELSE 0 END) AS `6月`,
	SUM(CASE MONTH(`create_time`) WHEN '7' THEN 1 ELSE 0 END) AS `7月`,
	SUM(CASE MONTH(`create_time`) WHEN '8' THEN 1 ELSE 0 END) AS `8月`,
	SUM(CASE MONTH(`create_time`) WHEN '9' THEN 1 ELSE 0 END) AS `9月`,
	SUM(CASE MONTH(`create_time`) WHEN '10' THEN 1 ELSE 0 END) AS `10月`,
	SUM(CASE MONTH(`create_time`) WHEN '11' THEN 1 ELSE 0 END) AS `11月`,
	SUM(CASE MONTH(`create_time`) WHEN '12' THEN 1 ELSE 0 END) AS `12月` 
FROM `t_user` # 根据自身需要确定实际业务表
WHERE YEAR(`create_time`)= YEAR(NOW());
```
