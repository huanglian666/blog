---
title: 数据库
icon: fa-solid fa-database
---

数据库是后端开发绕不开的基本功，本板块从 MySQL 的安装使用讲到 SQL 语句的完整分类，再到 Java 程序访问数据库的标准接口 JDBC。内容以关系型数据库 MySQL 为主，适合已具备 Java 基础语法的读者；SQL 部分零基础也能直接上手。

## 学习路线

建议先学 **MySQL**，沿"概述与安装 → DDL/DML/DQL 等语句分类 → 视图、函数、存储过程"的顺序把 SQL 基础打牢；再学 **JDBC**，理解 Java 程序如何连接并操作数据库，数据库连接池与事务是后续框架学习的高频考点。学完本板块即可进入 [框架学习](/framework/) 板块——MyBatis 正是 JDBC 之上的持久层框架。

## MySQL

- [MySQL概述](./mysql/01_MySQL概述.md)
- [MySQL安装及配置](./mysql/02_MySQL安装及配置.md)
- [MySQL客户端工具](./mysql/03_MySQL客户端工具.md)
- [SQL概述及DDL](./mysql/04_SQL概述及DDL.md)
- [DML](./mysql/05_DML.md)
- [约束](./mysql/06_约束.md)
- [DQL](./mysql/07_DQL.md)
- [DCL](./mysql/08_DCL.md)
- [TPL](./mysql/09_TPL.md)
- [视图](./mysql/10_视图.md)
- [常用函数](./mysql/11_常用函数.md)
- [变量、存储过程与函数](./mysql/12_变量_存储过程_函数.md)

## JDBC

- [JDBC](./jdbc/01_JDBC.md)
- [数据库连接池](./jdbc/02_数据库连接池.md)
- [事务](./jdbc/03_事务.md)
- [Commons DbUtils](./jdbc/04_Commons_DbUtils.md)
