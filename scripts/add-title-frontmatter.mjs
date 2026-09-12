// 批量补充 frontmatter title：普通文档标题取文件名去掉 .md 后缀（保留数字前缀）
// 已有 frontmatter 的文件仅补缺 title；历史 _sidebar.md 单独处理，不当作普通文章补标题
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "..")
const docsDir = path.resolve(projectRoot, "docs")

// 特殊 README 页面标题映射（相对 docs 的路径 -> 语义化标题）
const specialTitles = {
  "me/README.md": "关于我",
  "tool/idea/README.md": "IDEA简介",
}

// 这些目录跳过（构建产物/缓存/图片目录）
const SKIP_DIRS = new Set(["node_modules", ".cache", ".temp", "dist", ".vuepress"])

const changed = [] // 已修改：{ file, action }
const skipped = [] // 跳过：历史 _sidebar 或已有 title
const errors = [] // 出错

function readFirstLines(content, n) {
  return content.split("\n").slice(0, n)
}

// 解析是否已有 frontmatter；返回 { has, titleLine } 或在无 frontmatter 时返回 has=false
function detectFrontmatter(content) {
  if (!content.startsWith("---\n")) return { has: false, titleLine: null, endLine: null }
  const lines = content.split("\n")
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") {
      const hasTitle = lines.slice(1, i).some((l) => /^title\s*:/.test(l))
      return { has: true, titleLine: hasTitle ? lines.find((l) => /^title\s*:/.test(l)) : null, endLine: i }
    }
  }
  return { has: false, titleLine: null, endLine: null } // 只有开始没有结束，视为无 frontmatter
}

function processFile(file) {
  const rel = path.relative(docsDir, file)
  const base = path.basename(file, ".md")

  // 历史 _sidebar.md：不当作普通文章补标题
  if (path.basename(file) === "_sidebar.md") {
    skipped.push({ file: rel, action: "历史_sidebar跳过" })
    return
  }

  // 首页 docs/README.md 保留 home 语义，不补 title
  if (rel === "README.md") {
    skipped.push({ file: rel, action: "首页跳过" })
    return
  }

  const title = specialTitles[rel] ?? base
  let content = fs.readFileSync(file, "utf8")

  // 文件必须存在且为 UTF-8 文本；若以 NUL 开头说明是二进制，跳过
  if (content.charCodeAt(0) === 0) {
    errors.push({ file: rel, msg: "疑似二进制文件" })
    return
  }

  const fm = detectFrontmatter(content)
  if (fm.has) {
    if (fm.titleLine) {
      skipped.push({ file: rel, action: "已有title" })
      return
    }
    // 已有 frontmatter 但缺 title：在开始行后插入 title
    const lines = content.split("\n")
    lines.splice(1, 0, `title: ${title}`)
    content = lines.join("\n")
  } else {
    // 无 frontmatter：在最前面补一个
    content = `---\ntitle: ${title}\n---\n\n${content}`
  }

  fs.writeFileSync(file, content, "utf8")
  changed.push({ file: rel, action: fm.has ? "补title" : "新增frontmatter", title })
}

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue
      walk(full)
    } else if (ent.name.endsWith(".md")) {
      processFile(full)
    }
  }
}

walk(docsDir)

console.log(`\n===== 修改清单（${changed.length}）=====`)
for (const c of changed) console.log(`[${c.action}] ${c.title}\t${c.file}`)
console.log(`\n===== 跳过（${skipped.length}）=====`)
for (const s of skipped) console.log(`[${s.action}] ${s.file}`)
if (errors.length) {
  console.log(`\n===== 错误（${errors.length}）=====`)
  for (const e of errors) console.log(`${e.file}: ${e.msg}`)
  process.exitCode = 1
} else {
  console.log("\n无错误")
}
