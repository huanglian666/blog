// JavaSE 侧边栏配置：仿 softExamSidebar 的形式，
// 二级分组头可点击跳转到该目录的 README 索引页，组内文章平铺展示。
// 显示文本去掉文件名的数字前缀，链接仍指向原文件，不改动仓库文件名。
const basePath = "/javase/"

/** 拼接某二级目录下某篇文章的站点链接（自动 URL 编码），filename 默认为显示文本加编号前缀前的原名 */
const article = (text, directory, filename = text) => ({
	text,
	link: encodeURI(`${basePath}${directory}/${filename}`),
})

/** 构造一个二级目录分组：组头点击进入目录 README，组内为该目录全部文章 */
const group = (text, directory, children) => ({
	text,
	link: encodeURI(`${basePath}${directory}/`),
	prefix: encodeURI(`${basePath}${directory}/`),
	collapsible: true,
	children,
})

export const javaseSidebar = [
	{
		text: "JavaSE概览",
		link: encodeURI(`${basePath}`),
	},
	group("JavaSE基础", "basic", [
		article("Java入门与开发环境搭建", "basic", "01_Java入门与开发环境搭建"),
		article("Java语言基础", "basic", "02_Java语言基础"),
		article("控制流程", "basic", "03_控制流程"),
		article("方法", "basic", "04_方法"),
		article("数组", "basic", "05_数组"),
		article("面向对象基础", "basic", "06_面向对象基础"),
		article("面向对象三大特征", "basic", "07_面向对象三大特征"),
		article("三个修饰符", "basic", "08_三个修饰符"),
		article("接口和内部类", "basic", "09_接口和内部类"),
		article("常用类", "basic", "10_常用类"),
		article("集合", "basic", "11_集合"),
		article("异常", "basic", "12_异常"),
	]),
	group("JavaSE高级", "senior", [
		article("IO", "senior", "01_IO"),
		article("多线程", "senior", "02_多线程"),
		article("网络编程", "senior", "03_网络编程"),
		article("反射", "senior", "04_反射"),
		article("Java8新特性", "senior", "05_Java8新特性"),
	]),
]
