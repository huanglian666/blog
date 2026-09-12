import {defaultTheme} from 'vuepress'


export default {
	land: 'zh-CN',
	title: '黄炼wiki',
	description: '欢迎来到黄炼的个人博客',
	port: '8088',
	host: 'localhost',
	head:[['link',{rel: 'icon', href: '/logo.jpg'}]],
	base: '/',
	markdown: {
        code:{
            lineNumbers:true//代码显示行号
        }
	},
	theme: defaultTheme({
		 navbar: [
            {
                text:'首页',
                link:'/',
            },
            {
                text: 'JavaSE',
                children:[
                    {
                        text:'JavaSE基础',
                        children:[
                            {text:'01_Java入门与开发环境搭建', link: '/javase/basic/01_Java入门与开发环境搭建.md'},
                            {text:'02_Java语言基础', link: '/javase/basic/04_方法.md'},
                            {text:'03_控制流程', link: '/javase/basic/04_方法.md'},
                            {text:'04_方法', link: '/javase/basic/04_方法.md'},
                            {text:'05_数组', link: '/javase/basic/05_数组.md'},
                            {text:'06_面向对象基础', link: '/javase/basic/06_面向对象基础.md'},
                            {text:'07_面向对象三大特征', link: '/javase/basic/07_面向对象三大特征.md'},
                            {text:'08_三个修饰符', link: '/javase/basic/08_三个修饰符.md'},
                            {text:'09_接口和内部类', link: '/javase/basic/09_接口和内部类.md'},
                            {text:'10_常用类', link: '/javase/basic/10_常用类.md'},
                            {text:'11_集合', link: '/javase/basic/11_集合.md'},
                            {text:'12_异常', link: '/javase/basic/12_异常.md'},
                        ]

                    },
                    {
                        text:'JavaSE高级',
                        children:[
                            {text:'01_IO', link: '/javase/senior/01_IO.md'},
                            {text:'02_多线程', link: '/javase/senior/02_多线程.md'},
                            {text:'03_网络编程', link: '/javase/senior/03_网络编程.md'},
                            {text:'04_反射', link: '/javase/senior/04_反射.md'},
                            {text:'05_Java8新特性', link: '/javase/senior/05_Java8新特性.md'},
                        ]
                    },
                ]
            },
            {
                text: '工具|部署',
                children:[
                    {text:'IDEA',
                    children:[
                        {text:'简介',link:'/tool/idea/'},
                        {text:'01_IDEA配置_2019',link:'/tool/idea/01_IDEA配置_2019.md'},
                        {text:'02_IDEA配置_2020',link:'/tool/idea/02_IDEA配置_2020.md'},
                        {text:'03_IDEA快捷键',link:'/tool/idea/03_IDEA快捷键.md'},
                    ]
                    },// 以 ‘/’结束，默认读取 README.md
                    {text:'Maven',
                     children:[
                         {text:'01_Maven基础',link:'/tool/maven/01_Maven基础.md'},
                         {text:'02_Maven聚合工程',link:'02_Maven聚合工程.md'},
                     ]
                    },
                    {text:'版本控制',
                        children:[
                            {text:'Git基础教程',link:'/tool/git/Git.md'},
                        ]
                    },
                    {text:'Linux',
                        children:[
                            {text:'01_Linux_安装',link:'/tool/linux/01_Linux_安装.md'},
                            {text:'02_Linux_简介及常用命令',link:'/tool/linux/02_Linux_简介及常用命令.md'},
                            {text:'03_Linux_Vim使用',link:'/tool/linux/03_Linux_Vim使用.md'},
                            {text:'04_Linux_软件安装及Java开发环境搭建',link:'/tool/linux/04_Linux_软件安装及Java开发环境搭建.md'},
                            {text:'05_Linux_搭建基于SFTP服务的文件服务器',link:'/tool/linux/05_Linux_搭建基于SFTP服务的文件服务器.md'},
                            {text:'06_Linux_防火墙FirewallD设置',link:'/tool/linux/06_Linux_防火墙FirewallD设置.md'},
                        ]
                    },
                    {text:'代理服务器',
                        children:[
                            {text:'Nginx基础教程',link:'/tool/nginx/Nginx.md'},
                        ]
                    },
                ]
            },
            {
                text: '数据库',
                children:[
                    {
                        text:'MySql',
                        children:[
                            {text:'01_MySQL概述', link: '/sql/mysql/01_MySQL概述.md'},
                            {text:'02_MySQL安装及配置', link: '/sql/mysql/02_MySQL安装及配置.md'},
                            {text:'03_MySQL客户端工具', link: '/sql/mysql/03_MySQL客户端工具.md'},
                            {text:'04_SQL概述及DDL', link: '/sql/mysql/04_SQL概述及DDL.md'},
                            {text:'05_DML', link: '/sql/mysql/05_DML.md'},
                            {text:'06_约束', link: '/sql/mysql/06_约束.md'},
                            {text:'07_DQL', link: '/sql/mysql/07_DQL.md'},
                            {text:'08_DCL', link: '/sql/mysql/08_DCL.md'},
                            {text:'09_TPL', link: '/sql/mysql/09_TPL.md'},
                            {text:'10_视图', link: '/sql/mysql/10_视图.md'},
                            {text:'11_常用函数', link: '/sql/mysql/11_常用函数.md'},
                            {text:'12_变量_存储过程_函数', link: '/sql/mysql/12_变量_存储过程_函数.md'},
                        ]
                    },
                    {
                        text:'JDBC',
                        children:[
                            {text:'01_JDBC', link: '/sql/jdbc/01_JDBC.md'},
                            {text:'02_数据库连接池', link: '/sql/jdbc/02_数据库连接池.md'},
                            {text:'03_事务', link: '/sql/jdbc/03_事务.md'},
                            {text:'04_Commons_DbUtils', link: '/sql/jdbc/04_Commons_DbUtils.md'},
                        ]
                    },

                ]
            },
            {
                text: 'Web开发',
                children:[
                    {
                        text:'前端基础',
                        children:[
                            {text:'01_HTML', link: '/web/view/01_HTML.md'},
                            {text:'02_CSS', link: '/web/view/02_CSS.md'},
                            {text:'03_JavaScript', link: '/web/view/03_JavaScript.md'},
                            {text:'04_jQuery', link: '/web/view/04_jQuery.md'},
                            {text:'05_BootStrap', link: '/web/view/05_BootStrap.md'},
                            {text:'06_Ajax_JSON', link: '/web/view/06_Ajax_JSON.md'},
                        ]
                    },
                    {
                        text:'JavaWeb',
                        children:[
                            {text:'01_Web开发基础', link: '/web/javaweb/01_Web开发基础.md'},
                            {text:'02_Servlet', link: '/web/javaweb/02_Servlet.md'},
                            {text:'03_JSP入门_Cookie_Session', link: '/web/javaweb/03_JSP入门_Cookie_Session.md'},
                            {text:'04_JSP进阶_EL_JSTL', link: '/web/javaweb/04_JSP进阶_EL_JSTL.md'},
                            {text:'05_Filter', link: '/web/javaweb/05_Filter.md'},
                            {text:'06_文件上传', link: '/web/javaweb/06_文件上传.md'},
                        ]
                    },
                ]
            },
            {
                text: '框架学习',
                children:[
                    {
                        text:'Mybatis',
                        children:[
                            {text:'01_MyBatis快速入门', link: '/framework/mybatis/01_MyBatis快速入门.md'},
                            {text:'02_MyBatis进阶', link: '/framework/mybatis/02_MyBatis进阶.md'},
                            {text:'03_MybatisPlus', link: '/framework/mybatis/03_MybatisPlus.md'},
                            {text:'04_tkMapper', link: '/framework/mybatis/04_tkMapper.md'},
                        ]
                    },
                    {
                        text:'Spring',
                        children:[
                            {text:'01_SpringIOC和DI', link: '/framework/spring/01_SpringIOC和DI.md'},
                            {text:'02_动态代理和SpringAOP', link: '/framework/spring/02_动态代理和SpringAOP.md'},
                            {text:'03_Spring整合MyBatis_声明式事务', link: '/framework/spring/03_Spring整合MyBatis_声明式事务.md'},
                            {text:'04_Spring注解开发_整合Junit', link: '/framework/spring/04_Spring注解开发_整合Junit.md'},
                        ]
                    },
                    {
                        text:'SpringMVC',
                        children:[
                            {text:'01_SpringMVC快速入门及解析.md', link: '/framework/springmvc/01_SpringMVC快速入门及解析.md'},
                            {text:'02_SpringMVC的响应和请求.md', link: '/framework/springmvc/02_SpringMVC的响应和请求.md'},
                            {text:'03_SpringMVC文件上传下载及异常处理.md', link: '/framework/springmvc/03_SpringMVC文件上传下载及异常处理.md'},
                            {text:'04_SSM整合案例.md', link: '/framework/springmvc/04_SSM整合案例.md'},
                            {text:'05_SpringSecurity通用权限管理系统.md', link: '/framework/springmvc/05_SpringSecurity通用权限管理系统.md'},
                        ]
                    },
                    {
                        text:'SpringBoot',
                        children:[
                            {text:'01_SpringBoot_入门', link: '/framework/springboot/01_SpringBoot_入门.md'},
                            {text:'02_SpringBoot_进阶', link: '/framework/springboot/02_SpringBoot_进阶.md'},
                            {text:'03_SpringBoot_Swagger2', link: '/framework/springboot/03_SpringBoot_Swagger2.md'},
                        ]
                    },
                    {
                        text:'前端框架(Vue)',
                        children:[
                            {text:'01_ECMAScript6入门', link: '/framework/vue/01_ECMAScript6入门.md'},
                            {text:'02_Vue入门', link: '/framework/vue/02_Vue入门.md'},
                            {text:'03_Vue进阶', link: '/framework/vue/03_Vue进阶.md'},
                            {text:'04_Wiki实战项目', link: '/framework/vue/04_Wiki实战项目.md'},
                        ]
                    },
                ]
            },
            {
                 text:'SpringCloud',
                 children:[
                     {
                         text:'docker',
                         children:[
                             {text:'01_微服务的发展历史',link: '/springCloud/docker/01_微服务架构演变.md'},
                             {text:'02_docker',link: '/springCloud/docker/02_docker.md'},
                         ]
                     },
                     {
                         text:'redis',
                         children:[
                             {text:'01_redis',link:'/springCloud/redis/01_redis.md'},
                             {text:'02_redis',link:'/springCloud/redis/02_redis.md'},
                             {text:'03_布隆过滤器',link:'/springCloud/redis/03_布隆过滤器.md'},
                         ]
                     },
                     {
                         text:'MQ',
                         children:[
                             {text:'01_RocketMQ',link:'/springCloud/MQ/01_rocketMQ.md'},
                         ]
                     },
                     {
                         text:'ElasticSearch',
                         children:[
                             {text:'01_ElasticSearch',link:'/springCloud/elasticsearch/01_ElasticSearch.md'},
                         ]
                     },
                     {
                         text:'SpringCloudAlibaba',
                         children:[
                             {text:'01_Nacos',link:'/springCloud/springcloudalibaba/01_Nacos.md'},
                             {text:'02_Nacos',link:'/springCloud/springcloudalibaba/02_Nacos.md'},
                             {text:'03_Sentinel',link:'/springCloud/springcloudalibaba/03_Sentinel.md'},
                             {text:'04_Sleuth',link:'/springCloud/springcloudalibaba/04_Sleuth.md'},
                             {text:'05_Gateway',link:'/springCloud/springcloudalibaba/05_Gateway.md'},
                             {text:'06_Seata.md',link:'/springCloud/springcloudalibaba/06_Seata.md'},
                         ]
                     }
                 ]
            },
            {
                 text:'SpringCloud综合项目',
                 children:[
                     {text:'01_电子商城',link:'/springCloud/project/01_项目笔记.md'},
                     {text:'02_单点登录SSO',link:'/springCloud/project/02_单点登录SSO.md'},
                     {text:'03_ElasticSearch在项目中做搜索的应用',link:'/springCloud/project/03_ElasticSearch在项目中做搜索的应用.md'},
                     {text:'04_IdWorker',link:'/springCloud/project/04_IdWorker.md'},
                     {text:'05_微信支付',link:'/springCloud/project/05_微信支付.md'},
                     {text:'06_git在项目中的使用',link:'/springCloud/project/06_git在项目中的使用.md'},
                     {text:'07_网页静态化技术',link:'/springCloud/project/07_网页静态化技术.md'},
                     {text:'08_购物车',link:'/springCloud/project/08_购物车.md'},
                 ]

            },
            {
                text:'设计模式',
                children:[
                    {text:'01_设计模式概述',link:'/designPatterns/01_设计模式.md'},
                    {text:'02_创建形设计模式',link:'/designPatterns/02_设计模式.md'},
                    {text:'03_结构形设计模式1',link:'/designPatterns/03_设计模式.md'},
                    {text:'04_结构形设计模式2',link:'/designPatterns/04_设计模式.md'},
                    {text:'05_行为形设计模式1',link:'/designPatterns/05_设计模式.md'},
                    {text:'06_行为形设计模式2',link:'/designPatterns/06_设计模式.md'},
                ]

            }


        ],
        sidebar: {//左侧列表
            '/guide/vue/': [
                { // 对应导航中的link文件夹路径，注意这里是 ‘/’结束
                    text: 'Vue 学习',
                    children: [
                        '/guide/vue/test01.md',
                        '/guide/vue/test02.md',
                        '/guide/vue/test03.md'
                    ]
                }
            ],
            '/guide/ts/': [
                {
                    text: 'Typescript 学习',
                    children: [
                        '/guide/ts/test01.md'
                    ]
                }
            ],
            // fallback 侧边栏被最后定义
            '/': [''], //不能放在数组第一个，否则会导致右侧栏无法使用
        }
	})



}
