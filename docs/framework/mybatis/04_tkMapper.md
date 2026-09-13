---
title: 04_tkMapper
date: 2026-09-12
---

## 一、tkMapper简介

> 基于MyBatis提供了很多第三方插件，这些插件通常可以完成数据操作方法的封装（GeneralMapper）、数据库逆向工程工作(根据数据表生成实体类、生成映射文件)
>
> - MyBatis-plus
> - tkMapper
>
> tkMapper就是一个MyBatis插件，是在MyBatis的基础上提供了很多工具，让开发变得简单，提高开发效率。
>
> - 提供了针对**单表**通用的数据库操作方法
> - 逆向工程（根据数据表生成实体类、dao接口、映射文件）

## 二、tkMapper项目搭建

### 2.1、建库建表

```sql
CREATE DATABASE `spring_mybatis`;
USE `spring_mybatis`;

DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `roleName` varchar(50) DEFAULT NULL,
  `roleDesc` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
insert  into `sys_role`(`id`,`roleName`,`roleDesc`) values 
(1,'校长','负责全面工作'),
(2,'教研专员','课程研发工作'),
(3,'讲师','授课工作'),
(4,'助教','协助解决学生的问题'),
(5,'就业专员','负责学员就业工作');

DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(80) DEFAULT NULL,
  `phoneNum` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

insert  into `sys_user`(`id`,`username`,`email`,`password`,`phoneNum`) values 
(1,'张三','zhangsan@hpe.com','111','18660701111'),
(2,'王五','wangwu@hpe.com','222','18660702222'),
(3,'李华','lihua@hpe.com','333','18660703333');

DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `userId` bigint(20) NOT NULL,
  `roleId` bigint(20) NOT NULL,
  PRIMARY KEY (`userId`,`roleId`) USING BTREE,
  KEY `roleId` (`roleId`) USING BTREE,
  CONSTRAINT `sys_user_role_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `sys_user` (`id`),
  CONSTRAINT `sys_user_role_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `sys_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
insert  into `sys_user_role`(`userId`,`roleId`) values 
(1,1),
(1,2),
(2,2),
(2,3),
(3,5);
```

### 2.2、创建SpringBoot项目导入依赖

```xml
<dependencies>
    <!-- tkMapeer -->
    <dependency>
        <groupId>tk.mybatis</groupId>
        <artifactId>mapper-spring-boot-starter</artifactId>
        <version>2.1.5</version>
    </dependency>

    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.47</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>

<resources>
    <resource>
        <directory>src/main/java</directory>
        <includes>
            <include>**/*.xml</include>
        </includes>
    </resource>
</resources>
```

### 2.3、修改启动类

> 添加`@MapperScan`注解，注意类型`tk.mybatis.spring.annotation.MapperScan`

```java
import tk.mybatis.spring.annotation.MapperScan;

@SpringBootApplication
@MapperScan("com.qfedu.mapper")
public class TkmapperDemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(TkmapperDemoApplication.class, args);
    }
}
```

## 三、tkMapper使用

### 3.1、创建实体类

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sys_user")
public class SysUser {
    @Id
    @Column(name = "id")
    private Long id;
    @Column(name = "username")
    private String username;
    @Column(name = "email")
    private String email;
    @Column(name = "password")
    private String password;
    @Column(name = "phoneNum")
    private String phoneNum;
}
```

### 3.2、创建Mapper接口

> tkMapper已经完成了对单表的通用操作的封装，封装在Mapper接口和MySqlMapper接口；因此如果我们要完成对单表的操作，只需自定义mapper接口继承Mapper接口和MySqlMapper接口

```java
import com.qfedu.entity.SysUser;
import tk.mybatis.mapper.common.Mapper;
import tk.mybatis.mapper.common.MySqlMapper;

public interface SysUserMapper extends Mapper<SysUser>, MySqlMapper<SysUser> {

}
```

### 3.3、测试

```java
@SpringBootTest
class TkmapperdemoApplicationTests {

    @Autowired
    private SysUserMapper sysUserMapper;

    //测试tkMappe是否可用
    @Test
    public void test1() {
        //根据主键查询
        SysUser sysUser = sysUserMapper.selectByPrimaryKey(1L);
        System.out.println(sysUser);
    }
}
```

## 四、tkMapper提供的方法

### 4.1、根据主键查询

```java
@Test
public void test1() {
    //根据主键查询
    SysUser sysUser = sysUserMapper.selectByPrimaryKey(1L);
    System.out.println(sysUser);
}
```

### 4.2、添加

```java
@Test
public void test2() {
    //tkMapper-添加
    SysUser sysUser = new SysUser();
    sysUser.setUsername("tom");
    sysUser.setPassword("123");
    sysUser.setEmail("tom@126.com");
    sysUser.setPhoneNum("111111");

    int result = sysUserMapper.insert(sysUser);
    System.out.println(result);
}
```

> 返回主键

```java
@Test
public void test3() {
    //tkMapper-添加-主键
    SysUser sysUser = new SysUser();
    sysUser.setUsername("tom");
    sysUser.setPassword("123");
    sysUser.setEmail("tom@126.com");
    sysUser.setPhoneNum("111111");

    int result = sysUserMapper.insertUseGeneratedKeys(sysUser);
    System.out.println(result);
    System.out.println(sysUser);
}
```

### 4.3、根据主键删除

```java
@Test
public void test4() {
    //tkMapper-根据主键删除
    sysUserMapper.deleteByPrimaryKey(5);
}
```

### 4.4、根据自定义条件删除

```java
@Test
public void test5() {
    //tkMapper-删除
    //用来封装条件
    Example example = new Example(SysUser.class);
    //链式操作
    example.createCriteria().andEqualTo("username", "tom");

    sysUserMapper.deleteByExample(example);
}
```

### 4.5、根据主键修改

```java
@Test
public void test6() {
    //tkMapper - 修改
    SysUser sysUser = new SysUser();
    sysUser.setId(3L);
    sysUser.setUsername("lihua");

    sysUserMapper.updateByPrimaryKey(sysUser);
}
```

### 4.6、根据自定义条件修改

```java
@Test
public void test7() {
    Example example = new Example(SysUser.class);
    example.createCriteria().andEqualTo("username", "lihua");

    SysUser sysUser = new SysUser();
    sysUser.setId(3L);
    sysUser.setPhoneNum("00000");
    sysUser.setEmail("abc@126.com");
    sysUser.setPassword("111111");
    //update sys_user set k=v, k=v where ....
    sysUserMapper.updateByExample(sysUser, example);
}
```

### 4.7、查询所有

```java
@Test
public void test8() {
    //查询所有
    List<SysUser> sysUsers = sysUserMapper.selectAll();

    sysUsers.stream().forEach(item -> System.out.println(item));
}
```

### 4.8、根据条件查询

```java
@Test
public void test9() {
    //条件查询
    Example example = new Example(SysUser.class);
    example.createCriteria().andEqualTo("username", "张三");

    List<SysUser> sysUsers = sysUserMapper.selectByExample(example);
    System.out.println(sysUsers);
}

@Test
public void test10() {
    //条件查询
    Example example = new Example(SysUser.class);
    example.createCriteria().andEqualTo("username", "张三");

    SysUser sysUser = sysUserMapper.selectOneByExample(example);
    System.out.println(sysUser);
}
```

### 4.9、分页查询

```java
@Test
public void test11() {
    //分页
    //分页查询 limit 起始的索引（从0开始）, 每页的记录数
    int pageNum = 2;
    int pageSize = 2;
    int start = (pageNum-1)*pageSize;

    RowBounds rowBounds = new RowBounds(start,pageSize);
    List<SysUser> sysUsers = sysUserMapper.selectByRowBounds(new SysUser(), rowBounds);
    sysUsers.forEach(System.out::println);
}
```

## 五、在使用tkMapper是如何进行关联查询

### 5.1、通过多个单表操作实现

```java
//查询所有的讲师
@Test
public void test13() {
    //查询出"讲师"对应的角色id
    Example example = new Example(SysRole.class);
    example.createCriteria().andEqualTo("rolename", "讲师");

    SysRole sysRole = sysRoleMapper.selectOneByExample(example);

    //根据角色id去中间表中查询对应的userId
    example = new Example(SysUserRole.class);
    example.createCriteria().andEqualTo("roleid", sysRole.getId());

    List<SysUserRole> sysUserRoles = sysUserRoleMapper.selectByExample(example);
    //List<SysUserRole> ---> List<Long>
    //传统的写法
    //List<Long> ids = new ArrayList<>();
    //for (SysUserRole sysUserRole : sysUserRoles) {
    //    ids.add(sysUserRole.getUserid());
    //}
    List<Long> ids = sysUserRoles
        .stream()
        .map(item -> item.getUserid()).collect(Collectors.toList());


    //根据userId查询出所有的SysUser
    example = new Example(SysUser.class);
    example.createCriteria().andIn("id", ids);

    List<SysUser> sysUsers = sysUserMapper.selectByExample(example);
    System.out.println(sysUsers);
}
```

### 5.2、自定义连接查询

#### 5.2.1、在DAO接口自定义方法

```java
public interface SysUserMapper extends GeneralMapper<SysUser> {
    List<SysUser> queryUserByRoleName(String roleName);
}
```

#### 5.2.2、创建Mapper文件 

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.qfedu.mapper.SysUserMapper">
    <select id="queryUserByRoleName" resultType="sysUser">
        select
            u.*
        from
            sys_user u, sys_user_role ur, sys_role r
        where
            u.id=ur.userId and ur.roleId=r.id and r.roleName=#{roleName}
    </select>
</mapper>
```

## 六、逆向工程

> 逆向工程，根据创建好的数据表，生成实体类、mapper接口、映射文件

### 6.1、添加逆向工程依赖

> 这里创建一个普通的Maven工程就可以
>
> 在pom.xml中添加如下的插件

```xml
<plugin>
    <groupId>org.mybatis.generator</groupId>
    <artifactId>mybatis-generator-maven-plugin</artifactId>
    <version>1.3.5</version>

    <dependencies>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.47</version>
        </dependency>
        <dependency>
            <groupId>tk.mybatis</groupId>
            <artifactId>mapper</artifactId>
            <version>3.4.4</version>
        </dependency>
    </dependencies>
</plugin>
```

### 6.2、逆向工程配置

> 在resources/generator目录下创建generatorConfig.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<generatorConfiguration>
    <!-- 引入数据库连接配置 -->
    <!--    <properties resource="jdbc.properties"/>-->

    <context id="Mysql" targetRuntime="MyBatis3Simple" defaultModelType="flat">
        <property name="beginningDelimiter" value="`"/>
        <property name="endingDelimiter" value="`"/>

        <!-- 配置 GeneralDAO -->
        <plugin type="tk.mybatis.mapper.generator.MapperPlugin">
            <property name="mappers" value="com.qfedu.general.GeneralMapper"/>
        </plugin>

        <!-- 配置数据库连接 -->
        <jdbcConnection driverClass="com.mysql.jdbc.Driver"
                        connectionURL="jdbc:mysql://localhost:3306/spring_mybatis?useSSL=false&amp;useUnicode=true&amp;characterEncoding=utf-8"
                        userId="root" password="root">
        </jdbcConnection>

        <!-- 配置实体类存放路径 -->
        <javaModelGenerator targetPackage="com.qfedu.entity" targetProject="src/main/java"/>

        <!-- 配置 XML 存放路径 -->
        <sqlMapGenerator targetPackage="/" targetProject="src/main/resources/mappers"/>

        <!-- 配置 DAO 存放路径 -->
        <javaClientGenerator targetPackage="com.qfedu.mapper" targetProject="src/main/java" type="XMLMAPPER"/>

        <!-- 配置需要指定生成的数据库和表，% 代表所有表 -->
        <table tableName="%">
            <!-- mysql 配置 -->
            <!--            <generatedKey column="id" sqlStatement="Mysql" identity="true"/>-->
        </table>
        <!--        <table tableName="tb_roles">-->
        <!--            &lt;!&ndash; mysql 配置 &ndash;&gt;-->
        <!--            <generatedKey column="roleid" sqlStatement="Mysql" identity="true"/>-->
        <!--        </table>-->
        <!--        <table tableName="tb_permissions">-->
        <!--            &lt;!&ndash; mysql 配置 &ndash;&gt;-->
        <!--            <generatedKey column="perid" sqlStatement="Mysql" identity="true"/>-->
        <!--        </table>-->
    </context>
</generatorConfiguration>
```

### 6.3、将配置文件设置到逆向工程的maven插件

```xml
<plugin>
    <groupId>org.mybatis.generator</groupId>
    <artifactId>mybatis-generator-maven-plugin</artifactId>
    <version>1.3.5</version>
    <!-- 添加如下配置 -->
    <configuration>     <configurationFile>${basedir}/src/main/resources/generator/generatorConfig.xml</configurationFile>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.47</version>
        </dependency>
        <dependency>
            <groupId>tk.mybatis</groupId>
            <artifactId>mapper</artifactId>
            <version>3.4.4</version>
        </dependency>
    </dependencies>
</plugin>
```

### 6.4、执行逆向生成

> 双击Idea中Maven标签Plugins中的`mybatis-generator:generate`

