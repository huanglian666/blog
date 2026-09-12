## 一、准备工作

> 建库建表

```sql
DROP DATABASE if exists mydb2;
CREATE DATABASE mydb2;

USE mydb2;


DROP TABLE IF EXISTS account;
CREATE TABLE account  (
  id int(11) NOT NULL AUTO_INCREMENT,
  cardnum varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  money decimal(10, 0) NULL DEFAULT NULL,
  PRIMARY KEY (id) USING BTREE
);

INSERT INTO account VALUES (1, '10001', 5000);
INSERT INTO account VALUES (2, '10002', 5000);
```

> 生活当中转账是转账方账户扣钱，收账方账户加钱。我们用数据库操作来模拟现实转账
>
> 使用SQL语句模拟上述操作

```sql
# A账户转账给B账户1000元
# A账户减1000元
UPDATE account SET money=money-1000 WHERE cardnum='10001';

# B账户加1000元
UPDATE account SET money=money+1000 WHERE cardnum='10002';
```

> 模拟转账错误

```sql
# A账户转账给B账户1000元
# A账户减1000元
UPDATE account SET money=money-1000 WHERE cardnum='10001';
# 中间出现错误 断电、异常、出错...

# B账户加1000元
UPDATE account SET money=money+1000 WHERE cardnum='10002';
```

> 上述代码在减操作后过程中出现了异常或加钱语句出错，会发现，减钱仍旧是成功的，而加钱失败了！
>
> 注意：每条 SQL 语句都是一个独立的操作，一个操作执行完对数据库是永久性的影响。
>
> 上面的情形是不能容忍的，我们希望类似转账这种操作涉及到的多步操作要么全部成功，要么全部失败。

## 二、关于事务

### 2.1、什么是事务

> 一个操作序列，这些操作要么都执行，要么都不执行，它是一个不可分割的工作单位。
>
> 事务要处理的问题，把多个对数据库的操作绑定成一个事务，**要么都成功，要么都失败**。

### 2.2、MySQL中处理事务

> MySQL中处理事务涉及三个操作：
>
> * 开启事务 
> * 提交事务
> * 回滚

```sql
# 开启事务
START TRANSACTION;

# 多个SQL操作

# 提交事务
COMMIT;
# 回滚
ROLLBACK;
```

> 在执行SQL语句之前，先执行START TRANSACTION，这就开启了一个事务（事务的起点），然后可以去执行多条SQL语句;
>
> 后要结束事务，COMMIT表示提交，即事务中的多条SQL语句所做出的影响会持久化到数据库中，或者ROLLBACK，表示回滚，即回滚到事务的起点，之前做的所有操作都被撤消了；

```sql
# 开启事务
START TRANSACTION;

# 多个SQL操作
# A账户转账给B账户1000元
# A账户减1000元
UPDATE account SET money=money-1000 WHERE cardnum='10001';
# B账户加1000元
UPDATE account SET money=money+1000 WHERE cardnum='10002';

# 提交事务
COMMIT;
# 回滚
ROLLBACK;
```

### 2.3、事务原理

> 数据库会为每一个客户端都维护一个空间独立的缓存区(回滚段)，一个事务中所有的增删改语句的执行结果都会缓存在回滚段中，只有当事务中所有SQL语句均正常结束（COMMIT），才会将回滚段中的数据同步到数据库。否则无论因为哪种原因失败，整个事务将回滚（ROLLBACK）。

### 2.4、事务特性

>**原子性（Atomicity）**：事务中所有操作作为一个整体，是**不可再分割**的原子单位。事务中所有操作要么全部执行成功，要么全部执行失败。
>
>**一致性（Consistency）**：事务执行后，数据库状态与其它业务规则保持一致。如转账业务，无论事务执行成功与否，参与转账的两个账号余额之和应该是不变的。
>
>**隔离性（Isolation）**：隔离性是指在并发操作中，不同事务之间应该隔离开来，使每个并发中的事务不会相互干扰。
>
>**持久性（Durability）**：一旦事务提交成功，事务中所有的数据操作都必须被持久化到数据库中，即使提交事务后，数据库马上崩溃，在数据库重启时，也必须能保证通过某种机制恢复数据。

### 2.5、事务隔离级别

#### 2.5.1、事务并发读问题

> 在现代关系型数据库中，事务机制是非常重要的，假如在多个事务并发操作数据库时，如果没有有效的机制进行避免就会导致出现**脏读，不可重复读，幻读**。
>
> **脏读**：
>
> * 在事务A执行过程中，事务A对数据资源进行了修改，事务B读取了事务A修改后的数据；
> * 由于某些原因，事务A并没有完成提交，发生了回滚操作，则事务B读取的数据就是脏数据。
> * 这种读取到另一个事务未提交的数据的现象就是脏读。
>
> | 时间点 | 事务A              | 事务B              |
> | ------ | ------------------ | ------------------ |
> | 1      | 开启事务           |                    |
> | 2      |                    | 开启事务           |
> | 3      | 修改（update）数据 |                    |
> | 4      |                    | 查询（select）数据 |
> | 5      | 回滚               |                    |
>
> **不可重复读**：
>
> * 事务B读取了两次数据资源，在这两次读取的过程中事务A修改了数据，导致事务B在这两次读取出来的数据不一致；
> * 这种在同一个事务中，前后两次读取的数据不一致的现象就是不可重复读。
>
> | 时间点 | 事务A              | 事务B              |
> | ------ | ------------------ | ------------------ |
> | 1      | 开启事务           |                    |
> | 2      |                    | 开启事务           |
> | 3      |                    | 查询（select）数据 |
> | 4      | 修改（update）数据 |                    |
> | 5      | 提交               |                    |
> | 6      |                    | 查询（select）数据 |
>
> **幻读**：
>
> * 幻读是针对数据**插入（INSERT）**操作来说的。
> * 事务A查询某条数据不存在，事务B插入该条数据并提交；
> * A再次查询该数据仍然不存在，但是无法插入成功，让用户感觉很魔幻，感觉出现了幻觉，这就叫幻读。
>
> | 时间点 | 事务A                              | 事务B              |
> | ------ | ---------------------------------- | ------------------ |
> | 1      | 开启事务                           |                    |
> | 2      | 查询（select）数据                 |                    |
> | 3      |                                    | 开启事务           |
> | 4      |                                    | 插入（insert）数据 |
> | 5      |                                    | 提交               |
> | 6      | 查询（select）数据，数据不存在     |                    |
> | 7      | 插入（insert）相同主键数据，不成功 |                    |
> | 8      |                                    | 查询（select）数据 |

#### 2.5.2、四大隔离级别简介

> 为了解决以上的问题，主流的关系型数据库都会提供四种事务的隔离级别。事务隔离级别从低到高分别是：
>
> * 读未提交(READ UNCOMMITTED)
> * 读已提交(READ COMMITTED)
> * 可重复读(REPEATABLE READ)
> * 串行化(SERIALIZABLE)
>
> 事务隔离级别等级越高，越能保证数据的一致性和完整性，但是执行效率也越低。所以在设置数据库的事务隔离级别时需要做一下权衡，**MySQL默认是可重复读（REPEATABLE READ）的级别**。
>
> 下表展示了四种隔离级别对并发读问题的解决程度。
>
> | 隔离级别                   | 脏读   | 不可重复读 | 幻读   |
> | -------------------------- | ------ | ---------- | ------ |
> | 读未提交(READ UNCOMMITTED) | 可能   | 可能       | 可能   |
> | 读已提交(READ COMMITTED)   | 不可能 | 可能       | 可能   |
> | 可重复读(REPEATABLE READ)  | 不可能 | 不可能     | 可能   |
> | 串行化(SERIALIZABLE)       | 不可能 | 不可能     | 不可能 |

#### 2.5.3、隔离级别常见操作

> 查看事务隔离级别

```sql
select @@tx_isolation;
show variables like 'tx_isolation';
```

> 修改隔离级别

```sql
set [作用域] transaction isolation level [事务隔离级别]
# 作用域可以是SESSION或GLOBAL，SESSION只针对当前回话窗口，GLOBAL是全局的
# 隔离级别是read uncommitted、read committed、repeatable read、serializable这四种，不区分大小写
set [session | global] transaction isolation level {read uncommitted | read committed | repeatable read | serializable}

# 案例，设置全局隔离级别为read uncommitted
set global transaction isolation level read uncommitted
```

> **设置全局隔离级别完成后，只对之后新起的SESSION才起作用，对已经启动SESSION无效。如果用Shell客户端那就要重新连接MySQL，如果用Navicat那就要创建新的查询窗口。**

#### 2.5.4、隔离级别演示

> 准备工作

```sql
USE mydb2;

DROP TABLE IF EXISTS `tb_test`;
CREATE TABLE `tb_test`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `num` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

INSERT INTO `tb_test` VALUES (1, 1);
INSERT INTO `tb_test` VALUES (2, 2);
INSERT INTO `tb_test` VALUES (3, 3);
```

##### 2.5.4.1、读未提交(READ UNCOMMITTED)

> 任何事务对数据的修改都会第一时间暴露给其他事务，即使事务还没有提交。

```sql
# 设置隔离级别为read uncommitted
set session transaction isolation level read uncommitted；
```

> 重新启动两个窗口连接MySQL，分别代表A、B两个事务。两个事务分别用A、B代替。
>
> A：启动事务，此时数据为初始状态

```
mysql> select @@tx_isolation;
+------------------+
| @@tx_isolation   |
+------------------+
| READ-UNCOMMITTED |
+------------------+
1 row in set, 1 warning (0.00 sec)
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)
mysql> select * from tb_test;
+----+------+
| id | num  |
+----+------+
|  1 |    1 |
|  2 |    2 |
|  3 |    3 |
+----+------+
3 rows in set (0.00 sec)
```

> B：启动事务，更新数据，但不提交

```
mysql> update tb_test set num=10 where id=1;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select * from tb_test;
+----+------+
| id | num  |
+----+------+
|  1 |   10 |
|  2 |    2 |
|  3 |    3 |
+----+------+
3 rows in set (0.00 sec)
```

> A：再次读取数据，发现数据已经被修改了，这就是所谓的“脏读”

```
mysql> select * from tb_test;
+----+------+
| id | num  |
+----+------+
|  1 |   10 |
|  2 |    2 |
|  3 |    3 |
+----+------+
3 rows in set (0.00 sec)
```

> B：回滚事务

```
mysql> rollback;
Query OK, 0 rows affected (0.00 sec)
```

> A：再次读数据，发现数据变回初始状态

```
mysql> select * from tb_test;
+----+------+
| id | num  |
+----+------+
|  1 |    1 |
|  2 |    2 |
|  3 |    3 |
+----+------+
3 rows in set (0.00 sec)
```

> 经过上面的实验可以得出结论，事务B更新了一条记录，但是没有提交，此时事务A可以查询出未提交记录。造成脏读现象。读未提交(READ UNCOMMITTED)是最低的隔离级别。

##### 2.5.4.2、读已提交(READ COMMITTED)

> 既然读未提交没办法解决脏数据问题，那么就有了读提交。读提交就是一个事务只能读到其他事务已经提交过的数据，也就是其他事务调用commit命令之后的数据。那脏数据问题迎刃而解了。

```sql
# 设置隔离级别为read committed
set session transaction isolation level read committed;
```

> A：启动事务，此时数据为初始状态

```
mysql> select @@tx_isolation;
+------------------+
| @@tx_isolation   |
+------------------+
| READ-UNCOMMITTED |
+------------------+
1 row in set, 1 warning (0.00 sec)
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)
mysql> select * from tb_test;
+----+------+
| id | num  |
+----+------+
|  1 |    1 |
|  2 |    2 |
|  3 |    3 |
+----+------+
3 rows in set (0.00 sec)
```

> B：启动事务，更新数据，但不提交

```
mysql> update tb_test set num=10 where id=1;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select * from tb_test;
+----+------+
| id | num  |
+----+------+
|  1 |   10 |
|  2 |    2 |
|  3 |    3 |
+----+------+
3 rows in set (0.00 sec)
```

> A：再次读取数据，发现还是之前不去到的数据，说明在读已提交(READ COMMITTED)级别下解决了脏读的问题

```
mysql> select * from tb_test;
+----+------+
| id | num  |
+----+------+
|  1 |    1 |
|  2 |    2 |
|  3 |    3 |
+----+------+
3 rows in set (0.00 sec)
```

> B：提交

```
mysql> commit;
Query OK, 0 rows affected (0.00 sec)
```

> A：再次读取数据，发现数据已经被修改了

```
mysql> select * from tb_test;
+----+------+
| id | num  |
+----+------+
|  1 |   10 |
|  2 |    2 |
|  3 |    3 |
+----+------+
3 rows in set (0.00 sec)
```

> 这就出现了一个问题，在同一事务中(本例中的事务A)，事务的不同时刻同样的查询条件，查询出来的记录内容是不一样的，事务B的提交影响了事务A的查询结果，这就是不可重复读，也就是读已提交隔离级别。
>
> 每个SELECT语句都有自己的一份快照，而不是一个事务一份，所以在不同的时刻，查询出来的数据可能是不一致的。
>
> 读已提交解决了脏读的问题，但是无法做到可重复读。

##### 2.5.4.3、可重复读(REPEATABLE READ)

> 可重复是对比不可重复而言的，上面说不可重复读是指同一事务不同时刻读到的数据值可能不一致。而可重复读是指，事务不会读到其他事务对已有数据的修改，及时其他事务已提交，也就是说，事务开始时读到的已有数据是什么，在事务提交前的任意时刻，这些数据的值都是一样的。但是，对于其他事务新插入的数据是读取不到，也无法插入相同的数据，这也就引发了幻读问题。

```sql
# 设置隔离级别为repeatable read
set session transaction isolation level repeatable read;
```

> A：启动事务，此时数据为初始状态

```
mysql> select @@tx_isolation;
+------------------+
| @@tx_isolation   |
+------------------+
| REPEATABLE-READ |
+------------------+
1 row in set, 1 warning (0.00 sec)
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)
mysql> select * from tb_test;
+----+------+
| id | num  |
+----+------+
|  1 |    1 |
|  2 |    2 |
|  3 |    3 |
+----+------+
3 rows in set (0.00 sec)
```

> B：开启事务，修改数据并提交

```
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

mysql> update tb_test set num=10 where id=1;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> commit;
Query OK, 0 rows affected (0.00 sec)
```

> A：查询数据，发现和之前的查询结果相同。

```
mysql> select * from tb_test;
+----+------+
| id | num  |
+----+------+
|  1 |    1 |
|  2 |    2 |
|  3 |    3 |
+----+------+
3 rows in set (0.00 sec)
```

> 以上可以看到，可重复读(REPEATABLE READ)隔离级别解决了不可重复读问题，但是目前存在幻读的问题。
>
> 将数据库表恢复成之前的状态，分别开启两个事务。
>
> A：启动事务，此时数据为初始状态

```
mysql> select @@tx_isolation;
+------------------+
| @@tx_isolation   |
+------------------+
|  REPEATABLE-READ |
+------------------+
1 row in set, 1 warning (0.00 sec)
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)
mysql> select * from tb_test;
+----+------+
| id | num  |
+----+------+
|  1 |    1 |
|  2 |    2 |
|  3 |    3 |
+----+------+
3 rows in set (0.00 sec)
```

> B：开启事务，添加数据，提交

```
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

mysql> insert into tb_test(num) values(4);
Query OK, 1 row affected (0.00 sec)

mysql> commit;
Query OK, 0 rows affected (0.00 sec)
```

> A：查询，看不到新添加的数据，插入主键为4的数据，失败

```
mysql> select * from tb_test;
+----+------+
| id | num  |
+----+------+
|  1 |    1 |
|  2 |    2 |
|  3 |    3 |
+----+------+
3 rows in set (0.00 sec)

mysql> insert into tb_test(id, num) values(4,4);
ERROR 1062 (23000): Duplicate entry '4' for key 'PRIMARY'
```

##### 2.5.4.4、串行化(SERIALIZABLE)

> 这是最高的隔离级别，它通过强制事务排序，使之不可能相互冲突，从而解决幻读问题。简言之，它是在每个读的数据行上加上共享锁。在这个级别，可能导致大量的超时现象和锁竞争。这种隔离级别很少使用

```sql
# 设置全局隔离级别为serializable
set session transaction isolation level serializable;
```

