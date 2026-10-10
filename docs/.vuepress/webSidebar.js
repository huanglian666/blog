// Web 开发板块侧边栏配置：形式同 softExamSidebar，分组头可点击跳到目录 README。
import { articleIcons } from "./articleIcons.js"

const basePath = "/web/"

// 各二级目录的侧边栏图标（FontAwesome class），分组与组内文章共用，与目录 README 的 icon 保持一致
const ICONS = {
	javaweb: "fa-solid fa-globe",
	view: "fa-solid fa-desktop",
}

const article = (text, directory, filename = text) => ({
	text,
	// 优先取逐篇文章的语义图标，未收录的文章回退到目录级图标
	icon: articleIcons[`web/${directory}/${filename}`] ?? ICONS[directory],
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

export const webSidebar = [
	{
		text: "Web开发概览",
		icon: "fa-solid fa-globe",
		link: encodeURI(`${basePath}`),
	},
	group("JavaWeb", "javaweb", [
		article("Web开发基础", "javaweb", "01_Web开发基础"),
		article("Servlet", "javaweb", "02_Servlet"),
		article("JSP入门（Cookie与Session）", "javaweb", "03_JSP入门_Cookie_Session"),
		article("JSP进阶（EL与JSTL）", "javaweb", "04_JSP进阶_EL_JSTL"),
		article("Filter", "javaweb", "05_Filter"),
		article("文件上传", "javaweb", "06_文件上传"),
	]),
	group("前端基础", "view", [
		article("HTML", "view", "01_HTML"),
		article("CSS", "view", "02_CSS"),
		article("JavaScript", "view", "03_JavaScript"),
		article("jQuery", "view", "04_jQuery"),
		article("BootStrap", "view", "05_BootStrap"),
		article("Ajax与JSON", "view", "06_Ajax_JSON"),
	]),
]
