---
title: Commons DbUtils
date: 2026-09-12
---

# Commons DbUtils

本篇整理 Commons DbUtils 组件的主要类与方法（QueryRunner、ResultSetHandler），并通过完整案例演示增删改、查询与事务操作。

## 1. 简介

**DBUtils** 是 Apache Commons 组件中的一员，开源免费。它是对 JDBC 的简单封装，但仍然被很多公司使用。

- 主要功能：用来操作数据库，简化 JDBC 的操作；
- 使用时需要和数据库连接池、MySQL 的 jar 包配合使用。

## 2. 主要类及方法

`QueryRunner` 是执行 SQL 语句的类：

- 创建 QueryRunner：
  - 构造器 `QueryRunner()`：在事务里面使用；
  - 构造器 `QueryRunner(连接池对象)`；
- `update()`：执行 INSERT、UPDATE、DELETE；
- `query()`：执行 SELECT。

### 2.1 关于增删改

```java
int update(String sql, Object... params)                       //可执行增、删、改语句
int update(Connection con, String sql, Object... params)       //需要调用者提供Connection，支持事务
```

### 2.2 关于查询

```java
T query(String sql, ResultSetHandler rsh, Object... params)            //可执行查询
T query(Connection con, String sql, ResultSetHandler rsh, Object... params)  //需要调用者提供Connection，支持事务
```

#### 2.2.1 ResultSetHandler 接口

ResultSetHandler 的常见实现类及用途如下：

| 实现类 | 适用结果集 | 说明 |
| --- | --- | --- |
| `BeanHandler` | 单行 | 构造器需要一个 Class 类型的参数，用来把一行结果转换成指定类型的 JavaBean 对象 |
| `BeanListHandler` | 多行 | 构造器同样需要一个 Class 类型的参数，用来把每行结果集转换成一个 JavaBean，多行就是转换成 List 对象（一组 JavaBean） |
| `MapHandler` | 单行 | 把一行结果集转换成 Map 对象 |
| `MapListHandler` | 多行 | 把一行记录转换成一个 Map，多行就是多个 Map，即 `List<Map>` |
| `ScalarHandler` | 单行单列 | 通常用于 `select count(*) from t_stu` 语句（结果集是单行单列的），返回一个 Object 类型的聚合函数结果 |

> [!NOTE]
> `BeanHandler`、`MapHandler`、`ScalarHandler` 只处理**一行**结果；查询可能返回多行时，请使用对应的 `BeanListHandler`、`MapListHandler`。

## 3. 使用

### 3.1 建库建表

```sql
DROP DATABASE IF EXISTS mydbutils;

CREATE DATABASE mydbutils;
USE mydbutils;

CREATE TABLE tb_stu ( 
    sid INT PRIMARY KEY auto_increment, 
    sname VARCHAR (50), 
    sage INT, 
    sgender VARCHAR (10) 
);
INSERT INTO tb_stu(sname, sage, sgender) VALUES('John', 20, "male");
INSERT INTO tb_stu(sname, sage, sgender) VALUES('bob', 20, "male");

CREATE TABLE USER(
    username VARCHAR (20), 
    password VARCHAR (20)
);
INSERT INTO USER VALUES('Peter', '123');
INSERT INTO USER VALUES('John', '123');

CREATE TABLE account  (
  id int(11) NOT NULL AUTO_INCREMENT,
  cardnum varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  money decimal(10, 0) NULL DEFAULT NULL,
  PRIMARY KEY (id) USING BTREE
);
INSERT INTO account VALUES (1, '10001', 5000);
INSERT INTO account VALUES (2, '10002', 5000);
```

### 3.2 项目搭建

1. 新建 Java 项目；
2. 在项目下新建 `lib` 目录；
3. 将 MySQL 驱动 Jar 包、Druid 连接池 Jar 包、DbUtils 的 Jar 包拷贝到 `lib` 目录下；
4. 选中 `lib` 目录右键 `Add as Library`，单击 `OK`；
5. 将之前使用的最新版本的 JdbcUtils 工具类拷贝到项目中，并增加如下方法：

```java
//获取连接池对象
public static DataSource getDataSource() {
    return dataSource;
}
```

### 3.3 创建实体类

```java
public class Student {
	private int sid;
	private String sname;
	private int sage;
	private String sgender;
    
    //get、set
    //toString...
}
```

### 3.4 DbUtils 使用

```java
import com.qfedu.entity.Student;
import com.qfedu.utils.JdbcUtils;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.junit.Test;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;

public class MyTest {
    private DataSource dataSource = JdbcUtils.getDataSource();

    //测试添加
    @Test
    public void testAdd() {
        //创建QueryRunner
        QueryRunner qr = new QueryRunner(dataSource);
        //SQL
        String sql = "INSERT INTO tb_stu(sname, sage, sgender) VALUES(?, ?, ?)";
        int result = 0;
        //参数
        Object[] params = {"zhangsan", 12, "male"};
        //操作--增
        try {
            result = qr.update(sql, params);
            System.out.println(result);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    //测试删除
    @Test
    public void testDel() {
        QueryRunner qr = new QueryRunner(dataSource);

        String sql = "DELETE FROM tb_stu WHERE sid=?";
        int result = 0;

        Object[] params = {5};

        try {
            result = qr.update(sql, params);
            System.out.println(result);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    //测试修改
    @Test
    public void testUpdate() {
        QueryRunner qr = new QueryRunner(dataSource);

        String sql = "UPDATE tb_stu SET sname=? WHERE sid=?";
        int result = 0;

        Object[] params = {"zs", 1};

        try {
            result = qr.update(sql, params);
            System.out.println(result);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    //测试查询
    @Test
    public void testSelect1() {
        QueryRunner qr = new QueryRunner(dataSource);
        String sql = "SELECT * FROM tb_stu WHERE sid=?";
        Student stu = null;
        Object[] params = {1};
        try {
            stu = qr.query(sql, new BeanHandler<Student>(Student.class), params);
            System.out.println(stu);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    //测试查询
    @Test
    public void testSelect2() {
        QueryRunner qr = new QueryRunner(dataSource);
        String sql = "SELECT * FROM tb_stu";
        List<Student> list = null;
        try {
            list =  qr.query(sql, new BeanListHandler<Student>(Student.class));
            for (Student student : list) {
                System.out.println(student);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    //测试查询
    @Test
    public void testSelect3() {
        QueryRunner qr = new QueryRunner(dataSource);
        String sql = "SELECT count(*) FROM tb_stu";

        long count = 0;

        try {
            count = qr.query(sql, new ScalarHandler<Long>());
            System.out.println(count);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

### 3.5 事务

> [!NOTE]
> 以下代码基于《事务》一篇 2.4.2、2.4.3 小节的代码。

#### 3.5.1 DAO 代码

```java
import com.qfedu.utils.JdbcUtils;
import org.apache.commons.dbutils.QueryRunner;

import java.sql.SQLException;

public class AccountDao {
    /*
     * 提款withdrawal
     * */
    public void withdrawal(String cardNum, double money) throws SQLException {
        String sql = "update account set money=money-? where cardNum=?";

        Object[] params = {money, cardNum};

        QueryRunner qr = new QueryRunner();
        qr.update(JdbcUtils.getConnection(), sql, params);
    }

    /*
     * 存款deposit
     * */
    public void deposit(String cardNum, double money) throws SQLException {
        String sql = "update account set money=money+? where cardNum=?";

        Object[] params = {money, cardNum};

        QueryRunner qr = new QueryRunner();
        qr.update(JdbcUtils.getConnection(), sql, params);
    }
}
```

#### 3.5.2 Service 代码

```java
import com.qfedu.dao.AccountDao;
import com.qfedu.utils.JdbcUtils;

import java.sql.SQLException;

public class AccountService {
    private AccountDao accountDao = new AccountDao();

    //转账操作
    public void trans(String src, String dst, double money) {

        try {
            JdbcUtils.beginTransaction();
            accountDao.withdrawal(src, money);

            //int i = 100/0;

            accountDao.deposit(dst, money);
            JdbcUtils.commitTransaction();
        } catch (Exception e) {
            e.printStackTrace();
            try {
                JdbcUtils.rollbackTransaction();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
    }
}
```

#### 3.5.3 测试代码

```java
@Test
public void testTransaction() {
    AccountService accountService = new AccountService();

    accountService.trans("10001", "10002", 1000);
}
```

## 4. 小结

- DbUtils 的核心是 **QueryRunner（执行 SQL）+ ResultSetHandler（封装结果）**；
- 增删改调用 `update()`，查询调用 `query()`，结果交给不同的 Handler 处理；
- 事务场景使用无参构造的 `QueryRunner()`，并把外层开启事务的 Connection 传入 `update()` / `query()`。
