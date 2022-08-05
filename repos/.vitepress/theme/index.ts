import DefaultTheme from 'vitepress/theme'
import MyLayout from "./MyLayout.vue"
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css"
import { Timeline } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/timeline/style/css.js'
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
    // 全局注册ArcoDesign时间轴组件
    app.use(Timeline)

    app.component('ArticleMetadata', ArticleMetadata)
    app.component('Tag', Tag)
    app.component('Archive', Archive)
  }
}