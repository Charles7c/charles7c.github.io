---
title: 个人常用 SQL 函数
author: 查尔斯
date: 2022/02/16 15:43
isTop: true
categories:
 - 杂碎逆袭史
tags:
 - SQL
 - SQL函数
---

# 个人常用 SQL 函数 <Badge text="持续更新" type="warning" />

## 时间函数

### 获取当前时间（MySQL）

```sql
# 输出格式为：yyyy-MM-dd HH:mm:ss
NOW();
```

### 获取当前时间秒（MySQL）

```sql
# 从 1970年1月1日 开始到现在的秒数
UNIX_TIMESTAMP();
```

### 计算两个时间之间的间隔（MySQL）

```sql
# unit 可选为FRAC_SECOND 毫秒、SECOND 秒、MINUTE 分钟、HOUR 小时、DAY 天、WEEK 星期、MONTH 月、QUARTER 季度、YEAR 年
TIMESTAMPDIFF(unit, datetime_expr1, datetime_expr2)
```

## 字符串函数

### 拼接字符串（MySQL）

```sql
# 将多个字符串拼接在一起
CONCAT(str1, str2, ...)
```

::: tip 笔者说
这个函数看起来平平无奇，但实际用起来，可不只是真香。你可能会在 MyBatis 中解决 SQL 注入的时候用到它，还可能在一些 “奇怪” 的场景用到它。
:::

#### 清空数据库中的所有表数据

清空单表数据很简单。

```sql
TRUNCATE TABLE 表名;
```

但是，如果现在有 100 + 张表？你当然不会一个一个的去 `TRUNCATE`，但 MySQL 又没有提供该功能。那你可以用用下面的方法。

1. 查询该数据库下的所有表，利用 `CONCAT()` 函数将 `TRUNCATE` 语句拼接起来

   ```shell
   SELECT
     CONCAT('TRUNCATE TABLE ', TABLE_NAME, ';')
   FROM 
     information_schema.TABLES
   WHERE TABLE_SCHEMA = '数据库名';
   ```

2. 将执行结果复制，直接执行即可

#### 删除数据库中的所有表

删除单表很简单。

```sql
DROP TABLE 表名;
```

但是，如果现在有 100 + 张表？你当然不会一个一个的去 `DROP`，但 MySQL 又没有提供该功能。那你可以用用下面的方法。

1. 查询该数据库下的所有表，利用 `CONCAT()` 函数将 `DROP` 语句拼接起来

   ```shell
   SELECT
     CONCAT('DROP TABLE IF EXISTS ', TABLE_NAME, ';')
   FROM 
     information_schema.TABLES
   WHERE TABLE_SCHEMA = '数据库名';
   ```

2. 将执行结果复制，直接执行即可
