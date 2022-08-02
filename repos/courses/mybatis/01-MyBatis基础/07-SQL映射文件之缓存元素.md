---
title: SQL映射文件之缓存元素
author: 查尔斯
date: 2020/12/28 00:17
categories:
 - MyBatis快速入门
tags:
 - MyBatis
 - ORM框架
---

# SQL映射文件之缓存元素

## 前言

**C：**  在上一篇，笔者带大家对 MyBatis SQL 映射文件的 resultMap 元素做了介绍，它大概是 MyBatis 学习中第一个 "坎儿"，没跨过来的同学也没关系，慢慢来，切勿急躁，先看看本篇再说。本篇，笔者将带你学习 MyBatis SQL 映射文件的 cache 元素。

cache 即缓存，任何应用都不可缺少的一个组成部分，但凡想提升性能，缓存就得拿出来说道说道。MyBatis 中自然也少不了缓存的存在，下面我们去看看吧。

## cache元素

cache 元素，是用于开启 MyBatis 二级缓存的关键。在 MyBatis 中缓存分为一级缓存和二级缓存 。

### 一级缓存

**一级缓存主要指的是 Session 缓存，默认是开启并生效的** 。

一级缓存存在两种作用域范围：[2]

- `SESSION`（默认）**在同一个 SqlSession 中多次执行同一个查询，除第一次走数据库，剩下的都走缓存** 。
- `STATEMENT` 每执行完一个 Mapper 中的语句后都会将一级缓存清除（不推荐配置）。

测试一下一级缓存的 `SESSION` 作用域范围：(随便找两个查询试试就可以)

```java
class TestMyBatis {

    @Test
    void testSelectByList() {
        // 获取SqlSession对象
        try (SqlSession sqlSession = MyBatisUtils.openSession()) {

            // 获取 Mapper 接口
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			
            // 执行不同 SQL
            List<User> userList1 = userMapper.selectList();
            List<User> userList2 = userMapper.selectByName("J");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
```

很显然它执行了两条 SQL，和缓存根本搭不上关系。

![202012281138752](../../../public/img/2020/12/28/202012281138752.png)

再来试试执行两次相同的 SQL 查询。

```java
class TestMyBatis {

    @Test
    void testSelectByList() {
        // 获取SqlSession对象
        try (SqlSession sqlSession = MyBatisUtils.openSession()) {

            // 获取 Mapper 接口
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            // 执行相同 SQL
            List<User> userList1 = userMapper.selectList();
            List<User> userList2 = userMapper.selectList();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
```

结果显而易见，MyBatis 在同一个 SqlSession 中，对相同的 SQL 查询，只执行了一次，第二次则直接使用了缓存。

![202012281139250](../../../public/img/2020/12/28/202012281139250.png)

### 二级缓存

**二级缓存是指 mapper 映射文件。** 二级缓存的作用域是同一个 namespace 下的 mapper 映射文件内容，**多个 SqlSession 之间是共享的** 。

::: warning 笔者说
可以通过核心配置文件中的 settings 元素的 cacheEnabled 对所有二级缓存进行全局性开/关设置（默认值为true）。
:::

```xml
<settings>
    <setting name="cacheEnabled" value="true"/>
</settings>
```

在测试二级缓存前，我们需要先对指定的 SQL 映射文件启用二级缓存，即添加一个 cache 元素。

```xml
<!-- 对于同一个 SQL 映射文件来讲，只能使用一个 cache 元素 -->
<cache/>
```

上面我们仅仅添加了一个空 cache 元素 ，但其实它已经采用了很多缓存默认值，大致如下：[1]

- 映射语句文件中的所有 select 语句的结果将会被缓存。
- 映射语句文件中的所有 insert、update 和 delete 语句会刷新缓存（哪怕最后没提交事务也会刷新缓存）。
- 缓存会使用最近最少使用算法（LRU, Least Recently Used）算法来清除不需要的缓存。
- 缓存不会定时进行刷新（也就是说，没有刷新间隔）。
- 缓存会保存列表或对象（无论查询方法返回哪种）的 1024 个引用。
- 缓存会被视为读/写缓存，这意味着获取到的对象并不是共享的，可以安全地被调用者修改，而不干扰其他调用者或线程所做的潜在修改。

你也可以通过修改 cache 元素的属性来调整二级缓存。

```xml
<!-- 这个更高级的配置创建了一个 FIFO 缓存，每隔 60 秒刷新，最多可以存储结果对象或列表的 512  个引用，而且返回的对象被认为是只读的，因此对它们进行修改可能会在不同线程中的调用者产生冲突。  -->
<cache
    eviction="FIFO"
    flushInterval="60000"
    size="512"
    readOnly="true"/>
```

**eviction** 代表缓存清除策略：（默认的清除策略是 LRU）

- `LRU`  最近最少使用：移除最长时间不被使用的对象  
- `FIFO`  先进先出：按对象进入缓存的顺序来移除它们 
- `SOFT`  软引用：基于垃圾回收器状态和软引用规则移除对象     
- `WEAK` – 弱引用：更积极地基于垃圾收集器状态和弱引用规则移除对象。          

**flushInterval** 代表缓存刷新间隔：（默认情况是不设置，也就是没有刷新间隔，缓存仅仅会在调用语句时刷新）它的属性值可以被设置为任意的正整数，设置的值应该是一个以毫秒为单位的合理时间量。        

**size** 代表可以缓存的对象引用数目：（默认值是 1024）它的属性值可以被设置为任意正整数，但要注意欲缓存对象的大小和运行环境中可用的内存资源。        

**readOnly** 代表缓存中的对象是否只读：（默认值是 false），它的属性值可以被设置为 true 或 false。只读的缓存会给所有调用者返回缓存对象的相同实例，因此这些对象不能被修改，这就提供了可观的性能提升。而可读写的缓存会（通过序列化）返回缓存对象的拷贝，速度上会慢一些，但是更安全（ **建议** ）。

---

赶快测试一下吧：

```java
class TestMyBatis {

    @Test
    void testSelectByList() {
        try {
            // 获取SqlSession对象
            SqlSession sqlSession1 = MyBatisUtils.openSession();
            // 执行
            UserMapper userMapper1 = sqlSession1.getMapper(UserMapper.class);
            List<User> userList1 = userMapper1.selectList();
            // 【执行关闭操作，将 SqlSession 中的数据写到二级缓存区域】
            sqlSession1.close();
			
            // 获取SqlSession对象
            SqlSession sqlSession2 = MyBatisUtils.openSession();
            // 执行
            UserMapper userMapper2 = sqlSession2.getMapper(UserMapper.class);
            List<User> userList2 = userMapper2.selectList();
            sqlSession2.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
```

控制台报错了，User 没有序列化，上方 readOnly 属性刚介绍完，它默认值为 false，表示每次会通过序列化返回缓存对象的拷贝，以此实现可读写的缓存。

![202012281139256](../../../public/img/2020/12/28/202012281139256.png)

```java
public class User implements Serializable{
    // 略
}
```

再测试之后，控制台输出如下，Cache Hit Ratio 表示缓存命中率，开启二级缓存后，每执行一次查询，系统都会计算一次二级缓存的命中率。第一次查询也是先从缓存中查询，只不过缓存中一定是没有的，所以命中率为0，然后再从DB中查询后缓存到二级缓存中。第二次查询的时候是从二级缓存中读取的，这一次的命中率为1/2=0.5。 当然，若有第三次查询，则命中率为1/3=0.66 ，依此类推。[3]

![202012281139540](../../../public/img/2020/12/28/202012281139540.png)

## cache-ref元素

当我们想要在多个命名空间中共享相同的缓存配置和实例时，cache-ref 元素就可以派上用场了，当同时使用了 cache 元素和 cache-ref 元素时，cache 元素的优先级更高。

```xml
<!-- namespace：要共享二级缓存的某 SQL 映射文件的 namespace 的值 -->
<cache-ref namespace="com.example.mapper.UserMapper"/>
```

::: tip 笔者说
二级缓存也不是万能的，需要根据实际情况来，当查询操作远远多于增删改操作的情况下，并且业务对数据的实时性要求不高的时候可以采用二级缓存，否则增删改频繁刷新二级缓存将会降低系统性能，而缓存又会导致实时效果差。
而且 MyBatis 的二级缓存也存在着一些缺陷，使用 MyBatis 二级缓存必须有一个前提：保证所有的增删改查都在同一个 namespace 下才行，不然容易出现数据不一致问题，例如：当两个 SQL 映射文件中均存在对同一个表的操作，那么其中一方修改了表，只会引发该 SQL 映射文件的二级缓存清空，而不会清空另一个的。
:::

## 参考文献

[1]MyBatis 官网. XML 映射文件[EB/OL]. https://mybatis.org/mybatis-3/zh/sqlmap-xml.html. 2020-12-26

[2]花好夜猿. Mybatis【面试题】讲讲Mybatis的缓存-简答[EB/OL]. https://blog.csdn.net/qq_23202687/article/details/103708458. 2019-12-26

[3]陈浩翔. 你真的懂Mybatis缓存机制吗[EB/OL]. https://mp.weixin.qq.com/s/h2x15k71rClaHjcz7u2dlQ. 2018-07-10

## 后记

SQL 映射文件的初步学习终于结束了，幸好有之前的文章雏形，但就这样还花费了半天时间整理和完善，但愿它能给小白用户带来一份系统的学习方案。

::: info 笔者说
对于技术的学习，笔者一贯遵循的步骤是：先用最最简单的 demo 让它跑起来，然后学学它的最最常用 API 和 配置让自己能用起来，最后熟练使用的基础上，在空闲时尝试阅读它的源码让自己能够洞彻它的运行机制，部分问题出现的原因，同时借鉴这些技术实现来提升自己的代码高度。

所以在笔者的文章中，前期基本都是小白文，仅仅穿插很少量的源码研究。当然等小白文更新多了，你们还依然喜欢，后期会不定时专门对部分技术的源码进行解析。
:::
