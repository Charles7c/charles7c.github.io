---
title: SQL映射文件之查询元素
author: 查尔斯
date: 2020/12/27 23:35
categories:
 - MyBatis快速入门
tags:
 - MyBatis
 - ORM框架
---

# SQL映射文件之查询元素

## 前言

**C：** 在上一篇，笔者带大家对 MyBatis 的核心配置文件做了介绍。本篇开始，笔者将带你学习 MyBatis 的 SQL 映射文件，它是 MyBatis 中亮点最多的部分（翻回去看看 MyBatis 特点，主要优势都在这儿），同时也是未来我们使用 MyBatis 开发时接触最多的部分。

不过你也别担心，MyBatis 在 SQL 语句映射方面异常强大，但 SQL 映射文件却是相当简单。

下方是 SQL 映射文件的标签模板，笔者将花两三篇对其中常用的一些标签的常用使用方式进行介绍。

**mapper** 根标签

- cache-ref  引用其它命名空间的缓存配置
- **cache**  配置给定命名空间的缓存
- ***resultMap***  （自定义结果集映射配置）用来描述数据库结果集和对象的对应关系，是最复杂也是最强大的元素
- ~~parameterMap~~ （自定义参数映射配置）此元素已被废弃，并可能在将来被移除！请使用行内参数映射。
- **sql**  可以重用的 SQL 块
- **insert**  映射插入语句
- **update**  映射更新语句
- **delete**  映射删除语句
- **select**  映射查询语句

![202012271107691](../../../public/img/2020/12/27/202012271107691.png)

## mapper元素

mapper 元素是 SQL 映射文件的根标签，在该标签内有一个属性 namespace（命名空间），可以理解为当前 SQL 映射文件的标识。

**传统 SqlSession 开发中** ，mapper 元素的 namespace 属性和下方子元素的 id 属性联合保证了 SQL 语句的唯一标识。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="userMapper">
    <select id="selectList" resultType="User">
        SELECT * FROM `user`
    </select>
</mapper>
```

```java
List<User> userList = sqlSession.selectList("userMapper.selectList");
```

**SqlSession 的 Mapper 接口开发中** ，mapper 元素的 namespace 属性必须命名为对应的 Mapper 接口的全限定类名，下方子元素也要和对应 Mapper 接口中的方法一 一对应。

```java
package com.example.mapper;
// ...略...
public interface UserMapper {

    /**
     * 查询用户列表
     * @return /
     */
    List<User> selectList();
	
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.mapper.UserMapper">
    <!-- List<User> selectList();  -->
    <select id="selectList" resultType="User">
        SELECT * FROM `user`
    </select>
</mapper>
```

::: tip 笔者说
Mapper 接口开发是我们上篇中最后部分讲解过的 SqlSession 使用方式，以后也是主要的写法，很好理解，GKD掌握。
:::

## select元素

在每一个项目中，查询都是应用最频繁也是应用最困难的部分。 在 SQL 映射文件中，select 元素就是用于编写查询 SQL 的，它是 MyBatis 中最常用的元素之一。

select 元素有很多属性，可以很详细的来配置每条语句的行为细节。

- **id** 命名空间中唯一的标识符

  Mapper 接口开发中，id 值需要和接口中对应方法的名字保持一致

- **parameterType** 传入SQL语句的参数类型

  可以为参数类型的全限定类名或别名

  Mapper接口开发中，parameterType 值需要和接口中对应方法的参数类型保持一致

- **resultType** SQL语句返回值类型（详细解释见 resultMap 元素部分）

  可以为返回值类型的全限定类名或别名

  Mapper接口开发中，resultType 值需要和接口中对应方法的返回值类型保持一致

  **注意：** 如果返回值类型是集合，那么 resultType 值应该表示为集合的泛型类型，而不是集合类型。

接下来，笔者通过几个示例来带大家掌握下 select 元素的使用。

::: tip 笔者说
笔者只是介绍了使用最为频繁的几个属性，如果想了解更多的属性含义，可以前往[官网](https://mybatis.org/mybatis-3/zh/sqlmap-xml.html)查看。
:::

### 用户名查询

在《快速入门》篇的数据库基础上，我们先来实现一个根据用户名的模糊查询。

首先，在 Mapper 接口中我们添加一个方法。

```java
public interface UserMapper {

    /**
     * 根据用户名模糊查询
     * @param name 用户名
     * @return 用户列表
     */
    List<User> selectByName(String name);

}
```

然后我们在 SQL 映射文件中再添加一个与该方法对应的查询元素。

```xml
<!-- List<User> selectByName(String name); -->
<!-- 通过#{参数名}即可获取传入的值 -->
<select id="selectByName" parameterType="string" resultType="User">
    select * from user where name like concat('%', #{name}, '%')
</select>
```

测试一下：

```java
class TestMyBatis {

    @Test
    void testSelectByName() throws IOException {
        // 获取SqlSession对象
        try (SqlSession sqlSession = MyBatisUtils.openSession()) {

            // 获取 Mapper 接口
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            // 执行 SQL
            List<User> userList = userMapper.selectByName("J");

            // 遍历数据
            userList.forEach(System.out::println);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
```

**控制台输出：** 

```sql
-- 输出的 SQL 语句
select * from user where name like concat('%', ?, '%')
```

```
User [id=1, name=Jone, age=18, email=Jone@126.com]
User [id=2, name=Jack, age=20, email=Jack@126.com]
```

#### #{}和${}的区别

在控制台输出的 MyBatis 日志中，我们可以看到最后执行的 SQL 就是我们在传统 JDBC 开发中，为了解决 SQL 注入攻击而编写的 SQL 形式。

之所以输出如此，是因为我们使用了 #{} 的形式来使用参数，\#{}表示一个占位符号，可以接收简单类型值或 POJO 属性值，通过 #{} 可以实现 preparedStatement 向占位符中设置值，自动进行 Java 类型和 JDBC 类型转换。#{} 可以有效防止 SQL 注入。

**注意：** #{} 占位符不能放置在字符串中，即：select * from user where name like '%#{name}%' 是错误的。

---

其实在 MyBatis 中还有占位符：${}，但是基本不使用，至于原因，我们试试看就知道了。

```xml
<!-- List<User> selectByName(String name); -->
<!-- ${参数名} 可以直接放在字符串中 -->
<select id="selectByName" parameterType="string" resultType="User">
    select * from user where name like '%${name}%'
</select>
```

**控制台输出：** 

```sql
-- 输出的 SQL 语句
select * from user where name like '%J%'
```

这回知道原因了吧？ **总结一下它们的区别（面试题）** ：

-  在使用`#{}`参数语法时，MyBatis 会创建 `PreparedStatement` 参数占位符，并通过占位符安全地设置参数（就像使用 ? 一样）[1]
- 在使用 `${}` 时，MyBatis 会将 SQL 中的 `${}` 替换成对应变量的值。适合需要直接插入一个不转义的字符串时使用。
- 使用 #{} 可以有效的防止 SQL 注入，提高系统安全性。

### 多参数查询

我们也都知道，在 Java 中定义方法的时候，返回值类型只能设定为一个具体类型，但是方法的参数是可以定义 N 个的，那么在面对这种方法时，MyBatis 查询元素的 parameterType 该如何使用呢？

其实也非常简单，**有三种方式比较流行** ：

- 将多个参数封装到 POJO / 自定义对象中
- 将多个参数封装到 Map / List 集合中
- 将多个参数通过 @Param 注解标注

我们通过一个案例感受下不同方式的区别： **案例需求：根据用户名、年龄查询用户列表** 

#### 封装到POJO

首先，在 Mapper 接口中我们添加一个方法。

```java
public interface UserMapper {

    /**
     * 根据用户名和年龄查询
     * @param user 用户信息
     * @return 用户列表
     */
    List<User> selectByUser(User user);

}
```

然后我们在 SQL 映射文件中再添加一个与该方法对应的查询元素。

```xml
<!-- List<User> selectByUser(User user); -->
<!-- 在 parameterType 为对象时, #{属性名} 可以获取对象中的属性值 -->
<select id="selectByUser" parameterType="User" resultType="User">
    select
        * 
    from
        user 
    where 
        name like concat('%', #{name}, '%')
        and age = #{age}
</select>
```

测试一下：

```java
class TestMyBatis {

    @Test
    void testSelectByUser() throws IOException {
        // 获取SqlSession对象
        try (SqlSession sqlSession = MyBatisUtils.openSession()) {

            // 获取 Mapper 接口
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            // 执行 SQL
            User user = new User();
            user.setName("J");
            user.setAge(20);
            List<User> userList = userMapper.selectByUser(user);

            // 遍历数据
            userList.forEach(System.out::println);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
```

**控制台输出：** 

```sql
-- 输出的 SQL 语句
select * from user where name like concat('%', ?, '%') and age = ?
```

```
User [id=2, name=Jack, age=20, email=Jack@126.com]
```

#### 封装到Map集合

::: tip 笔者说
笔者个人比较喜欢这一种，Map 集合总是那么"万金油"。
:::

首先，在 Mapper 接口中我们添加一个方法。

```java
public interface UserMapper {

    /**
     * 根据用户名和年龄查询
     * @param params 条件参数
     * @return 用户列表
     */
    List<User> selectByMap(Map<String, Object> params);

}
```

然后我们在 SQL 映射文件中再添加一个与该方法对应的查询元素。

```xml
<!-- List<User> selectByMap(Map<String, Object> params); -->
<!-- 在 parameterType 为 Map 集合时, #{map的键名} 可以获取集合的值 -->
<select id="selectByMap" parameterType="map" resultType="User">
    select
        * 
    from
        user 
    where 
        name like concat('%', #{name}, '%')
        and age = #{age}
</select>
```

测试一下：

```java
class TestMyBatis {

    @Test
    void testSelectByMap() throws IOException {
        // 获取SqlSession对象
        try (SqlSession sqlSession = MyBatisUtils.openSession()) {

            // 获取 Mapper 接口
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            // 执行 SQL
            Map<String, Object> params = new HashMap<>();
            params.put("name", "J");
            params.put("age", 20);
            List<User> userList = userMapper.selectByMap(params);

            // 遍历数据
            userList.forEach(System.out::println);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
```

**控制台输出：** 

```sql
-- 输出的 SQL 语句
select * from user where name like concat('%', ?, '%') and age = ?
```

```
User [id=2, name=Jack, age=20, email=Jack@126.com]
```

#### @Param注解

::: tip 笔者说
@Param 注解与上述两种方式有些不同，如果你使用了该注解，那么 parameterType 就不需要再手动指定了，使用 **普通类型参数** （Java中的 int、double、String...... 这些都属于普通类型参数，而对象和集合就不属于普通类型参数了）的方法一般都推荐使用它。
:::

首先，在 Mapper 接口中我们添加一个方法。

```java
public interface UserMapper {

    /**
     * 根据用户名和年龄查询
     * @param name 用户名
     * @param age 年龄
     * @return 用户列表
     */
    // @Param("参数名") 注解中传入的参数名才是占位符要使用到的名字
    List<User> selectByParam(@Param("name") String name, @Param("age") Integer age);

}
```

然后我们在 SQL 映射文件中再添加一个与该方法对应的查询元素。

```xml
<!-- List<User> selectByParam(@Param("name") String name, @Param("age") Integer age); -->
<!-- #{@Param注解设定的名} 可以用来取出对应参数的值 -->
<select id="selectByParam" resultType="User">
    select
        * 
    from
        user 
    where 
        name like concat('%', #{name}, '%')
        and age = #{age}
</select>
```

测试一下：

```java
class TestMyBatis {

    @Test
    void testSelectByParam() throws IOException {
        // 获取SqlSession对象
        try (SqlSession sqlSession = MyBatisUtils.openSession()) {

            // 获取 Mapper 接口
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            // 执行 SQL
            List<User> userList = userMapper.selectByParam("j", 20);

            // 遍历数据
            userList.forEach(System.out::println);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
```

**控制台输出：** 

```sql
-- 输出的 SQL 语句
select * from user where name like concat('%', ?, '%') and age = ?
```

```
User [id=2, name=Jack, age=20, email=Jack@126.com]
```

::: warning 使用注意
超过 3 个以上的 **普通类型参数** 最好封装成对象或 Map 来入参（特别是在常规的增加和修改操作时，字段较多，封装成对象比较方便），而参数固定的业务方法，最好使用 @Param 来入参（这种方法比较灵活，代码的可读性高，可以清晰看出来这个接口方法的所需的参数是什么，并且对于固定的接口方法，参数一般是固定的，所以可以使用直接参数入参即可，无需封装对象。例如：修改个人密码的方法，根据 id 删除用户的方法，根据 id 查看用户明细的方法，都可以采取这种方式）
::: 

## sql元素

在同一个 SQL 映射文件中，经常面临着重复 SQL 的问题，尤其是查询类 SQL 。效果如下：

```xml
<select id="selectByName" resultType="User">
    select 
        id, name, age, email
    from
        user
    where name like concat('%', #{name}, '%')
</select>
```

```xml
<select id="selectById" resultType="User">
    select 
        id, name, age, email
    from
        user
    where id = #{id}
</select>
```

使用 sql 元素可以让我们得以复用一些 SQL语句。

```xml
<!-- 定义可重用 SQL 段 -->
<sql id="selectUser">
    select 
        id, name, age, email
    from
        user
</sql>

<select id="selectByName" resultType="User">
    <!-- 引用 SQL -->
    <include refid="selectUser"/>
    where name like concat('%', #{name}, '%')
</select>

<select id="selectById" resultType="User">
    <include refid="selectUser"/>
    where id = #{id}
</select>
```

## 参考文献

[1]MyBatis 官网. XML 映射文件[EB/OL]. https://mybatis.org/mybatis-3/zh/sqlmap-xml.html. 2020-12-26

## 后记

本篇中，select 元素是重点，笔者列了好多个示例，你一定要将示例代码完整"临摹" + "思考"一遍，这样才能达到笔者所说的技术学习的第二步、第三步。

::: info 笔者说
对于技术的学习，笔者一贯遵循的步骤是：先用最最简单的 demo 让它跑起来，然后学学它的最最常用 API 和 配置让自己能用起来，最后熟练使用的基础上，在空闲时尝试阅读它的源码让自己能够洞彻它的运行机制，部分问题出现的原因，同时借鉴这些技术实现来提升自己的代码高度。

所以在笔者的文章中，前期基本都是小白文，仅仅穿插很少量的源码研究。当然等小白文更新多了，你们还依然喜欢，后期会不定时专门对部分技术的源码进行解析。
:::

