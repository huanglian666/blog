// 设计模式侧边栏配置：按“导学 → 基础 → 创建型 → 结构型 → 行为型 → 综合案例”的学习顺序组织，
// 每篇文章的链接统一由 article() 拼接，避免在 config.js 中重复书写路径前缀。
const designPatternPath = "/designPatterns/"

/** 拼接设计模式分类下某篇文章的站点链接，自动对中文文件名做 URL 编码 */
const pageLink = (filename) => encodeURI(`${designPatternPath}${filename}`)

/** 构造一个侧边栏文章节点，filename 默认与显示文本一致 */
const article = (text, filename = text) => ({
	text,
	link: pageLink(filename),
})

export const designPatternSidebar = [
	{
		text: "设计模式导学",
		link: pageLink("设计模式-导学"),
	},
	{
		text: "设计模式基础",
		link: pageLink("01_设计模式基础"),
	},
	{
		text: "创建型模式（建造型）",
		collapsible: true,
		children: [
			article("创建型模式概述", "03_创建型模式概述"),
			article("单例模式", "02_单例模式"),
			article("工厂模式", "04_工厂模式"),
			article("原型模式", "05_原型模式"),
			article("建造者模式", "06_建造者模式"),
			article("创建型模式对比", "07_创建型模式对比"),
		],
	},
	{
		text: "结构型模式",
		collapsible: true,
		children: [
			article("结构型模式概述", "08_结构型模式概述"),
			article("代理模式", "09_代理模式"),
			article("适配器模式", "10_适配器模式"),
			article("装饰者模式", "11_装饰者模式"),
			article("桥接模式", "12_桥接模式"),
			article("外观模式", "13_外观模式"),
			article("组合模式", "14_组合模式"),
			article("享元模式", "15_享元模式"),
		],
	},
	{
		text: "行为型模式",
		collapsible: true,
		children: [
			article("行为型模式概述", "16_行为型模式概述"),
			article("模板方法模式", "17_模板方法模式"),
			article("策略模式", "18_策略模式"),
			article("命令模式", "19_命令模式"),
			article("责任链模式", "20_责任链模式"),
			article("状态模式", "21_状态模式"),
			article("观察者模式", "22_观察者模式"),
			article("中介者模式", "23_中介者模式"),
			article("迭代器模式", "24_迭代器模式"),
			article("访问者模式", "25_访问者模式"),
			article("备忘录模式", "26_备忘录模式"),
			article("解释器模式", "27_解释器模式"),
		],
	},
	{
		text: "综合案例",
		collapsible: true,
		children: [article("自定义 Spring 框架", "28_自定义Spring框架")],
	},
]
