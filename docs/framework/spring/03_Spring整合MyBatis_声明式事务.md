---
title: 03_Spring整合MyBatis_声明式事务
---

## 一、Spring整合MyBatis基础工程搭建

> 新建Maven工程，导入坐标，pom.xml配置如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.qfedu</groupId>
    <artifactId>spring_mybatis</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>2.0.3</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.4.5</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.47</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.1.5</version>
        </dependency>
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

> 基础工程就是之前我们学习MyBatis时使用的工程，里面没有任何Spring的内容。

### 1.1、建库建表

```sql
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `roleName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `roleDesc` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, '校长', '负责全面工作');
INSERT INTO `sys_role` VALUES (2, '教研专员', '课程研发工作');
INSERT INTO `sys_role` VALUES (3, '讲师', '授课工作');
INSERT INTO `sys_role` VALUES (4, '班主任', '班级日常管理，协助解决学生的问题');
INSERT INTO `sys_role` VALUES (5, '就业专员', '负责学员就业工作');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phoneNum` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, '张三', 'zhangsan@126.com', '111', '18660701111');
INSERT INTO `sys_user` VALUES (2, '王五', 'wangwu@126.com', '222', '18660702222');
INSERT INTO `sys_user` VALUES (3, '李华', 'lihua@126.com', '333', '18660703333');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `userId` bigint(20) NOT NULL,
  `roleId` bigint(20) NOT NULL,
  PRIMARY KEY (`userId`, `roleId`) USING BTREE,
  INDEX `roleId`(`roleId`) USING BTREE,
  CONSTRAINT `sys_user_role_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `sys_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `sys_user_role_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `sys_role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES (1, 1);
INSERT INTO `sys_user_role` VALUES (1, 2);
INSERT INTO `sys_user_role` VALUES (2, 2);
INSERT INTO `sys_user_role` VALUES (2, 3);
INSERT INTO `sys_user_role` VALUES (3, 5);
```

### 1.2、创建实体类

> Role.java

```java
public class Role {

    private Long id;
    private String roleName;
    private String roleDesc;
    
    //set和get方法
    //toString方法
}
```

> User.java

```java
public class User {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String phoneNum;
    private List<Role> roles;
    
    //set和get方法
    //toString方法
}
```

### 1.3、创建接口

> RoleMapper.java

```java
public interface RoleMapper {
    List<Role> list();

    void save(Role role);

    List<Role> fingByUserId(Long uid);
}
```

> UserMapper.java

```java
public interface UserMapper {
    List<User> list();

    void save(User user);

    void delete(Long uid);
}
```

> UserRoleMapper.java

```java
public interface UserRoleMapper {

    void save(@Param("uid") Long uid, @Param("rid") Long rid);

    void delete(Long uid);
}
```

### 1.4、创建映射配置文件

> RoleMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.qfedu.mapper.RoleMapper">
    <select id="list" resultType="role">
        select * from sys_role
    </select>

    <select id="fingByUserId" resultType="role" parameterType="long">
        select * from sys_user u, sys_user_role ur, sys_role r where u.id=ur.userId and ur.roleId=r.id and u.id=#{id}
    </select>

    <insert id="save" parameterType="role">
        insert into sys_role(roleName, roleDesc) values(#{roleName}, #{roleDesc})
    </insert>
</mapper>
```

> UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.qfedu.mapper.UserMapper">
    <resultMap id="userMap" type="user">
        <id column="id" property="id" />
        <result column="username" property="username" />
        <result column="email" property="email" />
        <result column="password" property="password" />
        <result column="phoneNum" property="phoneNum" />
        <collection property="roles" ofType="role">
            <id column="rid" property="id" />
            <result column="roleName" property="roleName" />
            <result column="roleDesc" property="roleDesc" />
        </collection>
    </resultMap>
    
    <select id="list" resultType="user" resultMap="userMap">
        SELECT
            u.*, r.id rid, r.roleDesc roleDesc, r.roleName roleName
        FROM
            sys_user u, sys_user_role ur, sys_role r
        WHERE
            u.id=ur.userId AND r.id=ur.roleId
    </select>

    <insert id="save" parameterType="user">
        <selectKey keyProperty="id" keyColumn="id" resultType="java.lang.Long" order="AFTER">
            select last_insert_id()
        </selectKey>
        insert into sys_user(username, email, password, phoneNum) values(#{username}, #{email}, #{password}, #{phoneNum})
    </insert>

    <delete id="delete" parameterType="long">
        delete from sys_user where id=#{uid}
    </delete>
</mapper>
```

> UserRoleMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.qfedu.mapper.UserRoleMapper">
    <insert id="save">
        insert into sys_user_role values(#{uid}, #{rid})
    </insert>

    <delete id="delete" parameterType="long">
        delete from sys_user_role where userId=#{uid}
    </delete>
</mapper>
```

### 1.5、创建JDBC配置文件

```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/spring_mybatis?useSSL=false&useUnicode=true&characterEncoding=utf8
jdbc.username=root
jdbc.password=root
```

### 1.6、创建核心配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 引入外部配置文件 -->
    <properties resource="jdbc.properties" />

    <!-- 配置别名 -->
    <typeAliases>
        <package name="com.qfedu.entity" />
    </typeAliases>
    
    <!-- 配置环境 -->
    <environments default="mysql">
        <environment id="mysql">
            <transactionManager type="JDBC"></transactionManager>
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}" />
                <property name="url" value="${jdbc.url}" />
                <property name="username" value="${jdbc.username}" />
                <property name="password" value="${jdbc.password}" />
            </dataSource>
        </environment>
    </environments>

    <!-- 加载映射配置文件 -->
    <mappers>
        <package name="com.qfedu.mapper" />
    </mappers>
</configuration>
```

### 1.7、日志配置文件

> log4j.properties

```properties
#
# Hibernate, Relational Persistence for Idiomatic Java
#
# License: GNU Lesser General Public License (LGPL), version 2.1 or later.
# See the lgpl.txt file in the root directory or <http://www.gnu.org/licenses/lgpl-2.1.html>.
#

### direct log messages to stdout ###
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.Target=System.err
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%d{ABSOLUTE} %5p %c{1}:%L - %m%n

### direct messages to file hibernate.log ###
#log4j.appender.file=org.apache.log4j.FileAppender
#log4j.appender.file.File=hibernate.log
#log4j.appender.file.layout=org.apache.log4j.PatternLayout
#log4j.appender.file.layout.ConversionPattern=%d{ABSOLUTE} %5p %c{1}:%L - %m%n

### set log levels - for more verbose logging change 'info' to 'debug' ###

log4j.rootLogger=debug, stdout
```

### 1.8、测试

```java
@Test
public void testMyBatis() throws IOException {
    InputStream inputStream = Resources.getResourceAsStream("sqlMapConfig.xml");
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    SqlSession session = sqlSessionFactory.openSession();

    UserMapper userMapper = session.getMapper(UserMapper.class);
    List<User> users = userMapper.list();

    for (User user : users) {
        System.out.println(user);
    }
}
```

## 二、Spring整合MyBatis

### 2.1、整合思路

> 将Session工厂（SqlSessionFactory）交给Spring容器进行管理；

### 2.2、将Session工厂(SqlSessionFactory)交给Spring进行管理

```xml
<!-- 加载配置文件 -->
<context:property-placeholder location="classpath:jdbc.properties" />

<!-- 配置数据源 -->
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
    <property name="driverClassName" value="${jdbc.driver}" />
    <property name="url" value="${jdbc.url}" />
    <property name="username" value="${jdbc.username}" />
    <property name="password" value="${jdbc.password}" />
</bean>

<!-- 配置sqlSessionFactory，整合MyBatis -->
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <!-- 配置连接池 -->
    <property name="dataSource" ref="dataSource" />
    <!-- 配置别名 -->
    <property name="typeAliasesPackage" value="com.qfedu.bean" />
    <!-- 配置MyBatis的核心配置文件 -->
    <property name="configLocation" value="classpath:mybatis-config.xml" />
</bean>
```

### 2.3、配置包扫描，生成Mapper接口的动态代理对象

```xml
<!-- 配置包扫描，生成Mapper接口的动态代理对象 -->
<bean id="mapperScannerConfigurer" class="org.mybatis.spring.mapper.MapperScannerConfigurer">
    <property name="basePackage" value="com.qfedu.mapper" />
</bean>
```

### 2.4、修改MyBatis核心配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
	<settings>
        <!-- 打印查询语句 -->
        <setting name="logImpl" value="LOG4J" />
    </settings>
</configuration>
```

### 2.5、Service层代码

> 接口RoleService.java

```java
public interface RoleService {
    List<Role> list();
    void save(Role role);
}
```

> 接口UserService.java

```java
public interface UserService {
    List<User> list();
    void save(User user, Long[] roleId);
    void delete(Long uid);
}
```

> 实现类RoleServiceImpl.java

```java
@Service
public class RoleServiceImpl implements RoleService {
    private RoleMapper roleMapper;

    public void setRoleMapper(RoleMapper roleMapper) {
        this.roleMapper = roleMapper;
    }

    @Override
    public List<Role> list() {
        return roleMapper.list();
    }

    @Override
    public void save(Role role) {
        roleMapper.save(role);
    }
}
```

> 实现类UserServiceImpl.java

```java
@Service
public class UserServiceImpl implements UserService {
    private UserMapper userMapper;
    private UserRoleMapper userRoleMapper;

    public void setUserMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }
    
    public void setUserRoleMapper(UserRoleMapper userRoleMapper) {
        this.userRoleMapper = userRoleMapper;
    }

    @Override
    public List<User> list() {
        List<User> users = userMapper.list();
        return users;
    }

    @Override
    public void save(User user, Long[] roleId) {
        userMapper.save(user);

        Long uid = user.getId();

        for (Long rid : roleId) {
            userRoleMapper.save(uid, rid);
        }
    }

    @Override
    public void delete(Long uid) {
        userRoleMapper.delete(uid);
        userMapper.delete(uid);
    }
}
```

> 在Spring的核心配置文件中配置Service。

```xml
<!-- 创建Service层对象 -->
<bean id="userService" class="com.qfedu.service.impl.UserServiceImpl">
    <property name="userMapper" ref="userMapper" />
    <property name="userRoleMapper" ref="userRoleMapper" />
</bean>
```

### 2.6、测试

```java
public class MyTest {
    @Test
    public void testMyBatis() throws IOException {
        InputStream inputStream = Resources.getResourceAsStream("mybatis-config.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session = sqlSessionFactory.openSession();

        UserMapper userMapper = session.getMapper(UserMapper.class);
        List<User> users = userMapper.list();

        for (User user : users) {
            System.out.println(user);
        }
    }

    @Test
    public void testSpringMyBatis() {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        UserService userService = (UserService)context.getBean("userService");
        List<User> userList = userService.list();
        for (User user : userList) {
            System.out.println(user);
        }
    }
}
```

## 三、事务处理

### 3.1、基础工程搭建

#### 3.1.1、建库建表

```sql
CREATE TABLE `account`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30),
  `money` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `account` VALUES (1, 'tom', 1000);
INSERT INTO `account` VALUES (2, 'bob', 1000);
```

#### 3.1.2、创建实体类

> Account.java

```java
public class Account implements Serializable {
    private Integer id;
    private String name;
    private Integer money;
    //set、get
    //toString
}
```

#### 3.1.3、创建接口及实现类

> AccountMapper.java

```java
public interface AccountMapper {
    void update(Account account) throws SQLException;
    Account findById(Integer srcId);
}
```

> AccountService.java

```java
public interface AccountService {
    void transfer(Integer srcId, Integer dstId, Integer money) throws Exception;
}
```

> AccountServiceImpl.java

```java
public class AccountServiceImpl implements AccountService {
    private AccountMapper accountMapper;

    public void setAccountMapper(AccountMapper accountMapper) {
        this.accountMapper = accountMapper;
    }

    @Override
    public void transfer(Integer srcId, Integer dstId, Integer money) throws Exception {
        Account src = accountMapper.findById(srcId);
        Account dst = accountMapper.findById(dstId);

        if(src == null) {
            throw new RuntimeException("转出用户不存在");
        }

        if(dst == null) {
            throw new RuntimeException("转入用户不存在");
        }

        if(src.getMoney() < money) {
            throw new RuntimeException("转出账户余额不足");
        }

        src.setMoney(src.getMoney() - money);
        dst.setMoney(dst.getMoney() + money);

        accountMapper.update(src);
        //int x = 1/0;
        accountMapper.update(dst);
    }
}
```

#### 3.1.4、创建映射配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.qfedu.mapper.AccountMapper">
    <update id="update" parameterType="account">
        update account set money=#{money} where id=#{id}
    </update>
    <select id="findById" resultType="account">
        select * from account where id=#{id}
    </select>
</mapper>
```

#### 3.1.5、创建JDBC配置文件

 ```properties
 jdbc.driver=com.mysql.jdbc.Driver
 jdbc.url=jdbc:mysql://localhost:3306/spring_mybatis?useSSL=false&useUnicode=true&characterEncoding=utf8
 jdbc.username=root
 jdbc.password=root
 ```

#### 3.1.6、创建核心配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">

    <!-- 加载配置文件 -->
    <context:property-placeholder location="classpath:jdbc.properties" />

    <!-- 创建Service层对象 -->
    <bean id="accountService" class="com.qfedu.service.impl.AccountServiceImpl">
        <property name="accountMapper" ref="accountMapper" />
    </bean>

    <!-- 配置数据源 -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassName" value="${jdbc.driver}" />
        <property name="url" value="${jdbc.url}" />
        <property name="username" value="${jdbc.username}" />
        <property name="password" value="${jdbc.password}" />
    </bean>

    <!-- 配置sqlSessionFactory，整合MyBatis -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource" />
        <!-- 配置别名 -->
        <property name="typeAliasesPackage" value="com.qfedu.bean" />
        <property name="configLocation" value="classpath:mybatis-config.xml" />
    </bean>

    <!-- 配置包扫描 -->
    <bean id="mapperScannerConfigurer" class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.qfedu.mapper" />
    </bean>
</beans>
```

#### 3.1.7、基础工程测试

```java
public class MyTest {
    @Test
    public void testTrans() throws Exception {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        AccountService accountService = (AccountService)context.getBean("accountService");

        accountService.transfer(1, 2, 100);
    }
}
```

> 在转账中间人为制造错误发现无法回滚。

### 3.2、编程式事务控制相关对象

> **PlatformTransactionManager接口是Spring的事务管理器，它里面提供了我们常用的操作事务的方法**

| 方法                                                         | 说明             |
| ------------------------------------------------------------ | ---------------- |
| `TransactionStatus getTransaction(TransactionDefinition var1)` | 获取事务状态信息 |
| `void commit(TransactionStatus var1)`                        | 提交事务         |
| `void rollback(TransactionStatus var1)`                      | 回滚事务         |

> PlatformTransactionManager是接口类型，不同的Dao层技术则有不同的实现类，Dao层技术是jdbc或mybatis时：org.springframework.jdbc.datasource.DataSourceTransactionManager。
>
> **TransactionDefinition是事务的定义信息对象**

| 方法                           | 说明               |
| ------------------------------ | ------------------ |
| `int getIsolationLevel()`      | 获得事务的隔离级别 |
| `int getPropagationBehavior()` | 事务的传播行为     |
| `int getTimeout()`             | 获得超时时间       |
| `boolean isReadOnly()`         | 是否只读           |

#### 1. 事务隔离级别

> 设置隔离级别，可以解决事务并发产生的问题，如脏读、不可重复读和虚读。
>
> * ISOLATION_DEFAULT
> * ISOLATION_READ_UNCOMMITTED
> * ISOLATION_READ_COMMITTED
> * ISOLATION_REPEATABLE_READ
> * ISOLATION_SERIALIZABLE

#### 2. 事务传播行为

> * **REQUIRED：如果当前没有事务，就新建一个事务，如果已经存在一个事务中，加入到这个事务中。一般的选择（默认值）**
> * **SUPPORTS：支持当前事务，如果当前没有事务，就以非事务方式执行（没有事务）**
> * MANDATORY：使用当前的事务，如果当前没有事务，就抛出异常
> * REQUERS_NEW：新建事务，如果当前在事务中，把当前事务挂起。
> * NOT_SUPPORTED：以非事务方式执行操作，如果当前存在事务，就把当前事务挂起
> * NEVER：以非事务方式运行，如果当前存在事务，抛出异常
> * NESTED：如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则执行 REQUIRED 类似的操作
> * 超时时间：默认值是-1，没有超时限制。如果有，以秒为单位进行设置
> * 是否只读：建议查询时设置为只读
>
> **TransactionStatus接口提供的是事务具体的运行状态**

| 方法                         | 说明           |
| ---------------------------- | -------------- |
| `boolean hasSavepoint()`     | 是否存储回滚点 |
| `boolean isCompleted()`      | 事务是否完成   |
| `boolean isNewTransaction()` | 是否是新事务   |
| `boolean isRollbackOnly()`   | 事务是否回滚   |

### 3.3、声明式事务控制

#### 3.3.1、什么是声明式事务控制

> Spring的声明式事务顾名思义就是采用声明的方式来处理事务。这里所说的声明，就是指**在配置文件中声明**，用在Spring 配置文件中声明式的处理事务来代替代码式的处理事务。
>
> **声明式事务处理的作用**
>
> * 事务管理不侵入开发的组件。具体来说，业务逻辑对象就不会意识到正在事务管理之中，事实上也应该如此，因为事务管理是属于系统层面的服务，而不是业务逻辑的一部分，如果想要改变事务管理策划的话，也只需要在定义文件中重新配置即可
> * 在不需要事务管理的时候，只要在设定文件上修改一下，即可移去事务管理服务，无需改变代码重新编译，这样维护起来极其方便
>
> **注意：Spring 声明式事务控制底层就是AOP。**

#### 3.3.2、声明式事务控制实现

> 声明式事务控制需要明确的几个问题：
>
> * 谁是切点？
> * 谁是通知？
> * 配置切面？
>
> 代码实现如下：

#### 3.3.3、引入相关依赖

> 在基础工程pom.xml中增加如下的依赖

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aspects</artifactId>
    <version>5.2.6.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
    <version>5.2.6.RELEASE</version>
</dependency>
```

#### 3.3.4、引入相关命名空间

> applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">
```

#### 3.3.5、配置事务增强

```xml
<!-- 配置平台事务管理器 -->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager" >
    <property name="dataSource" ref="dataSource" />
</bean>

<!-- 通知，事务的增强 -->
<tx:advice id="txAdvice" transaction-manager="transactionManager">
    <tx:attributes>
        <tx:method name="*"/>
    </tx:attributes>
</tx:advice>
```

#### 3.3.6、配置织入

```xml
<!-- 配置切面 -->
<aop:config>
    <aop:pointcut id="pt" expression="execution(* com.qf.service..*(..))"/>
    <aop:advisor advice-ref="txAdvice" pointcut-ref="pt" />
</aop:config>
```

#### 3.3.7、测试

```java
public class MyTest {
    @Test
    public void testTrans() throws Exception {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        AccountService accountService = (AccountService)context.getBean("accountService");

        accountService.transfer(1, 2, 100);
    }
}
```
