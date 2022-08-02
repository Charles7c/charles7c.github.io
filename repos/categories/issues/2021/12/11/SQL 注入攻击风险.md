---
title: SQL 注入攻击风险
author: 查尔斯
date: 2021/12/11 22:51
categories:
 - Bug万象集
tags:
 - SQL
 - 网络攻击
---

# SQL 注入攻击风险

## 前言

**C：** Java 开发者都知道，想要用 Java 连接关系型数据库进行操作，就要学习使用 java.sql 包下的一套 JDBC API，这套 API 的使用步骤，大致如下：

```java {30}
/**
 * JDBC，模拟登录示例
 *
 * @author Charles7c
 * @date 2021/12/11 22:51
 */
public class JdbcLoginDemo {
    public static void main(String[] args) {
        // 录入登录信息
        Scanner input = new Scanner(System.in);
        System.out.print("请输入用户名：");
        String username = input.next();
        System.out.print("请输入密码：");
        String password = input.next();

        // 查询数据库，验证登录信息
        boolean loginResult = false;
        Connection conn = null;
        Statement statement = null;
        ResultSet rs = null;
        try {
            // 1、注册驱动
            Class.forName("com.mysql.jdbc.Driver");
            // 2、获取连接
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/school", "root", "root");
            // 3、创建语句执行平台
            statement = conn.createStatement();
            // 4、编写SQL语句
            // String sql = "SELECT * FROM `user` WHERE `username` = '" + username + "' AND `password` = '" + password + "'";
            String sql = String.format("SELECT * FROM `user` WHERE `username` = '%s' AND `password` = '%s'", username, password);
            // 5、执行SQL语句
            rs = statement.executeQuery(sql);
            // 6、解析结果集
            if (rs.next()) {
                loginResult = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 7、释放资源，先开后关
            try {
                if (rs != null) {
                    rs.close();
                }
                if (statement != null) {
                    statement.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        // 输出登录结果
        System.out.println(loginResult ? "登录成功！" : "登录失败！用户名或密码错误！");
    }
}
```

上方是一个非常经典的 JDBC 模拟登录示例，同样的，很多同学可能一眼就看出来了，它存在着一个严重的攻击漏洞：SQL 注入攻击。

今天，咱们就一块来聊聊 SQL 注入（SQL Injection）这个东西。

## SQL 注入攻击简介

 SQL 注入（SQL Injection）作为一种比较常见的网络攻击方式，在学习 JDBC 时就肯定会得到老师的重点提醒。它的出现原因就是因为开发者编写的 SQL 语句，采用拼接的方式来接受输入参数。

看看上方代码的第 4 步骤，一条 通过用户名和密码来查询用户记录 的简单查询 SQL，它在接受用户名和密码两个输入参数时，是直接拼接到查询 SQL 语句上的。

```java
// 下方两种形式都一样，笔者个人相对更喜欢使用格式化字符串而已
// String sql = "SELECT * FROM `user` WHERE `username` = '" + username + "' AND `password` = '" + password + "'";
String sql = String.format("SELECT * FROM `user` WHERE `username` = '%s' AND `password` = '%s'", username, password);
```

假设是一个正常的用户输入：

- 用户名：admin
- 密码：123456

那最终执行的查询 SQL 语句，如下：

```sql
SELECT * FROM `user` WHERE `username` = 'admin' AND `password` = '123456';
```

这倒是没什么问题，但是如果是一个攻击者恶意的输入：

- 用户名：luanShuDe（胡乱输入的）
- 密码：luanShuDe' OR '1' = '1（密码也是胡乱输入的，重点在后面部分）

那最终执行的查询 SQL 语句，如下：

```sql
SELECT * FROM `user` WHERE `username` = 'luanShuDe' AND `password` = 'luanShuDe' OR '1' = '1';
```

胡乱输入的用户名和密码肯定查询不到结果，但是密码后面的内容由于是 SQL 语法，直接拼接到查询 SQL 语句内，最终也是会执行的，1和1是恒等的，而 OR 运算符是只要一个条件满足，就匹配，所以结果就会查询出所有的用户记录。

这就导致本该登录失败的情况，却判定登录成功了！也就达成了一次相对简单的 SQL 注入攻击了。

## 解决方案

### JDBC 的 PreparedStatement

问题是要解决的，而且 JDBC 早就提供了相应的解决方法。那就是采用 Statement 的子接口 PreparedStatement，使用步骤如下：

::: tip 笔者说

Prepared 从单词意思上就知道是：准备好的，有准备的。

PreparedStatement 的对象包含了编译好的 SQL 语句。这种 “准备好” 的方式不仅能提高安全性，解决 SQL 注入问题，而且在多次执行同一个 SQL 时，无需再编译，能够提高效率。

:::

```java {27}
/**
 * JDBC，模拟登录示例
 *
 * @author Charles7c
 * @date 2021/12/11 22:51
 */
public class JdbcLoginDemo2 {
    public static void main(String[] args) {
        // 录入登录信息
        Scanner input = new Scanner(System.in);
        System.out.print("请输入用户名：");
        String username = input.next();
        System.out.print("请输入密码：");
        String password = input.next();

        // 查询数据库，验证登录信息
        boolean loginResult = false;
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            // 1、注册驱动
            Class.forName("com.mysql.jdbc.Driver");
            // 2、获取连接
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/school", "root", "root");
            // 3、编写SQL语句，使用 ? 进行参数占位
            String sql = "SELECT * FROM `user` WHERE `username` = ? AND `password` = ?";
            // 4、创建语句执行平台
            ps = conn.prepareStatement(sql);
            // 5、设置参数
            ps.setString(1, username);
            ps.setString(2, password);
            // 6、执行SQL语句
            rs = ps.executeQuery();
            // 7、解析结果集
            if (rs.next()) {
                loginResult = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 8、释放资源，先开后关
            try {
                if (rs != null) {
                    rs.close();
                }
                if (ps != null) {
                    ps.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        // 输出登录结果
        System.out.println(loginResult ? "登录成功！" : "登录失败！用户名或密码错误！");
    }
}
```

### MyBatis 的 #{}

在平时的开发中，我们基本上都在采用 ORM 框架来解决持久层问题，MyBatis 作为一个在国内常用的半自动 ORM 框架，底层就是对 JDBC 的封装，简化了大量模板化的代码。

如果你也使用了 MyBatis，那么在 SQL 语句传参时，一定要注意使用 #{} 的方式，它最终的实现就是 JDBC 的 PreparedStatement。

### 特殊符号检查过滤

MyBatis 还有一种 ${} 也可以来接受参数，但是这种方式最终就是直接在 SQL 语句中拼接输入参数，所以它存在 SQL 注入攻击的风险。

如果真的想用，可以采用对输入参数进行特殊符号检查过滤。检查过滤的代码，可参考如下：

```java
public class CheckUtils {
    /**
    * 校验条件参数不可包含特殊字符，并且小于255个字符
    * 
    * @param 条件参数内容
    * @throws Exception 具体错误信息
    */
    public static void checkCondition(String param) throws Exception {
        if (param != null) {
            String regEx = "[`~!@#$%^&*+=|{}':;',\\[\\]<>?~！@#￥%……&*（）+|{}【】‘；：”“’。，、？]|\n|\r|\t";
            Matcher matcher = Pattern.compile(regEx).matcher(param);
            if (param.length() < 0 || param.length() > 255) {
                throw new Exception("查询条件最长字符255！");
            }
            if (matcher.find()) {
                throw new Exception("查询条件中不应包含特殊字符！");
            }
        }
    }
}
```

当然了，笔者个人认为基本上能用 ${} 的地方都可以采用 #{} 替代。不过，倒也是见过一些同事在写代码时坚持用 ${} ，代码片段类似如下：

```sql
SELECT * FROM user WHERE username LIKE '%${username}%'
```

的确，LIKE 模糊查询时，后面模糊条件的 `%` 等符号是不能直接出现在 SQL 语句里的，而是要写在由 `'` （单引号）引起的字符串内。但是 MyBatis 的 `#{}` 又无法写在由 `'` （单引号）引起的字符串内，即无法直接写成 `'%#{username}%'` （如果你不相信，可以自行尝试一下，看看控制台会有什么 “惊喜” 输出），这应该就是这部分同事不得不采用 `'%${username}%'` 写法的原因。

好在，笔者这正好也提供一种解决方法，可以解决此问题，那就是使用 SQL 函数 CONCAT()，代码片段类似如下：

```sql
SELECT * FROM user WHERE username LIKE CONCAT('%', #{username}, '%')
```

没错，既然要拼接字符串，那就用 CONCAT() 函数，这个函数就是专门用来拼接字符串的，在拼接时可以使用 #{} ，所以也就不会存在 SQL 注入的问题了。