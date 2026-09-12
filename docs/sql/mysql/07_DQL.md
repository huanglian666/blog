---
title: 07_DQL
---

## 一、准备工作

查询操作是所有操作中使用最频繁的操作，为了进行查询的学习，首先运行一段SQL脚本。

```sql
DROP DATABASE if exists mytest;
CREATE DATABASE mytest;

USE mytest;

/*
	部门表
	deptno	部门编号
	dname	部门名称
	loc		部门位置
*/
CREATE TABLE dept(
	deptno		INT 	PRIMARY KEY,
	dname		VARCHAR(50),
	loc 		VARCHAR(50)
);

/*
	雇员表
	empno		员工编号
	ename		员工姓名
	job			员工工种
	mgr			上级编号
	hiredate	入职日期 	
	sal			薪资
	comm		奖金
	deptno		部门编号
*/
CREATE TABLE emp(
	empno		INT 	PRIMARY KEY,
	ename		VARCHAR(50),
	job		VARCHAR(50),
	mgr		INT,
	hiredate	DATE,
	sal		DECIMAL(7,2),
	comm 		DECIMAL(7,2),
	deptno		INT,
	CONSTRAINT fk_emp FOREIGN KEY(mgr) REFERENCES emp(empno)
);

/*
	创建工资等级表
	grade	工资等级编号
	losal	最低工资
	hisal	最高工资
*/
CREATE TABLE salgrade(
	grade		INT 	PRIMARY KEY,
	losal		INT,
	hisal		INT
);

/*
	创建学生表
	sid			学生编号
	sname		学生姓名
	age			学生年龄
	gander		学生性别
	province	省份
	tuition		学费
*/
CREATE TABLE stu(
	sid		INT 	PRIMARY KEY,
	sname		VARCHAR(50),
	age		INT,
	gander		VARCHAR(10),
	province	VARCHAR(50),
	tuition		INT
);

/*插入dept表数据*/
INSERT INTO dept VALUES (10, '研发部', '北京');
INSERT INTO dept VALUES (20, '市场部', '上海');
INSERT INTO dept VALUES (30, '行政部', '北京');
INSERT INTO dept VALUES (40, '财务部', '北京');
/*插入salgrade表数据*/
INSERT INTO salgrade VALUES (1, 7000, 12000);
INSERT INTO salgrade VALUES (2, 12010, 14000);
INSERT INTO salgrade VALUES (3, 14010, 20000);
INSERT INTO salgrade VALUES (4, 20010, 30000);
INSERT INTO salgrade VALUES (5, 30010, 99990);
/*插入emp表数据*/
INSERT INTO emp VALUES (1009, 'Smith', '董事长', NULL, '2001-11-17', 50000, NULL, 10);
INSERT INTO emp VALUES (1004, 'Tom', '经理', 1009, '2001-04-02', 29750, NULL, 20);
INSERT INTO emp VALUES (1006, 'Lucy', '经理', 1009, '2001-05-01', 28500, NULL, 30);
INSERT INTO emp VALUES (1007, 'Lily', '架构师', 1009, '2001-09-01', 24500, NULL, 10);
INSERT INTO emp VALUES (1008, 'John', '工程师', 1004, '2007-04-19', 30000, NULL, 20);
INSERT INTO emp VALUES (1013, '周杰伦', '工程师', 1004, '2001-12-03', 30000, NULL, 20);
INSERT INTO emp VALUES (1002, '周星驰', '销售员', 1006, '2001-02-20', 16000, 3000, 30);
INSERT INTO emp VALUES (1003, '成龙', '销售员', 1006, '2001-02-22', 12500, 5000, 30);
INSERT INTO emp VALUES (1005, '约翰逊', '销售员', 1006, '2001-09-28', 12500, 14000, 30);
INSERT INTO emp VALUES (1010, '鲍威尔', '销售员', 1006, '2001-09-08', 15000, 0, 30);
INSERT INTO emp VALUES (1012, '史泰龙', '文员', 1006, '2001-12-03', 9500, NULL, 30);
INSERT INTO emp VALUES (1014, '马克思', '文员', 1007, '2002-01-23', 13000, NULL, 10);
INSERT INTO emp VALUES (1011, '恩格斯', '文员', 1008, '2007-05-23', 11000, NULL, 20);
INSERT INTO emp VALUES (1001, '辛格', '文员', 1013, '2000-12-17', 8000, NULL, 20);
INSERT INTO emp VALUES (1033, 'Rose', '经理', 1013, '2011-12-17', 18000, NULL, 20);
INSERT INTO emp VALUES (1034, 'Robin', '经理', 1009, '2011-12-17', 18000, NULL, 10);
INSERT INTO emp VALUES (1038, 'Bob', '司机', 1009, '2011-12-17', 18000, NULL, 50);
/*插入stu表数据*/
INSERT INTO stu VALUES ('1', 'zhangsan', '23', '男', '北京', '21500');
INSERT INTO stu VALUES ('2', 'lisi', '25', '男', '北京', '21500');
INSERT INTO stu VALUES ('3', 'wangwu', '22', '男', '北京', '23500');
INSERT INTO stu VALUES ('4', 'Herry', '25', '男', '北京', '21500');
INSERT INTO stu VALUES ('5', '史莱克', '23', '女', '北京', '21000');
INSERT INTO stu VALUES ('6', '汉克斯', '22', '女', '山东', '22500');
INSERT INTO stu VALUES ('7', '马克', '21', '女', '北京', '21600');
INSERT INTO stu VALUES ('8', '马克思', '23', '男', '北京', '23500');
INSERT INTO stu VALUES ('9', 'Hans', '23', '女', '加利福尼亚', '22500');
INSERT INTO stu VALUES ('10', '古惑仔', '18', '男', '香港', '21500');
INSERT INTO stu VALUES ('11', '琼瑶', '23', '男', '台湾', '21500');
INSERT INTO stu VALUES ('12', '杰克逊', '24', '男', '科罗拉多', '21500');
INSERT INTO stu VALUES ('13', '博尔特', '24', '男', '华盛顿', '22500');
INSERT INTO stu VALUES ('14', '巴斯德', '22', '男', '弗吉尼亚', '23500');
INSERT INTO stu VALUES ('15', '克里', '25', '男', '北京', '21500');
INSERT INTO stu VALUES ('16', '克林顿', '23', '女', '北京', '21000');
INSERT INTO stu VALUES ('17', '希拉里', '22', '女', '山东', '22500');
INSERT INTO stu VALUES ('18', '川普', '21', '女', '北京', '21600');
INSERT INTO stu VALUES ('19', '尤里', '23', '男', '北京', '23500');
INSERT INTO stu VALUES ('20', '加加林', '23', '女', '莫斯科', '22500');
INSERT INTO stu VALUES ('21', '特斯拉', '18', '男', '纽约', '23500');
INSERT INTO stu VALUES ('22', '拉姆斯菲尔德', '23', '丹佛', '湖北', '21500');
INSERT INTO stu VALUES ('23', '盖伊', '23', '男', '佛罗里达', '21500');
```

> 关系结构数据库是以表格（Table）进行数据存储，表格由“行”和“列”组成。
>
> 经验：执行查询语句返回的结果集是一张虚拟表。

## 二、单表查询

### 2.1、基本查询

>SELECT后跟列名
>
>FROM后跟表名

#### 2.1.1、查询所有列

```sql
# 查询所有列
SELECT * FROM 表名
# 查询所有部门的信息
SELECT * FROM dept;
# 查询所有学生的信息
SELECT * FROM student;
```

#### 2.1.2、查询指定列

```sql
# 查询指定列
SELECT 列1 [, 列2, ...列N] FROM 表名;
# 查询所有部门的名称
SELECT dname FROM dept;
# 查询所有的学生姓名和年龄
SELECT sname, age FROM stu;
# 查询所有的学生姓名，年龄和省份
SELECT sname, age, province FROM stu;
```

#### 2.1.3、完全重复的记录只出现一次

```sql
# 查询所有的工种
SELECT job FROM emp;

# 上面查询出的结果有多条是重复的，我们需要将重复记录去除，重复的记录只出现一次
# 去重操作
# 当查询结果中的多行记录一模一样时，只显示一行
# 一般查询所有列时很少会有这种情况，但只查询一列（或几列）时，这种可能就大了
SELECT DISTINCT job FROM emp;
```

#### 2.1.4、列运算

**算数运算**

```sql
# 列可以进行加、减、乘、除运算
# 查询所有员工的姓名和工资提升50%之后的工资
SELECT ename, sal*1.5 FROM emp;

# 查询所有员工的姓名和总工资（工资加奖金）
SELECT ename, sal+comm FROM emp; # 注意这个结果有问题，后面会进行处理
```

**字符串连接运算**

```sql
# MySQL使用CONCAT()进行连接运算, 不能用“+”连接字符串
# 查询所有员工的姓名和工资
SELECT ename, CONCAT(sal, '$') FROM emp;
```

**转换NULL值**

```sql
# 在进行列运算时，如果某一列值为NULL，那么运算之后的结果也为NULL
# 如果我们不希望最终结果为NULL，那么我们需要在运算之前对NULL值进行转换
# 查询所有员工的姓名和总工资（工资加奖金, 如果奖金为NULL则按照奖金为0进行运算）
SELECT ename, sal+IFNULL(comm, 0) FROM emp;
# IFNULL(列名, 转换值)
```

**别名**

```sql
# 对列进行运算后，查询出的结果中的列名不便于阅读，这时需要给列名起一个别名
# 格式：列名 AS 别名
# AS也可以省略，格式：列名 别名
# 查询所有员工的姓名和总工资（工资加奖金, 如果奖金为NULL则按照奖金为0进行运算）
SELECT ename AS '姓名', sal+IFNULL(comm, 0) AS '总工资' FROM emp;
SELECT ename '姓名', sal+IFNULL(comm, 0) '总工资' FROM emp;
# 除了可以给列起别名，也可以给表起别名，在多表查询中会使用到为表起别名
```

#### 2.1.5、条件查询

与前面介绍的UPDATE和DELETE语句一样，SELECT语句也可以使用WHERE子句来控制查询出的记录。

```sql
# 查询部门编号为20的所有员工的信息
SELECT * FROM emp WHERE deptno=20

# 查询工种为工程师的所有员工的信息
SELECT * FROM emp WHERE job='工程师'

# 查询有奖金的所有员工的信息
SELECT * FROM emp WHERE comm IS NOT NULL and comm <> 0;
SELECT * FROM emp WHERE comm IS NOT NULL and comm != 0;
```

#### 2.1.6、模糊查询

> 模糊 -- 不精确
>
> "_"匹配一个任意字符，只匹配一个字符而不是多个
>
> "%"匹配0~N个任意字符
>
> 模糊查询需要使用运算符：LIKE

```sql
# 查询姓“周”的所有员工的信息
SELECT * FROM emp WHERE ename LIKE '周%';

# 查询姓名中包含“杰”的所有员工的信息
SELECT * FROM emp WHERE ename LIKE '%杰%';

# 查询姓“周”并且姓名只有三个字的所有员工的信息
SELECT * FROM emp WHERE ename LIKE '周__';
```

### 2.2、排序　

> 有些时候我们需要对查询出的结果进行排序
>
> 排序分成升序（ASC）和降序（DESC），可以使用多列作为排序条件
>
> 排序使用关键字ORDER BY

```sql
# 排序
# 规则：列名 升序/降序
SELECT 列1, 列2, 列3 FROM 表名 WHERE 条件 ORDER BY 规则1, 规则2,....,规则n　

# 查询所有员工信息，按照工号升序排列
SELECT * FROM emp ORDER BY empno ASC;
# 如果是升序，ASC可以省略
SELECT * FROM emp ORDER BY empno;

# 如果设置了多个排序规则，如果规则1顺序相同则按照顺序2排序, 如果规则2顺序相同则按照顺序3排序...
# 查询所有员工信息，按照工资升序排列，如果工资相同，按照工号降序排列
SELECT * FROM emp ORDER BY sal ASC, empno DESC;
```

### 2.3、聚合函数

>聚合函数做某列的纵向运算, 为NULL项不参与运算.
>
>| 函数  | 功能     |
>| ----- | -------- |
>| COUNT | 计算个数 |
>| MAX   | 最大值   |
>| MIN   | 最小值   |
>| AVG   | 平均值   |
>| SUM   | 和       |

```sql
# 查询公司员工个数
SELECT count(1) FROM emp;
SELECT count(*) FROM emp;

# 查询公司最高工资
SELECT MAX(sal) FROM emp;

# 查询公司最低工资
SELECT MIN(sal) FROM emp;

# 查询公司所有员工工资和
SELECT SUM(sal) FROM emp;

# 查询公司员工工资的平均值
SELECT AVG(sal) FROM emp;
```

### 2.4、分组查询

> 分组查询是把记录使用某一列进行分组，然后查询组信息。
>
> 分组查询查的是组信息，不能带“个人”信息。
>
> 组信息包括：
>
> * 分组列
> * 聚合函数
>
> 分组查询使用GROUP BY关键字。

```sql
# 查询每个工种的平均工资
SELECT job, AVG(sal) FROM emp GROUP BY job;

# 查询每个工种的员工数量
SELECT job, COUNT(1) FROM emp GROUP BY job;
```

> 分组查询也可以设置条件，分组后的条件使用HAVING, 分组前的条件使用WHERE

```sql
# 查询工资大于15000的员工的工种，以及工种的平均工资
SELECT job, AVG(sal) FROM emp WHERE sal>15000 GROUP BY job;

# 查询工资大于15000的员工的工种，以及工种的平均工资，只显示超过两人的工种
SELECT job, AVG(sal) FROM emp WHERE sal>15000 GROUP BY job HAVING COUNT(*)>=2;
```

### 2.5、LIMIT子句

> 多用在分页查询中
>
> LIMIT用来限定查询结果的起始行，以及查询行数

```sql
# 语法
SELECT 列名 FROM 表名 LIMIT 起始行，查询行数;

# 查询员工表中前五名员工的所有信息
# 起始行是从 0 开始，代表了第一行
SELECT * FROM emp LIMIT 0, 5;

#查询员工表中从第4条开始，查询10行
SELECT * FROM emp LIMIT 3,10;
```

> LIMIT多数时候用在分页查询中
>
> 起始行计算公式：（当前页-1）* 每页的记录数

```sql
# 查询员工表中第一页信息，显示五条
SELECT * FROM emp LIMIT 0, 5;

# 查询员工表中第二页信息，显示五条
SELECT * FROM emp LIMIT 5, 5;
```

### 2.6、查询语句执行顺序

```sql
SELECT
FROM
WHERE
GROUP BY
HAVING
ORDER BY
LIMIT
```

## 三、多表查询

> 使用多表关联查询的原因--查询的数据分布在多个表中

### 3.1、合并结果集

> 合并结果集就是把两个select语句的查询结果合并到一起，结果集就是一个表格。
>
> 要求：被合并的两个结果：列数必须相同。

```sql
# UNION：去除重复记录
SELECT * FROM t1 UNION SELECT * FROM t2;
# UNION ALL：不去除重复记录
SELECT * FROM t1 UNION ALL SELECT * FROM t2;
```

### 3.2、内连接

```sql
# 方式1(MySQL特有，不符合SQL标准)
SELECT 列名 FROM 表1, 表2 WHERE 表1.列名 条件运算符 表2.列名 [AND 条件];
# 方式2(符合SQL标准)
SELECT 列名 FROM 表1 INNER JOIN 表2 ON 表1.列名 条件运算符 表2.列名 [WHERE 条件];

# 列出员工的姓名和部门名称
SELECT e.ename, d.dname FROM emp e, dept d WHERE e.deptno=d.deptno;
SELECT e.ename, d.dname FROM emp e INNER JOIN dept d ON e.deptno=d.deptno;
```

> 上面的查询只能查询出拥有部门的员工和拥有员工的部门，没有部门的员工和没有员工的部门是查询不到的。如果要将所有的员工和部门都查询出来需要使用外连接。

### 3.3、外连接

> 结果集中包含主表所有数据行，如果主表的某行在从表中没有匹配行时，则从表的选择列为NULL值。

#### 3.3.1、左外连接

> 左外连接是以左表为主表，去关联右表(从表)，**结果集中包含主表所有数据行**，如果主表的某行在从表中没有匹配行时，则从表的选择列为NULL值。

```sql
# 语法
SELECT 列名 FROM 左表 LEFT [OUTER] JOIN 右表 ON 左表.列名  条件运算符 右表.列名 [WHERE 条件];

# 列出员工的姓名和部门名称, 包括没有部门的员工
SELECT e.ename, d.dname FROM emp e LEFT JOIN dept d ON e.deptno=d.deptno;

# 列出员工的姓名和部门名称, 包括没有员工的部门
SELECT e.ename, d.dname FROM dept d LEFT JOIN emp e ON e.deptno=d.deptno;
```

#### 3.3.2、右外连接

> 右外连接是以右表为主表，去关联左表(从表)，**结果集中包含主表所有数据行**，如果主表的某行在从表中没有匹配行时，则从表的选择列为NULL值。

```sql
# 语法
SELECT 列名 FROM 左表 RIGHT [OUTER] JOIN 右表 ON 左表.列名 条件运算符 右表.列名 [WHERE 条件];

# 列出员工的姓名和部门名称, 包括没有员工的部门
SELECT e.ename, d.dname FROM emp e RIGHT JOIN dept d ON e.deptno=d.deptno;

# 列出员工的姓名和部门名称, 包括没有部门的员工
SELECT e.ename, d.dname FROM dept d RIGHT JOIN emp e ON e.deptno=d.deptno;
```

#### 3.3.3、全外连接

> 完全连接左表和右表中所有行，当某行数据在另一个表中没有匹配时，则另一个表的选择列值为NULL。

```sql
# 语法
SELECT 列名 FROM 左表 FULL [OUTER] JOIN 右表 ON 左表.列名 条件运算符 右表.列名 [WHERE 条件]
```

> MySQL不支持这种语法，可以使用合并结果集进行模拟全外连接。

```sql
SELECT e.ename, d.dname FROM emp e LEFT JOIN dept d ON e.deptno=d.deptno
UNION
SELECT e.ename, d.dname FROM emp e RIGHT JOIN dept d ON e.deptno=d.deptno;
```

## 四、子查询

> 子查询就是嵌套查询，即SELECT中包含SELECT，如果一条语句中存在两个或两个以上SELECT，那么就是子查询语句了。
>
> 子查询出现的位置：
>
> * WHERE后，作为条件的一部分；
> * FROM后，作为被查询的一条表。

### 4.1、WHERE后

```sql
# 查询工资最高的员工的信息
SELECT * FROM emp WHERE emp.sal=(最高薪资);
# 查询员工的最高薪资
SELECT MAX(sal) FROM emp;
# 综合
SELECT * FROM emp WHERE emp.sal=(SELECT MAX(sal) FROM emp);


# 查询和文员在同一部门的所有员工的信息
SELECT * FROM emp WHERE emp.deptno=(文员的部门编号);
# 文员的部门编号
SELECT DISTINCT deptno FROM emp WHERE emp.job='文员';
# 综合
SELECT * FROM emp WHERE emp.deptno IN (SELECT DISTINCT deptno FROM emp WHERE emp.job='文员');


# 查询高于30部门所有人工资的员工详细信息
SELECT * FROM emp WHERE sal>ALL(SELECT sal FROM emp WHERE deptno=30);
# 查询高于30部门任意一人工资的员工详细信息
SELECT * FROM emp WHERE sal>ANY(SELECT sal FROM emp WHERE deptno=30);
# 查询工资、部门与周杰伦完全相同的员工信息
SELECT * FROM emp WHERE (sal, deptno) IN (SELECT sal, deptno FROM emp WHERE ename='周杰伦');
```

### 4.2、FROM后

```sql
# 列出在每个部门名称、员工数量、平均工资
SELECT
	d.dname, e.cnt, e.avgsal
FROM
	(SELECT deptno, COUNT(*) cnt, AVG(sal) avgsal FROM emp GROUP BY deptno) e, dept d
WHERE e.deptno=d.deptno;
```



