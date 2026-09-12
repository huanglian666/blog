# VuePress 博客迁移与重构执行提示词

你现在是资深 VuePress、Vue 3、Markdown 文档工程师。请直接在当前项目中完成下面的重构任务，不要只输出方案或代码片段。开始修改前先检查工作区状态、Node.js 版本、包管理器、依赖锁文件和现有构建结果；完成后必须实际执行构建与验证。

## 一、项目位置与现状

项目根目录：`vuepress-starter`

主要目录和文件：

- 文档目录：`docs/`
- VuePress 配置：`docs/.vuepress/config.js`
- 首页：`docs/README.md`
- 静态资源：`docs/.vuepress/public/logo.jpg`
- 依赖配置：`package.json`
- 当前锁文件：`yarn.lock`
- 部署脚本：`deploy.sh`

当前项目基线：

- 当前使用 VuePress `2.0.0-beta.51`。
- 当前使用 `@vuepress/plugin-search` `2.0.0-beta.51`。
- 当前主题是 `defaultTheme`。
- 当前搜索插件已经启用，但主要依赖页面标题和 Markdown 标题建立索引。
- 当前共有约 115 个 Markdown 文件，其中约 105 个普通文档页、7 个历史 `_sidebar.md` 文件和 3 个 README 页面。
- 大多数普通文档没有以文件名为内容的文档级一级标题，很多文档从 `##` 开始。例如 `docs/framework/vue/03_Vue进阶.md` 的首个正文标题是 `## 一、Axios`。
- `docs/.vuepress/config.js` 中存在较长的手写 navbar 配置和过时的 sidebar 配置。
- 当前配置中有明显需要审查的问题：`land` 疑似应为 `lang`；JavaSE 部分有导航项指向错误文件；Maven 部分存在相对路径风险；`/guide/vue/` 和 `/guide/ts/` 侧边栏引用的示例页面并不存在。
- `deploy.sh` 当前存在用户尚未提交的修改：推送命令已从 `master:gh-pages` 改为 `HEAD:gh-pages`。必须保留该修改，不能覆盖、回退或重写这部分用户改动。
- 当前文档中存在大量普通代码里的 `$`、`${...}`、`$JAVA_HOME`、模板表达式和字符串，不能把所有 `$...$` 粗暴转换成数学公式。

## 二、总体目标

将当前博客迁移到 `vuepress-theme-hope`，并保持现有文档内容、图片资源和 URL 路径尽可能稳定。

必须实现：

1. 使用 `vuepress-theme-hope` 作为主题。
2. 支持 Markdown 中常见的 LaTeX/TeX 数学公式，包括行内公式和块级公式。
3. 搜索文档名称。例如搜索 `Vue进阶` 时，必须能够找到 `03_Vue进阶.md` 对应页面；搜索带编号的完整文件名也必须能够找到。
4. 重新整理 navbar、sidebar、首页和主题配置。
5. 保留现有文章的物理文件路径，避免不必要的 404。
6. 现有图片、代码块、表格、外部链接和相对图片引用不能因主题迁移而大面积失效。
7. 完成可重复的本地构建和部署构建验证。

## 三、重要设计决策

### 1. 数学公式方案

使用 `vuepress-theme-hope` 的 Markdown math 配置，优先选择 KaTeX：

- 添加 `katex` 依赖。
- 在 Hope 主题配置中启用：`markdown.math.type = "katex"`。
- 验证以下形式：

```markdown
行内公式：$E=mc^2$

块级公式：

$$
\frac{a}{b} = c
$$
```

如果仓库中将来确认存在 KaTeX 不支持、但 MathJax 支持的复杂 TeX 命令，再评估切换到 MathJax。不要为了测试而修改现有普通代码中的 `$`、`${}`、Shell 变量或模板表达式。

### 2. 文档名称和搜索方案

不要简单地给所有文章盲目插入一个可见的 `# 文件名`。这样会改变标题层级、目录结构，并可能与已有的内容性一级标题重复。

推荐采用“双保险”方案：

#### 页面元数据

为普通文档补充 YAML frontmatter，标题使用文件名去掉 `.md` 后的完整名称。例如：

```yaml
---
title: 03_Vue进阶
---
```

规则：

- `03_Vue进阶.md` 的 title 为 `03_Vue进阶`。
- `Vue进阶.md` 的 title 为 `Vue进阶`。
- 不删除、不覆盖已有 frontmatter；首页的 `home: true` 等字段必须保留。
- 对已有一级标题的文章不要再额外插入重复一级标题，先使用 frontmatter title 作为页面标题。
- 对首页、关于我、IDEA 简介等 README 页面，根据页面实际语义补充合理 title；不要破坏首页 frontmatter。

#### 搜索额外字段

继续使用本地 `@vuepress/plugin-search`，通过其 `getExtraFields(page)` 将文件名加入搜索索引。建议逻辑如下，具体写法按当前依赖 API 调整：

```js
getExtraFields: (page) => {
  const filename = page.filePathRelative
    ?.replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(/\\.md$/i, "")

  return filename ? [filename] : []
}
```

同时使用 `isSearchable` 排除历史 `_sidebar.md` 文件，避免它们出现在搜索结果和自动侧边栏中。

验证至少包括：

- 搜索 `Vue进阶` 能找到 `/framework/vue/03_Vue进阶.html`。
- 搜索 `03_Vue进阶` 能找到同一页面。
- 搜索 `MyBatis进阶`、`Redis`、`设计模式` 能得到合理结果。
- 搜索代码中的 `${...}`、`$JAVA_HOME` 时不能导致数学公式渲染异常。

### 3. 主题和配置方案

将 `defaultTheme` 替换为 `hopeTheme`。

保留并正确迁移：

- 站点标题、描述、favicon、logo。
- `base: process.env.BASE || '/'`。
- 本地开发端口 `8088`，除非实际构建验证证明必须调整。
- 代码块行号。
- 中文语言配置，修正 `land` 为正确的 `lang`。

建议配置结构：

```js
import { hopeTheme } from "vuepress-theme-hope"

export default {
  lang: "zh-CN",
  title: "黄炼wiki",
  description: "欢迎来到黄炼的个人博客",
  base: process.env.BASE || "/",
  head: [["link", { rel: "icon", href: "/logo.jpg" }]],
  markdown: {
    code: {
      lineNumbers: true,
    },
  },
  theme: hopeTheme({
    logo: "/logo.jpg",
    markdown: {
      math: {
        type: "katex",
      },
    },
    plugins: {
      search: {
        maxSuggestions: 10,
        hotKeys: ["s", "/"],
        isSearchable: (page) => {
          return !page.filePathRelative?.replace(/\\/g, "/").endsWith("/_sidebar.md")
        },
        getExtraFields: (page) => {
          // 将 Markdown 文件名加入搜索索引
        },
      },
    },
  }),
}
```

以上只是目标结构，必须结合当前安装的 VuePress/Hope 版本确认选项位置和类型，不要机械复制导致配置失效。

### 4. 导航和侧边栏方案

优先保留现有文件和目录路径，不进行大规模重命名。

建议：

- navbar 保留现有主要分类：首页、JavaSE、工具/部署、数据库、Web 开发、框架学习、SpringCloud、设计模式等。
- 将 navbar 从超长的 `config.js` 中拆到独立配置文件，例如 `.vuepress/navbar.js`，提高可维护性；如果拆分会增加兼容风险，也可以先保留在 `config.js`，但必须清理错误链接。
- 内部链接统一使用稳定的绝对路径，并尽量省略 `.md` 扩展名，例如 `/framework/vue/03_Vue进阶`。
- 修复已知错误链接，尤其是 JavaSE 02/03、Maven 聚合工程和首页开始学习按钮。
- 删除或替换当前指向不存在 `/guide/vue/`、`/guide/ts/` 示例页面的旧 sidebar 配置。
- 优先使用 Hope 的结构化 sidebar，让侧边栏根据目录结构和 frontmatter 自动生成；数字编号文章按文件名稳定排序。
- 如果结构化 sidebar 会展示历史 `_sidebar.md`，通过 frontmatter 的 `index: false`、搜索排除规则或合理的配置方式将它们排除。
- 不要让历史 `_sidebar.md` 文件作为可见的普通文章出现在导航、sidebar 或搜索结果中；在确认无引用后再决定是否归档或删除，删除前必须先检查链接和 Git 差异。
- 对目录名不够友好的部分，优先用 sidebar 的分组配置或目录 README 设置显示文本，不要为了改显示名称而重命名物理目录。

## 四、依赖和运行环境要求

当前项目是 VuePress 2 beta 项目，必须先确认运行环境再升级依赖：

1. 检查 Node.js 版本和部署环境版本。
2. `vuepress-theme-hope` 当前文档要求 VuePress 2、Vue 3，以及受支持的 Node LTS；如果本机或生产环境版本过旧，先给出兼容处理并选择可用版本，不要无视环境直接安装最新依赖。
3. 当前仓库使用 Yarn v1 锁文件。Hope 官方更推荐 pnpm，并要求使用受支持的包管理器。根据实际部署环境选择一种包管理器并保持一致：
   - 如果选择 pnpm，生成并提交 `pnpm-lock.yaml`，同步调整部署脚本。
   - 如果继续使用 Yarn，确认使用的是 Hope 支持的 Yarn 版本，并正确迁移锁文件。
   - 不要同时留下多个互相冲突的锁文件。
4. 升级 `vuepress`、`vuepress-theme-hope`、`@vuepress/plugin-search` 时必须使用相互兼容的版本，安装后执行干净安装和构建。
5. 添加 `katex`。
6. 不要把 `node_modules` 或 `docs/.vuepress/dist` 加入版本控制。

## 五、首页处理

检查并规范化 `docs/README.md`：

- 保留 `home: true`、hero 文案、按钮、features 和页脚语义。
- 将 logo frontmatter 路径调整为 Hope 更稳定的绝对路径 `/logo.jpg`，确认构建后的图片可访问。
- 检查 YAML 缩进，确保 `footer` 是首页顶层字段，而不是最后一个 feature 的子字段。
- 不要在本次迁移中擅自改写首页文案风格；只修复会影响解析或主题显示的问题。

## 六、文章元数据批处理要求

批量补充 frontmatter 时必须安全处理：

- 所有文件按 UTF-8 读取和写回，不能出现乱码。
- 先生成清单，再执行修改；修改后检查文件数量和 Git diff。
- 只处理 Markdown 页面，不处理图片、`.DS_Store`、`node_modules`、`dist`。
- 不修改 fenced code block 内的内容。
- 不替换代码中的 `$`、`${}`、Shell 变量、JavaScript 模板字符串或正则表达式。
- 保留文章原文、图片路径、代码块和表格。
- 如果文件已有 frontmatter，只补缺少的 `title`，不要重复插入 frontmatter。
- 文章标题使用文件名去掉 `.md` 的完整名称，保留数字前缀，保证搜索和 sidebar 唯一性。
- 对历史 `_sidebar.md` 文件单独处理，不把它们当作普通文章补标题。

## 七、链接、资源和构建验证

完成修改后执行以下验证，不能只看命令是否启动：

### 依赖和静态构建

- 在确定的 Node.js 和包管理器环境下执行干净安装。
- 执行开发构建，确认本地站点能启动。
- 执行生产构建：`BASE=/blog/` 下构建一次，验证部署子路径。
- 确认构建产物中存在首页、主要分类页、Vue 进阶页、图片资源和 KaTeX 相关内容。

### 页面验证

至少检查：

- 首页能打开，logo 正常显示。
- `/framework/vue/03_Vue进阶.html` 能打开。
- JavaSE、数据库、工具、Web、SpringCloud、设计模式几个分类下的页面都能打开。
- 页面标题、breadcrumb、sidebar、上一页/下一页导航正常。
- 深色模式、移动端布局、代码行号和代码复制功能没有明显异常。
- 图片相对路径没有大面积 404。
- 旧的 `.html` 页面路径尽量保持不变。

### 数学公式验证

建立一个临时或正式的最小公式验证页面，包含：

- 行内公式 `$E=mc^2$`。
- 块级公式 `$$...$$`。
- 分数、上下标、根号、希腊字母。
- 公式前后包含中文。
- 代码块中包含 `$JAVA_HOME`、`${name}` 和普通美元字符串。

确认数学公式显示为渲染后的公式，而不是原始 TeX 文本；代码内容保持原样。

### 搜索验证

使用浏览器实际操作搜索框，不能只检查源码：

- `Vue进阶`
- `03_Vue进阶`
- `MyBatis进阶`
- `设计模式`
- `Redis`
- `Nacos`

记录每个关键词是否返回正确页面，确认结果链接、标题和页面跳转都正确。

### 链接审计

- 检查 navbar、sidebar、首页按钮和 Markdown 内部链接。
- 检查是否仍有指向不存在页面的 `/guide/vue/`、`/guide/ts/` 链接。
- 检查 Maven、JavaSE、SpringCloud 等已知配置链接。
- 对因历史链接格式造成的误报进行区分，不要为了消除警告而大规模改动文章内容。

## 八、Git 和变更边界

开始修改前记录：

- `git status`
- 当前分支和最近提交
- 当前 `deploy.sh` 的未提交 diff

必须遵守：

- 保留用户在 `deploy.sh` 中将推送目标改为 `HEAD:gh-pages` 的现有修改。
- 不使用破坏性 Git 命令，例如 `git reset --hard`、`git checkout --`。
- 不覆盖与本任务无关的用户修改。
- 不提交 `node_modules`、构建产物或临时验证文件。
- 完成后输出清晰的变更文件列表、构建命令、验证结果和仍需人工确认的问题。

## 九、完成标准

只有同时满足以下条件才算完成：

- 主题已经切换为 `vuepress-theme-hope`。
- 依赖锁文件和包管理器状态一致，可干净安装。
- KaTeX/MathJax 公式至少一种方案真实渲染成功。
- 搜索 `Vue进阶` 可以找到 `03_Vue进阶.md` 页面。
- 文档文件名已通过 frontmatter 和搜索额外字段进入索引。
- sidebar 不展示历史 `_sidebar.md`。
- 现有主要导航和 URL 没有明显断裂。
- 普通构建和 `BASE=/blog/` 部署构建均成功。
- 图片、代码块和相对链接没有大面积损坏。
- 用户原有的 `deploy.sh` 未提交修改被完整保留。

如果某一步因为 Node.js、包管理器、网络、依赖版本或部署环境阻塞，先完成能够安全完成的检查，并明确指出阻塞原因、已尝试的替代方案和下一步需要的外部条件；不要伪造构建成功。
