# 黄炼的技术博客

> 用代码记录成长，用笔记沉淀知识

基于 **VuePress 2** 与 **vuepress-theme-hope** 搭建的个人技术博客，收录 Java 后端开发、工具实践、软件设计师考试与日常兴趣的长期笔记。

**在线访问：<https://huanglian666.github.io/blog/>**

---

## 项目简介

这是一个以**内容沉淀**为目标的静态博客：所有文章以 Markdown 编写，图片随文章存放在仓库内（自托管，不依赖外部图床），构建后由 GitHub Actions 自动发布到 GitHub Pages。

当前收录约 **293 篇** Markdown 笔记、**2100+ 张**配图。

## 技术栈

| 类别 | 选型 | 说明 |
| --- | --- | --- |
| 静态站点框架 | VuePress `2.0.0-rc.31` | 基于 Vite 的构建，支持 Vue 组件 |
| 主题 | vuepress-theme-hope `2.0.0-rc.109` | 博客首页、分类标签、侧边栏与图标体系 |
| 打包器 | `@vuepress/bundler-vite` | 生产构建产物输出到 `docs/.vuepress/dist` |
| 站内搜索 | `@vuepress/plugin-slimsearch` | 构建期生成索引、浏览器端检索，不依赖外部 API |
| 数学公式 | KaTeX | 通过主题的 `markdown.math` 开启 |
| 代码高亮 | Shiki | 开启行号显示 |
| 图标 | Font Awesome 6 | 由 `head` 引入 CDN，供导航与侧边栏使用 |
| 包管理器 | pnpm `12.6.0` | 由 `packageManager` 字段锁定 |
| 运行时 | Node.js `24` | 与 CI 保持一致 |

## 内容板块

顶部导航分为以下分类，每类对应 `docs/` 下的同名目录：

| 板块 | 路径 | 内容 |
| --- | --- | --- |
| JavaSE | `/javase/` | Java 基础语法与进阶专题 |
| 工具｜部署 | `/tool/` | IDEA、Maven、Git、Linux 与 Nginx |
| 数据库 | `/sql/` | MySQL、SQL 与 JDBC |
| Web 开发 | `/web/` | 前端基础与 JavaWeb |
| 框架学习 | `/framework/` | MyBatis、Spring、SpringBoot、SpringMVC 与 Vue |
| SpringCloud | `/springCloud/` | 微服务、中间件与综合项目 |
| 设计模式 | `/designPatterns/` | 面向对象设计思想与实践 |
| 算法 | `/算法/` | 算法设计策略与经典问题的推导与实现 |
| 软考 | `/软考/` | 软件设计师考试知识整理 |
| 生活与兴趣 | `/生活与兴趣/` | 家庭网络、街霸游戏与日常实践 |
| 关于我 | `/me/` | 博主介绍与联系方式 |

其中「软考」板块按考试大纲组织，当前已整理中级资格 **软件设计师** 的 9 个专题：

```
计算机组成与体系结构 · 操作系统 · 程序设计语言 · 数据结构
算法基础 · 数据结构与算法应用 · 系统开发基础 · 项目管理 · 数据流图
```

## 目录结构

```
.
├── docs/                        # 站点根目录（VuePress 的 sourceDir）
│   ├── .vuepress/               # 站点配置与主题定制
│   │   ├── config.js            # 站点主配置：主题、插件、搜索、数学公式等
│   │   ├── navbar.js            # 顶部导航栏
│   │   ├── softExamSidebar.js   # 软考板块侧边栏（手写维护）
│   │   ├── lifeSidebar.js       # 生活与兴趣板块侧边栏
│   │   ├── algorithmSidebar.js  # 算法板块侧边栏
│   │   ├── designPatternSidebar.js
│   │   ├── components/          # 自定义 Vue 组件
│   │   ├── layouts/             # 自定义布局
│   │   ├── styles/              # 样式覆盖
│   │   └── public/              # 静态资源（logo 等，不参与打包）
│   ├── README.md                # 博客首页（home: true）
│   ├── javase/ tool/ sql/ web/ framework/ springCloud/
│   ├── 算法/ 软考/ 生活与兴趣/ designPatterns/ me/
│   └── <分类>/<文章>.md
│       └── _pic/                # 该目录下文章引用的图片
├── scripts/                     # 辅助脚本
├── prompts/                     # 提示词与迁移记录
├── deploy.sh                    # 本地构建脚本
└── .github/workflows/           # CI：发布 Pages + 备份到 Hugging Face
```

### 文章与图片的组织约定

- **每篇文章与其配图同目录**：图片统一放在同级 `_pic/` 目录，正文用 `./_pic/xxx.png` 相对路径引用。图片随仓库一起版本管理，不使用外部图床。
- **每个分类目录含一个 `README.md`** 作为该分类的索引页，其中的「学习目录」用列表链接到各篇文章。
- **侧边栏**：多数分类在 `config.js` 中用 `'structure'` 按目录结构自动生成；软考、算法、设计模式、生活与兴趣四个板块因需要自定义层级与图标，由独立 JS 文件手工维护。

## 本地开发

**前置要求**：Node.js 24、pnpm 12.6.0。

```bash
# 安装依赖
pnpm install

# 启动开发服务器（默认 http://localhost:8088）
pnpm docs:dev
```

## 构建与部署

```bash
# 本地构建（产物输出到 docs/.vuepress/dist）
pnpm docs:build

# 或使用封装脚本，带 GitHub Pages 子路径前缀
./deploy.sh
```

> **关于 `BASE`**：站点部署在 `https://huanglian666.github.io/blog/` 的子路径下，构建时必须设置 `BASE=/blog/`，否则静态资源会 404。`deploy.sh` 已内置该变量；直接执行 `pnpm docs:build` 时默认 `base` 为 `/`，仅适合本地预览。

### CI 流水线

| 工作流 | 触发条件 | 作用 |
| --- | --- | --- |
| `build-and-push-gh-pages.yml` | push 到 `master` / 手动 | 安装依赖并构建，把 `dist` 推送到 `gh-pages` 分支完成发布 |
| `backup-to-huggingface.yml` | push 到 `master` / 每周日 / 手动 | 把完整源码与提交历史镜像备份到 Hugging Face dataset |

Hugging Face 备份会把历史中的二进制文件改写为 Git LFS 指针，并通过 Git Xet 上传，因此备份仓库中的 commit SHA 与 GitHub 侧不同（提交信息、作者与日期保留）。

## 辅助脚本

| 脚本 | 用途 |
| --- | --- |
| `scripts/download_markdown_images.py` | 把 Markdown 中的远程图床链接下载到本地 `_pic/`，并把引用改写为相对路径。支持单个文件或整个目录，带断点续传与 PNG 完整性校验。 |
| `scripts/add-title-frontmatter.mjs` | 批量为缺少 `title` 的文章补充 frontmatter（默认取文件名）。 |

```bash
# 例：本地化某篇文章（或整个目录）的图片
python3 scripts/download_markdown_images.py docs/软考
```

## 写作约定

- **数学公式中的中文必须用 `\text{}` 包裹**，例如 `$\text{风险曝光度} = 1000000 \times 0.5\%$`。KaTeX 直接渲染裸中文会触发构建告警。
- **图片放仓库内、不做有损压缩**，优先保证画质。
- 文章 frontmatter 至少包含 `title`，可选 `date` / `lastmod` / `icon`。

## License

MIT

Copyright © 2021-present 黄炼
