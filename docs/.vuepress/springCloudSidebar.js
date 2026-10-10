// SpringCloud 板块侧边栏配置：形式同 softExamSidebar，分组头可点击跳到目录 README。
const basePath = "/springCloud/"

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

export const springCloudSidebar = [
	{
		text: "SpringCloud概览",
		link: encodeURI(`${basePath}`),
	},
	group("Docker", "docker", [
		article("微服务架构演变", "docker", "01_微服务架构演变"),
		article("Docker", "docker", "02_docker"),
	]),
	group("Redis", "redis", [
		article("Redis（上）", "redis", "01_redis"),
		article("Redis（下）", "redis", "02_redis"),
		article("布隆过滤器", "redis", "03_布隆过滤器"),
	]),
	group("MQ", "MQ", [
		article("RocketMQ", "MQ", "01_rocketMQ"),
	]),
	group("ElasticSearch", "elasticsearch", [
		article("ElasticSearch", "elasticsearch", "01_ElasticSearch"),
	]),
	group("SpringCloudAlibaba", "springcloudalibaba", [
		article("Nacos", "springcloudalibaba", "01_Nacos"),
		article("Gateway", "springcloudalibaba", "02_Gateway"),
		article("Sentinel", "springcloudalibaba", "03_Sentinel"),
		article("Seata", "springcloudalibaba", "04_Seata"),
		article("Sleuth", "springcloudalibaba", "05_Sleuth"),
	]),
	group("综合项目", "project", [
		article("项目笔记", "project", "01_项目笔记"),
		article("单点登录SSO", "project", "02_单点登录SSO"),
		article("ElasticSearch 在项目中的应用", "project", "03_ElasticSearch在项目中做搜索的应用"),
		article("IdWorker", "project", "04_IdWorker"),
		article("微信支付", "project", "05_微信支付"),
		article("网页静态化技术", "project", "07_网页静态化技术"),
		article("购物车", "project", "08_购物车"),
	]),
]
