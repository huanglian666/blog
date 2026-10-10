// 批量为文章补充 frontmatter 的 icon / category / tag：
// - icon：与侧边栏配置及目录 README 保持一致的 FontAwesome class
// - category：按一级板块归类（首页项目卡片的板块名）
// - tag：按二级目录（或设计模式的编号前缀）归类
// 幂等：已存在对应 key 的文件跳过该 key，不覆盖已有值；可重复运行。
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { articleIcons } from "../docs/.vuepress/articleIcons.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "..")
const docsDir = path.resolve(projectRoot, "docs")

// 各板块配置：category 为一级分类；icons/tags 按二级目录名映射；
// tagMapper 可选，用于按文件名（如设计模式的编号前缀）细分 tag
const SECTIONS = {
	javase: {
		category: "JavaSE",
		icons: { basic: "fa-solid fa-code", senior: "fa-solid fa-gears" },
		tags: { basic: "Java基础", senior: "Java高级" },
	},
	tool: {
		category: "工具与部署",
		icons: {
			git: "fa-brands fa-git-alt",
			idea: "fa-solid fa-laptop-code",
			linux: "fa-brands fa-linux",
			maven: "fa-solid fa-box-archive",
			nginx: "fa-solid fa-server",
		},
		tags: { git: "Git", idea: "IDEA", linux: "Linux", maven: "Maven", nginx: "Nginx" },
	},
	sql: {
		category: "数据库",
		icons: { jdbc: "fa-brands fa-java", mysql: "fa-solid fa-database" },
		tags: { jdbc: "JDBC", mysql: "MySQL" },
	},
	web: {
		category: "Web开发",
		icons: { javaweb: "fa-solid fa-globe", view: "fa-solid fa-desktop" },
		tags: { javaweb: "JavaWeb", view: "前端基础" },
	},
	framework: {
		category: "框架学习",
		icons: {
			mybatis: "fa-solid fa-database",
			spring: "fa-solid fa-leaf",
			springboot: "fa-solid fa-rocket",
			springmvc: "fa-solid fa-diagram-project",
			vue: "fa-brands fa-vuejs",
		},
		tags: {
			mybatis: "MyBatis",
			spring: "Spring",
			springboot: "SpringBoot",
			springmvc: "SpringMVC",
			vue: "Vue",
		},
	},
	springCloud: {
		category: "SpringCloud",
		icons: {
			docker: "fa-brands fa-docker",
			redis: "fa-solid fa-bolt",
			MQ: "fa-solid fa-comments",
			elasticsearch: "fa-solid fa-magnifying-glass",
			springcloudalibaba: "fa-solid fa-cloud",
			project: "fa-solid fa-screwdriver-wrench",
		},
		tags: {
			docker: "Docker",
			redis: "Redis",
			MQ: "消息队列",
			elasticsearch: "ElasticSearch",
			springcloudalibaba: "SpringCloudAlibaba",
			project: "综合项目",
		},
	},
	// 软考：没有 tags 映射表，tag 直接使用专题板块名（即文章所在二级目录）
	软考: {
		category: "软考",
		useSubDirAsTag: true,
		icons: {
			计算机组成与体系结构: "fa-solid fa-memory",
			操作系统: "fa-solid fa-gears",
			程序设计语言: "fa-solid fa-code",
			数据结构: "fa-solid fa-sitemap",
			算法基础: "fa-solid fa-lightbulb",
			数据结构与算法应用: "fa-solid fa-diagram-project",
			系统开发基础: "fa-solid fa-cubes",
			项目管理: "fa-solid fa-clipboard-list",
			数据流图: "fa-solid fa-water",
			面向对象技术: "fa-solid fa-cube",
			"UML建模（案例题）": "fa-solid fa-project-diagram",
			面向对象程序设计: "fa-solid fa-laptop-code",
		},
	},
	// 设计模式：文章都在板块根目录，按文件名编号前缀区分图标与 tag
	designPatterns: {
		category: "设计模式",
		iconByFilename(filename) {
			if (filename === "设计模式-导学") return "fa-solid fa-book-open"
			const num = Number.parseInt(filename, 10)
			if (num <= 1) return "fa-solid fa-book"
			if (num <= 7) return "fa-solid fa-cubes"
			if (num <= 15) return "fa-solid fa-link"
			if (num <= 27) return "fa-solid fa-arrows-left-right"
			return "fa-solid fa-toolbox"
		},
		tagByFilename(filename) {
			if (filename === "设计模式-导学") return "设计模式"
			const num = Number.parseInt(filename, 10)
			if (num <= 1) return "设计模式基础"
			if (num <= 7) return "创建型模式"
			if (num <= 15) return "结构型模式"
			if (num <= 27) return "行为型模式"
			return "综合案例"
		},
	},
}

// 这些目录跳过（构建产物/缓存/图片目录）
const SKIP_DIRS = new Set(["node_modules", ".cache", ".temp", "dist", ".vuepress", "_pic"])

const changed = [] // 已修改：{ file, keys }
const skipped = [] // 跳过：已有全部 key 或不在板块内
const errors = [] // 出错

// 解析 frontmatter 块：返回 { start, end, lines, eol }；无 frontmatter 时 start 为 -1
// 换行兼容：历史笔记中存在 CRLF 文件，按 /\r?\n/ 切分并按原风格写回，
// 避免在 CRLF 文件中混入 LF 行
function detectFrontmatter(content) {
	const eol = content.includes("\r\n") ? "\r\n" : "\n"
	const lines = content.split(/\r?\n/)
	if (lines[0] !== "---") return { has: false, lines, eol }
	for (let i = 1; i < lines.length; i++) {
		if (lines[i] === "---") {
			return { has: true, lines, endLine: i, eol }
		}
	}
	return { has: false, lines, eol } // 只有开始没有结束，视为无 frontmatter
}

function processFile(file, sectionName, subDir) {
	const rel = path.relative(docsDir, file)
	const base = path.basename(file, ".md")
	const section = SECTIONS[sectionName]

	// 图标优先取 articleIcons 里的逐篇语义映射（与侧边栏共用同一份数据），
	// 未收录的文章回退到目录级图标
	const relKey = rel.split(path.sep).join("/").replace(/\.md$/, "")
	const icon =
		articleIcons[relKey] ??
		(subDir ? section.icons?.[subDir] : section.iconByFilename?.(base))
	const tag = subDir
		? section.tags?.[subDir] ?? (section.useSubDirAsTag ? subDir : undefined)
		: section.tagByFilename?.(base)
	// 待写入的键值对（值为 undefined 的跳过，比如没有映射到 icon 的目录）
	const wanted = []
	if (icon) wanted.push(["icon", icon])
	if (section.category) wanted.push(["category", `[${section.category}]`])
	if (tag) wanted.push(["tag", `[${tag}]`])
	if (!wanted.length) {
		skipped.push({ file: rel, action: "无映射配置" })
		return
	}

	let content = fs.readFileSync(file, "utf8")
	const fm = detectFrontmatter(content)

	// 只在 frontmatter 块内查找已有 key，避免把正文里的同名文本误判为已存在
	const blockLines = fm.has ? fm.lines.slice(1, fm.endLine) : []
	const hasKey = (key) => blockLines.some((l) => new RegExp(`^${key}\\s*:`).test(l))

	// icon 支持原地更新：已有 icon 但值与本次映射不同（如从目录级图标升级为逐篇图标）时替换该行
	const missing = wanted.filter(([key]) => !hasKey(key))
	const iconEntry = wanted.find(([key]) => key === "icon")
	let iconUpdated = false
	if (iconEntry && hasKey("icon")) {
		const idx = blockLines.findIndex((l) => /^icon\s*:/.test(l))
		if (idx !== -1 && blockLines[idx].trim() !== `icon: ${iconEntry[1]}`) {
			blockLines[idx] = `icon: ${iconEntry[1]}`
			iconUpdated = true
		}
	}
	if (!missing.length && !iconUpdated) {
		skipped.push({ file: rel, action: "已是最新" })
		return
	}

	const insertLines = missing.map(([key, value]) => `${key}: ${value}`)
	if (fm.has) {
		// 原地更新的 icon 写回块内；新缺的键插到 frontmatter 块末尾（结束 --- 之前）
		if (iconUpdated) fm.lines.splice(1, fm.endLine - 1, ...blockLines)
		if (missing.length) {
			const endLine = iconUpdated ? 1 + blockLines.length : fm.endLine
			fm.lines.splice(endLine, 0, ...insertLines)
		}
		content = fm.lines.join(fm.eol)
	} else {
		// 无 frontmatter：新建一个只含这些键的块
		content = ["---", ...insertLines, "---", "", ""].join(fm.eol) + content
	}

	fs.writeFileSync(file, content, "utf8")
	const actions = []
	if (iconUpdated) actions.push("更新icon")
	if (missing.length) actions.push(`补${missing.map(([key]) => key).join("+")}`)
	changed.push({ file: rel, keys: actions.join("，") })
}

function walk(dir) {
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		if (ent.name.startsWith(".")) continue
		const full = path.join(dir, ent.name)
		if (ent.isDirectory()) {
			if (SKIP_DIRS.has(ent.name)) continue
			walk(full)
		} else if (ent.name.endsWith(".md")) {
			// README 是目录索引页，不参与博客分类/标签
			if (ent.name === "README.md") continue
			const relDir = path.relative(docsDir, dir)
			const [sectionName, ...rest] = relDir.split(path.sep)
			const section = SECTIONS[sectionName]
			if (!section) {
				skipped.push({ file: path.relative(docsDir, full), action: "板块外跳过" })
				continue
			}
			// 软考的层级是 板块/资格方向/专题，取最后一级目录作为映射键
			const subDir = sectionName === "软考" ? rest[rest.length - 1] : rest[0]
			processFile(full, sectionName, rest.length ? subDir : undefined)
		}
	}
}

walk(docsDir)

console.log(`\n===== 修改清单（${changed.length}）=====`)
for (const c of changed) console.log(`[${c.keys}] ${c.file}`)
console.log(`\n===== 跳过（${skipped.length}）=====`)
for (const s of skipped) console.log(`[${s.action}] ${s.file}`)
if (errors.length) {
	console.log(`\n===== 错误（${errors.length}）=====`)
	for (const e of errors) console.log(`${e.file}: ${e.msg}`)
	process.exitCode = 1
} else {
	console.log("\n无错误")
}
