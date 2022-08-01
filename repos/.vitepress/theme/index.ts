import DefaultTheme from 'vitepress/theme'
import MyLayout from "./components/MyLayout.vue"
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css"
import ArticleMetadata from './components/ArticleMetadata.vue'
import './styles/vars.css'
import './styles/custom.css'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    // 全局注册ElementPlus
    app.use(ElementPlus)

    app.component('ArticleMetadata', ArticleMetadata)
  }
}