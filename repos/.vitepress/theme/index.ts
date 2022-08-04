import DefaultTheme from 'vitepress/theme'
import MyLayout from "./MyLayout.vue"
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css"
import ArticleMetadata from './components/ArticleMetadata.vue'
import Tag from './components/Tag.vue'
import Archive from './components/Archive.vue'
import './styles/vars.css'
import './styles/custom.css'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    // 全局注册ElementPlus
    app.use(ElementPlus)

    app.component('ArticleMetadata', ArticleMetadata)
    app.component('Tag', Tag)
    app.component('Archive', Archive)
  }
}