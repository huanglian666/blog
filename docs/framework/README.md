---
title: 框架学习
icon: fa-solid fa-layer-group
---

主流后端开发框架学习笔记，覆盖持久层（MyBatis）、核心容器（Spring）、快速开发（SpringBoot）、Web 层（SpringMVC）与前端框架（Vue）的全套生态。本板块需要 [JavaSE](/javase/)、[数据库](/sql/) 与 [Web开发](/web/) 的基础——尤其建议先掌握 JDBC 和 Servlet，这样才能理解框架各自解决了什么问题。

## 学习路线

推荐按 **Mybatis → Spring → SpringMVC → SpringBoot** 的顺序学习，这正是 Java 后端框架的历史演进线：先学持久层框架 MyBatis 简化数据库操作；再学 Spring 的 IOC/DI 与 AOP 思想；然后是 SpringMVC 的请求处理模型，并用 SSM 整合案例把三者串起来；最后用 SpringBoot 体会"约定优于配置"的开发效率。Vue 部分独立成线，做前后端联调实践时再学即可。

## Mybatis

- [MyBatis快速入门](./mybatis/01_MyBatis快速入门.md)
- [MyBatis进阶](./mybatis/02_MyBatis进阶.md)
- [MybatisPlus](./mybatis/03_MybatisPlus.md)
- [tkMapper](./mybatis/04_tkMapper.md)

## Spring

- [Spring IOC 和 DI](./spring/01_SpringIOC和DI.md)
- [动态代理和 Spring AOP](./spring/02_动态代理和SpringAOP.md)
- [Spring 整合 MyBatis 与声明式事务](./spring/03_Spring整合MyBatis_声明式事务.md)
- [Spring 注解开发与整合 JUnit](./spring/04_Spring注解开发_整合Junit.md)

## SpringBoot

- [SpringBoot 入门](./springboot/01_SpringBoot_入门.md)
- [SpringBoot 进阶](./springboot/02_SpringBoot_进阶.md)
- [SpringBoot 集成 Swagger2](./springboot/03_SpringBoot_Swagger2.md)

## SpringMVC

- [SpringMVC快速入门及解析](./springmvc/01_SpringMVC快速入门及解析.md)
- [SpringMVC的响应和请求](./springmvc/02_SpringMVC的响应和请求.md)
- [SpringMVC文件上传下载及异常处理](./springmvc/03_SpringMVC文件上传下载及异常处理.md)
- [SSM整合案例](./springmvc/04_SSM整合案例.md)
- [SpringSecurity通用权限管理系统](./springmvc/05_SpringSecurity通用权限管理系统.md)

## Vue

- [ECMAScript 6 入门](./vue/01_ECMAScript6入门.md)
- [Vue入门](./vue/02_Vue入门.md)
- [Vue进阶](./vue/03_Vue进阶.md)
- [Wiki实战项目](./vue/04_Wiki实战项目.md)
