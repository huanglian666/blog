---
title: 04_Commons_DbUtils
date: 2026-09-12
---

## 一、简介

> DBUtils是Apache Commons组件中的一员，开源免费。是对JDBC的简单封装，但是它还是被很多公司使用。
>
> 主要功能：用来操作数据库，简化JDBC的操作。
>
> 在使用的时候要和数据库连接池、MySQL的jar包配合使用。

## 二、主要类及方法

> `QueryRunner`:执行sql语句的类
>
> * 创建QueryRunner
>   * 构造器：`QueryRunner()` ，在事务里面使用；
>   * 构造器：`QueryRunner(连接池对象)`
> * `update()`：执行INSERT、UPDATE、DELETE
> * `query()`：执行SELECT

### 2.1、关于增删改

> int update(String sql, Object... params) -->  可执行增、删、改语句
>
> int update(Connection con, String sql, Object... parmas) --> 需要调用者提供Connection，支持事务

### 2.2、关于查询

> T query(String sql, ResultSetHandler rsh, Object... params) --> 可执行查询
>
> T query(Connection con, String sql, ResultSetHadler rsh, Object... params) --> 需要调用者提供Connection，支持事务

#### 2.2.1、ResultSetHandler接口

> BeanHandler(单行) --> 构造器需要一个Class类型的参数，用来把一行结果转换成指定类型的javaBean对象;
>
> BeanListHandler(多行) --> 构造器也是需要一个Class类型的参数，用来把一行结果集转换成一个javabean，那么多行就是转换成List对象，一堆javabean；
>
> MapHandler(单行) --> 把一行结果集转换Map对象；
>
> MapListHandler(多行) --> 把一行记录转换成一个Map，多行就是多个Map，即`List<Map>`
>
> ScalarHandler(单行单列) --> 通常用与select count(*) from t_stu语句！结果集是单行单列的！它返回一个Object 聚合函数。

## 三、使用

### 3.1、建库建表

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

### 3.2、项目搭建

> 1. 新建Java项目；
> 2. 在项目下新建lib目录；
> 3. 将MySQL驱动Jar包、Druid连接池Jar包、DbUtils的Jar包拷贝到lib目录下；
> 4. 选中lib目录右键Add as Library--单击OK;
> 5. 将之前使用的最新版本的JdbcUtils工具类拷贝到项目中，并增加如下的方法。

```java
//获取连接池对象
public static DataSource getDataSource() {
    return dataSource;
}
```

### 3.3、创建实体类

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

### 3.4、DbUtils使用

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

### 3.5、事务

> 以下代码基于03_事务2.4.2、2.4.3的代码

#### 3.5.1、DAO代码

```java
import com.qfedu.utils.JdbcUtils;
import org.apache.commons.dbutils.QueryRunner;

import java.sql.Connection;
import java.sql.PreparedStatement;
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

#### 3.5.1、Service代码

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

#### 3.5.2、测试代码

```java
@Test
public void testTransaction() {
    AccountService accountService = new AccountService();

    accountService.trans("10001", "10002", 1000);
}
```

