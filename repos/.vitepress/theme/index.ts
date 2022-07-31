import DefaultTheme from 'vitepress/theme'
import MyLayout from "./components/MyLayout.vue"
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css"
import * as ElIcons from '@element-plus/icons-vue'
import api from './api/index'
import ArticleMetadata from './components/ArticleMetadata.vue'
import './styles/vars.css'
import './styles/custom.css'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app, router }) {
    // 全局注册ElementPlus的所有图标
    for (const [key, elIcon] of Object.entries(ElIcons)) {
      app.component(key, elIcon)
    }
    // 全局注册ElementPlus
    app.use(ElementPlus)

    // 全局挂载api接口
    if (typeof window !== 'undefined') {
        window.$api = api
    }
    app.component('ArticleMetadata', ArticleMetadata)
  }
}