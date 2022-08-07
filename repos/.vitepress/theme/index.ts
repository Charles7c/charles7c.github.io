import DefaultTheme from 'vitepress/theme'
import MyLayout from "./MyLayout.vue"
import './styles/vars.css'
import './styles/custom.css'
import ArticleMetadata from './components/ArticleMetadata.vue'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    app.component('ArticleMetadata', ArticleMetadata)
  }
}