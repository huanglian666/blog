# AGENTS.md

面向 AI 编码代理的项目说明。**动手前请先读完「核心约定」与「已知坑」两节**，这个仓库有多处不遵守就会静默出错或构建告警的约束。

## 项目定位

基于 **VuePress 2 + vuepress-theme-hope** 的个人技术博客，内容以 Markdown 沉淀为主，图片随文章自托管在仓库内。

| 项 | 值 |
| --- | --- |
| 线上地址 | <https://huanglian.top/blog/>（GitHub Pages 镜像：<https://huanglian666.github.io/blog/>） |
| 主仓库 | `git@github.com:huanglian666/blog.git`，默认分支 `master` |
| 规模 | 约 293 篇 Markdown、2100+ 张配图 |

> **注意区分同级项目**：`../illusion-blog` 是另一个用 Hugo + 幻梦主题重写的站点（服务 `huanglian.top` 根路径），与本项目是两套独立代码，**不要跨项目改文件**。本项目的产物只挂在 `/blog/` 子路径下。

## 快速命令

```bash
pnpm install            # 安装依赖
pnpm docs:dev           # 本地开发，http://localhost:8088
pnpm docs:build         # 构建，产物在 docs/.vuepress/dist
./deploy.sh             # 带 BASE=/blog/ 的构建（等价于 BASE=/blog/ pnpm docs:build）
```

**包管理器只能用 pnpm**（`packageManager: pnpm@12.6.0`），不要用 npm 或 yarn。

## 技术栈与版本约束

| 组件 | 版本 | 备注 |
| --- | --- | --- |
| VuePress | `2.0.0-rc.31` | rc 版本，API 与正式版有差异 |
| vuepress-theme-hope | `2.0.0-rc.109` | 主题，插件通过 `plugins: {}` 开启 |
| `@vuepress/plugin-comment` | `2.0.0-rc.134` | 随主题安装，评论功能 |
| Node.js | `24` | 与 CI 一致，见 workflow 的 `NODE_VERSION` |
| pnpm | `12.6.0` | 由 `packageManager` 字段锁定 |
| 数学公式 | KaTeX | 主题 `markdown.math.type` |
| 代码高亮 | Shiki | 已开行号 |

## 目录结构

```
docs/                          # VuePress sourceDir，只有这里的文件会成为站点页面
├── .vuepress/
│   ├── config.js              # 站点主配置（主题、插件、搜索、公式）
│   ├── navbar.js              # 顶部导航栏
│   ├── softExamSidebar.js     # 软考侧边栏（手写）
│   ├── lifeSidebar.js         # 生活与兴趣侧边栏（手写）
│   ├── algorithmSidebar.js    # 算法侧边栏（手写）
│   ├── designPatternSidebar.js# 设计模式侧边栏（手写）
│   ├── components/ layouts/ styles/   # 主题定制
│   └── public/                # 不参与打包的静态资源（logo 等）
├── README.md                  # 博客首页（home: true）
└── <分类>/<文章>.md
    └── _pic/                  # 该目录下文章引用的图片
```

**仓库根目录的 `README.md` 只用于 GitHub 展示**，`sourceDir` 是 `docs/`，所以根 README 不会成为站点页面。改它不影响构建。

## 核心约定

### 1. 图片：自托管，禁止外链图床

- 每篇文章的配图放在**同级 `_pic/` 目录**，正文用相对路径引用：`![说明](./_pic/xxx.png)`。
- **不要**使用外部图床，**不要**对有损压缩提建议或改画质——这是刻意选择（画质优先）。
- 从外部粘贴的笔记带图床链接时，用仓库脚本本地化：

```bash
python3 scripts/download_markdown_images.py docs/软考          # 整个目录
python3 scripts/download_markdown_images.py docs/xxx/某篇.md   # 单篇
```

该脚本会下载图片到 `_pic/` 并把引用改写为相对路径，支持断点续传与 PNG 完整性校验。

### 2. KaTeX：公式里的中文必须包 `\text{}`

```markdown
✅ $\text{风险曝光度} = 1000000 \times 0.5\% = 5000\ \text{元}$
❌ $风险曝光度 = 1000000 \times 0.5\% = 5000 元$
```

裸中文会触发构建告警 `Found unicode character ... inside tex`。**构建后必须检查是否有此类告警**，有就修掉再交付。

> 用 `grep` 排查这个问题会假阳性（正文里的 `$` 会误匹配），以构建输出为准。

### 3. 侧边栏：两套机制，别搞混

`config.js` 的 `sidebar` 配置里：

- **`'structure'`（自动）**：`/javase/`、`/tool/`、`/sql/`、`/web/`、`/framework/`、`/springCloud/`、`/me/` —— 按目录结构自动生成，新增文章无需改配置。
- **手写 JS 文件（手动）**：`/软考/`、`/算法/`、`/生活与兴趣/`、`/designPatterns/` —— 新增文章**必须同步在对应的 Sidebar.js 里注册**，否则页面上看不到入口。

### 4. 每个分类目录要有索引页

分类目录下的 `README.md` 是该分类索引，需包含 frontmatter（至少 `title`，建议 `icon`）和「## 学习目录」列表链接到各篇文章。新增板块时，**上级目录的 README 学习目录也要同步加一行链接**。

### 5. frontmatter

文章至少要有 `title`；常用 `date`、`lastmod`、`icon`（FontAwesome class，如 `fa-solid fa-diagram-project`）。

缺 `title` 可用 `node scripts/add-title-frontmatter.mjs` 批量补，但**该脚本对 CRLF 换行的文件有缺陷**：它用 `content.startsWith("---\n")` 判断是否已有 frontmatter，CRLF 文件开头是 `---\r\n`，判断失败后会把新 frontmatter 插到原块之前，造成**重复 frontmatter**（`docs/springCloud/project/03_ElasticSearch在项目中做搜索的应用.md` 就是这样一个文件）。

因此运行该脚本后**必须逐个检查改动文件**：

```bash
git diff --name-only -- '*.md' | while read -r f; do
  n=$(awk 'NR<=12 && /^---[[:space:]]*$/{c++} END{print c+0}' "$f")
  [ "$n" -gt 2 ] && echo "重复 frontmatter: $f"
done
```

## 常见任务

### 新增一篇软考文章

1. 放到对应专题目录，如 `docs/软考/中级资格：软件设计师/项目管理/新文章.md`
2. 图片本地化（见上）
3. 在该目录 `README.md` 的「## 学习目录」加一行
4. 在 `docs/.vuepress/softExamSidebar.js` 对应分组加 `article("新文章", "项目管理")`

### 新增一个软考专题板块

1. 建目录 `docs/软考/中级资格：软件设计师/<板块名>/`
2. 建 `README.md`（含 `icon` 与「学习目录」）
3. 放入各篇文章与 `_pic/`
4. `docs/软考/中级资格：软件设计师/README.md` 学习目录加链接
5. `softExamSidebar.js` 加一个 `collapsible` 分组

## 已知坑

| 坑 | 说明 |
| --- | --- |
| **`BASE` 必须为 `/blog/`** | 站点部署在子路径下，构建时不给 `BASE=/blog/` 会导致静态资源 404。`deploy.sh` 已内置；直接 `pnpm docs:build` 只适合本地预览 |
| favicon 不拼 `base` | `head` 里的静态资源链接不会自动带 base 前缀，`config.js` 里已显式拼接，改这里要留意 |
| `shamefullyHoist` | pnpm 10+ 起该配置只在 `pnpm-workspace.yaml` 生效，`.npmrc` 里写无效。关掉会导致 VuePress 临时文件解析不到 `vue` 依赖而构建失败 |
| 历史 `_sidebar.md` | 旧版遗留文件，已被 `pagePatterns` 排除、不参与构建。不要"修复"它们，也不要让它们进搜索索引 |
| 标题锚点大小写 | 自定义了 `preserveCaseSlugify`，避免 `SpringBoot`、`MyBatis` 被转小写。改 `markdown.slugify` 会让已有目录链接失效 |
| 插件配置位置 | rc 版本里部分顶层 `markdown.code` 配置已移除，改由主题 `markdown` 段配置 |

## 评论功能

主题已内置 `@vuepress/plugin-comment`，在 `config.js` 的 `plugins` 里加 `comment` 段即可启用。支持 4 种服务：

| provider | 依赖 | 说明 |
| --- | --- | --- |
| `Giscus` | 已随主题安装，无需额外装包 | 基于 GitHub Discussions，静态站点最省事 |
| `Waline` | 需装 `@waline/client` | 需自建服务端，支持登录/表情等 |
| `Twikoo` | 需装 `twikoo` | 需自建/云函数服务端 |
| `Artalk` | 需装 `artalk` | 需自建服务端 |

单篇文章可在 frontmatter 用 `comment: false` 关闭评论。

**当前已启用 Giscus**，配置见 `config.js` 的 `plugins.comment`，实际值：

| 字段 | 值 |
| --- | --- |
| `repo` | `huanglian666/blog` |
| `repoId` | `R_kgDOH3a5Kg` |
| `category` | `Announcements` |
| `categoryId` | `DIC_kwDOH3a5Ks4DHOty` |
| `mapping` | `pathname` |

改这两个 ID 时注意：`repoId` / `categoryId` 是 GitHub 的 **node ID**，不是仓库名和分类名。可用 GraphQL 重新获取：

```bash
gh api graphql -f query='
query {
  repository(owner: "huanglian666", name: "blog") {
    id
    discussionCategories(first: 25) { nodes { id name } }
  }
}'
```

**分类必须是 Announcements 类型**（`isAnswerable: false`）：giscus 需要以管理员身份自动创建 discussion，其他类型的分类不允许机器人建帖。

**前置条件**：仓库已开启 Discussions，且 [giscus App](https://github.com/apps/giscus) 已授权本仓库。二者缺一，评论区会提示无法创建讨论。开启 Discussions 用：

```bash
gh api repos/huanglian666/blog -X PATCH -F has_discussions=true
```

## CI / 部署

| 工作流 | 触发 | 作用 |
| --- | --- | --- |
| `.github/workflows/build-and-push-gh-pages.yml` | push `master` / 手动 | 构建并推送 `dist` 到 `gh-pages` 分支 |
| `.github/workflows/backup-to-huggingface.yml` | push `master` / 每周日 / 手动 | 完整源码+历史镜像备份到 Hugging Face dataset |

HF 备份会把历史中的二进制改写为 LFS 指针并经 Git Xet 上传，因此**备份仓库的 commit SHA 与 GitHub 侧不同**（提交信息/作者/日期保留）。该流水线的推送带重试退避，用于扛 HF 对共享 Actions 出口 IP 的瞬时限流。

## 交付前检查

改完必须跑构建并确认无告警：

```bash
pnpm docs:build 2>&1 | grep -iE "warning|error|success"
```

预期只有 `success VuePress build completed`。**有 KaTeX 中文告警必须修掉**。若改动了正文链接或新增板块，另外确认构建产物里对应 HTML 已生成。
