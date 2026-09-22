import { defineClientConfig } from "vuepress/client"
import Blog from "./layouts/Blog.vue"
import "./styles/index.scss"

export default defineClientConfig({
  layouts: {
    Blog,
  },
})
