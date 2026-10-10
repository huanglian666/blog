// 数据库板块侧边栏配置：形式同 softExamSidebar，分组头可点击跳到目录 README。
const basePath = "/sql/"

const article = (text, directory, filename = text) => ({
	text,
	link: encodeURI(`${basePath}${directory}/${filename}`),
})

const group = (text, directory, children) => ({
	text,
	link: encodeURI(`${basePath}${directory}/`),
	prefix: encodeURI(`${basePath}${directory}/`),
	collapsible: true,
	children,
})

export const sqlSidebar = [
	{
		text: "数据库概览",
		link: encodeURI(`${basePath}`),
	},
	group("JDBC", "jdbc", [
		article("JDBC", "jdbc", "01_JDBC"),
		article("数据库连接池", "jdbc", "02_数据库连接池"),
		article("事务", "jdbc", "03_事务"),
		article("Commons DbUtils", "jdbc", "04_Commons_DbUtils"),
	]),
	group("MySQL", "mysql", [
		article("MySQL概述", "mysql", "01_MySQL概述"),
		article("MySQL安装及配置", "mysql", "02_MySQL安装及配置"),
		article("MySQL客户端工具", "mysql", "03_MySQL客户端工具"),
		article("SQL概述及DDL", "mysql", "04_SQL概述及DDL"),
		article("DML", "mysql", "05_DML"),
		article("约束", "mysql", "06_约束"),
		article("DQL", "mysql", "07_DQL"),
		article("DCL", "mysql", "08_DCL"),
		article("TPL", "mysql", "09_TPL"),
		article("视图", "mysql", "10_视图"),
		article("常用函数", "mysql", "11_常用函数"),
		article("变量、存储过程与函数", "mysql", "12_变量_存储过程_函数"),
	]),
]
