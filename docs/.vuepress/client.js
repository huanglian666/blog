import { defineClientConfig } from "vuepress/client"
import { onMounted, onUnmounted } from "vue"
import Blog from "./layouts/Blog.vue"
import "./styles/index.scss"

export default defineClientConfig({
  layouts: {
    Blog,
  },
  setup() {
    /** 点击音效：匹配哪些元素算"按钮"，点击这些元素时播放音效 */
    const BUTTON_SELECTOR =
      "button," +
      "a," +
      "[role='button']," +
      ".vp-button," +
      ".vp-nav-link," +
      ".vp-sidebar-link"

    // 部署在 /blog/ 子路径下，音频路径需要拼上 base 前缀，否则线上 404
    const base = typeof __VUEPRESS_BASE__ !== "undefined" ? __VUEPRESS_BASE__ : "/"

    let clickHandler = null

    onMounted(() => {
      // 点击按钮音效：合成的一段短促「嗒」声，preload 提前加载避免首次点击延迟
      const clickAudio = new Audio(`${base}sound/click.ogg`)
      clickAudio.preload = "auto"

      clickHandler = (event) => {
        const target = event.target
        if (!(target instanceof HTMLElement)) return

        // 从点击位置向上找最近的"按钮"元素，命中才播放
        const button = target.closest(BUTTON_SELECTOR)
        if (!button) return

        try {
          clickAudio.currentTime = 0
          clickAudio.play().catch((err) => {
            // 浏览器自动播放策略会拒绝未交互时的播放，此处均为用户主动点击，忽略即可
            console.warn("点击音效播放失败：", err)
          })
        } catch (err) {
          console.warn("点击音效播放失败：", err)
        }
      }

      window.addEventListener("click", clickHandler, { passive: true })
    })

    onUnmounted(() => {
      if (clickHandler) {
        window.removeEventListener("click", clickHandler)
      }
    })
  },
})
