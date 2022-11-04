---
title: 个人常用 Hutool 工具类
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

# 个人常用 Hutool工 具类 <Badge text="持续更新" type="warning" />

**C：** 技术圈常说一句：“你要会写轮子，也要会用轮子”。工作的时候，为了提升开发效率，节约开发时间，也常常提醒自己不要重复造 “轮子”。

每次开启一个新项目，除了搭建项目必备环境之外，必然要整理一下之前项目沉淀下来的工具类，然后 C V 大法。习惯了一些工具类后，新项目中用不了或是换一下总是感觉缺点什么，再加上每个人都有自己遇到或沉淀的工具类，项目中遇到工具类重复也是很常见的事儿。

话说回来，这些工具类就是开发中必不可少的一种 “轮子”。对于大多数同学，受限于技术，轮子可能勉强写的出来，但是写的是不是够好，够完善，这质量就没法保证了。

谁都是从一开始过来的，但好在有这么一些有志之士，将经年累月写过的轮子反复整理，反复打磨，推出了一个项目，它就是 Hutool。

接下来，笔者就带大家学习一些个人常用的 Hutool 工具类。

<!-- more -->

## 判断相等

### 传统用法

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

::: warning 《阿里巴巴Java开发手册》
【强制】所有整型包装类对象之间值的比较，全部使用 equals 方法比较。 说明：对于 Integer var = ? 在-128 至 127 之间的赋值，Integer 对象是在 IntegerCache.cache 产生， 会复用已有对象，这个区间内的 Integer 值可以直接使用==进行判断，但是这个区间之外的所有数据，都 会在堆上产生，并不会复用已有对象，这是一个大坑，推荐使用 equals 方法进行判断。 
:::

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

::: warning 《阿里巴巴Java开发手册》
【强制】BigDecimal 的等值比较应使用 compareTo()方法，而不是 equals()方法。 说明：equals()方法会比较值和精度（1.0 与 1.00 返回结果为 false），而 compareTo() 则会忽略精度。

说明：equals()方法会比较值和精度（1.0 与 1.00 返回结果为 false），而 compareTo()则会忽略精度。
:::

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

::: warning 《阿里巴巴Java开发手册》

【强制】浮点数之间的等值判断，基本数据类型不能用==来比较，包装数据类型不能用 equals 来判断。

说明：浮点数采用“尾数+阶码”的编码方式，类似于科学计数法的“有效数字+指数”的表示方式。二进 制无法精确表示大部分的十进制小数。

解决方法：

1. 指定一个误差范围，两个浮点数的差值在此范围之内，则认为是相等的。
2. 使用 BigDecimal 来定义值，再进行浮点数的运算操作。
:::

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

## 程序计时

### 传统用法

为了计算程序执行耗时，通常的做法是在程序段前后分别记录一个时间毫秒值变量，然后用结束时间毫秒值减去开始时间毫秒值就可以了。

```java
long startTime = System.currentTimeMillis();

// 要计时的程序片段
// ...

long endTime = System.currentTimeMillis();
System.out.println("总耗时：" + (endTime - startTime) + "ms");
```

### TimeInterval

实际上传统方法也没什么问题，但是当我们需要持续计时的时候，它就不是那么美丽了。Hutool 提供了 `TimeInterval` 来帮助我们实现灵活计时的需求。

```java
TimeInterval timer = DateUtil.timer();

// 要计时的程序片段1
// ...

System.out.println("总耗时：" + timer.interval() + "ms");

// 要计时的程序片段2
// ...

System.out.println("总耗时：" + timer.interval() + "ms");
// ...
```

## UUID生成器

### 传统用法

利用 JDK 内置的 `java.util.UUID`，可以生成 32 位的 UUID，但一般我们使用的时候还要再对其“加工”一下，转换成字符串并去除连字符。

```java
UUID uuid = UUID.randomUUID();
// 转换为字符串
String uuidStr = uuid.toString();
System.out.println(uuidStr); // 7f4c0b42-d066-4baa-bc24-4d74a69ea78e

// 去除连字符
String replaceUuidStr = uuidStr.replace("-", "");
System.out.println(replaceUuidStr); // 7f4c0b42d0664baabc244d74a69ea78e
```

### IdUtil

::: tip Hutool文档
Hutool重写了java.util.UUID的逻辑，对应类为cn.hutool.core.lang.UUID，使生成不带-的UUID字符串不再需要做字符替换，性能提升一倍左右。
:::

```java
String uuidStr = IdUtil.fastUUID();
System.out.println(uuidStr); // f69c5c5c-73fd-4286-b338-133927789d71

String simpleUuidStr = IdUtil.fastSimpleUUID();
System.out.println(simpleUuidStr); // 6905bc8239c1489a9f6fb18cee1d6884
// ...
```

## 获取Spring

### SpringUtil

::: tip Hutool文档
使用Spring Boot时，通过依赖注入获取bean是非常方便的，但是在工具化的应用场景下，想要动态获取bean就变得非常困难，于是Hutool封装了Spring中Bean获取的工具类——SpringUtil。
:::

要使用 SpringUtil，首先要完成两个操作。

1. 使用 `ComponentScan` 额外指定组件扫描包（记得别忘了也把自己的扫描包也加上）
2. 使用 `@Import` 导入 SpringUtil 类

```java
@SpringBootApplication
@Import(cn.hutool.extra.spring.SpringUtil.class)
@ComponentScan(basePackages = {"com.xxx", "cn.hutool.extra.spring"})
public class WebApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(args);
    }
}
```

常见用法：

```java
// 获取 Spring 容器中的指定对象
UserMapper userMapper = SpringUtil.getBean(UserMapper.class);
// 获取配置文件中的指定属性值
String activeProfile = SpringUtil.getProperty("spring.profiles.active");
// ...
```

## 集合操作

集合的出现极大的解决了复杂数据处理的需要，但仅凭 JDK 内置的集合方法，还是略显“苦涩”。

### MapUtil

顾名思义，MapUtil 生来是为了更方便的操作 Map 集合的。

::: tip 笔者说
单是能快速帮你创建指定初始容量大小的 Map 集合这一点就爱了。
:::

::: warning 《阿里巴巴Java开发手册》
【推荐】 集合初始化时， 指定集合初始值大小。  

说明： HashMap 使用 HashMap(int initialCapacity) 初始化，如果暂时无法确定集合大小， 那么指定默认值（ 16） 即可。  

正例： initialCapacity = (需要存储的元素个数 / 负载因子) + 1。 注意负载因子（即 loader factor） 默认为 0.75，如果暂时无法确定初始值大小，请设置为 16（即默认值） 。  

反例： HashMap 需要放置 1024 个元素，由于没有设置容量初始大小，随着元素增加而被迫不断扩容，
resize()方法总共会调用 8 次，反复重建哈希表和数据迁移。当放置的集合元素个数达千万级时会影响程序
性能。
:::

```java
// 判断是否为空、不为空
Map<String, Object> map1 = null;
Map<String, Object> map2 = new HashMap<>();
boolean flag1 = MapUtil.isEmpty(map1); // true
boolean flag2 = MapUtil.isNotEmpty(map1); // false
boolean flag3 = MapUtil.isEmpty(map2); // true
boolean flag4 = MapUtil.isNotEmpty(map2); // false
System.out.println(flag1);
System.out.println(flag2);
System.out.println(flag3);
System.out.println(flag4);

// 快速创建单键值对的 HashMap
HashMap<String, String> map3 = MapUtil.of("CN", "中国");
// 快速创建单键值对的 LinkedHashMap
HashMap<String, String> map4 = MapUtil.of("CN", "中国", true);

// 快速创建指定初始容量大小的 HashMap
HashMap<Object, Object> map5 = MapUtil.newHashMap(2);

// 快速创建LinkedHashMap
HashMap<Object, Object> map6 = MapUtil.newHashMap(true);
// 快速创建指定初始容量大小的 LinkedHashMap
HashMap<Object, Object> map7 = MapUtil.newHashMap(2, true);
// ...
```

**MapUtil 的 newHashMap() 源代码，如下：** 

```java
/**
 * 新建一个HashMap
 *
 * @param <K>  Key类型
 * @param <V>  Value类型
 * @param size 初始大小，由于默认负载因子0.75，传入的size会实际初始大小为size / 0.75 + 1
 * @return HashMap对象
 */
public static <K, V> HashMap<K, V> newHashMap(int size) {
    return newHashMap(size, false);
}

/**
 * 新建一个HashMap
 *
 * @param <K>     Key类型
 * @param <V>     Value类型
 * @param size    初始大小，由于默认负载因子0.75，传入的size会实际初始大小为size / 0.75 + 1
 * @param isOrder Map的Key是否有序，有序返回 {@link LinkedHashMap}，否则返回 {@link HashMap}
 * @return HashMap对象
 * @since 3.0.4
 */
public static <K, V> HashMap<K, V> newHashMap(int size, boolean isOrder) {
    int initialCapacity = (int) (size / DEFAULT_LOAD_FACTOR) + 1;
    return isOrder ? new LinkedHashMap<>(initialCapacity) : new HashMap<>(initialCapacity);
}
```