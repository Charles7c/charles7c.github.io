import DefaultTheme from 'vitepress/theme'
import MyLayout from "./components/MyLayout.vue"
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css"
import * as ElIcons from '@element-plus/icons-vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    // 全局注册ElementPlus的所有图标
    for (const [key, elIcon] of Object.entries(ElIcons)) {
      app.component(key, elIcon)
    }
    // 全局注册ElementPlus
    app.use(ElementPlus)
  }
}