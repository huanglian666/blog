---
title: SpringMVC的响应和请求
date: 2026-09-12
---

# SpringMVC的响应和请求

本篇整理 SpringMVC 的数据响应（页面跳转与回写数据）和请求参数的接收（基本类型、POJO、数组、集合、Restful 风格参数），以及静态资源放行、乱码处理、类型转换器等常见配置。

## 1. SpringMVC 的数据响应

### 1.1 数据响应方式概述

SpringMVC 的数据响应分为两大类：

| 响应方式 | 具体形式 |
| --- | --- |
| 页面跳转 | 直接返回字符串；通过 ModelAndView 返回 |
| 回写数据 | 直接返回字符串；返回对象或集合 |

#### 1.1.1 项目配置

1）新建一个 Controller，用来对请求进行处理：

```java
@Controller
@RequestMapping("/test")
public class TestController {

}
```

2）新建 success.jsp，用来作为跳转之后的页面。`/webapp/jsp/success.jsp`：

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>success</title>
</head>
<body>
    <p>success</p>
</body>
</html>
```

3）SpringMVC 的配置文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd">
    <context:component-scan base-package="com.qfedu" />

    <!-- 配置视图解析器 -->
    <bean id="viewResolver"
          class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/jsp/" />
        <property name="suffix" value=".jsp" />
    </bean>
</beans>
```

### 1.2 页面跳转——返回字符串形式

直接返回字符串：此种方式会将返回的字符串与视图解析器的前后缀拼接后跳转。

```java
/**
 * 直接返回字符串
 */
@RequestMapping("/test0")
public String test0() {
    return "success";
}
```

### 1.3 页面跳转——返回 ModelAndView 形式一

在 Controller 方法中返回 ModelAndView 对象，并且设置视图名称：

```java
/**
 * 使用ModelAndView返回数据和视图
 */
@RequestMapping("/test1")
public ModelAndView test1() {
    /*
        Model：模型，作用是封装数据
        View：视图，作用是展示数据
    */
    ModelAndView mv = new ModelAndView();
    // 设置模型数据
    mv.addObject("username", "zs");
    // 设置视图名称
    mv.setViewName("success");
    return mv;
}
```

### 1.4 页面跳转——返回 ModelAndView 形式二

在 Controller 方法的形参上直接声明 ModelAndView，无需在方法中自己创建，在方法中直接使用该对象设置视图，同样可以跳转页面。此外也可以只使用 Model 封装数据，视图名通过字符串返回：

```java
/**
 * 使用ModelAndView返回数据和视图
 */
@RequestMapping("/test2")
public ModelAndView test2(ModelAndView mv) {
    mv.addObject("username", "ls");
    mv.setViewName("success");
    return mv;
}

/**
 * 使用Model返回数据
 */
@RequestMapping("/test3")
public String test3(Model m) {
    m.addAttribute("username", "王五");
    return "success";
}
```

### 1.5 页面跳转——使用原生 Servlet API

在 Controller 方法的形参上可以直接使用原生的 Servlet 对象，只需声明即可：

```java
/**
 * 获取ServletAPI
 */
@RequestMapping("/test4")
public String test4(HttpServletRequest request, HttpSession session) {
    request.setAttribute("k1", "v1");
    session.setAttribute("k2", "v2");

    ServletContext context = request.getServletContext();
    context.setAttribute("k3", "v3");

    return "success";
}
```

### 1.6 回写数据——回写字符串

回写字符串有两种方式：

- 通过 SpringMVC 框架注入的 response 对象，使用 `response.getWriter().print("hello world")` 回写数据，此时不需要视图跳转，业务方法返回值为 `void`；
- 将需要回写的字符串直接返回，但此时需要通过 `@ResponseBody` 注解告知 SpringMVC 框架：方法返回的字符串不是用于视图跳转，而是直接写入 HTTP 响应体。

```java
/**
 * 回写字符串：使用response对象
 */
@RequestMapping("/test5")
public void test5(HttpServletResponse response) throws IOException {
    PrintWriter out = response.getWriter();
    out.println("<p style=\"border:1px solid #dddddd;color:blue;\">hello world</p>");
}

/**
 * 回写字符串：使用@ResponseBody注解
 */
@RequestMapping("/test6")
@ResponseBody
public String test6() {
    return "hello SpringMVC";
}
```

### 1.7 回写数据——回写 JSON 格式字符串

```java
/**
 * 返回JSON字符串：手动拼接
 */
@RequestMapping("/test7")
@ResponseBody
public String test7() {
    return "{\"username\":\"zhangsan\",\"age\":10}";
}
```

手动拼接 JSON 格式字符串的方式很麻烦，开发中往往要将复杂的 Java 对象转换成 JSON 格式的字符串。我们可以使用 web 阶段学习过的 JSON 转换工具 jackson 进行转换，通过 jackson 转换成 JSON 格式字符串后回写。完成该操作需要引入 jackson 依赖：

```xml
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
```

```java
/**
 * 返回JSON字符串：使用jackson转换
 */
@RequestMapping("/test8")
@ResponseBody
public String test8() throws JsonProcessingException {
    User user = new User();
    user.setUsername("ZhangSan");
    user.setAge(10);

    // 使用json的转换工具将对象转换成json格式字符串再返回
    ObjectMapper mapper = new ObjectMapper();
    String s = mapper.writeValueAsString(user);
    return s;
}
```

### 1.8 回写数据——返回对象或集合（配置消息转换器）

通过 SpringMVC 帮助我们将对象或集合进行 JSON 字符串的转换并回写。需要为处理器适配器配置消息转换参数，指定使用 jackson 进行对象或集合的转换，因此需要在 spring-mvc.xml 中进行如下配置：

```xml
<!-- 配置处理器映射器
     目的：配置消息转换器，实现bean对象到json的转换
-->
<bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter">
    <property name="messageConverters">
        <list>
            <bean class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter"></bean>
        </list>
    </property>
</bean>
```

配置完成后，各种对象、集合类型都可以直接返回：

```java
/**
 * 返回对象，将对象转换成JSON（需要在spring-mvc.xml中进行配置）
 */
@RequestMapping("/test9")
@ResponseBody
public User test9() {
    User user = new User();
    user.setUsername("LiSi");
    user.setAge(20);

    return user;
}

/**
 * 返回集合，将集合转换成JSON（需要在spring-mvc.xml中进行配置）
 */
@RequestMapping("/test10")
@ResponseBody
public List<User> test10() {
    User user1 = new User();
    user1.setUsername("LiSi");
    user1.setAge(20);

    User user2 = new User();
    user2.setUsername("Tom");
    user2.setAge(15);

    User user3 = new User();
    user3.setUsername("Bob");
    user3.setAge(16);

    List<User> list = new ArrayList<>();
    list.add(user1);
    list.add(user2);
    list.add(user3);

    return list;
}

/**
 * 返回Map，将Map转换成JSON（需要在spring-mvc.xml中进行配置）
 */
@RequestMapping("/test11")
@ResponseBody
public Map<String, String> test11() {
    Map<String, String> map = new HashMap<>();
    map.put("birthday", new Date().toString());
    map.put("tomorrow", new Date().toString());

    return map;
}

/**
 * 返回Set，将Set转换成JSON（需要在spring-mvc.xml中进行配置）
 */
@RequestMapping("/test12")
@ResponseBody
public Set<User> test12() {
    Set<User> set = new HashSet<>();
    User u1 = new User();
    u1.setUsername("zs");
    u1.setAge(10);
    User u2 = new User();
    u2.setUsername("ls");
    u2.setAge(11);

    set.add(u1);
    set.add(u2);

    return set;
}
```

### 1.9 回写数据——返回对象或集合（`<mvc:annotation-driven/>`）

上面配置处理器映射器比较麻烦，可以使用 `<mvc:annotation-driven/>` 代替。使用 `<mvc:annotation-driven/>` 后，默认底层就会集成 jackson 进行对象或集合的 JSON 格式字符串转换。

**如果一个 Controller 中所有的方法都要返回 JSON**，可以进行如下操作：

1. 将 Controller 使用 `@Controller` 和 `@ResponseBody` 进行修饰；
2. 将 Controller 使用 `@RestController` 进行修饰（建议使用这种方式）。

## 2. SpringMVC 的请求

客户端请求参数的格式是：`name=value&name=value……`

服务器端要获得请求的参数，有时还需要进行数据的封装。SpringMVC 可以接收如下类型的参数：

- 基本类型参数；
- POJO 类型参数；
- 数组类型参数；
- 集合类型参数。

### 2.1 获得基本类型参数（重要）

Controller 中业务方法的参数名称要与请求参数的 name 一致，参数值会自动映射匹配；并且能自动做类型转换（String 向其他类型转换）。

```java
/**
 * 获取基本数据类型参数
 * 请求参数名和方法参数名相同，会进行自动映射
 */
@RequestMapping("/test1")
public String test1(String username, int age) {
    System.out.println(username);
    System.out.println(age);

    return "success";
}
```

发送请求测试：

```text
http://localhost:8080/test/test1?username=Tom&age=18
```

### 2.2 获得 POJO 类型参数（重要）

Controller 中业务方法的 POJO 参数的属性名与请求参数的 key 一致，参数值会自动映射匹配。

`Student.java`：

```java
public class Student {
    private Integer id;
    private String name;
    private String addr;
    // 页面传递过来的String类型的时间会转换为Date类型
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date birthday;

    // set、get
    // toString
}
```

```java
/**
 * 获取POJO类型参数
 * 请求参数和bean的属性名相同，SpringMVC会自动进行封装
 */
@RequestMapping("/test2")
public String test2(Student student) {
    System.out.println(student);

    return "success";
}
```

发送请求测试：

```text
http://localhost:8080/test/test2?id=1&name=zs&addr=qd&birthday=2020-10-10 18:10:30
```

### 2.3 获得数组类型参数（重要）

Controller 中业务方法的数组名称与请求参数的 name 一致，参数值会自动映射匹配。

```java
/**
 * 获取数组类型参数
 * 数组名称和请求参数名称一致，SpringMVC会进行自动映射
 */
@RequestMapping("/test3")
public String test3(String[] hobby) {
    System.out.println(Arrays.toString(hobby));

    return "success";
}
```

发送请求测试：

```text
http://localhost:8080/test/test3?hobby=学习1&hobby=学习2&hobby=学习3
```

### 2.4 获得集合类型参数一：集合封装到 POJO 中

获得集合参数时，要将集合参数包装到一个 POJO 中才可以。

`Person.java`，其中封装了集合：

```java
public class Person {
    private List<User> list;
    private Map<String, User> map;
    private Set<User> set;

    public Person() {
        /**
         * 封装set类型参数时，在Person类中一定要先初始化，不然会报错
         */
        set = new HashSet<>();
        set.add(new User());
        set.add(new User());
    }

    public Set<User> getSet() {
        return set;
    }

    public void setSet(Set<User> set) {
        this.set = set;
    }

    public Map<String, User> getMap() {
        return map;
    }

    public void setMap(Map<String, User> map) {
        this.map = map;
    }

    public List<User> getList() {
        return list;
    }

    public void setList(List<User> list) {
        this.list = list;
    }

    @Override
    public String toString() {
        return "Person{" +
                "list=" + list +
                ", map=" + map +
                ", set=" + set +
                '}';
    }
}
```

```java
/**
 * 获取集合类型参数：如果普通的get提交或者通过form表单提交，
 * 要将集合封装到一个POJO类中才能接收。
 * 如果提交的是json数据，集合可以直接接收，不需要封装到POJO类中。
 */
@RequestMapping("/test4")
public String test4(Person person) {
    System.out.println(person.getList());
    System.out.println(person.getMap());
    // 封装set类型参数时，在Person类中一定要先初始化，不然会报错
    System.out.println(person.getSet());
    return "success";
}
```

对应的表单页面，提交参数的 name 使用 `list[0].username`、`map['1'].age` 这类下标语法：

```html
<form action="${pageContext.request.contextPath}/test/test4" method="post">
    <input type="text" name="list[0].username" /><br/>
    <input type="text" name="list[0].age" /><br/>
    <input type="text" name="list[1].username" /><br/>
    <input type="text" name="list[1].age" /><br/>
    <input type="text" name="map['1'].username" /><br/>
    <input type="text" name="map['1'].age" /><br/>
    <input type="text" name="map['2'].username" /><br/>
    <input type="text" name="map['2'].age" /><br/>
    <input type="text" name="set[0].username" /><br/>
    <input type="text" name="set[0].age" /><br/>
    <input type="text" name="set[1].username" /><br/>
    <input type="text" name="set[1].age" /><br/>
    <button type="submit">提交</button>
</form>
```

### 2.5 获得集合类型参数二：使用 @RequestBody（重要）

当使用 ajax 提交时，可以指定 contentType 为 json 形式，那么在方法参数位置使用 `@RequestBody` 就可以直接接收集合数据，而无需使用 POJO 进行包装。

```html
<script src="${pageContext.request.contextPath}/js/jquery-3.3.1.js"></script>
<script>
    var userList = new Array();
    userList.push({username:'zs',age:10});
    userList.push({username:'ls',age:12});
    userList.push({username:'tom',age:20});

    $.ajax({
        type:'POST',
        url:'${pageContext.request.contextPath}/test/test5',
        data:JSON.stringify(userList),
        contentType:"application/json;charset=utf-8"
    })
</script>
```

```java
@RequestMapping("/test5")
public void test5(@RequestBody List<User> users) {
    System.out.println(users);
}
```

### 2.6 静态资源访问的开启（重要）

当有静态资源需要加载时，比如 jquery 文件，通过谷歌开发者工具抓包发现，没有加载到 jquery 文件。原因是 SpringMVC 的前端控制器 DispatcherServlet 的 url-pattern 配置的是 `/`，代表对所有的资源都进行过滤操作。我们可以通过以下三种方式指定放行静态资源。

方式一：DispatcherServlet 采用其他的 url-pattern：

```xml
<servlet>
    <servlet-name>dispatcherServlet</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>dispatcherServlet</servlet-name>
    <url-pattern>*.action</url-pattern>
</servlet-mapping>
```

此时，所有访问 handler 的路径都要以 `.action` 结尾。

方式二：在 spring-mvc.xml 配置文件中指定放行的资源：

```xml
<!-- 配置静态资源不拦截 -->
<mvc:resources mapping="/js/**" location="/js/" />
<mvc:resources mapping="/css/**" location="/css/" />
<mvc:resources mapping="/img/**" location="/img/" />
```

方式三：使用 `<mvc:default-servlet-handler/>` 标签，将静态资源的处理交还给 Tomcat 默认的 Servlet：

```xml
<mvc:default-servlet-handler />
```

### 2.7 配置全局乱码过滤器——POST 请求（重要）

Tomcat 8 及以上的版本中，**get 方式**不会出现乱码了，因为服务器对 url 的编码格式可以进行自动转换。

当 POST 请求时，数据会出现乱码，我们可以设置一个过滤器来进行编码的过滤。web.xml：

```xml
<!-- 解决中文乱码的Filter  最好放在前面 -->
<filter>
    <filter-name>CharacterEncodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <param-value>utf-8</param-value>
    </init-param>
    <init-param>
        <param-name>forceEncoding</param-name>
        <param-value>true</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>CharacterEncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

### 2.8 参数绑定注解 @RequestParam

当请求的参数名称与 Controller 的业务方法参数名称不一致时，就需要通过 `@RequestParam` 注解进行绑定：

```java
@RequestMapping("/test6")
public String test6(@RequestParam(name = "name", required = false, defaultValue = "Jim") String username) {
    System.out.println(username);
    return "success";
}
```

`@RequestParam` 的常用属性：

| 属性 | 说明 |
| --- | --- |
| `name` / `value` | 指定请求参数的名称 |
| `required` | 请求中是否必须包含该参数，默认为 true |
| `defaultValue` | 参数默认值，未传参时生效 |

### 2.9 Restful 风格参数获取 @PathVariable（重要）

Restful 是一种软件架构风格、设计风格，而不是标准，只是提供了一组设计原则和约束条件。它主要用于客户端和服务器交互类的软件，基于这个风格设计的软件可以更简洁、更有层次、更易于实现缓存机制等。

Restful 风格的请求是使用"url + 请求方式"来表示一次请求目的的。HTTP 协议里面四个表示操作方式的动词如下：

| 请求方式 | 用途 |
| --- | --- |
| GET | 用于获取资源 |
| POST | 用于新建资源 |
| PUT | 用于更新资源 |
| DELETE | 用于删除资源 |

例如：

| 请求 | 含义 |
| --- | --- |
| `GET /user/1` | 得到 id = 1 的 user |
| `DELETE /user/1` | 删除 id = 1 的 user |
| `PUT /user/1` | 更新 id = 1 的 user |
| `POST /user` | 新增 user |

上述 url 地址 `/user/1` 中的 `1` 就是要获得的请求参数。在 SpringMVC 中可以使用占位符进行参数绑定：地址 `/user/1` 可以写成 `/user/{id}`，占位符 `{id}` 对应的就是 `1` 的值。在业务方法中我们可以使用 `@PathVariable` 注解进行占位符的匹配获取工作。

```java
/**
 * Restful风格的请求参数：url + 请求类型
 */
@GetMapping("/test7/{username}")
public String test7(@PathVariable("username") String username) {
    System.out.println(username);
    return "success";
}
```

请求地址：

```text
http://localhost:8080/test/test7/Bob
```

### 2.10 自定义类型转换器——日期转换

当 `@DateTimeFormat` 无法满足需求，或需要支持多种日期格式时，可以自定义类型转换器，实现 `Converter` 接口：

```java
public class DateConverter implements Converter<String, Date> {

    @Override
    public Date convert(String s) {
        SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
        Date date = null;
        try {
            date = fmt.parse(s);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }
}
```

接收 Date 类型参数：

```java
/**
 * 接收Date类型参数，这里需要自定义类型转换器进行支持
 */
@RequestMapping("/test8")
public String test8(Date date) {
    System.out.println(date);
    return "success";
}
```

在 spring-mvc.xml 中注册转换器并开启注解支持：

```xml
<!-- 配置类型转换器 -->
<bean id="conversionServiceFactoryBean" class="org.springframework.context.support.ConversionServiceFactoryBean">
    <property name="converters">
        <list>
            <bean class="com.qfedu.converter.DateConverter" />
        </list>
    </property>
</bean>

<!-- 配置spring开启注解mvc的支持，引用类型转换器 -->
<mvc:annotation-driven conversion-service="conversionServiceFactoryBean"/>
```

### 2.11 获取 Servlet 相关 API（重要）

参考 [1.5 节](#_1-5-页面跳转-使用原生-servlet-api)，在方法形参上直接声明 `HttpServletRequest`、`HttpSession` 等对象即可。

### 2.12 获取请求头信息 @RequestHeader、@CookieValue

使用 `@RequestHeader` 可以获得请求头信息，相当于 web 阶段学习的 `request.getHeader(name)`。`@RequestHeader` 注解的属性如下：

- `value`：请求头的名称；
- `required`：是否必须携带此请求头。

使用 `@CookieValue` 可以获得指定 Cookie 的值。`@CookieValue` 注解的属性如下：

- `value`：指定 cookie 的名称；
- `required`：是否必须携带此 cookie。

```java
/**
 * 获取请求头
 */
@RequestMapping("/test10")
public String test10(@RequestHeader(value = "User-Agent", required = false) String userAgent,
                     @RequestHeader(value = "Accept-Language", required = false) String acceptLanguage,
                     @CookieValue(value = "JSESSIONID") String sessionId) {
    System.out.println(userAgent);
    System.out.println(acceptLanguage);
    System.out.println(sessionId);
    return "success";
}
```

## 3. 本章小结

- 数据响应两条主线：页面跳转（返回字符串 / ModelAndView / Model）与回写数据（`@ResponseBody` 返回字符串或对象）；
- 对象转 JSON 依赖 jackson，推荐用 `<mvc:annotation-driven/>` 自动配置消息转换器，Controller 级别用 `@RestController`；
- 参数接收的关键是"名称匹配 + 自动类型转换"：基本类型看参数名，POJO 看属性名，集合表单提交需封装 POJO，JSON 提交用 `@RequestBody`；
- DispatcherServlet 拦截 `/` 会挡住静态资源，三种放行方式按需选择；
- 参数名不一致用 `@RequestParam`，Restful 占位符用 `@PathVariable`，请求头与 Cookie 分别用 `@RequestHeader`、`@CookieValue`，日期转换可用 `@DateTimeFormat` 或自定义 `Converter`。
