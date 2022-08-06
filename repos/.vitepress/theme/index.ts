import DefaultTheme from 'vitepress/theme'
import MyLayout from "./MyLayout.vue"
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import './styles/vars.css'
import './styles/custom.css'
import ArticleMetadata from './components/ArticleMetadata.vue'
import Tag from './components/Tag.vue'
import Archive from './components/Archive.vue'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    // 全局注册Arco Design Vue
    app.use(ArcoVue)

    app.component('ArticleMetadata', ArticleMetadata)
    app.component('Tag', Tag)
    app.component('Archive', Archive)
  }
}