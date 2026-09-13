---
title: 08_DCL
date: 2026-09-12
---

## 一、是什么

> **数据控制语言** (Data Control Language) 在SQL语言中，是一种可对数据访问权进行控制的指令，它可以控制特定用户账户对数据表、查看表、存储程序、用户自定义函数等数据库对象的控制权。

## 二、常用操作

### 2.1、创建用户

```sql
# 语法
CREATE USER 用户名@地址 IDENTIFIED BY '密码';

# 创建用户user1，密码设置为1234
CREATE USER user1@localhost IDENTIFIED BY '1234';
```

### 2.2、用户授权

```sql
# 语法
GRANT 权限1, …, 权限n ON 数据库.* TO 用户名;

# 将mydb1下的所有表的特定权限都赋给user1
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT ON mydb1.* TO user1@localhost;
# 将mydb1下的所有表的所有权限都赋给user1
GRANT ALL ON mydb1.* TO user1@localhost;
```

### 2.3、查看用户权限

```sql
# 语法
SHOW GRANTS FOR 用户名@主机名;

# 查看user1的权限
SHOW GRANTS FOR user1@localhost;
```

### 2.4、撤销权限

```sql
# 语法
REVOKE 权限1, … , 权限n ON 数据库.* FORM 用户名

# 撤销user1的在数据库mydb1上的部分权限
REVOKE create,alter,drop ON mydb1.* from user1@localhost;
# 撤销user1的在数据库mydb1上的所有权限
REVOKE ALL ON mydb1.* from user1@localhost;
```

### 2.5、删除用户

```sql
# 语法
DROP USER 用户名;

# 删除用户user1
DROP USER user1@localhost;
```

### 2.6、修改用户密码

```sql
# 语法
USE mysql;
UPDATE USER SET authentication_string=PASSWORD('密码') WHERE USER='用户名' and host='IP';
FLUSH PRIVILEGES;

# 修改user1的密码为user1
USE mysql;
UPDATE USER SET authentication_string=PASSWORD('user1') WHERE USER='user1' and host='localhost';
FLUSH PRIVILEGES;
```