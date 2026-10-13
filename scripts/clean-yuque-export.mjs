// 批量清理语雀导出遗留的排版噪声（invisible characters 与加粗错字）。
//
// 处理模式：
// 1. 零宽空格 U+200B：
//    - 夹在两个 * 之间的替换为普通空格。直接删除会让 **A**​**B** 变成
//      **A****B**，四个连续星号会被解析成错误的强调边界；
//    - 其余位置直接删除。CommonMark 下中文紧贴 ** 仍能正常加粗，删除安全。
// 2. 零宽连接符 U+200D：直接删除。已核对全站 69 处均为行内残留，
//    不存在 emoji 组合序列（👨‍👩‍👧 这类）依赖它的情况。
// 3. 加粗缺左括号：**X】** → **【X】**。语雀导出常把【丢在加粗之外，
//    如 **问题1】**；已含【 的（**【解析】**）不会被匹配。
//
// 安全边界：
// - 跳过 frontmatter（文件头 --- 块）；
// - 跳过围栏代码块（``` / ~~~）内的内容，代码中的不可见字符可能是有意的；
// - 不处理 U+00A0（nbsp）：它能正常渲染成空格，不会破坏解析，动了反而
//   可能把行首缩进变成 4 空格触发代码块。
//
// 幂等：已清理干净的文件再次运行不会改动。
// 默认 dry-run 只报告；加 --write 才写盘。
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "..")
const docsDir = path.resolve(projectRoot, "docs")

const WRITE = process.argv.includes("--write")

const SKIP_DIRS = new Set(["node_modules", ".vuepress", "dist", ".temp", ".cache"])

// 统计信息
let filesChanged = 0
let zwspStandalone = 0 // 直接删除的 U+200B
let zwspBetweenStars = 0 // *​* → * * 的 U+200B
let zwjRemoved = 0 // 删除的 U+200D
let boldFixed = 0 // **X】** → **【X】**

function cleanLine(line) {
	// 夹在两个星号之间的零宽字符替换为普通空格（星号保留）：
	// **A：**​**B** 若直接删除零宽字符会得到 **A****B**，四个连续星号
	// 无法确定强调边界；换成空格则是两个正常的加粗段。
	let out = line.replace(/(?<=\*)​(?=\*)/g, () => {
		zwspBetweenStars++
		return " "
	})
	out = out.replace(/​/g, () => {
		zwspStandalone++
		return ""
	})
	out = out.replace(/‍/g, () => {
		zwjRemoved++
		return ""
	})
	// **X】** → **【X】**：【 已在括号内或 X 含 * 的不匹配
	out = out.replace(/\*\*([^*\n【]*】)\*\*/g, (m, inner) => {
		boldFixed++
		return `**【${inner}`
	})
	return out
}

function cleanContent(content) {
	const lines = content.split("\n")
	let inFrontmatter = false
	let frontmatterDone = false
	let fence = null // 当前所在围栏代码块的定界符（``` 或 ~~~）

	return lines
		.map((line) => {
			// frontmatter：文件开头第一个 --- 到下一个 --- 之间
			if (!frontmatterDone) {
				if (inFrontmatter) {
					if (/^---\s*$/.test(line)) frontmatterDone = true
					return line
				}
				if (/^---\s*$/.test(line)) {
					inFrontmatter = true
					return line
				}
				frontmatterDone = true
			}
			// 围栏代码块：成对出现才进入/退出。
			// 允许列表前缀（- ```SQL 等）：笔记大量使用列表内代码块，
			// 不识别会导致后续正文被误判为代码而跳过清理。
			const fenceMatch = line.match(/^\s*(?:[-+*][ \t]+)?(`{3,}|~{3,})/)
			if (fenceMatch) {
				const marker = fenceMatch[1][0]
				if (!fence) fence = marker
				else if (fence === marker) fence = null
				return line
			}
			if (fence) return line
			return cleanLine(line)
		})
		.join("\n")
}

function walk(dir) {
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		if (ent.name.startsWith(".")) continue
		const full = path.join(dir, ent.name)
		if (ent.isDirectory()) {
			if (SKIP_DIRS.has(ent.name)) continue
			walk(full)
		} else if (ent.name.endsWith(".md")) {
			const content = fs.readFileSync(full, "utf8")
			const cleaned = cleanContent(content)
			if (cleaned !== content) {
				filesChanged++
				const rel = path.relative(docsDir, full)
				console.log(`[待清理] ${rel}`)
				if (WRITE) fs.writeFileSync(full, cleaned, "utf8")
			}
		}
	}
}

walk(docsDir)

console.log(`\n===== 统计 =====`)
console.log(`涉及文件：${filesChanged}`)
console.log(`零宽空格 U+200B：夹在星号间转空格 ${zwspBetweenStars} 处，直接删除 ${zwspStandalone} 处`)
console.log(`零宽连接符 U+200D：删除 ${zwjRemoved} 处`)
console.log(`加粗缺左括号：修复 ${boldFixed} 处`)
if (!WRITE) {
	console.log(`\n当前为 dry-run，未写盘。确认无误后加 --write 执行。`)
} else {
	console.log(`\n已写盘。`)
}
