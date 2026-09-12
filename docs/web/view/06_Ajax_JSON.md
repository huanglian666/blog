---
title: 06_Ajax_JSON
---

## 一、Ajax

### 1.1、Ajax概念

> * AJAX = Asynchronous (异步) JavaScript and XML（**异步**的JavaScript和XML）；
>   * 同步 --- 客户端必须等待服务器端的响应，在等待的期间客户端不能做其他操作；
>   * **异步** --- 客户端不需要等待服务器端的响应，在服务器处理请求的过程中，客户端可以进行其他的操作。
>
> - AJAX是一种在无需重新加载整个网页的情况下，能够更新部分网页的技术；
> - 通过在后台与服务器进行少量数据交换，AJAX可以使网页实现异步更新。这意味着可以在不重新加载整个网页的情况下，对网页的某部分进行更新；
> - 传统的网页（不使用 AJAX）如果需要更新内容，必需重载整个网页；
> - 提升用户体验。

#### 1.1.1、应用场景

![111](./_pic/111.png ':size=70%')

![](./_pic/222.png ':size=50%')

### 1.2、原生JS方式（了解）

> 需求：页面包含一个按钮，单击按钮发送Ajax请求，并将服务器返回的数据以弹框的形式在页面显示。

#### 1.2.1、前端部分

##### 1.2.1.1、步骤

> 1. 创建XMLHttpRequest对象；
> 2. 建立连接；
> 3. 发送请求；
> 4. 接收并处理来自服务器的响应结果。

##### 1.2.1.2、代码

> html

```html
<button onclick="ajaxTest()">发送ajax请求</button>
```

> javascript（参考`https://www.w3school.com.cn/ajax/index.asp`）

```javascript
//发送ajax请求--原生ajax
function ajaxTest() {
    //1.创建XMLHttpRequest对象
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    /* 2.建立连接
       参数：
          1.请求方式，GET、POST
          2.请求路径，一般写一个服务器资源的地址（Servlet的地址）
          3.同步或异步请求，true（异步）或 false（同步）
    */
    xmlhttp.open("GET", "${pageContext.request.contextPath}/ajaxServlet?name=Zhangsan", true);
    //3.发送请求
    xmlhttp.send();
    
    //如果需要像 HTML 表单那样 POST 数据，请使用 setRequestHeader() 来添加 HTTP 头。
    //然后在 send() 方法中规定您希望发送的数据：
    //xmlhttp.open("POST","${pageContext.request.contextPath}/ajaxServlet",true);
    //xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //xmlhttp.send("name=Zhangsan");

    //4.接收并处理来自服务器的响应结果
    xmlhttp.onreadystatechange = function () {
        /**
		 * readyState:XMLHttpRequest 的状态
		 *  0: 请求未初始化
		 *  1: 服务器连接已建立
		 *  2: 请求已接收
		 *  3: 请求处理中
		 *  4: 请求已完成，且响应已就绪
		 *
		 *  status:响应状态码
		 */
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            alert(xmlhttp.responseText);
        }
    }
}
```

#### 1.2.2、服务端代码

##### 1.2.2.1、步骤

>1. 创建JavaWeb工程；
>2. 创建Servlet；
>3. 接收请求参数；
>4. 响应数据。

##### 1.2.2.2、代码

```java
@WebServlet("/ajaxServlet")
public class AjaxServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //获取请求参数
        String name = request.getParameter("name");
        System.out.println(name + "-----------------------------");
/*        try {
            //延时5秒
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }*/

        //向浏览器响应数据
        response.getWriter().println("hello:" + name);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

### 1.3、jQuery方式（重点）

#### 1.3.1、常用函数

##### 1.3.1.1、$.ajax()

> **语法：**`$.ajax({键值对})`
>
> **参数：**
>
> * url：请求路径
> * type：请求方式 ("POST" 或 "GET")， 默认为 "GET"
> * data：请求参数，可以是“key=value”格式的字符串，也可以是JSON
> * dataType：预期服务器返回的数据类型 text
> * success：请求成功后的回调函数

##### 1.3.1.2、$.get()

> **语法：**`$.get(url, [data], [callback], [type])`
>
> **参数：**
>
> * url：请求路径
> * data：请求参数
> * callback：回调函数
> * type：响应结果的类型

##### 1.3.1.3、$.post()

> **语法：**`$.post(url, [data], [callback], [type])`
>
> **参数：**
>
> * url：请求路径
> * data：请求参数
> * callback：回调函数
> * type：响应结果的类型

#### 1.3.2、代码

> `$.ajax()`

```javascript
function ajaxTest() {
    $.ajax({
        url:"${pageContext.request.contextPath}/ajaxServlet",//请求地址
        type:"GET",//请求方式
        data:"name=ZhangSan",//发送的数据
        success:function (data) {//成功之后的回调函数
            alert(data);
        },
        error:function (err) {//失败之后的回调函数
            console.log(err);
        }
    });
}
```

> `$.get()`

```javascript
function ajaxTest() {
    /**
     * 四个参数：请求地址、请求数据、成功回调函数、预计的服务器响应的数据类型。
     */
    $.get("${pageContext.request.contextPath}/ajaxServlet", "name=Tom", function (data) {
        alert(data);
    }, "text");
}
```

> `$.post()`

```javascript
function ajaxTest() {
    $.post("${pageContext.request.contextPath}/ajaxServlet111", {name:"Tom"}, function (data) {
        alert(data);
    }, "text");
}
```

## 二、JSON

### 2.1、JSON概念

> JSON(JavaScript Object Notation, JS对象标记，JavaScript对象表示法) 是一种轻量级的**数据交换格式**。它基于 ECMAScript (W3C制定的JS规范)的一个子集，采用完全**独立于编程语言**的文本格式来**存储和表示**数据。简洁和清晰的层次结构使得JSON成为理想的**数据交换语言**。 易于人阅读和编写，同时也易于机器解析和生成，并有效地提升网络传输效率。

### 2.2、JSON语法

> 数据在名称/值对中：json数据是由**键值对**构成的
>
> * 键用引号(单双都行)引起来，也可以不使用引号
> * 值的取值类型：
>   * 数字（整数或浮点数）
>   * 字符串（在双引号中）
>   * 逻辑值（true 或 false）
>   * 数组（在方括号中）	{"persons":[{},{}]}
>   * 对象（在花括号中） {"address":{"province"："山东"....}}
>   * null
>   * 数据由逗号分隔：多个键值对由逗号分隔
>   * 花括号保存对象：使用{}定义json格式
>   * 方括号保存数组：[]

```javascript
//JSON对象
//基本格式
var student = {id:10, name:"Tom", age:10};

//嵌套格式 {}包含[]
//班级
var cls = {
    students: [//所有学生
        {id: 10, name: "Tom", age: 10},
        {id: 20, name: "Bob", age: 12},
        {id: 30, name: "Jim", age: 20},
        {id: 31, name: "Smith", age: 20}
    ],
    addr: "qd"//地址
};

//嵌套格式 []包含{}
var stus = [{id: 10, name: "Tom", age: 10},
            {id: 20, name: "Bob", age: 12},
            {id: 30, name: "Jim", age: 20},
            {id: 31, name: "Smith", age: 20}];
```

### 2.3、JSON值的获取

> json对象.键名
>
> json对象["键名"]
>
> 数组对象[索引]
>
> 遍历

```javascript
console.log(student.name);
console.log(student['name']);

//获取student对象中所有的键和值
for (var key in student) {
    console.log(key, student[key]);
}

console.log("--------------------------------------------")

//获取数组中的所有值
for (var i = 0; i < stus.length; i++) {
    var stu = stus[i];
    for(var key in stu){
        console.log(key+":"+stu[key]);
    }
}
```

### 2.4、JSON数据和Java对象的转换（重点）

> 在日常实践中通常会对JSON数据和Java对象进行**相互转换**，转换需要用到JSON解析器，常见的解析器如下：
>
> * Jsonlib（JSON官方）
> * Gson（Google）
> * **Jackson（Spring官方）**
> * *Fastjson（Alibaba）*
>
> 本质上就是一些工具类。

#### 2.4.1、Java对象转JSON

> 步骤：
>
> 1. 导入Jackson的相关jar包；
>
> 2. 创建Jackson核心对象 ObjectMapper；
>
> 3. 调用ObjectMapper的相关方法进行转换。
>
>    * writeValueAsString(Object obj) --- Java对象 ---> JSON字符串
>
>    * writeValue(参数1，Object obj )
>
>      参数1：
>
>      * File：将obj对象转换为JSON字符串，并保存到指定的文件中；
>      * Writer：将obj对象转换为JSON字符串，并将json数据填充到字符输出流中；
>      * OutputStream：将obj对象转换为JSON字符串，并将json数据填充到字节输出流中。
>
> Person类

```java
public class Person {
    private Integer id;
    private String name;
    private Integer age;
    private String addr;
    //set和get方法
    //toString方法
}
```

> 测试方法

```java
@Test
public void test1() throws IOException {
    //创建对象
    Person person = new Person();
    person.setId(10);
    person.setName("Tom");
    person.setAge(22);
    person.setAddr("QD");

    //创建jackson的核心对象
    ObjectMapper objectMapper = new ObjectMapper();

    //转换 Java对象 ---> JSON字符串
    String pStr = objectMapper.writeValueAsString(person);
    System.out.println(pStr);
    
    //转换 Java对象 ---> JSON字符串保存到文件中
    objectMapper.writeValue(new File("D:/a.txt"), person);
    objectMapper.writeValue(new FileWriter("D:/b.txt"), person);
}
```

##### 2.4.1.1、Java对象转JSON相关注解

> @JsonIgnore：排除属性。
>
> @JsonFormat：属性值得格式化
>
> * @JsonFormat(pattern = "yyyy-MM-dd")
>
> 修改Person类

```java
public class Person {
    private Integer id;
    private String name;
    private Integer age;
    private String addr;
   	//@JsonIgnore
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date birthday;
    //set和get方法
    //toString方法
}
```

> 测试方法

```java
@Test
public void test2() throws Exception {
    Person person = new Person();
    person.setId(20);
    person.setName("Tom");
    person.setAge(23);
    person.setAddr("QD");
    person.setBirthday(new Date());

    ObjectMapper objectMapper = new ObjectMapper();
    String s = objectMapper.writeValueAsString(person);

    System.out.println(s);
}
```

##### 2.4.1.2、复杂类型对象转JSON

```java
@Test
public void test3() throws JsonProcessingException {
    Person p1 = new Person();
    p1.setId(20);
    p1.setName("Tom");
    p1.setAge(23);
    p1.setAddr("QD");
    p1.setBirthday(new Date());

    Person p2 = new Person();
    p2.setId(20);
    p2.setName("Bob");
    p2.setAge(13);
    p2.setAddr("QD");
    p2.setBirthday(new Date());

    List<Person> list = new ArrayList<Person>();
    list.add(p1);
    list.add(p2);

    ObjectMapper objectMapper = new ObjectMapper();
    String s = objectMapper.writeValueAsString(list);

    System.out.println(s);
}

@Test
public void test4() throws JsonProcessingException {
    Map<String, Object> map = new HashMap<String, Object>();
    map.put("id", 10);
    map.put("name", "Tom");
    map.put("age", 20);
    map.put("addr", "QD");

    ObjectMapper objectMapper = new ObjectMapper();
    String s = objectMapper.writeValueAsString(map);

    System.out.println(s);
}
```

#### 2.4.2、JSON转Java对象

> 步骤：
>
> 1. 导入jackson的相关jar包；
> 2. 创建Jackson核心对象 ObjectMapper
> 3. 调用ObjectMapper的相关方法进行转换
>    * readValue(json字符串数据,Class)

```java
@Test
public void test5() throws IOException {
    String person = "{\"id\":20,\"name\":\"Tom\",\"age\":23,\"addr\":\"QD\"}";
    ObjectMapper objectMapper = new ObjectMapper();

    Person p = objectMapper.readValue(person, Person.class);
    System.out.println(p);
}
```

#### 2.4.3、Fastjson使用（Alibaba）

> Fastjson使用和Jackson类似，这里不再进行详细说明。
>
> 测试方法

```java
@Test
public void test6() {
    Person person = new Person();
    person.setId(20);
    person.setName("Tom");
    person.setAge(23);
    person.setAddr("QD");
    person.setBirthday(new Date());
	
    //Java对象转JSON字符串
    String json= JSON.toJSONString(person);
    System.out.println(json);
}

@Test
public void test7() {
    String person = "{\"id\":20,\"name\":\"Tom\",\"age\":23,\"addr\":\"QD\"}";
    
    //JSON字符串转Java对象
    Person p = JSON.parseObject(person, Person.class);
    System.out.println(p);
}
```

### 2.5、浏览器处理JSON字符串

#### 2.5.1、JSON对象转JSON字符串

> JSON.stringify()

#### 2.5.2、JSON字符串转JSON对象

> JSON.parse()

```javascript
var json={name:'zs',age:34};
var str=JSON.stringify(json);
console.log(typeof json);
console.log(typeof str);

var obj = JSON.parse(str);
console.log(typeof obj);
```

## 三、校验用户是否存在（重点）

> reg.jsp

```javascript
<script src="${pageContext.request.contextPath}/js/jquery-3.4.1.min.js"></script>
<script>
    $(function () {
        $("#username").blur(function () {
            var username = $(this).val(); 

            $.get("${pageContext.request.contextPath}/findUserServlet", {username:username}, function (data) {
                console.log(typeof data);
                //string --> JSON对象
                //var response = JSON.parse(data);
                var response = data;
                if(response.exsit) {
                    $("#info").css("color", "red");
                    $("#info").text(response.msg);
                } else {
                    $("#info").css("color", "green");
                    $("#info").text(response.msg);
                }
            }, "json");
        });

        $("#username").focus(function () {
            $("#info").text("");
        });
    });
</script>
```

> UserServlet.java

```java
@WebServlet("/findUserServlet")
public class FindUserServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");

        Map<String, Object> map = new HashMap<String, Object>();
        if("tom".equals(username)) {
            //存在
            map.put("exsit", true);
            map.put("msg", "用户名不可用");
        } else {
            map.put("exsit", false);
            map.put("msg", "用户名可用");
        }

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(out, map);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
```

## 四、使用Ajax实现文件上传

### 4.1、前端代码

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>文件上传</title>
    <script src="${pageContext.request.contextPath}/js/jquery-3.4.1.min.js"></script>
    <script>
        function onUpload() {
          var formData = new FormData();
          var fileData = $("#file").prop('files')[0];
          formData.append('pic', fileData);
          formData.append('username', $("#username").val());

          $.ajax({
                url: "${pageContext.request.contextPath}/UploadServlet",
                type: "post",
                async: false,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                      console.log(data)
                }
          })
        }
    </script>
  </head>
  <body>
    <div>
      <input id="username" type="text" name="username" placeholder="请输入用户名" />
      <input id="file" type="file" name="file" />
      <input type="button" value="上传" onclick="onUpload()">
    </div>
  </body>
</html>
```

### 4.2、服务端代码

```java
package com.qfedu.servlet;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@WebServlet(name = "UploadServlet", value = "/UploadServlet")
public class UploadServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //对上传的普通表单项和文件进行处理
        //System.out.println(request.getParameter("username"));
        //创建工厂
        DiskFileItemFactory factory = new DiskFileItemFactory();
        //创建解析器
        ServletFileUpload sfu = new ServletFileUpload(factory);
        //处理请求
        try {
            //FileItem - 对应表单项
            List<FileItem> fileItems = sfu.parseRequest(request);
            for (FileItem item : fileItems) {
                //判断当前的FileItem是否是普通表单项
                if (item.isFormField()) { //是普通表单项
                    //获取key
                    String name = item.getFieldName();
                    String value = item.getString();
                    System.out.println(name + ":" + value);
                } else { //是文件
                    String fileName = item.getName(); //原始文件名
                    System.out.println("文件名:" + fileName);
                    long size = item.getSize();
                    System.out.println("文件大小：" + size);

                    //将文件保存到项目下的img下 - 获取img的路径
                    ServletContext servletContext = request.getServletContext();
                    String imgPath = servletContext.getRealPath("/img");

                    fileName = UUID.randomUUID().toString().replace("-","") + "_" + fileName;

                    //保存文件
                    item.write(new File(imgPath + "/" + fileName));
                }
            }
        } catch (FileUploadException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }
}
```

