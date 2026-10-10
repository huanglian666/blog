---
title: Web开发基础
date: 2026-09-12
---

# Web开发基础

本篇整理 JavaWeb 入门所需的基础知识：C/S 与 B/S 体系结构、Web 资源分类、Tomcat 服务器的安装与使用、HTTP 协议，以及使用 IDEA 创建和部署 Web 项目的完整流程。

## 1. 常见软件系统体系结构

C/S 和 B/S 是软件发展过程中出现的两种软件架构方式。

### 1.1 C/S 架构

C/S 结构即客户端/服务器（Client/Server）结构，例如 QQ。

这种结构需要同时编写服务器端程序和客户端程序，我们平时安装的 QQ 就是它的客户端程序。

- **优点**：安全性比较好；
- **缺点**：软件更新时需要同时更新客户端和服务器端，比较麻烦。

### 1.2 B/S 架构

B/S 结构即浏览器/服务器（Browser/Server）结构。

- **优点**：只需要编写服务器端程序，不需要安装专门的客户端软件，有浏览器即可访问；
- **缺点**：安全性较差。

两种架构的对比总结如下：

| 对比项 | C/S 架构 | B/S 架构 |
| --- | --- | --- |
| 客户端 | 需要安装专门的客户端软件 | 只需浏览器 |
| 开发工作量 | 服务器端 + 客户端两端都要开发 | 只开发服务器端 |
| 更新维护 | 客户端和服务器端需同时更新 | 只更新服务器端 |
| 安全性 | 较好 | 较差 |

## 2. Web 资源

**Web**（World Wide Web）称为万维网，简单理解就是网站，它用来表示 Internet 主机上供外界访问的资源。

Internet 上供外界访问的资源分为两类：

- **静态资源**：供人们浏览的数据始终是不变的，浏览器能直接看懂，例如 HTML、CSS、JavaScript、各种图片；
- **动态资源**：供人们浏览的数据是由程序产生的，不同时间点访问 Web 页面看到的内容各不相同，例如 Servlet、JSP、ASP、PHP（在 Java 中只涉及 JSP/Servlet）。

客户端请求的页面如果是静态网页，服务器会直接把静态网页的内容响应给客户端；如果请求的是动态网页，服务器需要先把动态网页转换成静态网页，再把转换后的静态网页响应给客户端。

> [!NOTE]
> 从广义上讲，用户最终看到的都是静态网页。在 Java 中，动态 Web 资源开发技术统称为 **JavaWeb**。

## 3. Web 服务器

**Web 服务器**是运行及发布 Web 应用的容器，只有将开发的 Web 项目放置到该容器中，才能使网络中的所有用户通过浏览器进行访问。

### 3.1 常见 Web 服务器

| 分类 | 服务器 | 特点 |
| --- | --- | --- |
| 开源 | Tomcat | 主流 Web 服务器之一，适合初学者 |
| 开源 | Jetty | 运行效率比 Tomcat 高 |
| 开源 | Resin | 所有开源服务器软件中运行效率最高的 |
| 收费 | WebLogic | Oracle 出品 |
| 收费 | WebSphere | IBM 出品 |

Tomcat、Jetty、Resin 三者的用法从代码角度完全相同，只有在开启、关闭服务器软件时对应的命令稍有区别，掌握一个即掌握所有。收费服务器提供相应的服务与支持，但软件庞大、耗资源。

### 3.2 Tomcat 服务器

Tomcat 是 Apache 软件基金会（Apache Software Foundation）的 Jakarta 项目中的一个核心项目，免费开源，支持 Servlet 和 JSP 规范。Tomcat 技术先进、性能稳定，深受 Java 爱好者喜爱并得到了部分软件开发商的认可，成为目前比较流行的 Web 应用服务器。

#### 3.2.1 Tomcat 安装

##### 3.2.1.1 下载

- 官网：[Apache Tomcat® - Welcome!](https://tomcat.apache.org/index.html)
- Tomcat 8 下载地址：[Apache Tomcat® - Apache Tomcat 8 Software Downloads](https://tomcat.apache.org/download-80.cgi)

![Tomcat 官网下载页面](./_pic/image-20210905233047383.png)

根据自己电脑的情况选择 32 位或 64 位版本下载。为了统一，一定要下载压缩版本。

##### 3.2.1.2 解压安装

将 Tomcat 解压到一个没有特殊符号的目录中，纯英文路径即可。

##### 3.2.1.3 Tomcat 目录结构

| 文件夹 | 说明 | 备注 |
| --- | --- | --- |
| **bin** | 存放二进制可执行文件 | `startup.bat` 启动 Tomcat、`shutdown.bat` 停止 Tomcat |
| **conf** | 非常重要的目录，其中两个文件最为重要：`server.xml` 和 `web.xml` | `server.xml`：配置整个服务器信息，例如修改端口号、编码格式等；`web.xml`：项目部署描述符文件，注册了很多 MIME 类型（文档类型） |
| lib | Tomcat 的类库，存放 Tomcat 运行所需的 jar 文件 | |
| logs | 存放日志文件，记录 Tomcat 启动和关闭的信息；启动出错时异常也会记录在这里 | |
| temp | Tomcat 的临时文件，停止 Tomcat 后会被删除 | |
| **webapps** | 存放 Web 项目的目录，其中每个文件夹都是一个项目 | ROOT 是一个特殊的项目，地址栏中没有给出项目目录时，对应的就是 ROOT 项目 |
| **work** | 运行时生成的文件，最终运行的文件都在这里 | 客户端访问 JSP 文件时，Tomcat 会先把 JSP 生成为 Java 文件，再编译为 class 文件，生成的 java 和 class 文件都存放在这个目录下 |

#### 3.2.2 启动和停止

##### 3.2.2.1 启动

进入 Tomcat 安装目录的 bin 目录下，双击 `startup.bat` 启动程序，直到控制台出现 `xxx ms` 字样，表示启动完成。

##### 3.2.2.2 验证

打开浏览器，在地址栏输入 `http://localhost:8080`，出现如下界面表示启动成功。

![Tomcat 启动成功页面](./_pic/image-20210905234021264.png)

##### 3.2.2.3 停止

双击 `shutdown.bat` 即可关闭 Tomcat。

> [!WARNING]
> 一定不要点击控制台窗口的关闭按钮来停止 Tomcat，这样做可能导致停止失败。

#### 3.2.3 项目部署及访问

**部署静态网站**的步骤：

1. 在 webapps 目录下创建一个目录 hello（命名不能包含中文和空格），这个目录称为项目目录；
2. 在项目目录下创建一个 html 文件，例如 `index.html`；
3. 启动 Tomcat；
4. 打开浏览器访问：`http://localhost:8080/hello/index.html`。

**部署动态网站**的步骤：

1. 在 webapps 目录下创建一个项目目录 hello1；
2. 在项目目录下创建如下内容：
   - WEB-INF 目录：
     - 在 WEB-INF 目录下创建 `web.xml` 文件（从 ROOT 项目下的 WEB-INF 复制即可）；
     - 创建 classes 目录，用于存放 `.class` 文件；
     - 创建 lib 目录，用于存放 jar 文件；
   - 创建动态页面 `index.jsp`，与 WEB-INF 同级；
3. 打开浏览器访问：`http://localhost:8080/hello1/index.jsp`。

`index.jsp` 内容如下：

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>Index</title>
  </head>
  <body>
      <%
          String name = "张三";
          out.print("<p>" + name + "</p>");
      %>
      <p>Hello JavaWeb</p>
  </body>
</html>
```

关于访问路径，通用格式为 `协议://主机名:端口号/项目名/资源`：

| 组成 | 说明 |
| --- | --- |
| 协议 | 一般是 http 或 https |
| 主机名 | localhost 或其他域名 |
| 端口号 | Tomcat 默认是 8080 |
| 项目名 | 与 webapps 下项目所在目录的目录名一致 |
| 资源 | 静态资源或动态资源的位置；如果资源在某个目录中，此处也要包含目录名 |

> [!WARNING]
> WEB-INF 目录中的资源无法直接通过浏览器访问。

#### 3.2.4 常见问题

启动 Tomcat 时控制台闪退，一般是由于没有配置 `JAVA_HOME` 环境变量。之前在配置 JDK 环境变量时设置的 `JAVA_HOME` 就是为这里准备的：`JAVA_HOME` 的值是 JDK 中 bin 目录的上一级目录。

### 3.3 IDEA 集成 Tomcat

依次打开设置界面，配置 Tomcat 的安装目录，将本机的 Tomcat 集成到 IDEA 中：

![IDEA 配置 Tomcat（一）](./_pic/image-20210906003847048.png)

![IDEA 配置 Tomcat（二）](./_pic/image-20210906004013585.png)

![IDEA 配置 Tomcat（三）](./_pic/image-20210906004049383.png)

## 4. HTTP 协议

### 4.1 概述

**HTTP**（hypertext transport protocol）即超文本传输协议，详细规定了浏览器和万维网服务器之间互相通信的规则。通信规则规定了客户端发送给服务器的内容格式，也规定了服务器发送给客户端的内容格式：客户端发送给服务器的格式叫**请求协议**，服务器发送给客户端的格式叫**响应协议**。

HTTP 协议的特点：

| 特点 | 说明 |
| --- | --- |
| 支持客户端/服务器模式 | 基于 B/S 模式通信 |
| 简单快速 | 客户端只需向服务器发送请求方法和路径，服务器即可响应数据，因而通信速度很快；请求方法常用的有 GET、POST 等 |
| 灵活 | 允许传输任意类型的数据，传输的数据类型由 Content-Type 标识 |
| 无连接 | 每次连接只处理一个或多个请求，服务器处理完客户的请求后即断开连接，可以节省传输时间 |
| 无状态 | 协议对于事务处理没有记忆能力 |

其中"无连接"在两个 HTTP 版本中的表现不同：

- **HTTP 1.0**：一个请求响应之后直接断开连接，称为**短连接**；
- **HTTP 1.1**：响应后不立即断开，而是等几秒钟；这几秒钟之内有新的请求，仍然通过之前的连接通道收发消息，超过时间没有新请求才断开连接，称为**长连接**。

### 4.2 请求协议

请求协议是客户端发送给服务器的数据格式，结构如下：

```text
请求首行
请求头信息
空行
请求体
```

请求方式分为 GET 和 POST 两种：

| 请求方式 | 特点 |
| --- | --- |
| GET | 可以在请求的 URL 地址后以 `?` 的形式携带交给服务器的数据，多个数据之间以 `&` 分隔；URL 后附带的参数容量有限，通常不能超过 1K；GET 请求没有请求体 |
| POST | 传送的数据量没有限制，传输的数据在请求体内 |

![请求报文](./_pic/请求报文.png)

### 4.3 响应协议

响应协议是服务器发送给客户端的数据格式，结构如下：

```text
响应首行
响应头信息
空行
响应体
```

常见的响应状态码：

| 状态码 | 含义 |
| --- | --- |
| 200 | 请求成功，浏览器会把响应体内容（通常是 html）显示在浏览器中 |
| 404 | 请求的资源没有找到，说明客户端请求了不存在的资源 |
| 500 | 请求资源找到了，但服务器内部出现了错误 |
| 302 | 重定向 |
| 304 | 如果再次访问的页面没有经过修改，返回 304 |

![响应报文](./_pic/响应报文.png)

## 5. IDEA 创建 Web 项目

此处以 IDEA 2020.3 为例。

### 5.1 新建普通 Java 项目

![IDEA 新建普通 Java 项目](./_pic/image-20210906002401086.png)

> [!NOTE]
> IDEA 2020 无法直接新建 JavaWeb 项目，只能通过新建普通 Java 项目的方式间接创建 JavaWeb 项目。选择项目位置的操作与普通 Java 项目相同，此处略过。

### 5.2 修改普通 Java 项目为 JavaWeb 项目

在项目根目录上右键，选择 Add Framework Support：

![添加框架支持入口](./_pic/image-20210906002811360.png)

选择 JavaEE 版本：

![选择 JavaEE 版本](./_pic/image-20210906002948105.png)

勾选左侧的 Web Application：

![勾选 Web Application](./_pic/image-20210906003126293.png)

完成之后，可以看到项目下新建了 web 目录，并包含如下内容：

![web 目录结构](./_pic/image-20210906003250782.png)

接下来添加相关依赖：File -> Project Structure：

![打开 Project Structure](./_pic/image-20210906004437099.png)

![添加 Tomcat 依赖（一）](./_pic/image-20210906004525203.png)

![添加 Tomcat 依赖（二）](./_pic/image-20210906004613241.png)

执行上述操作之后，Tomcat 相关 jar 包就添加到了项目中；不添加的话，后续很多开发无法进行。

### 5.3 项目部署

此处指的是将 IDEA 中开发的 Web 项目部署到 Tomcat 中：

![配置 Tomcat 部署（一）](./_pic/image-20210906005147219.png)

![配置 Tomcat 部署（二）](./_pic/image-20210906005254292.png)

![配置 Tomcat 部署（三）](./_pic/image-20210906005402507.png)

![配置 Tomcat 部署（四）](./_pic/image-20210906005602709.png)

修改 index.jsp 的代码：

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>Index</title>
  </head>
  <body>
      <%
          String name = "张三";
          out.print("<p>" + name + "</p>");
      %>
      <p>Hello JavaWeb</p>
  </body>
</html>
```

### 5.4 项目运行

单击运行按钮运行项目，默认会在浏览器中打开 index.jsp：

![IDEA 运行 Web 项目](./_pic/image-20210906010314577.png)

> [!TIP]
> 在以后的开发中，多数时候都是重复上述步骤进行 JavaWeb 项目的开发。

### 5.5 其他操作

#### 5.5.1 关联第三方 jar 包

1. 在项目 WEB-INF 目录下新建 lib 目录；
2. 将第三方 jar 包（例如 MySQL 驱动 jar 包、druid 连接池 jar 包）拷贝到 lib 目录下；
3. 在 lib 上右键选择 `Add as Library`；
4. 选择 Project Library，完成。

三种库级别的适用范围如下：

| 库级别 | 适用范围 |
| --- | --- |
| Global Library | 所有工程都可以使用 |
| Project Library | 当前工程中所有模块都可以使用 |
| Module Library | 当前模块可以使用 |

#### 5.5.2 导出 war 包

项目完成后，有时需要打成 war 包方便部署。war 包可以直接放入 Tomcat 的 webapps 目录中，启动 Tomcat 后自动解压，即可访问。

![导出 war 包（一）](./_pic/image-20210906012103948.png)

![导出 war 包（二）](./_pic/image-20210906012351899.png)

![导出 war 包（三）](./_pic/image-20210906012451882.png)

执行上述操作后，会在项目根目录下生成 out 目录，内部包含的 war 包就是我们需要的 war 包：

![out 目录中的 war 包](./_pic/image-20210906012634767.png)

将该 war 包拷贝到 Tomcat 的 webapps 目录下，双击运行 `startup.bat`，Tomcat 会**自动解压**该 war 包并发布项目，发布之后我们就可以访问。
