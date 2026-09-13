import { viteBundler } from "@vuepress/bundler-vite"
import { hopeTheme } from "vuepress-theme-hope"
import { navbar } from "./navbar.js"
import { softExamSidebar } from "./softExamSidebar.js"

// 保留标题中英文的原始大小写，避免 README 目录锚点把 SpringBoot、MyBatis 等转换成小写。
const preserveCaseSlugify = (str) =>
	str
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[\u0000-\u001f]/g, "")
		.replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:\"“”‘’<>,.?/]+/g, "-")
		.replace(/-{2,}/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/^(\d)/, "_$1")

// 排除历史遗留的 _sidebar.md 页面，使其不出现在搜索结果中
const isSidebarFile = (page) =>
	page.filePathRelative?.replace(/\\/g, "/").endsWith("/_sidebar.md") ?? false

const legacyDesignPatternPages = [
	"designPatterns/01_设计模式.md",
	"designPatterns/02_设计模式.md",
	"designPatterns/03_设计模式.md",
	"designPatterns/04_设计模式.md",
	"designPatterns/05_设计模式.md",
	"designPatterns/06_设计模式.md",
]

const isSearchablePage = (page) => {
	const filePath = page.filePathRelative?.replace(/\\/g, "/")
	const isLegacyPage = legacyDesignPatternPages.some((path) => filePath?.endsWith(path))

	return !isSidebarFile(page) && !isLegacyPage
}

export default {
	bundler: viteBundler(),
	lang: "zh-CN",
	title: "黄炼wiki",
	description: "欢迎来到黄炼的个人博客",
	port: "8088",
	host: "localhost",
	// head 中的静态资源链接不会自动拼接 base，favicon 需显式带上 base 前缀，
	// 否则部署到 /blog/ 子路径时图标 404
	head: [
		["link", { rel: "icon", href: `${process.env.BASE || "/"}logo.png` }],
		// FontAwesome 6 图标（顶部导航与侧边栏菜单图标）
		[
			"link",
			{
				rel: "stylesheet",
				href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
			},
		],
	],
	base: process.env.BASE || "/",
	// 历史遗留的 _sidebar.md 是旧版 VuePress 的侧边栏配置，
	// 不编译成页面，避免产生 sidebar.html 垃圾页、死链和侧边栏重复节点
	pagePatterns: ["**/*.md", "!.vuepress", "!node_modules", "!**/_sidebar.md"],
	// 覆盖 VuePress 默认的全小写标题锚点，保留 README 目录中的英文大小写。
	markdown: {
		slugify: preserveCaseSlugify,
	},
	theme: hopeTheme({
		logo: "/logo.png",
		blog: {
			name: "黄炼",
			avatar: "/logo.png",
			description: "记录 Java 后端开发、工具实践与持续学习",
			intro: "/me/",
		},
		// 站点图标与 favicon 一致
		markdown: {
			// 代码高亮：使用 shiki 并显示行号（VuePress 顶层 markdown.code 已在 rc 版本移除）
			highlighter: {
				type: "shiki",
				lineNumbers: true,
			},
			// 启用 KaTeX 数学公式渲染
			math: {
				type: "katex",
			},
		},
		// 顶部导航栏，拆分到独立文件维护
		navbar,
		// 侧边栏按分类路径配置：点击顶部菜单进入某分类后，
		// 左侧只展示该分类下的二级/三级菜单，而不是全站平铺。
		// 每个值 "structure" 表示该路径按目录结构自动生成侧边栏。
			sidebar: {
			'/javase/': 'structure',
			'/tool/': 'structure',
			'/sql/': 'structure',
			'/web/': 'structure',
			'/framework/': 'structure',
			'/springCloud/': 'structure',
			'/软考/': softExamSidebar,
			'/designPatterns/': [
				{
					text: '设计模式导学',
					link: '/designPatterns/设计模式-导学',
				},
				{
					text: '设计模式基础',
					link: '/designPatterns/01_设计模式基础',
				},
				{
					text: '创建型模式（建造型）',
					collapsible: true,
					children: [
						{
							text: '创建型模式概述',
							link: '/designPatterns/03_创建型模式概述',
						},
						{
							text: '单例模式',
							link: '/designPatterns/02_单例模式',
						},
						{
							text: '工厂模式',
							link: '/designPatterns/04_工厂模式',
						},
						{
							text: '原型模式',
							link: '/designPatterns/05_原型模式',
						},
						{
							text: '建造者模式',
							link: '/designPatterns/06_建造者模式',
						},
						{
							text: '创建型模式对比',
							link: '/designPatterns/07_创建型模式对比',
						},
					],
				},
				{
					text: '结构型模式',
					collapsible: true,
					children: [
						{
							text: '结构型模式概述',
							link: '/designPatterns/08_结构型模式概述',
						},
						{
							text: '代理模式',
							link: '/designPatterns/09_代理模式',
						},
						{
							text: '适配器模式',
							link: '/designPatterns/10_适配器模式',
						},
						{
							text: '装饰者模式',
							link: '/designPatterns/11_装饰者模式',
						},
						{
							text: '桥接模式',
							link: '/designPatterns/12_桥接模式',
						},
						{
							text: '外观模式',
							link: '/designPatterns/13_外观模式',
						},
						{
							text: '组合模式',
							link: '/designPatterns/14_组合模式',
						},
						{
							text: '享元模式',
							link: '/designPatterns/15_享元模式',
						},
					],
				},
				{
					text: '行为型模式',
					collapsible: true,
					children: [
						{
							text: '行为型模式概述',
							link: '/designPatterns/16_行为型模式概述',
						},
						{
							text: '模板方法模式',
							link: '/designPatterns/17_模板方法模式',
						},
						{
							text: '策略模式',
							link: '/designPatterns/18_策略模式',
						},
						{
							text: '命令模式',
							link: '/designPatterns/19_命令模式',
						},
						{
							text: '责任链模式',
							link: '/designPatterns/20_责任链模式',
						},
						{
							text: '状态模式',
							link: '/designPatterns/21_状态模式',
						},
						{
							text: '观察者模式',
							link: '/designPatterns/22_观察者模式',
						},
						{
							text: '中介者模式',
							link: '/designPatterns/23_中介者模式',
						},
						{
							text: '迭代器模式',
							link: '/designPatterns/24_迭代器模式',
						},
						{
							text: '访问者模式',
							link: '/designPatterns/25_访问者模式',
						},
						{
							text: '备忘录模式',
							link: '/designPatterns/26_备忘录模式',
						},
						{
							text: '解释器模式',
							link: '/designPatterns/27_解释器模式',
						},
					],
				},
				{
					text: '综合案例',
					collapsible: true,
					children: [
						{
							text: '自定义 Spring 框架',
							link: '/designPatterns/28_自定义Spring框架',
						},
					],
				},
			],
			'/me/': 'structure',
		},
		plugins: {
			// 启用 Hope 的博客首页布局、文章列表与分类/标签能力
			blog: true,
			// 图标插件：使用 FontAwesome 免费版，配合 head 中引入的 CSS
			icon: {
				assets: "fontawesome",
				prefix: "fa-",
			},
			// 本地搜索插件：构建时生成全站标题/页头/文件名索引打进静态产物，
			// 搜索在浏览器本地完成，不依赖外部 API，适合国内访问场景
			search: {
				// 下拉建议条数
				maxSuggestions: 10,
				// 激活搜索的快捷键：按 s 或 / 聚焦搜索框
				hotKeys: ["s", "/"],
				// 历史 _sidebar.md 不作为可搜索页面
				isSearchable: isSearchablePage,
				// 将 Markdown 文件名（去掉 .md 后缀）加入搜索索引，
				// 使“Vue进阶”“03_Vue进阶”等关键词可命中对应页面
				getExtraFields: (page) => {
					const filename = page.filePathRelative
						?.replace(/\\/g, "/")
						.split("/")
						.pop()
						?.replace(/\.md$/i, "")

					return filename ? [filename] : []
				},
			},
		},
	}),
}
