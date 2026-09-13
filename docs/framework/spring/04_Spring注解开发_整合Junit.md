---
title: 04_Spring注解开发_整合Junit
date: 2026-09-12
---



## 一、Spring注解开发

> Spring是轻代码重配置的框架，配置比较繁琐，随着项目的扩大，配置会变得非常臃肿，影响开发效率。为了解决这个问题，注解开发成为一种趋势，注解代替XML配置文件可以简化配置，提高开发效率。
>
> "约定大于配置"

### 1.1、Spring原始注解

> **目的：**代替Spring的`<Bean>`的配置

| 注解               | 说明                                               |
| ------------------ | -------------------------------------------------- |
| **@Component**     | 使用在类上用于实例化Bean                           |
| **@Controller**    | 使用在Web层类上用于实例化Bean（SpringMVC中会讲到） |
| **@Service**       | 使用在Service层类上用于实例化Bean                  |
| **@Repository**    | 使用在Dao层类上用于实例化Bean                      |
| **@Autowired**     | 使用在字段上用于**根据类型**依赖注入               |
| @Qualifier         | 结合@Autowired一起使用用于**根据名称**进行依赖注入 |
| @Resource          | 相当于@Autowired+@Qualifier，按照名称进行注入      |
| **@Value**         | 注入普通属性                                       |
| @Scope             | 标注Bean的作用范围                                 |
| @PostConstruct     | 使用在方法上标注该方法是Bean的初始化方法           |
| @PreDestroy        | 使用在方法上标注该方法是Bean的销毁方法             |
| **@Transactional** | 在需要进行事务控制的类或是方法上开启事务           |

### 1.2、案例

> 在上一讲声明式事务的案例中修改

#### 1.2.1、修改Spring配置文件

> 使用注解进行开发时
>
> * 需要在applicationContext.xml中配置组件扫描，作用是指定哪个包及其子包下的Bean需要进行扫描以便识别使用注解配置的类、字段和方法；
> * 配置文件中要开启事务的注解驱动<tx:annotation-driven />，同时指定事务管理器；
> * 在使用原始注解情况下，第三方的类（不是自己定义的类）只能在XML中使用`<bean>`标签配置，无法使用上述注解进行配置。

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
    <!-- 配置包扫描 -->
    <context:component-scan base-package="com.qfedu" />

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

    <!-- 配置包扫描 - 扫描Mapper -->
    <bean id="mapperScannerConfigurer" class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.qfedu.mapper" />
    </bean>

    <!-- 配置事务管理器 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource" />
    </bean>

    <!--事务的注解驱动-->
    <tx:annotation-driven transaction-manager="transactionManager" />
</beans>
```

#### 1.2.2、配置Service

> 使用@Autowired或者@Autowired+@Qulifier或者@Resource进行Mapper代理对象的注入。

```java
@Service("accountService")
public class AccountServiceImpl implements AccountService {
    @Autowired
    private AccountMapper accountMapper;

    public void setAccountMapper(AccountMapper accountMapper) {
        this.accountMapper = accountMapper;
    }

    @Override
    @Transactional
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

### 1.3、Spring新注解(xml配置 -- Java配置)

> 使用上面的方式还不能完全代替xml配置文件，还需要使用注解替代的配置如下：
>
> * 非自定义的Bean的配置：`<bean>`;
> * 加载properties文件的配置：`<context:property-placeholder>`;
> * 组件扫描的配置：`<context:component-scan>`;
> * 引入其他文件：`<import>`。
>
> Spring后续版本新增注解如下：

| 注解                         | 说明                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| @Configuration               | 用于指定当前类是一个 Spring配置类，当创建容器时会从该类上加载注解 |
| @ComponentScan               | 用于指定Spring在初始化容器时要扫描的包。作用和在Spring的xml配置文件中的<context:component-scan   base-package="com.qfedu" />一样。 |
| @Bean                        | 使用在方法上，将该方法的返回值存储到Spring容器中，通常用于管理第三方类(不是自己定义的类)的bean |
| @PropertySource              | 用于加载.properties文件中的配置                              |
| @Import                      | 用于导入其他配置类                                           |
| @MapperScan                  | 扫描特定包下的mapper                                         |
| @EnableTransactionManagement | 配置事务的注解驱动                                           |

#### 1.3.1、Jdbc配置类

```java
//声明这是一个配置类
@Configuration
//引入外部配置文件
@PropertySource("classpath:jdbc.properties")
//扫描特定包下的mapper
@MapperScan(basePackages = "com.qfedu.mapper")
//配置事务的注解驱动
@EnableTransactionManagement
public class JdbcConfig {
    @Value("${jdbc.driver}")
    private String driverClassName;
    @Value("${jdbc.url}")
    private String url;
    @Value("${jdbc.username}")
    private String username;
    @Value("${jdbc.password}")
    private String password;

    //创建数据源
    @Bean("dataSource")
    public DataSource dataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setDriverClassName(driverClassName);
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);

        return dataSource;
    }

    //配置事务平台管理器
    @Bean("transactionManager")
    public DataSourceTransactionManager transactionManager(@Qualifier("dataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    //创建并配置SqlSessionFactoryBean
    @Bean("sqlSessionFactoryBean")
    public SqlSessionFactoryBean sqlSessionFactoryBean(@Qualifier("dataSource") DataSource dataSource) {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        //配置别名
        factoryBean.setTypeAliasesPackage("com.qfedu.bean");
        //加载MyBatis的核心配置文件
        factoryBean.setConfigLocation(new PathMatchingResourcePatternResolver().getResource("classpath:SqlMapConfig.xml"));

        return factoryBean;
    }
}
```

#### 1.3.2、主配置类

```java
//引入其他的配置类
@Import(JdbcConfig.class)
//配置包扫描
@ComponentScan("com.qfedu")
public class MainConfig {

}
```

> 上面的内容也可以写在一个配置类中，这里是为了演示引入其他文件，写了两个配置类。
>
> **使用上面的配置，在以后的开发中我们就可以完全抛弃XML配置了，这也是当前的主流，SpringBoot中就是这样做的。**

## 二、Spring整合Junit

### 2.1、原始Junit测试Spring存在的问题

> 在测试类中，每个测试方法都有以下两行代码：

```java
 ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
 IAccountService accountService = ac.getBean(IAccountService.class);
```

> 这两行代码的作用是获取Spring IOC容器，如果不写的话，直接会提示空指针异常。对于测试不友好。

### 2.2、希望达到的效果

>* 只告诉测试类Spring的配置文件；
>* 需要的Bean直接通过@Autowired注入。

### 2.3、步骤

> 1) 导入相关Jar包，junit的jar包和spring-test的jar包；
>
> 2) 使用@Runwith替换原来的运行时
>
> 3) 使用@ContextConfiguration或@SpringJUnitConfig指定**配置文件或配置类**
>
> 4) 使用@Autowired注入需要测试的对象
>
> 5) 创建测试方法测试

```java
//指定运行时
@RunWith(SpringJUnit4ClassRunner.class)
//指定Spring的配置文件或配置类
//@SpringJUnitConfig(locations = "classpath:applicationContext.xml")
@SpringJUnitConfig(classes = MainConfig.class)
public class MyTest1 {
    @Autowired
    private AccountService accountService;

    @Test
    public void test1() throws Exception {
        accountService.transfer(1, 2, 100);
    }
}
```



