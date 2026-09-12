## 一、基础环境搭建

> 本次环境搭建在《Spring整合MyBatis》基础之上进行，我们在该部分学习中完成了Spring对MyBatis的整合，并且完成了Dao层和Service层的代码，关于整合我们需要做的工作就是让Web容器能够读取Spring的配置文件。

### 1.1、添加坐标

> 这里的Jar包主要包含以下内容：
> 
> * Spring相关Jar包；
> * SpringMVC相关Jar包；
> * MySQL Jar包；
> * Druid相关Jar包；
> * MyBatis相关Jar包；
> * MyBatis分页插件相关Jar包；
> 
> pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.qfedu</groupId>
    <artifactId>03_ssm</artifactId>
    <version>1.0.0</version>
    <packaging>war</packaging>

    <name>03_ssm Maven Webapp</name>
    <!-- FIXME change it to the project's website -->
    <url>http://www.example.com</url>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>

    <dependencies>
         <!-- lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.22</version>
        </dependency>
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
            <version>5.1.49</version>
            <scope>runtime</scope>
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
        <!-- 事务处理相关Jar包 -->
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
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>javax.servlet.jsp</groupId>
            <artifactId>javax.servlet.jsp-api</artifactId>
            <version>2.3.3</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>jstl</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>
        <!-- 分页助手 -->
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper</artifactId>
            <version>3.7.5</version>
        </dependency>
        <dependency>
            <groupId>com.github.jsqlparser</groupId>
            <artifactId>jsqlparser</artifactId>
            <version>0.9.1</version>
        </dependency>
        <!-- Jackson -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-core</artifactId>
            <version>2.9.0</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.9.0</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-annotations</artifactId>
            <version>2.9.0</version>
        </dependency>
    </dependencies>
</project>
```

### 1.2、创建包结构

> 1) `com.qfedu.controller`：用来存放SpringMVC中的控制器；
> 
> 2) `com.qfedu.bean`：用来存放实体类（之前已经完成）；
> 
> 3) `com.qfedu.mapper`：用来存放mapper接口及接口映射文件（之前已经完成）；
> 
> 4) `com.qfedu.service`：用来存放Service层相关类（之前已经完成）。

### 1.3、Spring配置文件（之前已经完成）

> `applicationContext.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">
    <!-- 配置要扫描的包 -->
    <context:component-scan base-package="com.qfedu" >
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>

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
        <property name="dataSource" ref="dataSource" />
        <property name="configLocation" value="classpath:sqlMapConfig.xml" />
    </bean>

    <!-- 配置包扫描 -->
    <bean id="mapperScannerConfigurer" class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.qfedu.mapper" />
    </bean>
</beans>
```

### 1.4、JDBC配置文件（之前已经完成）

```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/spring_mybatis?useSSL=false
jdbc.username=root
jdbc.password=root
```

### 1.5、MyBatis配置文件（之前已经完成）

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <settings>
        <!-- 打印查询语句 -->
        <setting name="logImpl" value="LOG4J" />
    </settings>
    <!-- 配置插件 -->
    <plugins>
        <!-- 配置分页插件 -->
        <plugin interceptor="com.github.pagehelper.PageHelper">
            <!-- 配置分页插件方言 -->
            <property name="dialect" value="mysql" />
        </plugin>
    </plugins>
</configuration>
```

> **在此基础之上，完成了Spring对MyBatis的整合，可以在测试类中通过加载Spring配置文件进行相关测试。**

## 二、Web层相关代码

### 2.1、包装响应数据的类

```java
/**
 * 表示返回结果的bean
 */
@Data
public class RespBean {
    //状态码 10000-成功 10001-失败
    private Integer code;
    //返回的附件信息
    private String msg;
    //返回的数据
    private Object data;

    public static RespBean ok() {
        RespBean respBean = new RespBean();
        respBean.setCode(10000);

        return respBean;
    }

    public static RespBean ok(String msg) {
        RespBean respBean = new RespBean();
        respBean.setCode(10000);
        respBean.setMsg(msg);

        return respBean;
    }

    public static RespBean ok(String msg, Object data) {
        RespBean respBean = new RespBean();
        respBean.setCode(10000);
        respBean.setMsg(msg);
        respBean.setData(data);

        return respBean;
    }

    public static RespBean error() {
        RespBean respBean = new RespBean();
        respBean.setCode(10001);

        return respBean;
    }

    public static RespBean error(String msg) {
        RespBean respBean = new RespBean();
        respBean.setCode(10001);
        respBean.setMsg(msg);

        return respBean;
    }

    public static RespBean error(String msg, Object data) {
        RespBean respBean = new RespBean();
        respBean.setCode(10001);
        respBean.setMsg(msg);
        respBean.setData(data);

        return respBean;
    }
}


```

### 2.2、Controller相关代码

> 每个方法返回的都是JSON

```java
@RestController
@RequestMapping("/student")
public class StudentController {
    @Autowired
    private StudentService studentService;

    //分页查询
    @RequestMapping("/findByPage")
    public RespBean findByPage(Integer pageNum) {
        PageHelper.startPage(pageNum, 5);
        List<Student> studentList = studentService.findAll();

        PageInfo<Student> pageInfo = new PageInfo<>(studentList);
        return RespBean.ok("查询成功", pageInfo);
    }

    //根据ID查询
    @RequestMapping("/findById")
    public RespBean findById(Long id) {
        Student student = studentService.findById(id);

        return RespBean.ok("查询成功", student);
    }

    //添加
    @RequestMapping("/add")
    public RespBean add(Student student) {
        studentService.add(student);

        return RespBean.ok("添加成功");
    }

    //删除
    @DeleteMapping("/del/{id}")
    public RespBean del(@PathVariable("id") Long id) {
        studentService.del(id);

        return RespBean.ok("删除成功");
    }

    //修改
    @RequestMapping("/update")
    public RespBean update(Student student) {
        studentService.update(student);

        return RespBean.ok("修改成功");
    }
}
```

### 2.2、SpringMVC配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc.xsd">
    <!-- 配置包扫描 -->
    <context:component-scan base-package="com.qfedu.controller" >
        <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>

    <!-- mvc注解驱动 -->
    <mvc:annotation-driven />

    <!-- 配置视图解析器
        由于COntroller返回的都是JSON，此时不需要页面跳转，也就不再需要配置视图解析器
     -->
    <!-- <bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/pages/" />
        <property name="suffix" value=".jsp" />
    </bean> -->

    <!-- 静态资源权限开放 -->
    <mvc:default-servlet-handler />
</beans>
```

### 2.3、web.xml配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://java.sun.com/xml/ns/javaee
          http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
           version="3.0">
    <!-- 配置全站字符编码的Filter -->
    <filter>
        <filter-name>characterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>characterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!--Spring的监听器-->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
    <!--全局的初始化参数-->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:applicationContext.xml</param-value>
    </context-param>

    <!--SpringMVC的前端控制器-->
    <servlet>
        <servlet-name>DispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring-mvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>DispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```

## 三、完全使用Java代码实现SSM整合

> 本次环境搭建在《Spring注解开发_整合Junit》基础之上进行，我们在该部分学习中完成了Spring对MyBatis的整合，并且完成了Dao层和Service层的代码，完全使用Java代码配置，关于整合我们需要做的工作就是让Web容器能够读取Spring的配置类。

### 3.1、配置SpringMVC

```java
@WebAppConfiguration
//启用SpringMVC
@EnableWebMvc 
@ComponentScan("com.qfedu.controller")
public class WebConfig implements WebMvcConfigurer {
    //配置视图解析器
    @Bean
    public ViewResolver viewResolver() {
        //创建视图解析器
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        //配置前缀
        resolver.setPrefix("/pages/");
        //配置后缀
        resolver.setSuffix(".jsp");
        return resolver;
    }

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        /**
         *    配置静态资源放行，DispatcherServlet将对静态资源的请求转发到Servlet容器中默认的Servlet上，
         *    而不是使用DispatcherServlet本身来处理此类请求
         *  
         *  配置静态资源放行
        */    
        configurer.enable();
    }
}
```

### 3.2、配置DispatcherServlet

> `DispatcherServlet`是`Spring MVC`的核心，按照传统的方式，像`DispatcherServlet`这样的`Servlet`会配置在`web.xml`文件中，借助于`Servlet 3`规范和`Spring 3.1`的功能增强，这种方式已经不是唯一的方案了，我们会使用`Java`将`DispatcherServlet`配置在`Servlet`容器中，而不会再使用`web.xml`文件。
> 
> 我们只需要知道扩展`AbstractAnnotationConfigDispatcherServletInitializer`的任意类都会自动地配置 `DispatcherServlet`和`Spring`应用上下文，`Spring`的应用上下文会位于应用程序的`Servlet`上下文之中。

```java
public class WebInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected String[] getServletMappings() {
        //配置DispatcherServlet路径
        return new String[]{"/"};
    }

    @Override
    protected Class<?>[] getRootConfigClasses() {
        //加载Spring的配置类
        return new Class<?>[]{MainConfig.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        //加载SpringMVC的配置
        return new Class<?>[]{WebConfig.class};
    }
}
```

> **以下是一些细节，了解就可以**
> 
> 在`Servlet 3.0`环境中，容器会在类路径中查找实现`javax.servlet.ServletContainerInitializer`接口的类， 如果能发现的话，就会用它来配置`Servlet`容器。
> 
> `Spring`提供了这个接口的实现，名为`SpringServletContainerInitializer`，这个类反过来又会查找实现 `WebApplicationInitializer`的类并将配置的任务交给它们来完成。
> 
> `Spring 3.2`引入了一个便利的`WebApplicationInitializer` 基础实现，也就是：
> 
> * `AbstractAnnotationConfigDispatcherServletInitializer`
> 
> 因为我们继承了`AbstractAnnotationConfigDispatcherServletInitializer`（同时也就实现了 WebApplicationInitializer），因此当部署到`Servlet 3.0`容器中的时候，容器会自动发现它，并用它来配置 `Servlet`上下文。
> 
> `getServletMappings()`，它会将一个或多个路径映射到`DispatcherServlet`上。在本例中，它映射的是 `/`，这表示它会是应用的默认`Servlet`。它会处理进入应用的所有请求。
> 
> --------------------------------------------------------------------------------------------------------------------------------
> 
> 为了理解其他的两个方法，我们首先要理解`DispatcherServlet`和一个`Servlet`监听器`ContextLoaderListener`的关系。
> 
> 当`DispatcherServlet`启动的时候，它会创建`Spring`应用上下文，并加载配置文件或配置类中所声明的`bean`。在以上程序中的`getServletConfigClasses()`方法中，我们要求`DispatcherServlet`加载应用上下文时，使用定义在`WebConfig`配置类（使用`Java`配置）中的`bean`。
> 
> 但是在`Spring Web`应用中，通常还会有另外一个应用上下文。另外的这个应用上下文是由`ContextLoaderListener` 创建的。
> 
> 我们希望`DispatcherServlet`加载包含`Web`组件的`bean`，如控制器、视图解析器以及处理器映射，而 `ContextLoaderListener`要加载应用中的其他`bean`。这些`bean`通常是驱动应用后端的中间层和数据层组件。
> 
> 实际上，`AbstractAnnotationConfigDispatcherServletInitializer`会同时创建`DispatcherServlet`和`ContextLoaderListener`。`GetServletConfigClasses()`方法返回的带有`@Configuration`注解的类将会用来定义`DispatcherServlet`应用上下文中的`bean`。`getRootConfigClasses()`方法返回的带有`@Configuration`注解的类将会用来配置`ContextLoaderListener`创建的应用上下文中的`bean`。
> 
> 在本例中，根配置定义在`MainConfig`中，`DispatcherServlet`的配置声明在`WebConfig`中。
> 
> 需要注意的是，通过`AbstractAnnotationConfigDispatcherServletInitializer`来配置`DispatcherServlet `是传统`web.xml`方式的替代方案。如果你愿意的话，可以同时包含`web.xml`和 `AbstractAnnotationConfigDispatcherServletInitializer`，但这其实并没有必要。
> 
> 如果按照这种方式配置`DispatcherServlet`，而不是使用`web.xml`的话，那唯一问题在于它只能部署到支持 `Servlet 3.0`的服务器中才能正常工作，如`Tomcat 7`或更高版本。`Servlet 3.0`规范在2009年12月份就发布了，因此很有可能你会将应用部署到支持`Servlet 3.0`的`Servlet`容器之中。如果你还没有使用支持`Servlet 3.0 `的服务器，那么在`AbstractAnnotationConfigDispatcherServletInitializer`子类中配置 `DispatcherServlet`的方法就不适合你了。你别无选择，只能使用`web.xml`了。

## 四、关于页面

> 结合`光年模板`、`art-template`实现增删改查。
