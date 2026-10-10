// 工具与部署板块侧边栏配置：形式同 softExamSidebar，分组头可点击跳到目录 README。
import { articleIcons } from "./articleIcons.js"

const basePath = "/tool/"

// 各二级目录的侧边栏图标（FontAwesome class），分组与组内文章共用，与目录 README 的 icon 保持一致
const ICONS = {
	git: "fa-brands fa-git-alt",
	idea: "fa-solid fa-laptop-code",
	linux: "fa-brands fa-linux",
	maven: "fa-solid fa-box-archive",
	nginx: "fa-solid fa-server",
}

const article = (text, directory, filename = text) => ({
	text,
	// 优先取逐篇文章的语义图标，未收录的文章回退到目录级图标
	icon: articleIcons[`tool/${directory}/${filename}`] ?? ICONS[directory],
	link: encodeURI(`${basePath}${directory}/${filename}`),
})

const group = (text, directory, children) => ({
	text,
	icon: ICONS[directory],
	link: encodeURI(`${basePath}${directory}/`),
	prefix: encodeURI(`${basePath}${directory}/`),
	collapsible: true,
	children,
})

export const toolSidebar = [
	{
		text: "工具|部署概览",
		icon: "fa-solid fa-toolbox",
		link: encodeURI(`${basePath}`),
	},
	group("Git", "git", [
		article("Git", "git", "Git"),
	]),
	group("IDEA", "idea", [
		article("IDEA配置", "idea", "01_IDEA配置"),
		article("IDEA快捷键", "idea", "03_IDEA快捷键"),
	]),
	group("Linux", "linux", [
		article("Linux 安装", "linux", "01_Linux_安装"),
		article("Linux 简介及常用命令", "linux", "02_Linux_简介及常用命令"),
		article("Linux Vim 使用", "linux", "03_Linux_Vim使用"),
		article("Linux 软件安装及 Java 开发环境搭建", "linux", "04_Linux_软件安装及Java开发环境搭建"),
		article("Linux 搭建基于 SFTP 服务的文件服务器", "linux", "05_Linux_搭建基于SFTP服务的文件服务器"),
		article("Linux 防火墙 FirewallD 设置", "linux", "06_Linux_防火墙FirewallD设置"),
	]),
	group("Maven", "maven", [
		article("Maven 基础", "maven", "01_Maven基础"),
		article("Maven 聚合工程", "maven", "02_Maven聚合工程"),
	]),
	group("Nginx", "nginx", [
		article("Nginx", "nginx", "Nginx"),
	]),
]
