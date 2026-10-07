import { viteBundler } from "@vuepress/bundler-vite"
import { hopeTheme } from "vuepress-theme-hope"
import { navbar } from "./navbar.js"
import { softExamSidebar } from "./softExamSidebar.js"
import { lifeSidebar } from "./lifeSidebar.js"
import { designPatternSidebar } from "./designPatternSidebar.js"
import { algorithmSidebar } from "./algorithmSidebar.js"

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
	// 当前站点的公共运行时代码约 1 MB，调整 Vite 的提示阈值，避免把正常的主题公共包误报为异常。
	bundler: viteBundler({
		viteOptions: {
			build: {
				chunkSizeWarningLimit: 1200,
			},
		},
		// Hope 主题会在后续阶段写入 1024，这里在最终 Vite 配置阶段再次覆盖。
		configureVite: (config, _isServer, isBuild) => {
			config.build = {
				...config.build,
				chunkSizeWarningLimit: 1200,
			}
			if (isBuild) config.logLevel = "error"
			return config
		},
	}),
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
		// 站点部署源：feed、SEO、sitemap 等插件用它把站内路径拼成绝对地址。
		// 只写协议 + 主机（不带 /blog/），子路径由 base 自动补上，
		// 因此 feed 条目的真实地址形如 https://huanglian.top/blog/javase/xxx.html。
		// 线上 www.huanglian.top 会 301 跳到裸域，这里统一写裸域，
		// 避免每条订阅链接都多一次跳转、也避免和站点自身的规范链接不一致。
		hostname: "https://huanglian.top",
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
		// Hope 的博客聚合页是主题自动生成的独立路由，这些页面不需要侧边栏，显式配置空数组以避免构建警告。
		sidebar: {
			'/category/': [],
			'/tag/': [],
			'/article/': [],
			'/star/': [],
			'/timeline/': [],
			'/javase/': 'structure',
			'/tool/': 'structure',
			'/sql/': 'structure',
			'/web/': 'structure',
			'/framework/': 'structure',
			'/springCloud/': 'structure',
			'/算法/': algorithmSidebar,
			'/软考/': softExamSidebar,
			'/生活与兴趣/': lifeSidebar,
			'/designPatterns/': designPatternSidebar,
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
			// SlimSearch 本地搜索：构建时生成索引，浏览器端完成搜索，
			// 不依赖外部 API，适合国内访问场景。
			slimsearch: {
				// 开启全文索引，让正文中的技术名词也可以被搜索到。
				indexContent: true,
				// 激活搜索的快捷键：按 s 或 / 聚焦搜索框。
				hotKeys: [{ key: "s" }, { key: "/" }],
				// 历史 _sidebar.md 和旧版设计模式页面不作为可搜索页面。
				filter: isSearchablePage,
				// 将 Markdown 文件名（去掉 .md 后缀）加入搜索索引，
				// 使“Vue进阶”“03_Vue进阶”等关键词可命中对应页面。
				customFields: [
					{
						getter: (page) => {
							const filename = page.filePathRelative
								?.replace(/\\/g, "/")
								.split("/")
								.pop()
								?.replace(/\.md$/i, "")

							return filename || null
						},
						formatter: "$content",
					},
				],
			},
			// RSS / Atom 订阅源：构建时在产物根目录生成 rss.xml 与 atom.xml，
			// 并自动向每个页面的 head 注入 <link rel="alternate">，浏览器和阅读器可自动发现。
			// 线上订阅地址：https://huanglian.top/blog/rss.xml（Atom 为 /blog/atom.xml）
			feed: {
				rss: true,
				atom: true,
				// 条目正文保留完整 HTML，方便在阅读器里直接读全文；
				// 条目越多 feed 文件越大，这里只输出最近 30 篇（插件默认 100）。
				count: 30,
			},
			// 评论：Giscus，把评论存到本仓库的 GitHub Discussions。
			// 无需自建服务端，适合纯静态站点。
			// 前置条件：仓库已开启 Discussions，且 giscus App 已安装到本仓库
			// （https://github.com/apps/giscus），否则评论区会提示无法创建讨论。
			comment: {
				provider: "Giscus",
				// 存放评论的仓库（下方 repoId 为该仓库的 node ID，不是仓库名）
				repo: "huanglian666/blog",
				repoId: "R_kgDOH3a5Kg",
				// 必须使用 Announcements 类型的分类：giscus 需要以管理员身份
				// 自动创建 discussion，其他类型的分类不允许机器人建帖
				category: "Announcements",
				categoryId: "DIC_kwDOH3a5Ks4DHOty",
				// 页面与 discussion 的映射方式，按路径匹配；
				// 站点挂在 /blog/ 子路径下，各页面路径前缀一致，不影响匹配
				mapping: "pathname",
			},
		},
	}),
}
