---
title: 个人常用Hutool工具类
author: 查尔斯
date: 2019/12/30 19:00
isTop: true
categories:
 - 杂碎逆袭史
tags:
 - Java
 - Java工具类
 - Hutool
---

# 个人常用Hutool工具类 <Badge text="持续更新" type="warning" />

## 前言

**C：** 技术圈常说一句：“你要会写轮子，也要会用轮子”。工作的时候，为了提升开发效率，节约开发时间，也常常提醒自己不要重复造 “轮子”。

每次开启一个新项目，除了搭建项目必备环境之外，必然要整理一下之前项目沉淀下来的工具类，然后 C V 大法。习惯了一些工具类后，新项目中用不了或是换一下总是感觉缺点什么，再加上每个人都有自己遇到或沉淀的工具类，项目中遇到工具类重复也是很常见的事儿。

话说回来，这些工具类就是开发中必不可少的一种 “轮子”。对于大多数同学，受限于技术，轮子可能勉强写的出来，但是写的是不是够好，够完善，这质量就没法保证了。

谁都是从一开始过来的，但好在有这么一些有志之士，将经年累月写过的轮子反复整理，反复打磨，推出了一个项目，它就是 Hutool。

接下来，笔者就带大家学习一些个人常用的 Hutool 工具类。

<!-- more -->

## 判断相等

### Java官方

判断两个内容相等很常见了吧？

Java 7 的时候，官方还在 java.util 包下给提供了一个 Objects 工具类，源代码如下：

```java
/**
 * Returns {@code true} if the arguments are equal to each other
 * and {@code false} otherwise.
 * Consequently, if both arguments are {@code null}, {@code true}
 * is returned and if exactly one argument is {@code null}, {@code
 * false} is returned.  Otherwise, equality is determined by using
 * the {@link Object#equals equals} method of the first
 * argument.
 *
 * @param a an object
 * @param b an object to be compared with {@code a} for equality
 * @return {@code true} if the arguments are equal to each other
 * and {@code false} otherwise
 * @see Object#equals(Object)
 */
public static boolean equals(Object a, Object b) {
    return (a == b) || (a != null && a.equals(b));
}
```

这的确可以解决 80% 的判断相等问题了，也可以有效避免 NPE 问题。但是笔者比较贪心，所以一直使用的 Hutool 提供的 ObjectUtil 工具类来判断相等。

### ObjectUtil

在 Java 中，判断不同内容是否相等有多种情况，这在《阿里巴巴Java开发手册》中也有强调，笔者用 ObjectUtil 分别示范下不同情况的使用方法。

> 【强制】所有整型包装类对象之间值的比较，全部使用 equals 方法比较。 说明：对于 Integer var = ? 在-128 至 127 之间的赋值，Integer 对象是在 IntegerCache.cache 产生， 会复用已有对象，这个区间内的 Integer 值可以直接使用==进行判断，但是这个区间之外的所有数据，都 会在堆上产生，并不会复用已有对象，这是一个大坑，推荐使用 equals 方法进行判断。 

```java
System.out.println(ObjectUtil.equal(null, null)); // true
System.out.println(ObjectUtil.equal(null, 0)); // false
System.out.println(ObjectUtil.equal(0, 0)); // true
System.out.println(ObjectUtil.equal(0, 0L)); // false
System.out.println(ObjectUtil.equal(0L, 0L)); // true
System.out.println(ObjectUtil.equal(1L, 1L)); // true
System.out.println(ObjectUtil.notEqual(1L, 1L)); // false
```

**ObjectUtil 的 equal() 源代码，如下：** 

```java
/**
 * 比较两个对象是否相等。<br>
 * 相同的条件有两个，满足其一即可：<br>
 * <ol>
 * <li>obj1 == null && obj2 == null</li>
 * <li>obj1.equals(obj2)</li>
 * <li>如果是BigDecimal比较，0 == obj1.compareTo(obj2)</li>
 * </ol>
 *
 * @param obj1 对象1
 * @param obj2 对象2
 * @return 是否相等
 * @see Objects#equals(Object, Object)
 */
public static boolean equal(Object obj1, Object obj2) {
    // 判断是否为 BigDecimal 类型，如果是用 compareTo 比较
    if (obj1 instanceof BigDecimal && obj2 instanceof BigDecimal) {
        return NumberUtil.equals((BigDecimal) obj1, (BigDecimal) obj2);
    }
    // 否则使用 Java 官方提供的 Objects 工具类比较
    return Objects.equals(obj1, obj2);
}

/**
 * 比较两个对象是否不相等。<br>
 *
 * @param obj1 对象1
 * @param obj2 对象2
 * @return 是否不等
 * @since 3.0.7
 */
public static boolean notEqual(Object obj1, Object obj2) {
    return false == equal(obj1, obj2);
}
```

要是觉得 equal 这个单词不喜欢，你还可以用它的别名方法：（作者们考虑的是有点周到了）

```java
/**
 * 比较两个对象是否相等，此方法是 {@link #equal(Object, Object)}的别名方法。<br>
 * 相同的条件有两个，满足其一即可：<br>
 * <ol>
 * <li>obj1 == null && obj2 == null</li>
 * <li>obj1.equals(obj2)</li>
 * <li>如果是BigDecimal比较，0 == obj1.compareTo(obj2)</li>
 * </ol>
 *
 * @param obj1 对象1
 * @param obj2 对象2
 * @return 是否相等
 * @see #equal(Object, Object)
 * @since 5.4.3
 */
public static boolean equals(Object obj1, Object obj2) {
    return equal(obj1, obj2);
}
```
> 【强制】BigDecimal 的等值比较应使用 compareTo()方法，而不是 equals()方法。 说明：equals()方法会比较值和精度（1.0 与 1.00 返回结果为 false），而 compareTo() 则会忽略精度。
>
> 说明：equals()方法会比较值和精度（1.0 与 1.00 返回结果为 false），而 compareTo()则会忽略精度。

诚然，从上方源代码中我们可以清楚地看到 ObjectUtil 比较的时候还区分了 BigDecimal 类型，这也轻松的解决了此强制问题。

**在 ObjectUtil 比较 BigDecimal 类型相等时用到的 NumberUtil 中的 equals() 源代码，如下：** 

```java
/**
 * 比较大小，值相等 返回true<br>
 * 此方法通过调用{@link BigDecimal#compareTo(BigDecimal)}方法来判断是否相等<br>
 * 此方法判断值相等时忽略精度的，即0.00 == 0
 *
 * @param bigNum1 数字1
 * @param bigNum2 数字2
 * @return 是否相等
 */
public static boolean equals(BigDecimal bigNum1, BigDecimal bigNum2) {
    if (bigNum1 == bigNum2) {
        // 如果用户传入同一对象，省略compareTo以提高性能。
        return true;
    }
    if (bigNum1 == null || bigNum2 == null) {
        return false;
    }
    return 0 == bigNum1.compareTo(bigNum2);
}
```
### NumberUtil

> 【强制】浮点数之间的等值判断，基本数据类型不能用==来比较，包装数据类型不能用 equals 来判断。
>
> 说明：浮点数采用“尾数+阶码”的编码方式，类似于科学计数法的“有效数字+指数”的表示方式。二进 制无法精确表示大部分的十进制小数。
>
> 解决方法：
>
> 1. 指定一个误差范围，两个浮点数的差值在此范围之内，则认为是相等的。
> 2. 使用 BigDecimal 来定义值，再进行浮点数的运算操作。

浮点数比较的时候依然可以使用 ObjectUtil，但是也可以直接采用 NumberUtil：

```java
System.out.println(NumberUtil.equals(0.1, 0.1)); // true
System.out.println(ObjectUtil.equal(BigDecimal.valueOf(0.1), BigDecimal.valueOf(0.1))); // true
```

**上方用到的 NumberUtil 的 equals() 源代码，如下：** 

```java
/**
 * 比较大小，值相等 返回true<br>
 * 此方法通过调用{@link Double#doubleToLongBits(double)}方法来判断是否相等<br>
 * 此方法判断值相等时忽略精度的，即0.00 == 0
 *
 * @param num1 数字1
 * @param num2 数字2
 * @return 是否相等
 * @since 5.4.2
 */
public static boolean equals(double num1, double num2) {
    return Double.doubleToLongBits(num1) == Double.doubleToLongBits(num2);
}

/**
 * 比较大小，值相等 返回true<br>
 * 此方法通过调用{@link Float#floatToIntBits(float)}方法来判断是否相等<br>
 * 此方法判断值相等时忽略精度的，即0.00 == 0
 *
 * @param num1 数字1
 * @param num2 数字2
 * @return 是否相等
 * @since 5.4.5
 */
public static boolean equals(float num1, float num2) {
    return Float.floatToIntBits(num1) == Float.floatToIntBits(num2);
}
```

## 后记

**C：** 我个人对 Hutool 还是非常认可的，经过这么久的打磨，基础工具类日趋完善，用起来也放心。各位同学，根据自己项目的实际情况来选择吧。