---
title: 个人常用SQL函数
author: 查尔斯
date: 2022/02/16 15:43
isTop: true
categories:
 - 杂碎逆袭史
tags:
 - SQL
 - SQL函数
---

# 个人常用SQL函数 <Badge text="持续更新" type="warning" />

## 时间函数

### 获取当前时间(MySQL)

```sql
# 输出格式为：yyyy-MM-dd HH:mm:ss
NOW();
```

### 获取当前时间秒(MySQL)

```sql
# 从 1970年1月1日 开始到现在的秒数
UNIX_TIMESTAMP();
```

### 计算两个时间之间的间隔(MySQL)

```sql
# unit 可选为FRAC_SECOND 毫秒、SECOND 秒、MINUTE 分钟、HOUR 小时、DAY 天、WEEK 星期、MONTH 月、QUARTER 季度、YEAR 年
TIMESTAMPDIFF(unit, datetime_expr1, datetime_expr2)
```

