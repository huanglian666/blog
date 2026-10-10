/**
 * 站点顶部导航栏配置
 *
 * 只保留顶层大标题，无下拉子菜单。
 * 点击某项跳转到对应分类的 README 索引页，
 * 左侧侧边栏随后展示该分类的二级/三级菜单。
 *
 * 图标使用 FontAwesome 6 免费版 class（由 config.js 的 head 引入 CDN）。
 * 修改某一项时，同步确认 icon 与分类语义匹配。
 */
export const navbar = [
	{
		text: '首页',
		link: '/',
		icon: 'fa-solid fa-house',
	},
	{
		text: 'JavaSE',
		link: '/javase/',
		icon: 'fa-brands fa-java',
	},
	{
		text: '工具|部署',
		link: '/tool/',
		icon: 'fa-solid fa-toolbox',
	},
	{
		text: '数据库',
		link: '/sql/',
		icon: 'fa-solid fa-database',
	},
	{
		text: 'Web开发',
		link: '/web/',
		icon: 'fa-solid fa-globe',
	},
	{
		text: '框架学习',
		link: '/framework/',
		icon: 'fa-solid fa-layer-group',
	},
	{
		text: 'SpringCloud',
		link: '/springCloud/',
		icon: 'fa-solid fa-cloud',
	},
	{
		text: '软考',
		link: '/软考/',
		icon: 'fa-solid fa-graduation-cap',
	},
	{
		text: '设计模式',
		link: '/designPatterns/',
		icon: 'fa-solid fa-puzzle-piece',
	},
]
