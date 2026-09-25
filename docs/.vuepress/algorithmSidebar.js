// 算法侧边栏配置：按“算法设计策略”组织，
// 每个策略对应一个子目录（含 README 概览页），该策略下的文章挂在 README 之后。
// 链接统一由 article() 拼接，避免在 config.js 中重复书写路径前缀。
const algorithmPath = "/算法/"

/** 拼接算法分类下某个子目录的索引页链接（结尾带 / 指向 README） */
const sectionLink = (directory) => encodeURI(`${algorithmPath}${directory}/`)

/** 构造某个策略子目录下的文章节点，filename 默认与显示文本一致 */
const article = (text, directory, filename = text) => ({
	text,
	link: encodeURI(`${algorithmPath}${directory}/${filename}`),
})

/**
 * 构造一个策略子目录节点：README 作为该策略的概览入口。
 * 该策略下还没有文章时退化为普通链接——Hope 主题对 children 为空的折叠组
 * 仍会渲染展开箭头，展开后却没有任何子项，体验不好。
 * 后续往 articles 里补文章时，节点会自动变成可折叠分组。
 */
const section = (text, directory, articles = []) =>
	articles.length > 0
		? {
				text,
				link: sectionLink(directory),
				prefix: sectionLink(directory),
				collapsible: true,
				children: articles,
			}
		: {
				text,
				link: sectionLink(directory),
			}

export const algorithmSidebar = [
	{
		text: "算法概览",
		link: algorithmPath,
	},
	section("分治法", "分治法"),
	section("动态规划", "动态规划", [
		article("矩阵连乘问题", "动态规划"),
	]),
	section("贪心法", "贪心法"),
	section("回溯法", "回溯法"),
	section("分支限界法", "分支限界法"),
	section("随机化算法", "随机化算法"),
	section("线性规划与网络流", "线性规划与网络流"),
	section("NP完全性理论与近似算法", "NP完全性理论与近似算法"),
]
