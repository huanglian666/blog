---
title: DML
date: 2026-09-12
icon: fa-solid fa-pen-to-square
category: [数据库]
tag: [MySQL]
---

# DML

DML（Data Manipulation Language，数据操作语言）：对表记录进行增、删、改。

> [!IMPORTANT]
> DML 是对表的**内容**进行操作，DDL 是对表的**结构**进行操作，两者有本质区别。

## 1. 准备工作

先建库建表：

```sql
# 创建数据库
CREATE DATABASE IF NOT EXISTS mydb;
# 切换数据库
USE mydb;

# 删除表
DROP TABLE IF EXISTS stu;
# 创建学生表
CREATE TABLE stu  (
  id int(11),
  name varchar(20),
  age int(11),
  gender varchar(5),
  addr varchar(30)
);
```

由于 DML 对表的内容进行操作，为了验证操作是否生效，我们需要查询表的内容，SQL 语句如下：

```sql
# 查找表的所有记录
SELECT * FROM 表名;
```

## 2. DML的使用

### 2.1 插入数据

INSERT 用来在表中增加数据，增加的数据可能是一行，也可能是多行，但不可能是半行。

```sql
# 在表名后给出要插入的列名，其他没有指定的列等同于插入null值。所以插入记录总是插入一行，不可能是半行。
# 在VALUES后给出列值，值的顺序和个数必须与前面指定的列对应
INSERT INTO 表名(列名1, 列名2, ...) VALUES(列值1, 列值2, ...);

INSERT INTO stu(id, name, age, gender, addr) VALUES(1, 'zs', 10, '男', '青岛市北区');
INSERT INTO stu(name, age, gender, addr) VALUES('ls', 10, '男', '青岛市南区');
INSERT INTO stu(name, age) VALUES("ww", 20);

# 没有给出要插入的列，那么表示插入所有列
# 值的个数必须是该表列的个数
# 值的顺序，必须与表创建时给出的列的顺序相同
INSERT INTO 表名 VALUES(列值1, 列值2, ...);

INSERT INTO stu VALUES(1, 'zs', 10, '男', '青岛市北区');
INSERT INTO stu VALUES(2, 'ls', 10, '男', '青岛市南区');

# 一次插入多条数据
INSERT INTO 表名(列名1, 列名2, ...) VALUES(列值1, 列值2, ...), (列值1, 列值2, ...), (列值1, 列值2, ...);

INSERT INTO stu(name, age) VALUES('zs', 20), ('ls', 11), ('ww', 12);
```

### 2.2 修改数据

UPDATE 用来修改表中已有的数据。

```sql
# WHERE条件是可选的，如果没有条件，就修改所有记录。多数时候我们都加上WHERE条件
UPDATE 表名 SET 列名1=列值1, 列名2=列值2, ...[WHERE 条件]
```

关于条件：

- 条件必须是一个 boolean 类型的值或表达式；
- 运算符：`=`、`!=`、`<>`、`>`、`<`、`>=`、`<=`、`between...and...`、`in(...)`、`is null`、`not`、`or`、`and`；
- 条件写法与后面学习的删除数据及 DQL 中的条件通用。

```sql
UPDATE stu SET addr='qd', gender='男' WHERE age >= 18 AND age <= 80;
UPDATE stu SET addr='qd', gender='男' WHERE age <> 18;
UPDATE stu SET addr='qd', gender='男' WHERE age BETWEEN 18 AND 80;
UPDATE stu SET addr='qdsnq' WHERE name='zs' OR name='ls';
UPDATE stu SET addr='qdsnq' WHERE name IN('zhangsan','lisi');
UPDATE stu SET addr='qdsnq' WHERE age IS NOT null;
```

### 2.3 删除数据

DELETE 用来删除表中已有的数据。

```sql
# WHERE条件是可选的，如果没有条件，就删除所有记录。多数时候我们都加上WHERE条件
DELETE FROM 表名 [WHERE 条件];

# 删除id为1的学生
DELETE FROM stu WHERE id=1;

# 与DELETE不加WHERE删除整表数据不同，TRUNCATE是把表销毁，再按照原表的格式创建一张新表
TRUNCATE TABLE 表名;
```
