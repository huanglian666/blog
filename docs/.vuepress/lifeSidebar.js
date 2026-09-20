const lifePath = "/生活与兴趣/"

const pageLink = (directory, filename) =>
	encodeURI(`${lifePath}${directory}/${filename}`)

const article = (text, directory, filename = text) => ({
	text,
	link: pageLink(directory, filename),
})

export const lifeSidebar = [
	{
		text: "生活与兴趣",
		link: lifePath,
		prefix: lifePath,
		collapsible: true,
		children: [
			{
				text: "家庭网络",
				link: `${lifePath}家庭网络/`,
				prefix: `${lifePath}家庭网络/`,
				collapsible: true,
				children: [
					article(
						"🏠 家庭组网方案：极客实用主义版",
						"家庭网络",
					),
				],
			},
			{
				text: "街霸",
				link: `${lifePath}街霸/`,
				prefix: `${lifePath}街霸/`,
				collapsible: true,
				children: [
					article("街霸6基础概念解析", "街霸"),
					article(
						"从基础到实战：《街霸6》角色与连招进阶指南",
						"街霸",
					),
					article(
						"🥋 隆（Ryu）：孤高的求道者",
						"街霸",
					),
					article(
						"🌸 不知火舞（Mai Shiranui）：绚烂的不知火流继承者",
						"街霸",
					),
					article(
						"🍶 杰米（JAMIE）：霓虹下的醉拳舞者",
						"街霸",
					),
					article(
						"🏗️ 桑吉尔夫（Zangief）：钢铁般的赤色旋风",
						"街霸",
					),
				],
			},
			{
				text: "杂项",
				link: `${lifePath}杂项/`,
				prefix: `${lifePath}杂项/`,
				collapsible: true,
				children: [
					{
						text: "Chrome浏览器使用指南",
						link: `${lifePath}杂项/Chrome浏览器使用指南`,
						// 同时匹配主指南页面与其下的子指南目录。
						prefix: `${lifePath}杂项/Chrome浏览器使用指南`,
						collapsible: true,
						children: [
							article(
								"从 Chrome 浏览器导出插件（.crx）完整指南",
								"杂项/Chrome浏览器使用指南",
							),
						],
					},
				],
			},
		],
	},
]
