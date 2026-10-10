// 框架学习板块侧边栏配置：形式同 softExamSidebar，分组头可点击跳到目录 README。
import { articleIcons } from "./articleIcons.js"

const basePath = "/framework/"

// 各二级目录的侧边栏图标（FontAwesome class），分组与组内文章共用，与目录 README 的 icon 保持一致
const ICONS = {
	mybatis: "fa-solid fa-database",
	spring: "fa-solid fa-leaf",
	springboot: "fa-solid fa-rocket",
	springmvc: "fa-solid fa-diagram-project",
	vue: "fa-brands fa-vuejs",
}

const article = (text, directory, filename = text) => ({
	text,
	// 优先取逐篇文章的语义图标，未收录的文章回退到目录级图标
	icon: articleIcons[`framework/${directory}/${filename}`] ?? ICONS[directory],
	link: encodeURI(`${basePath}${directory}/${filename}`),
})

const group = (text, directory, children) => ({
	text,
	icon: ICONS[directory],
	link: encodeURI(`${basePath}${directory}/`),
	prefix: encodeURI(`${basePath}${directory}/`),
	collapsible: true,
	children,
})

export const frameworkSidebar = [
	{
		text: "框架学习概览",
		icon: "fa-solid fa-layer-group",
		link: encodeURI(`${basePath}`),
	},
	group("Mybatis", "mybatis", [
		article("MyBatis快速入门", "mybatis", "01_MyBatis快速入门"),
		article("MyBatis进阶", "mybatis", "02_MyBatis进阶"),
		article("MybatisPlus", "mybatis", "03_MybatisPlus"),
		article("tkMapper", "mybatis", "04_tkMapper"),
	]),
	group("Spring", "spring", [
		article("Spring IOC 和 DI", "spring", "01_SpringIOC和DI"),
		article("动态代理和 Spring AOP", "spring", "02_动态代理和SpringAOP"),
		article("Spring 整合 MyBatis 与声明式事务", "spring", "03_Spring整合MyBatis_声明式事务"),
		article("Spring 注解开发与整合 JUnit", "spring", "04_Spring注解开发_整合Junit"),
	]),
	group("SpringBoot", "springboot", [
		article("SpringBoot 入门", "springboot", "01_SpringBoot_入门"),
		article("SpringBoot 进阶", "springboot", "02_SpringBoot_进阶"),
		article("SpringBoot 集成 Swagger2", "springboot", "03_SpringBoot_Swagger2"),
	]),
	group("SpringMVC", "springmvc", [
		article("SpringMVC快速入门及解析", "springmvc", "01_SpringMVC快速入门及解析"),
		article("SpringMVC的响应和请求", "springmvc", "02_SpringMVC的响应和请求"),
		article("SpringMVC文件上传下载及异常处理", "springmvc", "03_SpringMVC文件上传下载及异常处理"),
		article("SSM整合案例", "springmvc", "04_SSM整合案例"),
		article("SpringSecurity通用权限管理系统", "springmvc", "05_SpringSecurity通用权限管理系统"),
	]),
	group("Vue", "vue", [
		article("ECMAScript 6 入门", "vue", "01_ECMAScript6入门"),
		article("Vue入门", "vue", "02_Vue入门"),
		article("Vue进阶", "vue", "03_Vue进阶"),
		article("Wiki实战项目", "vue", "04_Wiki实战项目"),
	]),
]
